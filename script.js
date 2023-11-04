let now = new Date();

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let day = days[now.getDay()];
document.querySelector("#day").innerHTML = day;

let hours = now.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}
let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}

document.querySelector("#time").innerHTML = `${hours}:${minutes}`;

// Show temperature - Share button

function displayCity(event) {
  event.preventDefault();
  let input = document.querySelector("#cityName");
  let city = input.value;
  console.log(city);
  document.querySelector("#city").innerHTML = city;

  displayTemperature(city);
}

let apiKey = "b5c3a410d9e64da83f9eb805ceaac113";

function changeTemperature(event, celsius) {
  event.preventDefault();

  let temperatureElement = document.querySelector("#temperature");

  if (event.target.id === "celsius") {
    temperatureElement.innerHTML = celsius;
  } else if (event.target.id === "fahrenheit") {
    let fahrenheit = (celsius * 9) / 5 + 32;
    temperatureElement.innerHTML = `${Math.round(fahrenheit)}`;
  }
}

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", (event) =>
  changeTemperature(event, celsius)
);

let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", (event) =>
  changeTemperature(event, celsius)
);

let celsius;

function getForecast(coord, city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(function (response) {
    celsius = Math.round(response.data.main.temp);
    let temperature = document.querySelector("#temperature");
    let wind = document.querySelector("#wind");
    let humidity = document.querySelector("#humidity");
    let description = document.querySelector("#description");
    let icon = document.querySelector("#icon");
    temperature.innerHTML = Math.round(response.data.main.temp);
    wind.innerHTML = Math.round(response.data.wind.speed * 3.6);
    humidity.innerHTML = response.data.main.humidity;
    description.innerHTML =
      response.data.weather[0].description.charAt(0).toUpperCase() +
      response.data.weather[0].description.slice(1);
    icon.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
    icon.setAttribute("alt", response.data.weather[0].description);

    getForecast(response.data.coord, city);
  });
}

let form = document.querySelector("form");
form.addEventListener("submit", displayCity);

let searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", displayCity);

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  showTemperatureOfMyCity(latitude, longitude);
}

function showTemperatureOfMyCity(latitude, longitude) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(function (response) {
    let myCity = document.querySelector("#city");
    myCity.innerHTML = response.data.name;
    celsius = Math.round(response.data.main.temp);
    let temperature = document.querySelector("#temperature");
    let wind = document.querySelector("#wind");
    let humidity = document.querySelector("#humidity");
    let description = document.querySelector("#description");
    temperature.innerHTML = Math.round(response.data.main.temp);
    wind.innerHTML = Math.round(response.data.wind.speed * 3.6);
    humidity.innerHTML = response.data.main.humidity;
    description.innerHTML =
      response.data.weather[0].description.charAt(0).toUpperCase() +
      response.data.weather[0].description.slice(1);
    icon.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
    icon.setAttribute("alt", response.data.weather[0].description);

    getForecast(response.data.coord, response.data.name);
  });
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");

  // Clear any previous forecast data
  forecastElement.innerHTML = "";

  // Start the row element
  let forecastHtml =
    '<div class="row align-items-center justify-content-around">';

  // Define an array of day abbreviations
  let dayAbbreviations = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (response.data.list) {
    // Loop through the first 5 days in the forecast data
    for (let i = 0; i < 5; i++) {
      // Find the forecast data for the corresponding day
      let forecastData = response.data.list[i];

      // If forecastData is found, build the HTML for the day
      if (forecastData) {
        forecastHtml += `
          <div class="col-2">
            <div>
              <div class="weather-forecast-date">${dayAbbreviations[i]}</div>
              <img
                src="http://openweathermap.org/img/wn/${
                  forecastData.weather[0].icon
                }@2x.png"
                alt=""
                class="forecast-icon"
                style="max-height: 64px; max-width: 64px"
              />
              <div class="weather-forecast-temperature">
                <span class="weather-forecast-max-temperature">${Math.round(
                  forecastData.main.temp_max
                )}°</span>
                <span class="weather-forecast-min-temperature">${Math.round(
                  forecastData.main.temp_min
                )}°</span>
              </div>
            </div>
          </div>
      `;
      }
    }
  } else {
    // Handle the case where the response data structure is not as expected
    forecastHtml =
      '<div class="error-message">Forecast data not available.</div>';
  }

  // Close the row element
  forecastHtml += "</div>";

  forecastElement.innerHTML = forecastHtml;
}

const buttons = document.querySelectorAll(".btn.btn-current");

buttons.forEach(function (button) {
  button.addEventListener("click", function () {
    navigator.geolocation.getCurrentPosition(showPosition);
    buttons.forEach((btn) => btn.classList.remove("clicked"));
    button.classList.add("clicked");
  });
});

function displayDefaultCity() {
  window.addEventListener("load", function () {
    const defaultCity = "Wrocław";
    displayTemperature(defaultCity);
  });
}

displayDefaultCity();
displayForecast();
