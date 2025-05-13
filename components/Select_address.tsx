import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { Feather, AntDesign } from '@expo/vector-icons';
const mockAddresses = [
  {
    id: '1',
    name: 'Sathwik',
    address: 'Address\nLocality/Town\nCity/District, State, Pin Code',
    mobile: '8008687540',
  },
  {
    id: '2',
    name: 'Sathwik',
    address: 'Address\nLocality/Town\nCity/District, State, Pin Code',
    mobile: '8008687540',
  },
];

export default function AddressScreen() {
  const [selectedAddress, setSelectedAddress] = useState('1');

  return (
    <View style={styles.container}>
    <View style={styles.progressBar}>
          <Text style={styles.progressActive}>                 </Text>
          {/* <AntDesign name="arrowright" size={18} style={styles.progressArrowActive} /> */}
          <Text style={styles.progressInactive}>          Cart</Text>
          <AntDesign name="arrowright" size={18} style={styles.progressArrowInactive} />
          <Text style={styles.progressActive}>Address</Text>
          <AntDesign name="arrowright" size={18} style={styles.progressArrowInactive} />
          <Text style={styles.progressInactive}>Payment</Text>
        </View>

      {/* Add Address */}
      <TouchableOpacity style={styles.addAddressBtn}>
        <Text style={styles.addAddressText}>ADD A NEW ADDRESS</Text>
      </TouchableOpacity>

      {/* Address List */}
      <ScrollView style={{ flex: 1 }}>
        {mockAddresses.map(addr => (
          <View key={addr.id} style={styles.addressCard}>
            <View style={styles.radioContainer}>
              <RadioButton
                value={addr.id}
                status={selectedAddress === addr.id ? 'checked' : 'unchecked'}
                onPress={() => setSelectedAddress(addr.id)}
              />
              <View>
                <Text style={styles.name}>{addr.name}</Text>
                <Text>{addr.address}</Text>
                <Text style={styles.mobile}>Mobile : <Text style={styles.bold}>{addr.mobile}</Text></Text>
              </View>
            </View>
            {selectedAddress === addr.id && (
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.smallBtn}>
                  <Text style={styles.btnText}>REMOVE</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.smallBtn}>
                  <Text style={styles.btnText}>EDIT</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Deliver Here Button */}
      <TouchableOpacity style={styles.deliverBtn}>
        <Text style={styles.deliverText}>DELIVER HERE</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { marginBottom: 16 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  progressText: { fontSize: 14, marginTop: 4 },
  green: { color: 'green', fontWeight: 'bold' },
  addAddressBtn: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  addAddressText: { fontWeight: 'bold' },
  addressCard: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
    borderRadius: 6,
  },
  radioContainer: { flexDirection: 'row', alignItems: 'flex-start' },
  name: { fontWeight: 'bold', fontSize: 16 },
  mobile: { marginTop: 4 },
  bold: { fontWeight: 'bold' },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  smallBtn: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 4,
  },
  btnText: { fontWeight: 'bold' },
  deliverBtn: {
    backgroundColor: '#000',
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  deliverText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
    marginTop: 10,
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
});
