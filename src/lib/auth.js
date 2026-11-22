import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
const secret = process.env.BETTER_AUTH_SECRET;
if (process.env.NODE_ENV === "production" && (!secret || secret.length < 32)) {
  throw new Error("BETTER_AUTH_SECRET must be set to at least 32 characters in production.");
}

const client = new MongoClient(process.env.DB_URL);
const db = client.db('fix-mate');
export const auth = betterAuth({
  secret,
  trustedOrigins: ["http://localhost:3000", "https://studio-space-ivory.vercel.app"],
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    storage: "database",
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
      "/sign-up/email": { window: 60, max: 5 },
      "/sign-in/social": { window: 60, max: 10 },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true
  },
  user: {
    additionalFields: {
      role: {
        // "string" (not an array) so better-auth can actually validate;
        // input stays true so the sign-up form can still pick technician.
        // databaseHooks below make "admin" impossible via self-signup.
        type: "string",
        input: true,
        defaultValue: "customer",
      },
      phone: { type: "string", required: false },
      area: { type: "string", required: false },
      bio: { type: "string", required: false },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => ({
          data: {
            ...user,
            // Only customer/technician via signup; admins are promoted later
            // through the admin dashboard (or a one-time DB update).
            role: user.role === "technician" ? "technician" : "customer",
          },
        }),
      },
      update: {
        // SECURITY: a user must never be able to change their own role from the client
        before: async ({ role, ...data }) => ({
          data: {
            ...data,
            ...(typeof data.phone === "string" && { phone: data.phone.trim().slice(0, 20) }),
            ...(typeof data.area === "string" && { area: data.area.trim().slice(0, 100) }),
            ...(typeof data.bio === "string" && { bio: data.bio.trim().slice(0, 300) }),
          },
        }),
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "credential"],
      requireLocalEmailVerified: false
    }
  },
  plugins: [jwt()],
  session: {
    cookieCache: {
      enabled: true,
      strategy: 'jwt',
      maxAge: 7 * 24 * 60 * 60
    }
  },
  database: mongodbAdapter(db, {
    client
  })
});
