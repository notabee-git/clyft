import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Alert, } from 'react-native';
import { Ionicons, Feather, AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {db, doc, getDoc, updateDoc } from '../firebaseConfig';
import { getCurrentUserUUID } from './auth-helper';
import { useLocalSearchParams } from "expo-router";
import { GeoPoint } from 'firebase/firestore';


type AddressType = 'Home' | 'Office' | 'Site' | 'Other';

interface AddressFormData {
  addressType: AddressType;
  city: string;
  fullName: string;
  phoneNumber: string;
  pincode: string;
  state: string;
  locality: string;
  flatBuilding: string;
  landmark: string;
  isDefault: boolean;
  latitude:number;
  longitude:number;
}





const AddressForm: React.FC = () => {
  const [formData, setFormData] = useState<AddressFormData>({
    fullName: '',
    phoneNumber: '',
    pincode: '',
    state: '',
    city: '',
    locality: '',
    flatBuilding: '',
    landmark: '',
    addressType: 'Home',
    isDefault: false,
    latitude:0,
    longitude:0,
  });
  const params = useLocalSearchParams();

    useEffect(() => {
      if (params && (params.pincode || params.city || params.state || params.locality || params.latitude || params.longitude)) {
        console.log(typeof params.latitude),
        setFormData((prev) => ({
          ...prev,
          pincode: typeof params.pincode === "string" ? params.pincode : "",
          state: typeof params.state === "string" ? params.state : "",
          city: typeof params.city === "string" ? params.city : "",
          locality: typeof params.locality === "string" ? params.locality : "",
          latitude: typeof params.latitude === "string" ? parseFloat(params.latitude) : 0,
          longitude: typeof params.longitude === "string" ? parseFloat(params.longitude) : 0,
        }));
      }
    }, []);


  const [errors, setErrors] = useState<Partial<Record<keyof AddressFormData, string>>>({});

  const handleInputChange = (field: keyof AddressFormData, value: string | boolean) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Clear error when user types
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: undefined
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AddressFormData, string>> = {};
    
    // Required fields
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    else if (!/^\+?[0-9]{10,12}$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Invalid phone number';
    
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.locality.trim()) newErrors.locality = 'Locality/Area/Street is required';
    if (!formData.flatBuilding.trim()) newErrors.flatBuilding = 'Flat no/Building name is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
const handleUseLocation = () => {

  router.push("/Location_page_address"); // Replace with your actual route if different
};


const handleSaveAddress = async () => {
  if (validateForm()) {
    const uuid = await getCurrentUserUUID();
    console.log('Current User UUID:', uuid);
    if (!uuid) {
      Alert.alert('Error', 'User ID not found.');
      return;
    }

    const userRef = doc(db, 'Users', uuid);

    try {
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        Alert.alert('Error', 'User not found.');
        return;
      }

      const userData = userSnap.data();
      const currentAddresses = userData.address || [];

      const newAddress = {
        id: Date.now(),
        fullname: formData.fullName,
        mobile: formData.phoneNumber,
        pincode: formData.pincode,
        state: formData.state,
        city: formData.city,
        locality: formData.locality,
        flatBuilding: formData.flatBuilding,
        landmark: formData.landmark,
        addressType: formData.addressType,
        coordinates: new GeoPoint(formData.latitude,formData.longitude),
      };

      // Add the new address
      const updatedAddresses = [...currentAddresses, newAddress];
      const newIndex = updatedAddresses.length - 1; // New index is last

      const updatePayload: any = {
        address: updatedAddresses,
      };

      // Only set default_address index if marked as default
      if (formData.isDefault) {
        updatePayload.default_address = newIndex;
      }

      await updateDoc(userRef, updatePayload);

      console.log('Address saved:', newAddress);
      Alert.alert('Success', 'Address saved successfully!');
      //route to saved address
      router.push("/Saved-Address");

    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert('Error', 'Could not save address. Please try again.');
    }
  } else {
    Alert.alert('Error', 'Please fill all required fields correctly.');
  }
};


  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
         <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>CONTACT INFO</Text>
          
          <TextInput
            style={[styles.input, errors.fullName && styles.inputError]}
            placeholder="Full Name *"
            value={formData.fullName}
            onChangeText={(text) => {
    const alphaText = text.replace(/[^a-zA-Z\s]/g, '');
    handleInputChange('fullName', alphaText);
  }}
          />
          
          <TextInput
            style={[styles.input, errors.phoneNumber && styles.inputError]}
            placeholder="Phone number (+91) *"
            value={formData.phoneNumber}
            onChangeText={(text) => {
            const numericText = text.replace(/[^0-9]/g, '');
            handleInputChange('phoneNumber', numericText);
            }}
            keyboardType="phone-pad"
            maxLength={10} 
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>ADDRESS INFO</Text>
          
          <View style={styles.pincodeRow}>
            <TextInput
              style={[styles.pincodeInput, errors.pincode && styles.inputError]}
              placeholder="Pincode *"
              value={formData.pincode}
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9]/g, '');
                 handleInputChange('pincode', numericText);
              }}    
              keyboardType="numeric"
              maxLength={6} 
            />
            <TouchableOpacity 
              style={styles.locationButton}
              onPress={handleUseLocation}
            >
              <Ionicons name="location" size={18} color="#FFF" />
              <Text style={styles.locationButtonText}>Use my location</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.stateCity}>
            <TextInput
              style={[styles.stateCityInput, errors.state && styles.inputError]}
              placeholder="State *"
              value={formData.state}
              onChangeText={(text) => {
    const alphaText = text.replace(/[^a-zA-Z\s]/g, '');
    handleInputChange('state', alphaText);
  }}
            />
            
            <TextInput
              style={[styles.stateCityInput, errors.city && styles.inputError]}
              placeholder="City *"
              value={formData.city}
              onChangeText={(text) => {
    const alphaText = text.replace(/[^a-zA-Z\s]/g, '');
    handleInputChange('city', alphaText);
  }}
            />
          </View>
          
          <TextInput
            style={[styles.input, errors.locality && styles.inputError]}
            placeholder="Locality / Area / Street *"
            value={formData.locality}
            onChangeText={(text) => handleInputChange('locality', text)}
          />
          
          <TextInput
            style={[styles.input, errors.flatBuilding && styles.inputError]}
            placeholder="Flat no / Building Name *"
            value={formData.flatBuilding}
            onChangeText={(text) => handleInputChange('flatBuilding', text)}
          />
          
          <TextInput
            style={[styles.input, errors.landmark && styles.inputError]}
            placeholder="Landmark *"
            value={formData.landmark}
            onChangeText={(text) => handleInputChange('landmark', text)}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>TYPE OF ADDRESS</Text>
          
          <View style={styles.addressTypeContainer}>
            {(['Home', 'Office', 'Site', 'Other'] as AddressType[]).map((type) => (
              <TouchableOpacity 
                key={type}
                style={styles.addressTypeOption}
                onPress={() => handleInputChange('addressType', type)}
                >
                <View style={styles.radioContainer}>
                    <View style={styles.radioOuter}>
                    {formData.addressType === type && <View style={styles.radioInner} />}
                    </View>
                    <Text style={[
                    styles.addressTypeText,
                    formData.addressType === type && styles.addressTypeSelectedText
                    ]}>
                    {type}
                    </Text>
                </View>
                </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => handleInputChange('isDefault', !formData.isDefault)}
          >
            <View style={[styles.checkbox, formData.isDefault && styles.checkboxSelected]}>
              {formData.isDefault && <Ionicons name="checkmark" size={12} color="#FFF" />}
            </View>
            <Text style={styles.checkboxLabel}>Make this as my default address</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSaveAddress}
        >
          <Text style={styles.saveButtonText}>SAVE ADDRESS</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 19,
    color: '#222',
    marginLeft: 14,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
    marginTop: 2,
  },
  progressActive: {
    color: '#0C8744',
    fontWeight: 'bold',
    fontSize: 15,
  },
  progressInactive: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 15,
  },
  progressArrowActive: {
    marginHorizontal: 6,
    color: '#0C8744',
  },
  progressArrowInactive: {
    marginHorizontal: 6,
    color: '#000',
  },  
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formSection: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    padding: 12,
    marginVertical: 6,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  pincodeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  pincodeInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    padding: 12,
    flex: 1,
    marginRight: 15,
  },
  locationButton: {
    backgroundColor: 'black',
    borderRadius: 4,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  locationButtonText: {
    color: 'white',
    marginLeft: 30,
    fontWeight: '500',
  },
  stateCity: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
    gap: 15,
  },
  stateCityInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    padding: 12,
    flex: 1,
  },
  stateCityInput1: {
    marginRight: 8,
  },
  addressTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  addressTypeOption: {
    marginVertical: 5,
    marginRight: 15,
  },
  addressTypeSelected: {
    fontWeight: 'bold',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#000',
  },
  addressTypeText: {
    fontSize: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkbox: {
    height: 18,
    width: 18,
    borderWidth: 2,
    borderColor: '#aaa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  checkboxLabel: {
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: 'black',
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 20,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  addressTypeSelectedText: {
  fontWeight: 'bold',
  },
});
export default AddressForm;