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
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
