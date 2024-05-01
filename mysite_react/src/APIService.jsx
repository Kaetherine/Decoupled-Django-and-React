import React, { Component } from 'react'

export class APIService {
    static UpdateArticle(article_id, body) {
        return fetch(`http://localhost:8000/api/articles/${article_id}/`, {

            'method' : 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization' : 'Token 4ff70db43d26a1eb5d05afd6d55045184a0e15e7'
      }, body:JSON.stringify(body)
    })
    .then(resp => resp.json())
}

    static DeleteArticle(article_id, token) {

    return fetch(`http://localhost:8000/api/articles/${article_id}/`, {
      'method':'DELETE',
      headers: {
          'Content-Type':'application/json',
          // 'Authorization':`Token ${token}` 
        }

   })

  }

}
