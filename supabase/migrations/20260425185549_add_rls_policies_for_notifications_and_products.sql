/*
  # Add RLS policies for notifications and products

  ## Summary
  Both tables have RLS enabled but no policies, meaning no one can access them.
  This migration adds the correct access policies for each table.

  ## Changes

  ### public.products
  - Products are catalog data with no user ownership.
  - Authenticated users can read all active products.
  - No insert/update/delete for regular users (admin-managed via service role).

  ### public.notifications
  - Notifications belong to a specific user via user_id.
  - Users can read, update (mark as read), and delete their own notifications.
  - Insert is done by SECURITY DEFINER trigger functions (service role), so no
    authenticated INSERT policy is needed for regular users.
*/

-- products: all authenticated users can read active products
CREATE POLICY "Authenticated users can view active products"
  ON public.products FOR SELECT
  TO authenticated
  USING (active = true);

-- notifications: users can only access their own
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own notifications"
  ON public.notifications FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));
