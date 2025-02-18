import { useState, useCallback, useMemo } from 'react';
import { mockUsers } from '../lib/mockData';

// Throttle function
const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Cache for storing search results
const searchCache = new Map();

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Memoize the users data for better performance
  const users = useMemo(() => mockUsers, []);

  // Debounced search function
  const debouncedSearch = useCallback((function () {
    let timeoutId;
    
    return (query) => {
      clearTimeout(timeoutId);
      
      return new Promise((resolve) => {
        timeoutId = setTimeout(() => {
          resolve(performSearch(query));
        }, 300); // 300ms delay
      });
    };
  })(), []);

  // Check if query is an ID
  const isIdSearch = useCallback((query) => {
    return /^\d+$/.test(query.trim());
  }, []);

  // Direct ID lookup
  const searchById = useCallback((id) => {
    const numericId = parseInt(id, 10);
    // Check cache first
    const cacheKey = `id:${numericId}`;
    if (searchCache.has(cacheKey)) {
      return searchCache.get(cacheKey);
    }

    // Search in users data
    const user = users.find(u => u.id === numericId);
    const result = user ? [user] : [];
    
    // Cache the result
    searchCache.set(cacheKey, result);
    return result;
  }, [users]);

  // Name search with suggestions
  const searchByName = useCallback((query) => {
    if (query.length < 2) return [];

    // Check cache first
    const cacheKey = `name:${query.toLowerCase()}`;
    if (searchCache.has(cacheKey)) {
      return searchCache.get(cacheKey);
    }

    // Perform search on users data with start-of-word matching
    const results = users.filter(user => {
      const [firstName, ...lastNameParts] = user.name.split(' ');
      const lastName = lastNameParts.join(' ');
      const searchTerm = query.toLowerCase();
      
      return firstName.toLowerCase().startsWith(searchTerm) || 
             lastName.toLowerCase().startsWith(searchTerm);
    });

    // Cache the results
    if (searchCache.size > 100) {
      const firstKey = searchCache.keys().next().value;
      searchCache.delete(firstKey);
    }
    searchCache.set(cacheKey, results);

    return results;
  }, [users]);

  // Perform the actual search
  const performSearch = useCallback((query) => {
    if (isIdSearch(query)) {
      return searchById(query);
    } else {
      return searchByName(query);
    }
  }, [isIdSearch, searchById, searchByName]);

  // Throttled search update for ID searches
  const throttledIdSearch = useCallback(
    throttle(async (value) => {
      const results = await searchById(value);
      setSuggestions(results);
      if (results.length > 0) {
        setSelectedUser(results[0]);
      }
      setIsLoading(false);
    }, 300),
    [searchById]
  );

  // Handle input change with appropriate throttling/debouncing
  const handleSearchChange = useCallback(async (value) => {
    setSearchQuery(value);
    setIsLoading(true);
    
    // Clear previous state if empty
    if (!value.trim()) {
      setSuggestions([]);
      setSelectedUser(null);
      setIsLoading(false);
      return;
    }

    try {
      if (isIdSearch(value)) {
        // For IDs, perform immediate search
        const results = await searchById(value);
        setSuggestions([]); // Clear suggestions for ID search
        if (results.length > 0) {
          setSelectedUser(results[0]);
        } else {
          setSelectedUser(null);
        }
      } else if (value.length >= 2) {
        // For names, use debouncing and show suggestions
        const results = await debouncedSearch(value);
        setSuggestions(results);
        if (results.length === 0) {
          setSelectedUser(null);
        }
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSuggestions([]);
      setSelectedUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, isIdSearch, searchById]);

  // Select a user from suggestions
  const handleSelectUser = useCallback((user) => {
    setSelectedUser(user);
    setSuggestions([]);
    setSearchQuery(user.name);
  }, []);

  // Clear the search
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setSuggestions([]);
    setSelectedUser(null);
  }, []);

  return {
    searchQuery,
    suggestions,
    selectedUser,
    isLoading,
    handleSearchChange,
    handleSelectUser,
    handleClearSearch,
  };
};
