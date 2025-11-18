import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'production', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS || "https://usenerd.com,https://www.usenerd.com",
      adminCors: process.env.ADMIN_CORS || "https://admin.usenerd.com",
      authCors: process.env.AUTH_CORS || "https://admin.usenerd.com,https://usenerd.com",
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  admin: {
    disable: false,
    backendUrl: "https://api.usenerd.com"
  },
  modules: [
    // Printful will be added after initial deployment
    // Uncomment after adding PRINTFUL_ACCESS_TOKEN and PRINTFUL_STORE_ID to .env
    /*
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
              backendUrl: process.env.PRINTFUL_BACKEND_URL || "https://api.usenerd.com",
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
        backendUrl: process.env.PRINTFUL_BACKEND_URL || "https://api.usenerd.com",
        confirmOrder: process.env.PRINTFUL_CONFIRM_ORDER === "true" || false,
        enableWebhooks: process.env.PRINTFUL_ENABLE_WEBHOOKS === "true" || false
      }
    }
    */
  ]
})
