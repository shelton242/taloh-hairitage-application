/*
  # Fix mutable search_path on all public functions

  ## Summary
  All functions in public schema had a mutable search_path, which is a security
  risk allowing schema injection attacks. This migration recreates all affected
  functions with SET search_path = '' and fully-qualified schema references.

  ## Affected Functions
  - public.broadcast_order_update (trigger)
  - public.http_post (utility)
  - public.calculate_consistency_percentage
  - public.event_trigger_fn (event trigger)
  - public.update_streak
  - public.handle_reminder_notification (trigger)
  - public.create_order_status_notification (trigger)
*/

-- broadcast_order_update
CREATE OR REPLACE FUNCTION public.broadcast_order_update()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
AS $$
BEGIN
  IF OLD.delivery_status IS DISTINCT FROM NEW.delivery_status THEN
    PERFORM pg_notify(
      'order_updates',
      json_build_object(
        'order_number', NEW.order_number,
        'delivery_status', NEW.delivery_status,
        'user_id', NEW.user_id,
        'timestamp', extract(epoch from now())
      )::text
    );
  END IF;
  RETURN NEW;
END;
$$;

-- http_post
CREATE OR REPLACE FUNCTION public.http_post(
  url text,
  headers jsonb DEFAULT '{}'::jsonb,
  body jsonb DEFAULT '{}'::jsonb
)
  RETURNS jsonb
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT content::jsonb INTO result
  FROM public.http_post(
    url,
    body::text,
    'application/json'
  ) as response;
  RETURN result;
END;
$$;

-- calculate_consistency_percentage
CREATE OR REPLACE FUNCTION public.calculate_consistency_percentage(
  p_user_id uuid,
  p_reminder_type text
)
  RETURNS numeric
  LANGUAGE plpgsql
  SECURITY INVOKER
  SET search_path = ''
AS $$
DECLARE
  v_frequency_hours integer;
  v_first_app_time timestamptz;
  v_expected_count numeric;
  v_actual_count integer;
  v_consistency numeric;
  v_hours_since_first numeric;
BEGIN
  SELECT frequency_hours INTO v_frequency_hours
  FROM public.reminder_settings
  WHERE user_id = p_user_id AND reminder_type = p_reminder_type;

  IF v_frequency_hours IS NULL THEN
    RETURN 0;
  END IF;

  SELECT COUNT(*) INTO v_actual_count
  FROM public.application_logs
  WHERE user_id = p_user_id AND reminder_type = p_reminder_type;

  IF v_actual_count = 0 THEN
    RETURN 0;
  END IF;

  SELECT MIN(application_time) INTO v_first_app_time
  FROM public.application_logs
  WHERE user_id = p_user_id AND reminder_type = p_reminder_type;

  v_hours_since_first := EXTRACT(EPOCH FROM (now() - v_first_app_time)) / 3600;

  IF v_hours_since_first < v_frequency_hours THEN
    RETURN 100;
  END IF;

  v_expected_count := GREATEST(1, FLOOR(v_hours_since_first / v_frequency_hours) + 1);
  v_consistency := LEAST(100, (v_actual_count::numeric / v_expected_count) * 100);

  RETURN ROUND(v_consistency, 2);
END;
$$;

-- event_trigger_fn
CREATE OR REPLACE FUNCTION public.event_trigger_fn()
  RETURNS event_trigger
  LANGUAGE plpgsql
  SET search_path = ''
AS $$
BEGIN
  -- Add logic here
END;
$$;

-- update_streak
CREATE OR REPLACE FUNCTION public.update_streak(
  p_user_id uuid,
  p_reminder_type text
)
  RETURNS integer
  LANGUAGE plpgsql
  SECURITY INVOKER
  SET search_path = ''
AS $$
DECLARE
  v_frequency_hours integer;
  v_streak integer := 0;
  v_grace_hours integer := 2;
BEGIN
  SELECT frequency_hours INTO v_frequency_hours
  FROM public.reminder_settings
  WHERE user_id = p_user_id AND reminder_type = p_reminder_type;

  IF v_frequency_hours IS NULL THEN
    RETURN 0;
  END IF;

  WITH ordered_apps AS (
    SELECT
      application_time,
      LAG(application_time) OVER (ORDER BY application_time) as prev_time
    FROM public.application_logs
    WHERE user_id = p_user_id AND reminder_type = p_reminder_type
    ORDER BY application_time DESC
  ),
  streak_check AS (
    SELECT
      application_time,
      prev_time,
      CASE
        WHEN prev_time IS NULL THEN true
        WHEN prev_time - application_time <= make_interval(hours => v_frequency_hours + v_grace_hours) THEN true
        ELSE false
      END as is_consecutive
    FROM ordered_apps
  )
  SELECT COUNT(*) INTO v_streak
  FROM (
    SELECT
      application_time,
      is_consecutive,
      SUM(CASE WHEN is_consecutive THEN 0 ELSE 1 END) OVER (ORDER BY application_time DESC) as break_group
    FROM streak_check
  ) grouped
  WHERE break_group = 0;

  RETURN GREATEST(v_streak, 0);
