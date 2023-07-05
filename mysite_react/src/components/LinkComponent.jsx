import React from 'react';
import { Link } from "react-router-dom";

function LinkComponent() {
  return (
    <div className="App-header">
            <nav>
                <Link to="/">Home</Link> |{" "}
                <Link to="/articles">Articles</Link>|{" "}
                <Link to="/users">Users</Link>
                <br></br>
            </nav>
    </div>
  )
}

export default LinkComponent
