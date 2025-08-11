import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"
import Home from './components/Home'
import Navbar from './components/Navbar'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import PasswordResetForm from './components/PasswordResetForm'
import PasswordResetConfirmForm from './components/PasswordResetConfirmForm'
import PasswordChange from './components/PasswordChange'
import PasswordResetConfirm from './components/PasswordResetConfirm'

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/articles" element={<App />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/password-reset" element={<PasswordResetForm />} />
        <Route path="/password-reset-confirm" element={<PasswordResetConfirmForm />} />
        <Route path="/password-change" element={<PasswordChange />} />
        <Route path="/reset-confirm" element={<PasswordResetConfirm />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
