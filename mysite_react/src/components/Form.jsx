import React, {useState, useEffect} from 'react'
import { APIService } from '../APIService'
import './Form.css'

function Form(props) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    useEffect(() => {
        if (props.article) {
            setTitle(props.article.title)
            setDescription(props.article.description)
        } else {
            // Reset form for new article
            setTitle('')
            setDescription('')
        }
    }, [props.article])

    const updateArticle = () => {
        APIService.UpdateArticle(props.article.id, {title, description})
        .then(resp => props.updatedInformation(resp))
    }

    const createArticle = () => {
        APIService.createArticle({title, description})
        .then(resp => {
            props.articleCreated(resp)
            // Reset form after successful creation
            setTitle('')
            setDescription('')
        })
        .catch(error => {
            console.error('Error creating article:', error)
        })
    }

    const handleSubmit = () => {
        if (props.article) {
            updateArticle()
        } else {
            createArticle()
        }
    }

    // SVG Icons
    const CheckIcon = () => (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
    );

    const CancelIcon = () => (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
    );

    return (
        <div className="form-container">
            <h3>
                {props.article ? 'Edit your article:' : 'Create a new article:'}
            </h3>
            <input 
                type="text" 
                className="form-control" 
                id="title" 
                placeholder="Enter article title" 
                value={title} 
                onChange={e => setTitle(e.target.value)}
            />
            <textarea 
                className="form-control textarea" 
                id="description" 
                placeholder="Enter article description" 
                rows="5" 
                value={description} 
                onChange={e => setDescription(e.target.value)}
            />
            <div className="form-actions">
                <button 
                    onClick={handleSubmit} 
                    className="form-icon-button btn-primary-icon"
                    disabled={!title.trim() || !description.trim()}
                    title={props.article ? 'Update Article' : 'Create Article'}
                >
                    <CheckIcon />
                </button>
                <button 
                    onClick={props.cancelEdit} 
                    className="form-icon-button btn-secondary-icon"
                    title="Cancel"
                >
                    <CancelIcon />
                </button>
            </div>
        </div>
    )
}

export default Form
