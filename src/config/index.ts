import "dotenv/config";

export const config = {
  port: process.env.PORT || 5000,

  database_url: process.env.DATABASE_URL,

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET as string,

    refreshSecret: process.env.JWT_REFRESH_SECRET as string,

    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "1h",

    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },

  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS),

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY as string,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET as string
  }

};
