import '@/db/config';
import { defineConfig } from "drizzle-kit"

export default defineConfig({
    schema: "./src/db/schema.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.POSTGRES_URL!,
    },
});
