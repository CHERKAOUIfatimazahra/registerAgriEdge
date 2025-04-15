import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export async function isUserAdmin(userEmail) {
  try {
    const adminDoc = await getDoc(doc(db, 'admins', userEmail));
    return adminDoc.exists();
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
} 