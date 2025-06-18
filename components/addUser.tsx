// Import required Firestore functions
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
// Import Firebase Authentication
import { getAuth } from 'firebase/auth';

// Initialize Firestore and Auth instances
const db = getFirestore();
const auth = getAuth();

/**
 * Checks if a user document exists in the 'Users' collection using the current user's UUID.
 * If not, it creates a new user document with default data.
 */
export const checkAndCreateUser = async () => {
  // Get the currently logged-in user
  const user = auth.currentUser;

  // If no user is logged in, exit the function
  if (!user) {
    console.log('No user logged in');
    return;
  }

  // Extract UUID (Firebase UID) from the user
  const uuid = user.uid;

  // Reference to the Firestore document for this user in the 'Users' collection
  const userDocRef = doc(db, 'Users', uuid);

  try {
    // Attempt to retrieve the document from Firestore
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      // If the document exists, log its data
      console.log('User already exists:', docSnap.data());
    } else {
      // If the document does not exist, create it with sample/default user data
      const userData = {
        UUID: uuid,
        firstName: '', // Use display name if available
        lastName: '',
        email: user.email,
        contact: user.phoneNumber, // Replace with actual number from user input
        password: '12345678', // ⚠️ Avoid storing raw passwords in production
        gender: '',
        dateOfBirth: '',
        currentLocation: '',
        address: [
          {
            area: '',
            city: '',
            pincode: 0,
            state: '',
            street: '',
          },
        ],
      };

      // Write the user document to Firestore
      await setDoc(userDocRef, userData);
      console.log('New user added to Firestore');
    }
  } catch (error) {
    // Handle errors during document fetch or creation
    console.error('Error checking or creating user:', error);
  }
};
