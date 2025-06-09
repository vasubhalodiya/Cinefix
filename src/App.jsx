import React, { useEffect } from "react";
import './App.css';
import Sidebar from "./components/Sidebar/Sidebar";
import AppRoutes from "./routes/AppRoutes";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './responsive.css';


const App = () => {
  const location = useLocation();
  const hideSidebarRoutes = ["/subscribe", "/paymentsuccessfull", "/login", "/signup"];
  const isResetLayout = hideSidebarRoutes.includes(location.pathname);

  useEffect(() => {
    if (isResetLayout) {
      document.body.classList.add("reset-css");
    } else {
      document.body.classList.remove("reset-css");
    }

    return () => document.body.classList.remove("reset-css");
  }, [location.pathname, isResetLayout]);

  return (
    <>
      {!isResetLayout && <Sidebar />}
      <div className="app-layout">
        <main className="main-cnt">
          <AppRoutes />
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            toastClassName="custom-toast"
          />
        </main>
      </div>
    </>
  );
};

export default App;
