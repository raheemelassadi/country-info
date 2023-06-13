import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css'

const fetchWeatherData = (country, setWeatherData) => {
  axios
    .get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=f14192cf9da2cd1cb88ee683e524190f`)
    .then(response => {
      const weatherData = response.data;
      const formattedWeatherData = {
        temperature: weatherData.main.temp,
        weatherIcon: weatherData.weather[0].icon,
        windSpeed: weatherData.wind.speed,
      };
      setWeatherData(formattedWeatherData);
    })
    .catch(error => {
      console.log(error);
    });
};

const App = () => {
  const [userInput, setUserInput] = useState('');
  const [countries, setCountries] = useState([]);
  const [expandedCountries, setExpandedCountries] = useState([]);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    if (userInput) {
      axios
        .get(`https://restcountries.com/v3.1/name/${userInput}`)
        .then(response => {
          setCountries(response.data);
          setExpandedCountries([]);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      setCountries([]);
      setExpandedCountries([]);
    }
  }, [userInput]);

  const handleChange = event => {
    setUserInput(event.target.value);
  };

  const handleExpand = country => {
    if (expandedCountries.includes(country)) {
      setExpandedCountries(expandedCountries.filter(c => c !== country));
    } else {
      setExpandedCountries([...expandedCountries, country]);
      if (!country.weather) {
        fetchWeatherData(country, weatherData => {
          country.weather = weatherData;
          setCountries([...countries]);
        });
      }
    }
  };

  let content;
  if (countries.length > 10) {
    content = <p>Too many matches, specify another filter</p>;
  } else if (countries.length === 1) {
    const country = countries[0];
    if (!country.weather) {
      fetchWeatherData(country, weatherData => {
        country.weather = weatherData;
        setCountries([...countries]);
      });
    }
    content = (
      <div className='container'>
        <h2 className='countryName'>{country.name.common}</h2>
        <p className='capital'>Capital: {country.capital}</p>
        <p className='area'>Area: {country.area} km²</p>
        <p className='languages'>Languages:</p>
        <ul>
          {Object.values(country.languages).map(language => (
            <li key={language}>{language}</li>
          ))}
        </ul>
        <img src={country.flags.png} alt="Flag" style={{ maxWidth: '200px' }} />

        {country.weather && (
          <div>
              <p>Temperature: {Math.round((country.weather.temperature - 273.15) * 9/5 + 32)}°F</p>
            <img
              src={`https://openweathermap.org/img/w/${country.weather.weatherIcon}.png`}
              alt="Weather Icon"
            />
            <p>Wind Speed: {country.weather.windSpeed} m/s</p>
          </div>
        )}
      </div>
    );
  } else if (countries.length > 0) {
    content = (
      <ul>
        {countries.map(country => (
          <li key={country.name.common}>
            {country.name.common}
            <button onClick={() => handleExpand(country)}>
              {expandedCountries.includes(country) ? 'Collapse' : 'Expand'}
            </button>
            {expandedCountries.includes(country) && (
              <div>
                <p>Capital: {country.capital}</p>
                <p>Area: {country.area} km²</p>
                <p>Languages:</p>
                <ul>
                  {Object.values(country.languages).map(language => (
                    <li key={language}>{language}</li>
                  ))}
                </ul>
                <img src={country.flags.png} alt="Flag" style={{ maxWidth: '200px' }} />

                {country.weather && (
                  <div>
                      <p>Temperature: {Math.round((country.weather.temperature - 273.15) * 9/5 + 32)}°F</p>
                    <img
                      src={`https://openweathermap.org/img/w/${country.weather.weatherIcon}.png`}
                      alt="Weather Icon"
                    />
                    <p>Wind Speed: {country.weather.windSpeed} m/s</p>
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <>
      <div className='inputContainer'>
      <input onChange={handleChange} placeholder='Enter Country Name'/>
      </div>
      {content}
    </>
  );
};

export default App;
