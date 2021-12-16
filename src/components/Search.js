import React, { useState, useEffect } from 'react';
import axios from "axios";

const Search = () => {
  const [term, setTerm] = useState('');
  const [results, setResults] = useState([]);

  // console.log(results);

  useEffect(() => {
    const search = async () => {
      const { data } = await axios.get('https://en.wikipedia.org/w/api.php',{
        params: {
          action: 'query',
          list: 'search',
          origin: '*',
          format: 'json',
          srsearch: term,
        },
      });

      // Updating or Result state with the data we got from our API request
      setResults(data.query.search);
    }
    
    if (term && !results.length) {

      search();

    } else {
      // Making a delay in sending search request until user stop changing input to prevent waste/overkill API requests
      const timeoutId = setTimeout(() => { 
      // if we called search without default value we need to make sure we have search term using the if statement so we dont get error from API for searching nothing
        if (term) {
          
          search();
        }
      }, 1000);

    // else we can call search with default value
    // search(); 

      return () =>{
        // cancel timeout every time user change input and start timeout all over again.
        clearTimeout(timeoutId);
      }
    }
    
  }, [term]);

  const renderedResults = results.map((result) => {
    return (
      <div key={result.pageid} className="item">
        <div className='right floated content'>
          <a className='ui button'
          href={`https://en.wikipedia.org?curid=${result.pageid}`}
          >Visit</a>
        </div>
        <div className="content">
          <div className="header">{result.title}</div>
        <span dangerouslySetInnerHTML={{ __html: result.snippet }}></span>
          {/* {result.snippet} */}
        </div>
      </div>
    );
  });

  return (
    <div>
      <div className="ui form">
        <div className="field">
          <label>Enter Search Term</label>
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="input"
          />
        </div>
      </div>
      <div className='ui celled list'>
        {renderedResults}
        </div>
    </div>
  );
};

export default Search;
