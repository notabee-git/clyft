import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const fetchSearchData = async () => {
  const categories = await getDocs(collection(db, 'categories'));
  const subcategories = await getDocs(collection(db, 'subcategories'));
  const widelisting = await getDocs(collection(db, 'widelisting'));

  const allItems = [
    ...categories.docs.map(doc => ({ type: 'category', ...doc.data() })),
    ...subcategories.docs.map(doc => ({ type: 'subcategory', ...doc.data() })),
    ...widelisting.docs.map(doc => ({ type: 'widelisting', ...doc.data() })),
  ];

  return allItems;
};
