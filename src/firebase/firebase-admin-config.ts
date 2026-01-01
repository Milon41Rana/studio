import { ServiceAccount } from 'firebase-admin';

// IMPORTANT: Store your service account credentials securely.
// Using environment variables is the recommended approach.
// Do not hardcode credentials in your source code.

// This structure is just for type definition.
// The actual values will be pulled from environment variables.
const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Important for Vercel/Netlify
};

export const firebaseAdminConfig = {
  credential: {
    projectId: serviceAccount.projectId!,
    clientEmail: serviceAccount.clientEmail!,
    privateKey: serviceAccount.privateKey!,
  },
  databaseURL: `https://${serviceAccount.projectId}.firebaseio.com`,
};