END;
$$;

-- handle_reminder_notification
CREATE OR REPLACE FUNCTION public.handle_reminder_notification()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
AS $$
DECLARE
  notification_id bigint;
  edge_function_url text := 'https://viglpwqnrievcdraviiu.supabase.co/functions/v1/send-push';
  service_role_key text := current_setting('app.settings.service_role_key', true);
BEGIN
  IF NEW.enabled = true AND NEW.next_application_due IS NOT NULL THEN

    INSERT INTO public.notifications (
      user_id,
      title,
      message,
      type,
      action_url,
      data
    ) VALUES (
      NEW.user_id,
      'Reminder: Time to Apply',
      CASE
        WHEN NEW.reminder_type = 'solution'
        THEN 'Time to apply your Hair Revitalizing Solution'
        WHEN NEW.reminder_type = 'shampoo'
        THEN 'Time to use your 3-in-1 Shampoo & Beard Wash'
        ELSE 'Time for your hair care routine'
      END,
      'system',
      '/home',
      jsonb_build_object(
        'reminder_type', NEW.reminder_type,
        'reminder_id', NEW.id,
        'next_due', NEW.next_application_due
      )
    )
    RETURNING id INTO notification_id;

    PERFORM
      net.http_post(
        url := edge_function_url,
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', concat('Bearer ', service_role_key)
        ),
        body := jsonb_build_object(
          'userId', NEW.user_id,
          'title', 'Time for Your Hair Care Routine',
          'body', CASE
            WHEN NEW.reminder_type = 'solution'
            THEN 'Time to apply your Hair Revitalizing Solution'
            WHEN NEW.reminder_type = 'shampoo'
            THEN 'Time to use your 3-in-1 Shampoo & Beard Wash'
            ELSE 'Time for your hair care routine'
          END,
          'data', jsonb_build_object(
            'reminder_type', NEW.reminder_type,
            'notificationId', notification_id,
            'url', '/home',
            'type', 'reminder'
          )
        )
      );

  END IF;
  RETURN NEW;
END;
$$;

-- create_order_status_notification
CREATE OR REPLACE FUNCTION public.create_order_status_notification()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
AS $$
DECLARE
  notification_id bigint;
  edge_function_url text := 'https://viglpwqnrievcdraviiu.supabase.co/functions/v1/send-push';
  service_role_key text := current_setting('app.settings.service_role_key', true);
BEGIN
  IF OLD.delivery_status IS DISTINCT FROM NEW.delivery_status AND NEW.user_id IS NOT NULL THEN

    INSERT INTO public.notifications (
      user_id,
      order_id,
      order_number,
      title,
      message,
      type,
      old_status,
      new_status,
      action_url,
      data
    ) VALUES (
      NEW.user_id,
      NEW.id,
      NEW.order_number,
      'Order Status Updated',
      format('Your order #%s status has been updated from %s to %s',
             NEW.order_number, OLD.delivery_status, NEW.delivery_status),
      'order_update',
      OLD.delivery_status,
      NEW.delivery_status,
      format('/orders/%s', NEW.order_number),
      jsonb_build_object(
        'order_id', NEW.id,
        'total', NEW.total,
        'payment_status', NEW.payment_status
      )
    )
    RETURNING id INTO notification_id;

    PERFORM
      net.http_post(
        url := edge_function_url,
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', concat('Bearer ', service_role_key)
        ),
        body := jsonb_build_object(
          'userId', NEW.user_id,
          'title', 'Order Status Updated',
          'body', format('Your order #%s status has been updated to %s',
                        NEW.order_number, NEW.delivery_status),
          'data', jsonb_build_object(
            'orderNumber', NEW.order_number,
            'status', NEW.delivery_status,
            'notificationId', notification_id,
            'url', format('/orders/%s', NEW.order_number)
          )
        )
      );

  END IF;
  RETURN NEW;
END;
$$;
