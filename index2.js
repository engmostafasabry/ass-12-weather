const searchInput = document.querySelector("#search-input");
const searchBtn = document.querySelector("#search-btn");

const API = `fc6494b0574e44f398b132957250707`;
const base = `https://api.weatherapi.com/v1/`;

// const API = `https://api.weatherapi.com/v1/search.json?key=fc6494b0574e44f398b132957250707&q=`;

const searchURI = `${base}/search.json?key=${API}&q=`;
const forcastURI = `${base}/forecast.json?key=${API}&q=`;

async function testSomething() {
  const searchWord = `Cairo`;
  let promise = await fetch(`${searchURI}${searchWord}`);
  let response = await promise.json();
  console.log(response);

  if (response.length > 0) {
    console.log("we got the location successfully");
    const id = response[0].id;

    // current date
    let promiseToday = await fetch(`${forcastURI}id:${id}`);
    let responseToday = await promiseToday.json();

    console.log(responseToday);

    console.log(`city name: ${responseToday.location.name}`);
    console.log(`current temperature: ${responseToday.current.temp_c}`);
    console.log(
      `chance of rain: ${responseToday.forecast.forecastday[0].day.daily_chance_of_rain}`,
    );
    console.log(`current state: ${responseToday.current.condition.text}`);
    console.log(`current state png: ${responseToday.current.condition.icon}`);
    console.log(`wind speed: ${responseToday.current.wind_kph}`);
    console.log(`wind direction: ${responseToday.current.wind_dir}`);

    // get other day
    const today = new Date();
    const tomorrowString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate() + 1}`;
    const dayAfterString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate() + 2}`;

    let promiseTomorrow = await fetch(
      `${forcastURI}id:${id}&dt=${tomorrowString}`,
    );
    let responseTomorrow = await promiseTomorrow.json();
    console.log(responseTomorrow);
  }
}

testSomething();
