/*
  # Move pg_net extension from public to extensions schema

  ## Summary
  The pg_net extension is currently installed in the public schema, which is
  a security risk as it exposes HTTP functions to all public schema users.
  Moving it to the extensions schema restricts access appropriately.

  ## Changes
  - Drop pg_net from public schema
  - Recreate pg_net in the extensions schema
*/

DROP EXTENSION IF EXISTS pg_net;
CREATE EXTENSION IF NOT EXISTS pg_net SCHEMA extensions;
