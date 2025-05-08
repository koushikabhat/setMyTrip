
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="49056388068-mlvg46thi7i3n5d38q4brn52tvc44ngl.apps.googleusercontent.com">
    <StrictMode>
      <App /> 
    </StrictMode>
  </GoogleOAuthProvider>,
)
