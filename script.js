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
  document.querySelector("#city").innerHTML = city;

  displayTemperature(city);
}

let apiKey = "b5c3a410d9e64da83f9eb805ceaac113";

function displayTemperature(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(function (response) {
    let temperature = document.querySelector("#temperature");
    let wind = document.querySelector("#wind");
    let humidity = document.querySelector("#humidity");
    let description = document.querySelector("#description");
    //let time = document.querySelector("#time");
    temperature.innerHTML = Math.round(response.data.main.temp);
    wind.innerHTML = Math.round(response.data.wind.speed * 3.6);
    humidity.innerHTML = response.data.main.humidity;
    description.innerHTML =
      response.data.weather[0].description.charAt(0).toUpperCase() +
      response.data.weather[0].description.slice(1);
  });
}

let form = document.querySelector("form");
form.addEventListener("submit", displayCity);
form.addEventListener("click", displayCity);

// Show current temperature

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
    let temperature = document.querySelector("#temperature");
    temperature.innerHTML = Math.round(response.data.main.temp);
    temperature.innerHTML = Math.round(response.data.main.temp);
    humidity.innerHTML = response.data.main.humidity;
  });
}

const buttons = document.querySelectorAll(".btn.btn-success");

buttons.forEach(function (button) {
  button.addEventListener("click", function () {
    navigator.geolocation.getCurrentPosition(showPosition);
  });
});
