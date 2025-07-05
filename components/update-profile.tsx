import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import { doc, getDoc, setDoc, getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useEffect } from 'react';


interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  contactNo: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female' | 'Other';
}

export default function UpdateProfileScreen() {


  const auth = getAuth();
  const db = getFirestore();
  const router = useRouter();


  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    contactNo: '',
    dateOfBirth: new Date(),
    gender: 'Male',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null); 


  useEffect(() => {
  const fetchUserData = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const userRef = doc(db, 'Users', currentUser.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();

        setProfileData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          contactNo: userData.contact || '',
          dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth) : new Date(),
          gender: userData.gender || 'Male',
        });
      } else {
        console.log('No user document found');
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    }
  };

  fetchUserData();
}, []);
  

  const handleContactNumberChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    handleInputChange('contactNo', numericText);
  };

  const handleInputChange = (field: keyof ProfileData, value: string | Date) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleInputChange('dateOfBirth', selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} - ${month} - ${year}`;
  };

  const handleUpdateProfile = async () => {
    if (
      !profileData.firstName.trim() ||
      !profileData.lastName.trim() ||
      !profileData.email.trim() ||
      !profileData.contactNo.trim()
    ) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

     try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('User not authenticated');

      const userRef = doc(db, 'Users', currentUser.uid);
      await setDoc(userRef, {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        contact: profileData.contactNo,
        gender: profileData.gender,
        dateOfBirth: profileData.dateOfBirth.toISOString(),
      }, { merge: true });

      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update Profile</Text>
      </View> */}

      <View style={styles.form}>
        {/* First Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>First Name *</Text>
          <TextInput
            style={[
              styles.input,
              focusedField === 'firstName' && styles.inputFocused 
            ]}
            value={profileData.firstName}
            onChangeText={(text) => handleInputChange('firstName', text)}
            onFocus={() => setFocusedField('firstName')}
            onBlur={() => setFocusedField(null)}
            placeholder={"Enter first name"}
          />
        </View>

        {/* Last Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Last Name *</Text>
          <TextInput
            style={[
              styles.input,
              focusedField === 'lastName' && styles.inputFocused
            ]}
            value={profileData.lastName}
            onChangeText={(text) => handleInputChange('lastName', text)}
            onFocus={() => setFocusedField('lastName')}
            onBlur={() => setFocusedField(null)}
            placeholder={"Enter first name"}
          />
        </View>

        {/* Email Address */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email Address *</Text>
          <TextInput
            style={[
              styles.input,
              focusedField === 'email' && styles.inputFocused
            ]}
            value={profileData.email}
            onChangeText={(text) => handleInputChange('email', text)}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            placeholder={"Enter email address"}
            keyboardType="email-address"
            autoCapitalize="none"
          />

        </View>

        {/* Contact Number */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contact No (+91) *</Text>
          <TextInput
            style={[
              styles.input,
              focusedField === 'contactNo' && styles.inputFocused
            ]}
            value={profileData.contactNo}
            onChangeText={(text) => handleInputChange('contactNo', text)}
            onFocus={() => setFocusedField('contactNo')}
            onBlur={() => setFocusedField(null)}
            placeholder={ "Enter contact number"}
            keyboardType="numeric"
            maxLength={13}
          />
        </View>

        {/* Date of Birth */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {formatDate(profileData.dateOfBirth)}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Gender */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={styles.genderOption}
              onPress={() => handleInputChange('gender', 'Male')}
            >
              <View style={styles.radioButton}>
                {profileData.gender === 'Male' && (
                  <View style={styles.radioButtonSelected} />
                )}
              </View>
              <Text style={styles.genderText}>Male</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.genderOption}
              onPress={() => handleInputChange('gender', 'Female')}
            >
              <View style={styles.radioButton}>
                {profileData.gender === 'Female' && (
                  <View style={styles.radioButtonSelected} />
                )}
              </View>
              <Text style={styles.genderText}>Female</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Update Button */}
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
          <Text style={styles.updateButtonText}>Update Profile</Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={profileData.dateOfBirth}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          maximumDate={new Date()}
          onChange={handleDateChange}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20, 
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    zIndex: 1000, 
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    flex: 1, 
  },
  form: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    fontWeight: '400',
  },
  input: {
    backgroundColor: '#E6E6E6',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    borderWidth: 0,
  },
  inputFocused: {
    borderColor: '#000', 
    borderWidth: 1, 
    backgroundColor: '#E6E6E6',
  },
  dateInput: {
    backgroundColor: '#E6E6E6',
    fontWeight: '500',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0,
  },
  dateText: {
    fontSize: 16,
    color: '#000',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 4,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioButton: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000',
  },
  genderText: {
    fontSize: 16,
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
