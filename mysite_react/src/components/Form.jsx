import React, {useState, useEffect} from 'react'
import { APIService } from '../APIService'

function Form(props) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    useEffect(() => {
         setTitle(props.article.title)
         setDescription(props.article.description)
    }, [props.article])

    const updateArticle = () => {
        APIService.UpdateArticle(props.article.id, {title, description})
        .then(resp => props.updatedInformation(resp))


    }

  return (
    <div>
      {props.article ? (
        <div className = "mb-3">
            <br></br>
            <br></br>
            <p>Ut labore et dolore odio qui title et blandit ici.</p>
            <input type = "text" className = "form-control" id = "title" placeholder = "Odio qui title." value = {title} onChange = {e => setTitle(e.target.value)}></input>
            <br></br>
            <textarea type = "text" className = "form-control" id = "description" placeholder = "Odio qui blandit." rows = "5" value = {description} onChange = {e => setDescription(e.target.value)}></textarea>
            <br></br>
            {
                <button onClick = {updateArticle} className = "btn btn-primary">Update Article</button>
            }
        </div>

      ) : null}
    </div>
  )
}

export default Form
