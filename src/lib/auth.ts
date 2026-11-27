import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.DB_URI as string);
const db = client.db('saloofy');

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
    emailAndPassword: { 
    enabled: true, 
  },
     user: {
       additionalFields: {
          role: {
              type: ["user", "admin"],
              input: false,
              defaultValue: 'user'
            },
          // Blocked users keep their account but lose access to protected
          // features. `input: false` stops clients from changing this field.
          blocked: {
              type: "boolean",
              input: false,
              defaultValue: false
            }
        }
    },
    socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
});