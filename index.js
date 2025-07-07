const searchInput = document.querySelector("#search-input");
const searchBtn = document.querySelector("#search-btn");
const weatherContent = document.querySelector("#weather-content");
const errorMessage = document.querySelector("#error-message");

const API = `fc6494b0574e44f398b132957250707`;
const base = `https://api.weatherapi.com/v1/`;
const searchURI = `${base}/search.json?key=${API}&q=`;
const forcastURI = `${base}/forecast.json?key=${API}&q=`;

const locationAPI = `https://ipinfo.io/?token=7a2901dc97cb3b`;

searchInput.addEventListener("input", () => {
  displayWeather(searchInput.value);
});

searchBtn.addEventListener("click", () => {
  displayWeather(searchInput.value);
});

// // default initialization
// (async function () {
//   const userLocation = await getUserLocation();
//   if (userLocation !== null && userLocation !== undefined) {
//     displayWeather(`${userLocation.latitude},${userLocation.longitude}`);
//   } else {
//     displayWeather("Cairo");
//   }
// })();

async function displayWeather(text) {
  try {
    // stop 400 (bad request) error
    if (text.trim() === "") return;

    const weatherData = await getWeatherData(text, 2);
    const todayWeatherString = getTodayWeather(weatherData);
    if (todayWeatherString !== null) {
      weatherContent.innerHTML = todayWeatherString;
      weatherContent.innerHTML += getOtherWeather(weatherData, 2);
    }

    errorMessage.classList.replace("d-block", "d-none");
  } catch (error) {
    console.error(error);
    errorMessage.classList.replace("d-none", "d-block");
    weatherContent.textContent = "";
  }
}

async function getWeatherData(text, numberOfOtherDays = 0) {
  const weatherData = [];
  let promiseSearch = await fetch(`${searchURI}${text}`);
  let responseSearch = await promiseSearch.json();

  if (responseSearch.length > 0) {
    const id = responseSearch[0].id;

    let promiseToday = await fetch(`${forcastURI}id:${id}`);
    let responseToday = await promiseToday.json();

    const dates = getDates(numberOfOtherDays);

    let tempObj = {
      location_name: responseToday.location.name,
      temp: responseToday.current.temp_c,
      rain_chance:
        responseToday.forecast.forecastday[0].day.daily_chance_of_rain,
      state: responseToday.current.condition.text,
      state_icon: `https:${responseToday.current.condition.icon}`,
      wind_speed: responseToday.current.wind_kph,
      wind_dir: responseToday.current.wind_dir,
      date_d_m: dates[0].date_d_m,
      weekday: dates[0].weekday,
    };

    // clear array first
    weatherData.push(tempObj);

    for (let i = 1; i <= numberOfOtherDays; i++) {
      promise_i = await fetch(`${forcastURI}id:${id}&dt=${dates[i].date_api}`);
      response_i = await promise_i.json();

      tempObj = {
        mintemp: response_i.forecast.forecastday[0].day.mintemp_c,
        maxtemp: response_i.forecast.forecastday[0].day.maxtemp_c,
        state: response_i.forecast.forecastday[0].day.condition.text,
        state_icon: `https:${response_i.forecast.forecastday[0].day.condition.icon}`,
        date_d_m: dates[i].date_d_m,
        weekday: dates[i].weekday,
      };

      weatherData.push(tempObj);
    }
    return weatherData;
  } else {
    return null;
  }
}

function getDates(numberOfDays = 2) {
  const result = [];
  const date = new Date();
  result.push({
    date_api: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
    date_d_m: `${date.getDate()} ${date.toLocaleString("default", { month: "long" })}`,
    weekday: date.toLocaleString("default", { weekday: "long" }),
  });
  fullMonthName = date.toLocaleString("default", { month: "long" });
  fullDayName = date.toLocaleString("default", { weekday: "long" });

  for (let i = 1; i <= numberOfDays; i++) {
    date.setDate(date.getDate() + 1);
    result.push({
      date_api: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      date_d_m: `${date.getDate()} ${date.toLocaleString("default", { month: "long" })}`,
      weekday: date.toLocaleString("default", { weekday: "long" }),
    });
  }

  return result;
}

function getTodayWeather(weatherData) {
  if (
    weatherData === null ||
    weatherData === undefined ||
    weatherData.length === 0
  )
    return null;

  return `
  <div class="col-lg-4">
    <div class="day day-color-1">
      <div id="day-0-header" class="d-flex justify-content-between day-header">
        <div>${weatherData[0].weekday}</div>
        <div>${weatherData[0].date_d_m}</div>
      </div>
      <div class="day-body d-flex flex-column">
        <div class="location">${weatherData[0].location_name}</div>
        <div class="row">
          <div class="col-12 col-sm-6 col-lg-12">
            <div class="temp text-white">${weatherData[0].temp}°C</div>
          </div>
          <div class="col-12 col-sm-6 col-lg-12">
            <img src="${weatherData[0].state_icon}" alt="" />
          </div>
        </div>
        <div class="state">${weatherData[0].state}</div>
        <div class="d-flex flex-wrap gap-4 day-stats">
          <div>
            <img
              src="./resources/images/icon-umberella.png"
              class="me-1"
              alt=""
            />
            <span>${weatherData[0].rain_chance}</span>
          </div>
          <div>
            <img src="./resources/images/icon-wind.png" class="me-1" alt="" />
            <span>${weatherData[0].wind_speed} Km/h</span>
          </div>
          <div>
            <img
              src="./resources/images/icon-compass.png"
              class="me-1"
              alt=""
            />
            <span>${weatherData[0].wind_dir}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
   `;
}

function getOtherWeather(weatherData, numberOfOtherDays = 2) {
  let otherWeatherString = ``;
  for (let i = 1; i <= numberOfOtherDays; i++) {
    const color_class = i % 2 === 0 ? "day-color-1" : "day-color-2";

    otherWeatherString += `
    <div class="col-lg-4">
      <div class="day ${color_class} h-100">
        <div class="d-flex justify-content-center day-header">
          <div>${weatherData[i].weekday}</div>
        </div>
        <!-- why did this need align-items-center? -->
        <div
          class="day-body-other d-flex flex-column justify-content-center align-items-center"
        >
          <img src="${weatherData[i].state_icon}" alt="" />
          <div class="temp-high text-white">${weatherData[i].maxtemp}°C</div>
          <div class="temp-low">${weatherData[i].mintemp}°C</div>
          <div class="state">${weatherData[i].state}</div>
        </div>
      </div>
    </div>
    `;
  }
  return otherWeatherString;
}

// async function getUserLocation() {
//   let userLocation = null;
//   if ("geolocation" in navigator) {
//     console.log("geolocation is available");
//     navigator.geolocation.getCurrentPosition(success, showError, {
//       maximumAge: 300000,
//       timeout: 10000,
//       enableHighAccuracy: true,
//     });
//
//     function success(position) {
//       console.log("got the location successfully");
//       userLocation = position.coords;
//     }
//
//     function showError(error) {
//       console.error(error);
//     }
//   } else {
//     console.error("geoloacation not available");
//   }
//   return userLocation;
// }
//
// console.log("hello world");
