import React, { Component } from 'react'

export class APIService {
    static UpdateArticle(article_id, body) {
        return fetch(`http://127.0.0.1:8000/api/articles/${article_id}/`, {

            'method' : 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization' : 'Token 4ff70db43d26a1eb5d05afd6d55045184a0e15e7'
      }, body:JSON.stringify(body)
    })
    .then(resp => resp.json())
}

    static InsertArticle(body) {

    return fetch('http://127.0.0.1:8000/api/articles/', {
      'method':'POST',
      headers: {
          'Content-Type':'application/json',
        //   'Authorization':`Token ${token}`
        }, 
        body:JSON.stringify(body)

    }).then(resp => resp.json())

  }

}
