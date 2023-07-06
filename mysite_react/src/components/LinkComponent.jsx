import React from 'react';
import { Link } from "react-router-dom";

function LinkComponent() {
  return (
    <div className = "App-header">
        <div>
            <h1>Ipsum & Dolor</h1>
        </div>
            <nav>
                <Link className='link' to="/">Home</Link> |{" "}
                <Link className='link' to="/articles">Articles</Link>
            </nav>
    </div>
  )
}

export default LinkComponent
