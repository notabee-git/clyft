import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { CartItem, Address } from '@/constants/types';
import { router } from "expo-router";

const db = getFirestore();

export async function placeOrder(
  cart: CartItem[],
  userId: string,
  address: Address,
  clearCart: () => void // <-- Add this
) {
  try {
    for (const item of cart) {
      const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

      const orderData = {
        Address: address,
        GST: 18,
        OrderID: orderId,
        UUID: userId,
        createdAt: serverTimestamp(),
        delivery_date: serverTimestamp(),
        delivery_fee: 20,
        item: item.product.name,
        price: item.price,
        quantity: item.quantity,
        size: item.product.variants[item.variantIndex].size,
        status: "pending",
        total: item.price * item.quantity,
        variant: item.variantIndex,
      };

      await addDoc(collection(db, "orders"), orderData);
      console.log("✅ Order placed for:", item.product.name);
    }

    // ✅ Clear cart after all orders are placed
    clearCart();

    // ✅ Navigate to homepage
    router.replace("/Homepage");

  } catch (error) {
    console.error("❌ Error placing order:", error);
  }
}
