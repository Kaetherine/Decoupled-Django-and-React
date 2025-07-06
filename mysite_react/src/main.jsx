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

// Placeholder components for new routes
const Technologies = () => <div style={{padding: '2rem'}}><h1>Technologies</h1><p>Coming soon...</p></div>
const Projects = () => <div style={{padding: '2rem'}}><h1>Engineering Projects</h1><p>Coming soon...</p></div>
const Architecture = () => <div style={{padding: '2rem'}}><h1>Architecture</h1><p>Coming soon...</p></div>

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
        <Route path="/technologies" element={<Technologies />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/architecture" element={<Architecture />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
