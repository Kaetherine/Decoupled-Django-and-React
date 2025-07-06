import React from 'react';

function Home() {
  return (
    <div className="main-content">
      <div className="App-header">
        <br></br>
        <br></br>
        <div>
          <div style={{ 
            width: '60%', 
            margin: '0 auto',
            padding: '20px'
          }}>
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
