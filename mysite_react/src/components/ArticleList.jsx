import LinkComponent from './LinkComponent';
import React from 'react';

function ArticleList(props) {

  const editBtn = (article) => {
      props.editBtn(article)
  }
 return (
   <div>
    <LinkComponent></LinkComponent>
    {props.articles && props.articles.map((article) => {
      return (
        <div key = {article.id} >
      <h2>{article.title}</h2>
      <p>{article.description}</p>
      <div className = "row">
          <div className = "col-md-1">
              <button className ="btn btn-primary" onClick = {() => editBtn(article)}>Update</button>
              </div>
          <div className = "col">
              <button className ="btn btn-danger">Delete</button>
          </div></div>
      <hr></hr>
      </div>
      )
    })}
     
   </div>
 )
}

export default ArticleList
