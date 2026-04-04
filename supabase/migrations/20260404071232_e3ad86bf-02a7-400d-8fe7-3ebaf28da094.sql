
CREATE OR REPLACE FUNCTION public.create_support_ticket(
    user_uuid uuid,
    subject_param text,
    message_param text,
    priority_param text DEFAULT 'medium',
    department_id_param uuid DEFAULT NULL,
    service_id_param uuid DEFAULT NULL
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
BEGIN
    -- Get user profile
    SELECT * INTO user_record FROM profiles WHERE id = user_uuid;
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'User not found');
    END IF;

    -- Create ticket
    INSERT INTO support_tickets (
        user_id, subject, priority, department_id, service_id, status
    ) VALUES (
        user_uuid, subject_param, priority_param::ticket_priority,
        department_id_param, service_id_param, 'open'::ticket_status
    ) RETURNING id, ticket_number INTO new_ticket_id, new_ticket_number;

    -- Add first message
    INSERT INTO support_ticket_messages (
        ticket_id, sender_user_id, sender_role, message
    ) VALUES (
        new_ticket_id, user_uuid, 'customer'::app_role, message_param
    );

    -- Notify customer
    BEGIN
        INSERT INTO notifications (user_id, title, message, type, action_url)
        VALUES (
            user_uuid,
            'Ticket Created: ' || new_ticket_number,
            'Your support ticket "' || subject_param || '" has been created.',
            'info',
            '/client/tickets/' || new_ticket_id
        );
    EXCEPTION WHEN OTHERS THEN NULL;
    END;

    -- Notify all admins
    FOR admin_user IN
        SELECT ur.user_id FROM user_roles ur WHERE ur.role IN ('super_admin', 'admin')
    LOOP
        BEGIN
            INSERT INTO notifications (user_id, title, message, type, action_url)
            VALUES (
                admin_user.user_id,
                'New Ticket: ' || new_ticket_number,
                COALESCE(user_record.full_name, user_record.email) || ' opened a ' || priority_param || ' ticket: ' || subject_param,
                'info',
                '/admin/tickets/' || new_ticket_id
            );
        EXCEPTION WHEN OTHERS THEN NULL;
        END;
    END LOOP;

    RETURN json_build_object(
        'success', true,
        'ticket_id', new_ticket_id,
        'ticket_number', new_ticket_number,
        'message', 'Support ticket created successfully'
    );

EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;
