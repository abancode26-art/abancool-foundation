
DROP FUNCTION IF EXISTS public.create_support_ticket(uuid, text, text, text, uuid, uuid);

CREATE OR REPLACE FUNCTION public.create_support_ticket(
    user_uuid uuid,
    subject_param text,
    message_param text,
    priority_param text DEFAULT 'medium',
    department_id_param text DEFAULT NULL,
    service_id_param text DEFAULT NULL
) RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_ticket_id UUID;
    new_ticket_number TEXT;
    user_record profiles%ROWTYPE;
    admin_user RECORD;
    resolved_dept_id UUID;
    resolved_service_id UUID;
BEGIN
    SELECT * INTO user_record FROM profiles WHERE id = user_uuid;
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'User not found');
    END IF;

    -- Resolve department: try UUID first, then name lookup
    IF department_id_param IS NOT NULL AND department_id_param != '' THEN
        BEGIN
            resolved_dept_id := department_id_param::uuid;
        EXCEPTION WHEN invalid_text_representation THEN
            SELECT id INTO resolved_dept_id FROM support_departments
            WHERE lower(name) = lower(department_id_param) AND is_active = true LIMIT 1;
        END;
    END IF;

    -- Resolve service_id
    IF service_id_param IS NOT NULL AND service_id_param != '' THEN
        BEGIN
            resolved_service_id := service_id_param::uuid;
        EXCEPTION WHEN invalid_text_representation THEN
            resolved_service_id := NULL;
        END;
    END IF;

    INSERT INTO support_tickets (user_id, subject, priority, department_id, service_id, status)
    VALUES (user_uuid, subject_param, priority_param::ticket_priority, resolved_dept_id, resolved_service_id, 'open'::ticket_status)
    RETURNING id, ticket_number INTO new_ticket_id, new_ticket_number;

    INSERT INTO support_ticket_messages (ticket_id, sender_user_id, sender_role, message)
    VALUES (new_ticket_id, user_uuid, 'customer'::app_role, message_param);

    BEGIN
        INSERT INTO notifications (user_id, title, message, type, action_url)
        VALUES (user_uuid, 'Ticket Created: ' || new_ticket_number,
                'Your support ticket "' || subject_param || '" has been created.', 'info',
                '/client/tickets/' || new_ticket_id);
    EXCEPTION WHEN OTHERS THEN NULL;
    END;

    FOR admin_user IN SELECT ur.user_id FROM user_roles ur WHERE ur.role IN ('super_admin', 'admin')
    LOOP
        BEGIN
            INSERT INTO notifications (user_id, title, message, type, action_url)
            VALUES (admin_user.user_id, 'New Ticket: ' || new_ticket_number,
                    COALESCE(user_record.full_name, user_record.email) || ' opened a ' || priority_param || ' ticket: ' || subject_param,
                    'info', '/admin/tickets/' || new_ticket_id);
        EXCEPTION WHEN OTHERS THEN NULL;
        END;
    END LOOP;

    RETURN json_build_object('success', true, 'ticket_id', new_ticket_id, 'ticket_number', new_ticket_number, 'message', 'Support ticket created successfully');
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;
