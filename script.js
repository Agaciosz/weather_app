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

let time = [now.getHours(), now.getMinutes()];
let formattedTime = time.join(":");
document.querySelector("#time").innerHTML = formattedTime;

//------------------------------//

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
    temperature.innerHTML = Math.round(response.data.main.temp);
  });
}

let form = document.querySelector("form");
form.addEventListener("submit", displayCity);
form.addEventListener("click", displayCity);

//------------------------------//

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
  });
}

const buttons = document.querySelectorAll(".btn.btn-success");

buttons.forEach(function (button) {
  button.addEventListener("click", function () {
    navigator.geolocation.getCurrentPosition(showPosition);
  });
});
