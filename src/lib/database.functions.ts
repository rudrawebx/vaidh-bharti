import { createServerFn } from "@tanstack/react-start";
import { testDbConnection, runSchemaMigration } from "@/integrations/mysql/client.server";

// 1. Check Hostinger MySQL Database Connection
export const checkHostingerDbConnection = createServerFn({ method: "GET" }).handler(async () => {
  return await testDbConnection();
});

// 2. Run Automatic Hostinger Table Creation Migration
export const initializeHostingerDbTables = createServerFn({ method: "POST" }).handler(async () => {
  return await runSchemaMigration();
});
