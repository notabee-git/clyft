import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { db, doc, getDoc, updateDoc } from '../firebaseConfig';
import { getCurrentUserUUID } from './auth-helper';

type AddressType = 'Home' | 'Office' | 'Site' | 'Other';

interface AddressFormData {
  fullName: string;
  phoneNumber: string;
  pincode: string;
  state: string;
  city: string;
  locality: string;
  flatBuilding: string;
  landmark: string;
  addressType: AddressType;
  isDefault: boolean;
}

const EditAddress: React.FC = () => {
  const { index, isDefault } = useLocalSearchParams();
  const addressIndex = parseInt(index as string, 10);
  const isDefaultAddress = isDefault === 'true';

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
    isDefault: isDefaultAddress,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AddressFormData, string>>>({});

  useEffect(() => {
    const loadAddress = async () => {
      const uuid = getCurrentUserUUID();
      if (!uuid) return;

      const userSnap = await getDoc(doc(db, 'Users', uuid));
      if (!userSnap.exists()) return;

      const data = userSnap.data();
      const addressList = isDefaultAddress ? [data.default_address] : data.address || [];
      const addressToEdit = addressList[addressIndex];

      if (addressToEdit) {
        setFormData({
          fullName: addressToEdit.fullname || '',
          phoneNumber: addressToEdit.mobile || '',
          pincode: addressToEdit.pincode || '',
          state: addressToEdit.state || '',
          city: addressToEdit.city || '',
          locality: addressToEdit.locality || '',
          flatBuilding: addressToEdit.flatBuilding || '',
          landmark: addressToEdit.landmark || '',
          addressType: addressToEdit.addressType || 'Home',
          isDefault: isDefaultAddress,
        });
      }
    };

    loadAddress();
  }, []);

  const handleInputChange = (field: keyof AddressFormData, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: undefined });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AddressFormData, string>> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    else if (!/^\+?[0-9]{10,12}$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Invalid phone number';

    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.locality.trim()) newErrors.locality = 'Locality is required';
    if (!formData.flatBuilding.trim()) newErrors.flatBuilding = 'Flat/Building is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUseLocation = () => {
    Alert.alert('Location Service', 'Getting your current location...');
    setTimeout(() => {
      setFormData({
        ...formData,
        pincode: '400001',
        state: 'Maharashtra',
        city: 'Mumbai'
      });
    }, 1000);
  };

  const handleSaveAddress = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Please fill all required fields correctly.');
      return;
    }

    const uuid = getCurrentUserUUID();
    if (!uuid) {
      Alert.alert('Error', 'User not found.');
      return;
    }

    const userRef = doc(db, 'Users', uuid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      Alert.alert('Error', 'User data not found.');
      return;
    }

    const userData = userSnap.data();
    const updatedAddress = {
      id: Date.now(),
      fullname: formData.fullName,
      address: formData.locality,
      mobile: formData.phoneNumber,
      pincode: formData.pincode,
      state: formData.state,
      city: formData.city,
      locality: formData.locality,
      flatBuilding: formData.flatBuilding,
      landmark: formData.landmark,
      addressType: formData.addressType,
      isDefault: formData.isDefault,
    };

    try {
      if (isDefaultAddress) {
        await updateDoc(userRef, { default_address: updatedAddress });
      } else {
        const updatedList = [...(userData.address || [])];
        updatedList[addressIndex] = updatedAddress;
        await updateDoc(userRef, { address: updatedList });
      }

      Alert.alert('Success', 'Address updated successfully!');
      router.back();
    } catch (error) {
      console.error('Error updating address:', error);
      Alert.alert('Error', 'Could not update address.');
    }
  };

  return (
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
            onChangeText={(text) =>
              handleInputChange('fullName', text.replace(/[^a-zA-Z\s]/g, ''))
            }
          />
          <TextInput
            style={[styles.input, errors.phoneNumber && styles.inputError]}
            placeholder="Phone number (+91) *"
            value={formData.phoneNumber}
            onChangeText={(text) =>
              handleInputChange('phoneNumber', text.replace(/[^0-9]/g, ''))
            }
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
              onChangeText={(text) => handleInputChange('pincode', text.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              maxLength={6}
            />
            <TouchableOpacity style={styles.locationButton} onPress={handleUseLocation}>
              <Ionicons name="location" size={18} color="#FFF" />
              <Text style={styles.locationButtonText}>Use my location</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.stateCity}>
            <TextInput
              style={[styles.stateCityInput, errors.state && styles.inputError]}
              placeholder="State *"
              value={formData.state}
              onChangeText={(text) =>
                handleInputChange('state', text.replace(/[^a-zA-Z\s]/g, ''))
              }
            />
            <TextInput
              style={[styles.stateCityInput, errors.city && styles.inputError]}
              placeholder="City *"
              value={formData.city}
              onChangeText={(text) =>
                handleInputChange('city', text.replace(/[^a-zA-Z\s]/g, ''))
              }
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
                  <Text
                    style={[
                      styles.addressTypeText,
                      formData.addressType === type && styles.addressTypeSelectedText
                    ]}
                  >
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
            <Text style={styles.checkboxLabel}>Make this my default address</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveAddress}>
          <Text style={styles.saveButtonText}>SAVE ADDRESS</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditAddress;


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
