import { useState, useEffect } from 'react'
import './App.css'
import ArticleList from './components/ArticleList'
import Form from './components/Form'
import Beispiel from './components/Beispiel'

function App() {

  const [articles, setArticles] = useState([])
  const [editArticle, setEditArticles] = useState(null)

    const updatedInformation = (article) => {
      const new_article = articles.map(myarticle => {
        if(myarticle.id === article.id) {
          return article;
        }
        else {
          return myarticle;
        }
      })
  
      setArticles(new_article)
  
    }

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/articles', {
      'method' : 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization' : 'Token 4ff70db43d26a1eb5d05afd6d55045184a0e15e7'
      }
    })
    .then(resp => resp.json())
    .then(resp => setArticles(resp))
    .catch(error => console.log(error))
  },[])
  const editBtn = (article) => {
    setEditArticles(article)
  }

  return (
    <div>
      <div className="App-header">
      <Beispiel></Beispiel>
      </div>
      <br></br>
      <br></br>
      <div className="App">
      <ArticleList articles = {articles} editBtn = {editBtn}></ArticleList>
      
      {editArticle ? <Form article = {editArticle} updatedInformation = {updatedInformation}></Form> : null}
      </div>
    </div>
  )
}

export default App
