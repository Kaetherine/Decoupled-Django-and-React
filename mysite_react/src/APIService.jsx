import React, { Component } from 'react'

export class APIService {

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
