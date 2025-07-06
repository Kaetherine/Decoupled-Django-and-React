import { useState, useEffect } from 'react'
import './App.css'
import ArticleList from './components/ArticleList'
import Form from './components/Form'
import { APIService } from './APIService'

function App() {

  const [articles, setArticles] = useState([])
  const [editArticle, setEditArticles] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

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
    const fetchArticles = async () => {
      try {
        setIsLoading(true)
        const data = await APIService.getArticles()
        setArticles(data)
        setError(null)
      } catch (error) {
        console.error('Error fetching articles:', error)
        setError('Failed to load articles')
      } finally {
        setIsLoading(false)
      }
    }

    fetchArticles()
  }, [])

  const editBtn = (article) => {
    setEditArticles(article)
  }

  const deleteBtn = async (article) => {
    try {
      await APIService.deleteArticle(article.id)
      const new_articles = articles.filter(myarticle => {
        if(myarticle.id === article.id) {
          return false
        }
        return true;
      })
      setArticles(new_articles)
    } catch (error) {
      console.error('Error deleting article:', error)
      setError('Failed to delete article')
    }
  }

  if (isLoading) {
    return (
      <div className="main-content" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Loading articles...</h2>
      </div>
    )
  }

  if (error) {
    return (
      <div className="main-content" style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
        <h2>Error: {error}</h2>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    )
  }

  return (
    <div className="main-content">
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
