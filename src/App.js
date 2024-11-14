import { useEffect, useRef, useState, useMemo } from 'react';
import './App.css';

function App() {
  const api_url = 'https://restcountries.com/v3.1/all';
  const [items, setItems] = useState([]); // This will hold the list of countries
  const [searchTerm, setSearchTerm] = useState(''); // This will hold the user's search input
  const [countryDetails, setCountryDetails] = useState(null); // This will hold the details of the searched country
  const [error, setError] = useState(''); // State to hold error messages
  const inputRef = useRef();

  // Fetch all countries on component mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(api_url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const listItems = await response.json();
        setItems(listItems); // Set the list of countries
      } catch (err) {
        console.log(err.stack);
      }
    };

    fetchItems();
  }, []); // This useEffect runs only once when the component mounts

  // Handle search when user clicks the search button or presses Enter
  const handleSearch = async () => {
    if (!searchTerm) {
      setCountryDetails(null); // Clear details if search term is empty
      return; // Do nothing if the search term is empty
    }

    try {
      const response = await fetch(`https://restcountries.com/v3.1/name/${searchTerm}`);
      if (!response.ok) {
        throw new Error('Country not found');
      }
      const data = await response.json();
      setCountryDetails(data[0]); // Set the details of the found country
      setError(''); // Clear any previous error
    } catch (err) {
      console.log(err.stack);
      setCountryDetails(null); // Clear previous country details if an error occurs
      setError('Country not found. Please try again.'); // Set error message
    }

    inputRef.current.focus();
  };

  // Handle key press for Enter key
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch(); // Trigger search on Enter key press
    }
  };

  // Use useMemo to filter countries
  const filteredCountries = useMemo(() => {
    return items.filter(country =>
      country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]); // Recalculate when items or searchTerm changes

  return (
    <div className="App">
      <h1>Country Search</h1>
      <input
        type="text"
        placeholder="Enter country name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update search term as user types
        onKeyPress={handleKeyPress} // Handle Enter key press
        ref={inputRef}
      />
      <button onClick={handleSearch}>Search</button>

      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message if exists */}

      {countryDetails && ( // Display country details if they exist
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

      {/* Render the filtered countries list only if no country details are displayed */}
      {!countryDetails && (
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