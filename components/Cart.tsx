// screens/CartScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

type CartItem = {
  id: number;
  name: string;
  price: number;
};

const CartScreen = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, name: 'Product 1', price: 10.0 },
    { id: 2, name: 'Product 2', price: 20.0 },
    { id: 3, name: 'Product 3', price: 30.0 },
  ]);

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      
      {/* Cart items */}
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text>{item.name}</Text>
            <Text>${item.price.toFixed(2)}</Text>
          </View>
        )}
      />

      {/* Total */}
      <View style={styles.total}>
        <Text>Total: ${totalAmount.toFixed(2)}</Text>
      </View>

      {/* Checkout Button */}
      <TouchableOpacity style={styles.checkoutButton}>
        <Text style={styles.checkoutText}>Proceed to Checkout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  total: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f8f8f8',
    marginBottom: 20,
  },
  checkoutButton: {
    padding: 15,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    borderRadius: 5,
  },
  checkoutText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CartScreen;
