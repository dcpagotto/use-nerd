import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:3000,http://localhost:8000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:9000,http://localhost:5173",
      authCors: process.env.AUTH_CORS || "http://localhost:9000,http://localhost:5173,http://localhost:8000",
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  admin: {
    disable: false,
    backendUrl: "http://localhost:9000"
  },
  modules: [
    {
      resolve: "@medusajs/medusa/fulfillment",
      options: {
        providers: [
          {
            resolve: "@vymalo/medusa-printful/printful-fulfillment",
            id: "printful-fulfillment",
            options: {
              enableWebhooks: process.env.PRINTFUL_ENABLE_WEBHOOKS === "true" || false,
              printfulAccessToken: process.env.PRINTFUL_ACCESS_TOKEN || "",
              storeId: process.env.PRINTFUL_STORE_ID || "",
              logo_url: process.env.PRINTFUL_LOGO_URL || "",
              backendUrl: process.env.PRINTFUL_BACKEND_URL || "http://localhost:9000",
              confirmOrder: process.env.PRINTFUL_CONFIRM_ORDER === "true" || false
            }
          }
        ]
      }
    },
    {
      resolve: "@vymalo/medusa-printful",
      options: {
        printfulAccessToken: process.env.PRINTFUL_ACCESS_TOKEN || "",
        storeId: process.env.PRINTFUL_STORE_ID || "",
        logo_url: process.env.PRINTFUL_LOGO_URL || "",
        backendUrl: process.env.PRINTFUL_BACKEND_URL || "http://localhost:9000",
        confirmOrder: process.env.PRINTFUL_CONFIRM_ORDER === "true" || false,
        enableWebhooks: process.env.PRINTFUL_ENABLE_WEBHOOKS === "true" || false
      }
    }
  ]
})
