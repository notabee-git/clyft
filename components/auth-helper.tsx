import { getAuth, onAuthStateChanged } from "firebase/auth";

/**
 * Waits until Firebase Auth is initialized and returns the current user's UUID.
 * @returns Promise<string | null>
 */
export const getCurrentUserUUID = async (): Promise<string | null> => {
  const auth = getAuth();

  if (auth.currentUser) {
    return auth.currentUser.uid;
  }

  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe(); // clean up listener
      resolve(user?.uid ?? null);
    });
  });
};
