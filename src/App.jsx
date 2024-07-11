import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [joke, setJoke] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJoke = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://v2.jokeapi.dev/joke/Any');
      if (response.data.type === 'single') {
        setJoke(response.data.joke);
      } else {
        setJoke(`${response.data.setup} ... ${response.data.delivery}`);
      }
      setLoading(false);
    } catch (error) {
      setError('Error fetching the joke. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJoke();
  }, []);

  return (
    <div className="App">
        <h1>Have a Joke!</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <p>{joke}</p>
        )}
        <button onClick={fetchJoke}>Get Another Joke</button>
    </div>
  );
}

export default App;