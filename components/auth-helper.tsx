import { getAuth } from 'firebase/auth';

/**
 * Returns the current user's UUID (Firebase UID) if logged in.
 * @returns string | null
 */
export const getCurrentUserUUID = (): string | null => {
  const auth = getAuth();
  const user = auth.currentUser;

  return user ? user.uid : null;
};
