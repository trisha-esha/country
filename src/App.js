import { useEffect, useRef, useReducer, useMemo } from 'react';
import './App.css';


const initialState = {
  items: [],
  searchTerm: '',
  countryDetails: null,
  error: ''
};


function reducer(state, action) {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.payload };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_COUNTRY_DETAILS':
      return { ...state, countryDetails: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

function App() {
  const api_url = 'https://restcountries.com/v3.1/all';
  const [state, dispatch] = useReducer(reducer, initialState); 
  const inputRef = useRef();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(api_url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const listItems = await response.json();
        dispatch({ type: 'SET_ITEMS', payload: listItems }); 
      } catch (err) {
        console.log(err.stack);
      }
    };

    fetchItems();
  }, []); 

  const handleSearch = async () => {
    if (!state.searchTerm) {
      dispatch({ type: 'SET_COUNTRY_DETAILS', payload: null }); 
      return; 
    }

    const foundCountry = state.items.find(country =>
      country.name.common.toLowerCase() === state.searchTerm.toLowerCase()
    );

    if (foundCountry) {
      dispatch({ type: 'SET_COUNTRY_DETAILS', payload: foundCountry }); 
      dispatch({ type: 'SET_ERROR', payload: '' }); 
    } else {
      dispatch({ type: 'SET_COUNTRY_DETAILS', payload: null }); 
      dispatch({ type: 'SET_ERROR', payload: 'Country not found. Please try again.' }); 
    }

    inputRef.current.focus();
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch(); 
    }
  };

  const filteredCountries = useMemo(() => {
    return state.items.filter(country =>
      country.name.common.toLowerCase().includes(state.searchTerm.toLowerCase())
    );
  }, [state.items, state.searchTerm]); 

  return (
    <div className="App">
      <h1>Country Search</h1>
      <input
        type="text"
        placeholder="Enter country name"
        value={state.searchTerm}
        onChange={(e) => dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value })} 
        ref={inputRef}
      />
      <button onClick={handleSearch}>Search</button>

      {state.error && <p style={{ color: 'red' }}>{state.error}</p>} 

      {state.countryDetails && ( 
        <div>
          <h2>Country Details</h2>
          <p><strong>Name:</strong> {state.countryDetails.name.common}</p>
          <p><strong>Capital:</strong> {state.countryDetails.capital ? state.countryDetails.capital[0] : 'N/A'}</p>
          <p><strong>Population:</strong> {state.countryDetails.population}</p>
          <p><strong>Area:</strong> {state.countryDetails.area} km²</p>
          <p><strong>Region:</strong> {state.countryDetails.region}</p>
          <p><strong>Subregion:</strong> {state.countryDetails.subregion}</p>
          <img src={state.countryDetails.flags.png} alt={`Flag of ${state.countryDetails.name.common}`} width="150" />
        </div>
      )}

      {state.searchTerm && !state.countryDetails && (
        <div>
          <h2>Filtered Countries</h2>
          <ul>
            {filteredCountries.map(country => (
              <li key={country.cca3}>{country.name.common}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;