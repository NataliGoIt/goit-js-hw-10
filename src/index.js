import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './services/fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchboxEl = document.querySelector('[id="search-box"]');
const countryInfoEl = document.querySelector('.country-info');
const countryListEl = document.querySelector('.country-list');

searchboxEl.addEventListener('input', debounce(showCountry, DEBOUNCE_DELAY));

function showCountry() {
  fetchCountries(searchboxEl.value.trim())
    .then(country => {
      countryInfoEl.innerHTML = '';
      countryListEl.innerHTML = '';

      if (country.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
      } else if (country.length >= 2 && country.length <= 10) {
        countryInfo(country);
      } else if (country.length === 1) {
        onCountryInfo(country);
      }
    })
    .catch(showError);
}

function countryInfo(country) {
  const markup = country
    .map(({ flags, name }) => {
      return `<li class="country-list"> 
      <img class="flag-list" src ="${flags.svg}" alt="Flag of ${name.official}"  width="50"/>
      <span class = "name-list">${name.official}</span></li>`;
    })
    .join('');
  countryListEl.innerHTML = markup;
}

function onCountryInfo([{ name, flags, capital, population, languages }]) {
  countryInfoEl.innerHTML = `<img src ="${flags.svg}" class="flags"  alt="Flag of ${
    name.official
  }" width="50"/>
         <span class="title">${name.official}</span>
         <ul>
       <li> Capital: <span class = "country__description">${capital}</span></li>
       <li> Population: <span class = "country__description">${population}</span></li>
       <li> Languages: <span class = "country__description">${Object.values(languages).join(', ')}
        </span></li>`;
}

function showError(error) {
  Notify.failure('Oops, there is no country with that name');
  countryInfoEl.innerHTML = '';
  countryListEl.innerHTML = '';
  console.log(error);
}
