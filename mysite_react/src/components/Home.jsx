import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="main-content">
      <div className="App-header">
        <br></br>
        <br></br>
        <div>
          <div className="home-text-container">
            <p>
            GrokNotes is a personal tool I built around the functionality
            of captureing and structureing technical notes. It was built as a proof of concept
            to validate that a decoupled multi-page-application can be built 
            using Django and React.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
