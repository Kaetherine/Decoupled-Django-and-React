import React from 'react';
import { Link } from "react-router-dom";

function Beispiel() {
  return (
    <div className = "App-header">
        <div>
            <h1>Ipsum & Dolor</h1>
        </div>
            <nav>
                <Link to="/">Home</Link> |{" "}
                <Link to="/articles">Articles</Link>
            </nav>
    </div>
  )
}

export default Beispiel
