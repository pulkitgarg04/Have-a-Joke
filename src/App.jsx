import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [joke, setJoke] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJoke = async () => {
    setLoading(true);

    const categories = [];
    if (document.getElementById('any').checked) categories.push('Any');
    if (document.getElementById('programming').checked) categories.push('Programming');
    if (document.getElementById('misc').checked) categories.push('Misc');
    if (document.getElementById('dark').checked) categories.push('Dark');
    if (document.getElementById('pun').checked) categories.push('Pun');
    if (document.getElementById('spooky').checked) categories.push('Spooky');
    if (document.getElementById('christman').checked) categories.push('Christmas');

    const blacklistedFlags = [];
    if (document.getElementById('nsfw').checked) blacklistedFlags.push('nsfw');
    if (document.getElementById('religious').checked) blacklistedFlags.push('religious');
    if (document.getElementById('political').checked) blacklistedFlags.push('political');
    if (document.getElementById('racist').checked) blacklistedFlags.push('racist');
    if (document.getElementById('sexist').checked) blacklistedFlags.push('sexist');
    if (document.getElementById('explicit').checked) blacklistedFlags.push('explicit');

    const categoriesParam = categories.length > 0 ? categories.join(',') : 'Any';
    const flagsParam = blacklistedFlags.length > 0 ? `&blacklistFlags=${blacklistedFlags.join(',')}` : '';

    const url = `https://v2.jokeapi.dev/joke/${categoriesParam}?en${flagsParam}`;

    try {
      const response = await axios.get(url);
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
      <h2>Have a Joke!</h2>
      <div>
        <label htmlFor="category">Select from Category: </label>
        <input type="checkbox" name="any" id="any" />
        <label htmlFor="any">Any</label>
        <input type="checkbox" name="programming" id="programming" />
        <label htmlFor="programming">Programming</label>
        <input type="checkbox" name="misc" id="misc" />
        <label htmlFor="misc">Misc</label>
        <input type="checkbox" name="dark" id="dark" />
        <label htmlFor="dark">Dark</label>
        <input type="checkbox" name="pun" id="pun" />
        <label htmlFor="pun">Pun</label>
        <input type="checkbox" name="spooky" id="spooky" />
        <label htmlFor="spooky">Spooky</label>
        <input type="checkbox" name="christman" id="christman" />
        <label htmlFor="christman">Christmas</label>
      </div>
      <div>
        <label htmlFor="flag">Select flag to blacklist: </label>
        <input type="checkbox" id="nsfw" /><label htmlFor="nsfw">Nsfw</label>
        <input type="checkbox" id="religious" /><label htmlFor="religious">Religious</label>
        <input type="checkbox" id="political" /><label htmlFor="political">Political</label>
        <input type="checkbox" id="racist" /><label htmlFor="racist">Racist</label>
        <input type="checkbox" id="sexist" /><label htmlFor="sexist">Sexist</label>
        <input type="checkbox" id="explicit" /><label htmlFor="explicit">Explicit</label>
      </div>
      <hr />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <p>{joke}</p>
      )}
      <hr />
      <button onClick={fetchJoke}>Get Another Joke</button>
    </div>
  );
}

export default App;