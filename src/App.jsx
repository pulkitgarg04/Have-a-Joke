import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [joke, setJoke] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [categories, setCategories] = useState({
    any: false,
    programming: false,
    misc: false,
    dark: false,
    pun: false,
    spooky: false,
    christmas: false,
  });

  const [language, setLanguage] = useState('en');
  const [blacklistedFlags, setBlacklistedFlags] = useState({
    nsfw: false,
    religious: false,
    political: false,
    racist: false,
    sexist: false,
    explicit: false,
  });

  const handleCategoryChange = (e) => {
    setCategories({
      ...categories,
      [e.target.name]: e.target.checked,
    });
  };

  const handleBlacklistChange = (e) => {
    setBlacklistedFlags({
      ...blacklistedFlags,
      [e.target.id]: e.target.checked,
    });
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const fetchJoke = async () => {
    setLoading(true);

    // Construct the API URL based on selected inputs
    const selectedCategories = Object.keys(categories).filter((key) => categories[key]);
    const selectedBlacklistedFlags = Object.keys(blacklistedFlags).filter((key) => blacklistedFlags[key]);

    const categoriesParam = selectedCategories.length > 0 ? selectedCategories.join(',') : 'Any';
    const flagsParam = selectedBlacklistedFlags.length > 0 ? `&blacklistFlags=${selectedBlacklistedFlags.join(',')}` : '';
    const langParam = `&lang=${language}`;

    const url = `https://v2.jokeapi.dev/joke/${categoriesParam}?${langParam}${flagsParam}`;

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
        <input type="checkbox" name="any" checked={categories.any} onChange={handleCategoryChange} />
        <label htmlFor="any">Any</label>
        <input type="checkbox" name="programming" checked={categories.programming} onChange={handleCategoryChange} />
        <label htmlFor="programming">Programming</label>
        <input type="checkbox" name="misc" checked={categories.misc} onChange={handleCategoryChange} />
        <label htmlFor="misc">Misc</label>
        <input type="checkbox" name="dark" checked={categories.dark} onChange={handleCategoryChange} />
        <label htmlFor="dark">Dark</label>
        <input type="checkbox" name="pun" checked={categories.pun} onChange={handleCategoryChange} />
        <label htmlFor="pun">Pun</label>
        <input type="checkbox" name="spooky" checked={categories.spooky} onChange={handleCategoryChange} />
        <label htmlFor="spooky">Spooky</label>
        <input type="checkbox" name="christmas" checked={categories.christmas} onChange={handleCategoryChange} />
        <label htmlFor="christmas">Christmas</label>
      </div>
      <div>
        <label htmlFor="language">Select Language: </label>
        <select name="language" id="language" value={language} onChange={handleLanguageChange}>
          <option value="cs">Czech</option>
          <option value="de">German</option>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="pt">Portuguese</option>
        </select>
      </div>
      <div>
        <label htmlFor="flag">Select flag to blacklist: </label>
        <input type="checkbox" id="nsfw" checked={blacklistedFlags.nsfw} onChange={handleBlacklistChange} /><label htmlFor="nsfw">Nsfw</label>
        <input type="checkbox" id="religious" checked={blacklistedFlags.religious} onChange={handleBlacklistChange} /><label htmlFor="religious">Religious</label>
        <input type="checkbox" id="political" checked={blacklistedFlags.political} onChange={handleBlacklistChange} /><label htmlFor="political">Political</label>
        <input type="checkbox" id="racist" checked={blacklistedFlags.racist} onChange={handleBlacklistChange} /><label htmlFor="racist">Racist</label>
        <input type="checkbox" id="sexist" checked={blacklistedFlags.sexist} onChange={handleBlacklistChange} /><label htmlFor="sexist">Sexist</label>
        <input type="checkbox" id="explicit" checked={blacklistedFlags.explicit} onChange={handleBlacklistChange} /><label htmlFor="explicit">Explicit</label>
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