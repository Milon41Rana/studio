
import { FirebaseOptions } from 'firebase/app';

// This config now reads from environment variables.
// This makes the app portable and secure for deployment on platforms like Vercel.
// The NEXT_PUBLIC_ prefix is required by Next.js to expose variables to the browser.
export const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyCP_yJrb5RJaxjcILbmYHbDQ7QzVKb5mxQ",
  authDomain: "studio-3606616224-86b1a.firebaseapp.com",
  projectId: "studio-3606616224-86b1a",
  storageBucket: "studio-3606616224-86b1a.appspot.com",
  messagingSenderId: "964859641752",
  appId: "1:964859641752:web:795109c451c2f06a62b5ed",
};
