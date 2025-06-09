localStorage.removeItem("isSubscribed");
localStorage.removeItem("isPremiumMovie");
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import store from './redux/store';
import { AuthProvider } from './Auth/AuthContext';
import './responsive.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
