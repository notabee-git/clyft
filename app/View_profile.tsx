import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

export default function ProfileScreen() {
  const auth = getAuth();
  const db = getFirestore();
  const router = useRouter();

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNo: '',
    dateOfBirth: new Date(),
    gender: '',
  });

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} - ${month} - ${year}`;
  };

  // Refetch profile whenever screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, 'Users', user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setProfileData({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            contactNo: userData.contact || '',
            dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth) : new Date(),
            gender: userData.gender || '',
          });
        }
      };

      fetchUserData();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileBlock}>
        <Text style={styles.label}>First Name</Text>
        <Text style={styles.readOnlyText}>{profileData.firstName}</Text>

        <Text style={styles.label}>Last Name</Text>
        <Text style={styles.readOnlyText}>{profileData.lastName}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.readOnlyText}>{profileData.email}</Text>

        <Text style={styles.label}>Contact No</Text>
        <Text style={styles.readOnlyText}>{profileData.contactNo}</Text>

        <Text style={styles.label}>Date of Birth</Text>
        <Text style={styles.readOnlyText}>{formatDate(profileData.dateOfBirth)}</Text>

        <Text style={styles.label}>Gender</Text>
        <Text style={styles.readOnlyText}>{profileData.gender}</Text>
      </View>

      <TouchableOpacity
        style={styles.updateButton}
        onPress={() => router.push('/update-profile')}
      >
        <Text style={styles.updateButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  profileBlock: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginTop: 16,
    marginBottom: 4,
  },
  readOnlyText: {
    fontSize: 16,
    fontWeight: '500',
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 6,
    color: '#000',
  },
  updateButton: {
    backgroundColor: '#000',
    borderRadius: 9,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
