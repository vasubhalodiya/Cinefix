import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [subscriptionExpiry, setSubscriptionExpiry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSubscriptionStatus(data.subscriptionStatus || null);
          setSubscriptionExpiry(data.subscriptionExpiry ? data.subscriptionExpiry.toDate() : null);
        } else {
          setSubscriptionStatus(null);
          setSubscriptionExpiry(null);
        }
      } else {
        setUser(null);
        setSubscriptionStatus(null);
        setSubscriptionExpiry(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (subscriptionExpiry && subscriptionStatus === "active") {
      const now = new Date();

      if (now > subscriptionExpiry) {
        setSubscriptionStatus("deactive");
        if (user) {
          const docRef = doc(db, "users", user.uid);
          updateDoc(docRef, { subscriptionStatus: "deactive" }).catch(console.error);
        }
      }
    }
  }, [subscriptionExpiry, subscriptionStatus, user]);

  return (
    <AuthContext.Provider value={{ user, loading, subscriptionStatus, subscriptionExpiry }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
