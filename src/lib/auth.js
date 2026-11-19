import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
const client = new MongoClient(process.env.DB_URL);
const db = client.db('fix-mate');
export const auth = betterAuth({
  trustedOrigins: ["http://localhost:3000", "https://studio-space-ivory.vercel.app"],
  emailAndPassword: {
    enabled: true,
    autoSignIn: false
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
        before: async (user) => {
          // Role is server-owned: strip it from any better-auth updateUser path.
          const { role: _role, ...rest } = user;
          return { data: rest };
        },
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
