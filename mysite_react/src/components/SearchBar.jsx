import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch, onClear, isSearching }) {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
        }
    };

    const handleClear = () => {
        setQuery('');
        onClear();
    };

    const handleInputChange = (e) => {
        setQuery(e.target.value);
        // Clear search if input is empty
        if (e.target.value.trim() === '') {
            onClear();
        }
    };

    const SearchIcon = () => (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
    );

    const ClearIcon = () => (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
    );

    return (
        <div className="search-bar-container">
            <form onSubmit={handleSubmit} className="search-form">
                <div className="search-input-wrapper">
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={query}
                        onChange={handleInputChange}
                        className="search-input"
                        disabled={isSearching}
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="clear-button"
                            title="Clear search"
                        >
                            <ClearIcon />
                        </button>
                    )}
                </div>
                <button 
                    type="submit" 
                    className="search-button"
                    disabled={!query.trim() || isSearching}
                    title={isSearching ? 'Searching...' : 'Search'}
                >
                    <SearchIcon />
                </button>
            </form>
        </div>
    );
}

export default SearchBar; 