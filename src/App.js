import { useEffect, useRef, useState, useMemo } from 'react';
import './App.css';

function App() {
  const api_url = 'https://restcountries.com/v3.1/all';
  const [items, setItems] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [countryDetails, setCountryDetails] = useState(null); 
  const [error, setError] = useState(''); 
  const inputRef = useRef();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(api_url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const listItems = await response.json();
        setItems(listItems);
      } catch (err) {
        console.log(err.stack);
      }
    };

    fetchItems();
  }, []); 

  const handleSearch = async () => {
    if (!searchTerm) {
      setCountryDetails(null); 
      return; 
    }

    
    const foundCountry = items.find(country =>
      country.name.common.toLowerCase() === searchTerm.toLowerCase()
    );

    if (foundCountry) {
      setCountryDetails(foundCountry); 
      setError(''); 
    } else {
      setCountryDetails(null); 
      setError('Country not found. Please try again.'); 
    }

    inputRef.current.focus();
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch(); 
    }
  };

  const filteredCountries = useMemo(() => {
    return items.filter(country =>
      country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]); 

  return (
    <div className="App">
      <h1>Country Search</h1>
      <input
        type="text"
        placeholder="Enter country name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} 
        onKeyPress={handleKeyPress}
         ref={inputRef}
      />
      <button onClick={handleSearch}>Search</button>

      {error && <p style={{ color: 'red' }}>{error}</p>} 

      {countryDetails && ( 
        <div>
          <h2>Country Details</h2>
          <p><strong>Name:</strong> {countryDetails.name.common}</p>
          <p><strong>Capital:</strong> {countryDetails.capital ? countryDetails.capital[0] : 'N/A'}</p>
          <p><strong>Population:</strong> {countryDetails.population}</p>
          <p><strong>Area:</strong> {countryDetails.area} km²</p>
          <p><strong>Region:</strong> {countryDetails.region}</p>
          <p><strong>Subregion:</strong> {countryDetails.subregion}</p>
          <img src={countryDetails.flags.png} alt={`Flag of ${countryDetails.name.common}`} width="150" />
        </div>
      )}

      
      {searchTerm && !countryDetails && (
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