import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { CartItem } from '@/constants/types';

const db = getFirestore();

export async function placeOrder(cart: CartItem[], userId: string, address: string = "Hitech City") {
  try {
    for (const item of cart) {
      const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

      const orderData = {
        OrderID: orderId,
        userId,
        name: item.product.name,
        price: item.price,
        quantity: item.quantity.toString(),
        total: item.price * item.quantity,
        status: "pending",
        createdAt: serverTimestamp(),
        Address: address,
      };

      const docRef = await addDoc(collection(db, "orders"), orderData);
      console.log("✅ Order placed for item:", item.product.name, "with ID:", docRef.id);
    }
  } catch (error) {
    console.error("❌ Error placing order:", error);
  }
}
