import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { APIService } from '../APIService'
import './ArticleList.css'

function ArticleList({ articles, onEdit, onDelete, onArticleClick, showSearchInfo, startCreateArticle }) {

    const editBtn = (article) => {
        onEdit(article)
    }

    const deleteBtn = (article) => {
      APIService.DeleteArticle(article.id)
      .then(() => onDelete(article))
      .catch(error => console.log(error))
    }

    const handleArticleTextClick = (article) => {
        onArticleClick(article)
    }

    return (
        <>
            {articles && articles.length > 0 ? (
                articles.map((article) => {
                    return (
                        <div key={article.id} className="article-item">
                            <h2>{article.title}</h2>
                            <div 
                                className="article-description" 
                                onClick={() => handleArticleTextClick(article)}
                            >
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {article.description}
                                </ReactMarkdown>
                            </div>
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
                    <p>{showSearchInfo ? 'No articles found matching your search.' : 'No articles yet. Create your first article!'}</p>
                    {!showSearchInfo && (
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
        </>
    )
}

export default ArticleList
 