import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, getAuth, User as FirebaseUser } from 'firebase/auth';
import { db, firebaseApp } from '@/firebaseConfig';
import * as Location from 'expo-location';
import { doc, updateDoc, setDoc } from 'firebase/firestore';

// TYPES
export interface Address {
  area: string;
  city: string;
  pincode: string;
  state: string;
  street: string;
}

type Gender = 'Male' | 'Female' | 'Other';

export interface User {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  dateOfBirth: string;
  gender: Gender;
  addresses: Address[];
  deliveryAddress?: Address;
  currentLocationAddress?: Address;
}

type LocationCoords = {
  latitude: number;
  longitude: number;
};

// CONTEXT TYPE
interface UserContextType {
  user: User | null;
  uuid: string | null;
  globalCoordinates: LocationCoords | null;
  selectedLocation: string | null;
  setGlobalCoordinates: (location: LocationCoords) => void;
  fetchAndSetLocationName: () => Promise<void>;
  updateUserInfo: (
    updatedInfo: Partial<Omit<User, 'uid' | 'addresses' | 'deliveryAddress' | 'currentLocationAddress'>>
  ) => void;
  addAddress: (address: Address) => void;
  setDeliveryAddress: (address: Address) => void;
  useCurrentLocation: (locationAddress: Address) => void;
  updateUserProfile: (updatedFields: Partial<User>) => Promise<void>;
}

// DEFAULT CONTEXT
export const UserContext = createContext<UserContextType>({
  user: null,
  uuid: null,
  globalCoordinates: null,
  selectedLocation: null,
  setGlobalCoordinates: () => {},
  fetchAndSetLocationName: async () => {},
  updateUserInfo: () => {},
  addAddress: () => {},
  setDeliveryAddress: () => {},
  useCurrentLocation: () => {},
  updateUserProfile: async () => {},
});

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};

// PROVIDER
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [uuid, setUUID] = useState<string | null>(null);
  const [globalCoordinates, setGlobalCoordinates] = useState<LocationCoords | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const auth = getAuth(firebaseApp);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          firstName: '',
          lastName: '',
          email: firebaseUser.email ?? '',
          contact: firebaseUser.phoneNumber ?? '',
          dateOfBirth: '',
          gender: 'Other',
          addresses: [],
        });
        setUUID(firebaseUser.uid);
      } else {
        setUser(null);
        setUUID(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateUserInfo = (
    updatedInfo: Partial<Omit<User, 'uid' | 'addresses' | 'deliveryAddress' | 'currentLocationAddress'>>
  ) => {
    setUser(prev => (prev ? { ...prev, ...updatedInfo } : prev));
  };

  const addAddress = (address: Address) => {
    setUser(prev => prev ? { ...prev, addresses: [...prev.addresses, address] } : prev);
  };

  const setDeliveryAddress = (address: Address) => {
    setUser(prev => prev ? { ...prev, deliveryAddress: address } : prev);
  };

  const useCurrentLocation = (locationAddress: Address) => {
    setUser(prev =>
      prev
        ? {
            ...prev,
            currentLocationAddress: locationAddress,
            deliveryAddress: locationAddress,
            addresses: [locationAddress, ...prev.addresses],
          }
        : prev
    );
  };

  const fetchAndSetLocationName = async () => {
    if (!globalCoordinates) return;

    try {
      const [location] = await Location.reverseGeocodeAsync({
        latitude: globalCoordinates.latitude,
        longitude: globalCoordinates.longitude,
      });

      if (location) {
        const address = `${location.name || ''}, ${location.city || ''}, ${location.postalCode || ''}`;
        setSelectedLocation(address.trim());
      } else {
        setSelectedLocation(null);
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      setSelectedLocation(null);
    }
  };

    const updateUserProfile = async (updatedFields: Partial<User>) => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const uuid = user.uid;
    const userRef = doc(db, 'Users', uuid); // Note: 'Users' with capital U

    // Merge updated fields with existing user document
    await setDoc(userRef, updatedFields, { merge: true });

    setUser(prev => (prev ? { ...prev, ...updatedFields } : prev));
    };

    
  return (
    <UserContext.Provider
      value={{
        user,
        uuid,
        globalCoordinates,
        selectedLocation,
        setGlobalCoordinates,
        fetchAndSetLocationName,
        updateUserInfo,
        addAddress,
        setDeliveryAddress,
        useCurrentLocation,
        updateUserProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
