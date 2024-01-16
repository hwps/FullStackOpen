/*
Node.js + React app that displays a search box and lets the user search for countries by name and select them.
Once a country is selected, basic info and if available, weather data for its capital will be shown.
*/

// To define this, create a file called .env containing VITE_OPENWEATHER_API_KEY=<key> in project root (same directory as index.html)
const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/'
const WEATHER_ICON_URL = 'http://openweathermap.org/img/wn/'

const RESTCOUNTRIES_API_URL = 'https://studies.cs.helsinki.fi/restcountries/api/all'



import {useState, useEffect} from 'react'
import axios from 'axios'

const FilterBox = ({value, onChange}) => <div>Find countries: <input value={value} onChange={onChange}/></div>

const CountryList = (props) => props.countries.map(country => <div key={country.name.common}>{country.name.common}<button onClick={() => props.filterFunc(country)}>Show</button></div>)

const CountryView = ({country}) => {
  
  const [weather, setWeather] = useState({})
  const weatherURL = `${WEATHER_API_URL}find?q=${country.capital}&appid=${WEATHER_API_KEY}&units=metric`

  // get weather data
  useEffect(() => {
    axios.get(weatherURL)
    .then(response => {

      console.log(response.data)

      const weatherData = {
        temp: response.data.list[0].main.temp,
        wind: response.data.list[0].wind.speed,
        icon: `${WEATHER_ICON_URL}${response.data.list[0].weather[0].icon}@2x.png`,
        icontext: response.data.list[0].weather[0].description
      }
      setWeather(weatherData)
    })
    .catch(() => console.log("Error: could not fetch weather data, please check API key and/or URL"))
  }, [weatherURL])

  
  // display country info (and weather data if available)
  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>Capital: {country.capital}</div>
      <div>Area: {country.area} km^2</div>
      <h3>Languages</h3>
      <ul>
        {Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
      </ul>
      <div><img src={country.flags.svg} alt="flag" width="200px" style={{border: '1px solid #333'}}></img></div>
      

      {Object.keys(weather).length > 0 ? 
        <div>
        <h3>Current weather in {country.capital}</h3>
        <div>Temperature: {weather.temp} C</div>
        <img src={weather.icon} alt={weather.icontext} />
        <div>Wind: {weather.wind} m/s</div>
        </div> 
      : null}
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [countryList, setCountryList] = useState([])

  useEffect(() => {
    axios.get(RESTCOUNTRIES_API_URL)
    .then(response => {
      setCountries(response.data)
      })
    .catch(() => console.log("country error"))
  }, [])

  const filterCountries = (param) =>
  {
    setFilter(param)
    const countriesToShow = countries.filter(country => country.name.common.toLowerCase().includes(param.toLowerCase()))
    setCountryList(countriesToShow)
  }

  const showCountry = (country) => {
    setFilter(country.name.common)
    const countryToShow = [country]
    setCountryList(countryToShow)
  }

  return (
    <div>
      <FilterBox value={filter} onChange={(event) => filterCountries(event.target.value)} />
      {countryList.length === 1 ? <CountryView country={countryList[0]} /> : null}
      {countryList.length > 1 && countryList.length <= 10 ? <CountryList countries={countryList} filterFunc={showCountry} /> : null}
      {filter.length > 0 && countryList.length > 10 ? "Too many matches, specify another filter" : null}
    </div>
  );
}

export default App;
