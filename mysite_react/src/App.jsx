import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
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
  const [focusedArticle, setFocusedArticle] = useState(null)
  const [textAlign, setTextAlign] = useState('justify') // 'justify', 'left', 'right', 'center'
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

  const handleArticleTextClick = (article) => {
    setFocusedArticle(article)
  }

  const closeFocusView = () => {
    setFocusedArticle(null)
  }

  const toggleTextAlign = () => {
    const alignments = ['justify', 'left', 'center', 'right']
    const currentIndex = alignments.indexOf(textAlign)
    const nextIndex = (currentIndex + 1) % alignments.length
    setTextAlign(alignments[nextIndex])
  }

  const getTextAlignIcon = () => {
    switch(textAlign) {
      case 'justify':
        return (
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        )
      case 'left':
        return (
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <line x1="3" y1="6" x2="15" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="15" y2="18"/>
          </svg>
        )
      case 'center':
        return (
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <line x1="6" y1="6" x2="18" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="6" y1="18" x2="18" y2="18"/>
          </svg>
        )
      case 'right':
        return (
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <line x1="9" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="9" y1="18" x2="21" y2="18"/>
          </svg>
        )
      default:
        return null
    }
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

  // Focus View für Artikel
  if (focusedArticle) {
    return (
      <div className="focus-view" onClick={closeFocusView}>
        <div className="focus-content" onClick={(e) => e.stopPropagation()}>
          <div className="focus-header">
            <button 
              className="focus-align-btn" 
              onClick={toggleTextAlign}
              title={`Text alignment: ${textAlign}`}
            >
              {getTextAlignIcon()}
            </button>
            <button className="focus-close" onClick={closeFocusView}>
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <h1>{focusedArticle.title}</h1>
          <div className={`focus-text align-${textAlign}`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {focusedArticle.description}
            </ReactMarkdown>
          </div>
        </div>
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
          
          <ArticleList 
            articles={displayedArticles}
            onEdit={editBtn}
            onDelete={deleteBtn}
            onArticleClick={handleArticleTextClick}
            showSearchInfo={isSearchMode}
            startCreateArticle={startCreateArticle}
          />
        </div>
      </div>
    </div>
  )
}

export default App
