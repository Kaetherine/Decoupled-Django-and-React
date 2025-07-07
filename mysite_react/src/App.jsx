import { useState, useEffect, useRef } from 'react'
import './App.css'
import ArticleList from './components/ArticleList'
import Form from './components/Form'
import SearchBar from './components/SearchBar'
import { APIService } from './APIService'

function App() {

  const [articles, setArticles] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [editArticle, setEditArticles] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchMode, setIsSearchMode] = useState(false)
  const formRef = useRef(null)

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
      
      // Also update search results if in search mode
      if (isSearchMode) {
        const new_search_results = searchResults.map(myarticle => {
          if(myarticle.id === article.id) {
            return article;
          }
          else {
            return myarticle;
          }
        })
        setSearchResults(new_search_results)
      }
      
      setEditArticles(null) // Hide edit form after update
    }

    const articleCreated = (article) => {
      setArticles([...articles, article])
      setShowCreateForm(false) // Hide create form after creation
    }

    const cancelOperation = () => {
      setEditArticles(null)
      setShowCreateForm(false)
    }

    const startCreateArticle = () => {
      setEditArticles(null) // Clear any existing edit
      setShowCreateForm(true)
    }

    const handleSearch = async (query) => {
      setIsSearching(true)
      setError(null)
      
      try {
        const response = await APIService.searchArticles(query)
        setSearchResults(response.results)
        setSearchQuery(query)
        setIsSearchMode(true)
      } catch (error) {
        console.error('Search error:', error)
        setError('Failed to search articles')
      } finally {
        setIsSearching(false)
      }
    }

    const handleClearSearch = () => {
      setSearchResults([])
      setSearchQuery('')
      setIsSearchMode(false)
    }

    const deleteBtn = async (article) => {
      try {
        await APIService.deleteArticle(article.id)
        
        // Remove from articles list
        const new_articles = articles.filter(myarticle => myarticle.id !== article.id)
        setArticles(new_articles)
        
        // Also remove from search results if in search mode
        if (isSearchMode) {
          const new_search_results = searchResults.filter(myarticle => myarticle.id !== article.id)
          setSearchResults(new_search_results)
        }
        
      } catch (error) {
        console.error('Error deleting article:', error)
        setError('Failed to delete article')
      }
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
    setShowCreateForm(false) // Hide create form if showing
    setEditArticles(article)
  }

  if (isLoading) {
    return (
      <div className="main-content loading-container">
        <h2>Loading articles...</h2>
      </div>
    )
  }

  if (error) {
    return (
      <div className="main-content error-container">
        <h2>Error: {error}</h2>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    )
  }

  const displayedArticles = isSearchMode ? searchResults : articles

  return (
    <div className="main-content">
      <div className="App">
        <div className="article-list-container">
          <div className="top-controls">
            <SearchBar 
              onSearch={handleSearch}
              onClear={handleClearSearch}
              isSearching={isSearching}
            />
            <button 
              className="new-article-btn"
              onClick={startCreateArticle}
              title="Add Article"
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
            </button>
          </div>
          
          {editArticle && (
            <Form 
              article={editArticle} 
              updatedInformation={updatedInformation}
              cancelEdit={cancelOperation}
            />
          )}
          
          {showCreateForm && (
            <Form 
              articleCreated={articleCreated}
              cancelEdit={cancelOperation}
            />
          )}
          
          {isSearchMode && (
            <div className="search-info">
              <p>
                {searchResults.length > 0 
                  ? `Found ${searchResults.length} articles matching "${searchQuery}"` 
                  : `No articles found matching "${searchQuery}"`
                }
              </p>
            </div>
          )}
          
          {displayedArticles && displayedArticles.length > 0 ? (
            displayedArticles.map((article) => {
              return (
                <div key={article.id} className="article-item">
                  <h2>{article.title}</h2>
                  <p>{article.description}</p>
                  <div className="article-actions">
                    <button 
                      className="icon-button edit-button" 
                      onClick={() => editBtn(article)}
                      title="Edit Article"
                    >
                      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                      </svg>
                    </button>
                    <button 
                      onClick={() => deleteBtn(article)} 
                      className="icon-button delete-button"
                      title="Delete Article"
                    >
                      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="no-articles">
              <p>{isSearchMode ? 'No articles found matching your search.' : 'No articles yet. Create your first article!'}</p>
              {!isSearchMode && (
                <button 
                  className="new-article-btn"
                  onClick={startCreateArticle}
                  title="Add Article"
                >
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
