import { auth, db } from "../Auth/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
export const checkSubscription = async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) return false;

    const userRef = doc(db, "users", currentUser.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return false;

    const userData = userSnap.data();
    const subscriptionStatus = userData.subscriptionStatus;
    const subscriptionExpiry = userData.subscriptionExpiry;

    if (!subscriptionExpiry) return false;

    const expiryDate = subscriptionExpiry.toDate ? subscriptionExpiry.toDate() : new Date(subscriptionExpiry);
    const now = new Date();

    if (now <= expiryDate) {
      if (subscriptionStatus !== "active") {
        await updateDoc(userRef, { subscriptionStatus: "active" });
      }
      return true;
    } else {
      if (subscriptionStatus !== "deactive") {
        await updateDoc(userRef, { subscriptionStatus: "deactive" });
      }
      return false;
    }
  } catch (error) {
    console.error("Error checking subscription:", error);
    return false;
  }
};

