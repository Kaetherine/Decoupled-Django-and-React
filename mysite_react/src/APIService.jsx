import React, { Component } from 'react'

export class APIService {
    
    static baseURL = 'http://localhost:8000/api'

    // Generic request method for better error handling
    static async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            credentials: 'include', // Include cookies for session auth
            ...options,
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API request failed: ${endpoint}`, error);
            throw error;
        }
    }

    // Search articles
    static async searchArticles(query) {
        if (!query || query.trim() === '') {
            return { results: [], count: 0, message: 'No search query provided' };
        }
        
        const encodedQuery = encodeURIComponent(query.trim());
        return fetch(`http://localhost:8000/api/search/?q=${encodedQuery}`, {
            'method': 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(resp => resp.json())
    }

    // User-related methods
    static async getCurrentUser() {
        return await this.request('/user/me/');
    }

    static async healthCheck() {
        return await this.request('/health/');
    }

    // Article methods - using original working approach
    static async getArticles() {
        return fetch('http://localhost:8000/api/articles/', {
            'method': 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(resp => resp.json())
    }

    static async getArticle(id) {
        return fetch(`http://localhost:8000/api/articles/${id}/`, {
            'method': 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(resp => resp.json())
    }

    static async createArticle(articleData) {
        return fetch('http://localhost:8000/api/articles/', {
            'method': 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(articleData),
        })
        .then(resp => resp.json())
    }

    static UpdateArticle(article_id, body) {
        return fetch(`http://localhost:8000/api/articles/${article_id}/`, {
            'method' : 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization' : 'Token 4ff70db43d26a1eb5d05afd6d55045184a0e15e7'
            }, 
            body: JSON.stringify(body)
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

    // Improved delete method with async/await
    static async deleteArticle(id) {
        return fetch(`http://localhost:8000/api/articles/${id}/`, {
            'method': 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }

    // User management methods
    static async getUsers() {
        return await this.request('/users/');
    }

    static async createUser(userData) {
        return await this.request('/users/', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }
}
