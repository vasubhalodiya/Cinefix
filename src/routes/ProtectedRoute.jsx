import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../Auth/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const ProtectedRoute = ({ children }) => {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAllowed(false);
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        const data = snap.data();
        const expiry = data?.subscriptionExpiry?.toDate?.();
        const valid = data?.subscriptionStatus === "active" && expiry && expiry > new Date();

        setAllowed(valid);
      } catch (error) {
        console.error("Error fetching subscription:", error);
        setAllowed(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (allowed === null) return <div>Loading...</div>;
  return allowed ? children : <Navigate to="/subscribe" />;
};

export default ProtectedRoute;
