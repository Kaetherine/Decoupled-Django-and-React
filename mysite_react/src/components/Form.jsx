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

    return (
        <div className="form-container">
            <div className="mb-3">
                <h3 className="form-label">
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
                <br></br>
                <textarea 
                    className="form-control" 
                    id="description" 
                    placeholder="Enter article description" 
                    rows="5" 
                    value={description} 
                    onChange={e => setDescription(e.target.value)}
                />
                <br></br>
                <div className="form-actions">
                    <button 
                        onClick={handleSubmit} 
                        className="btn btn-primary"
                        disabled={!title.trim() || !description.trim()}
                    >
                        {props.article ? 'Update Article' : 'Create Article'}
                    </button>
                    <button 
                        onClick={props.cancelEdit} 
                        className="btn btn-secondary"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Form
