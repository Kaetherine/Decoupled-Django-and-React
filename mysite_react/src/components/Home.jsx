import React from 'react';
import LinkComponent from './LinkComponent';

function Home() {
  return (
    <div className="App-header">
    <LinkComponent></LinkComponent>
    <div>
      <br></br>
      <br></br>
        <div>
          <a href="https://www.djangoproject.com/" target="_blank">
            <img src="src\assets\django-logo-positive.png" className="logo" alt="django logo" />
          </a>
          <a href="https://reactjs.org" target="_blank">
            <img src="src\assets\react.svg" className="logo react" alt="React logo" />
          </a>
        </div>
      </div>
    </div>
  )
}

export default Home
