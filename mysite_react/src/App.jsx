import { useState, useEffect } from 'react'
import './App.css'
import ArticleList from './components/ArticleList'
import Form from './components/Form'

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
    fetch('http://localhost:8000/api/articles', {
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
  const deleteBtn = (article) => {
    const new_articles = articles.filter(myarticle => {
      if(myarticle.id === article.id) {
        return false
      }
      return true;
    })

    setArticles(new_articles)

  }

  return (
    <div>
      <br></br>
      <br></br>
      <div className="App">
        <ArticleList articles = {articles} editBtn = {editBtn} deleteBtn = {deleteBtn}></ArticleList>
        
        {editArticle ? <Form article = {editArticle} updatedInformation = {updatedInformation}></Form> : null}
      </div>
    </div>
  )
}

export default App
