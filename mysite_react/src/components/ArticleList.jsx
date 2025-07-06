import React from 'react'
import { APIService } from '../APIService'
import './ArticleList.css'

function ArticleList(props) {

    const editBtn = (article) => {
        props.editBtn(article)
    }
    const deleteBtn = (article) => {
      APIService.DeleteArticle(article.id)
      .then(() => props.deleteBtn(article))
      .catch(error => console.log(error))
     
    }

    // SVG Icons
    const EditIcon = () => (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
        </svg>
    )

    const DeleteIcon = () => (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
        </svg>
    )

    return (
        <div className="article-list-container">
            {props.articles && props.articles.map((article) => {
                return (
                    <div key={article.id}>
                        <h2>{article.title}</h2>
                        <p>{article.description}</p>
                        <div className="article-actions">
                            <button 
                                className="icon-button edit-button" 
                                onClick={() => editBtn(article)}
                                title="Edit Article"
                            >
                                <EditIcon />
                            </button>
                            <button 
                                onClick={() => deleteBtn(article)} 
                                className="icon-button delete-button"
                                title="Delete Article"
                            >
                                <DeleteIcon />
                            </button>
                        </div>
                        <hr></hr>
                    </div>
                )
            })}
        </div>
    )
}

export default ArticleList
 