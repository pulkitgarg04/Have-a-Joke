import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [joke, setJoke] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [categories, setCategories] = useState({
    programming: false,
    misc: false,
    dark: false,
    pun: false,
    spooky: false,
    christmas: false,
  });

  const [language, setLanguage] = useState('en');
  const [blacklistedFlags, setBlacklistedFlags] = useState({
    nsfw: true,
    religious: true,
    political: true,
    racist: true,
    sexist: true,
    explicit: true,
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
    <div className="app">
      <div className="container">
        <h1>Have a Laugh!</h1>
        <div className="joke-box">
          {loading ? (
            <p className="loading">Loading</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <p className="joke">{joke}</p>
          )}
        </div>
        <div className="controls">
          <div className="section">
            <h2>Categories</h2>
            <div className="checkbox-group">
              {Object.keys(categories).map((category) => (
                <label key={category}>
                  <input
                    type="checkbox"
                    name={category}
                    checked={categories[category]}
                    onChange={handleCategoryChange}
                  />
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </label>
              ))}
            </div>
          </div>
          <div className="section">
            <h2>Language</h2>
            <select value={language} onChange={handleLanguageChange}>
              <option value="cs">Czech</option>
              <option value="de">German</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="pt">Portuguese</option>
            </select>
          </div>
          <div className="section">
            <h2>Blacklist Flags</h2>
            <div className="checkbox-group">
              {Object.keys(blacklistedFlags).map((flag) => (
                <label key={flag}>
                  <input
                    type="checkbox"
                    id={flag}
                    checked={blacklistedFlags[flag]}
                    onChange={handleBlacklistChange}
                  />
                  {flag.charAt(0).toUpperCase() + flag.slice(1)}
                </label>
              ))}
            </div>
          </div>
        </div>
        <button className="fetch-btn" onClick={fetchJoke}>
          Get Another Joke
        </button>
      </div>
    </div>
  );
}

export default App;