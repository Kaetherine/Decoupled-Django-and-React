import LinkComponent from './components/LinkComponent'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

function App() {

  return (
    <div>
      <div>
        <LinkComponent></LinkComponent>
      </div>
      <div className="App">
        <div>
          <a href="https://www.djangoproject.com/" target="_blank">
            <img src="src\assets\django-logo-positive.png" className="logo" alt="django logo" />
          </a>
          <a href="https://reactjs.org" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
      </div>
    </div>
    
  )
}

export default App
