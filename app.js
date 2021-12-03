//Query selectors
const searchInput = document.querySelector("#search-input");
const form = document.querySelector(".search-form");
const content = document.querySelector(".content");
const main = document.querySelector("main");

//Forms
form.addEventListener("submit", function (eventObject) {
  eventObject.preventDefault();
});

//Default page info (forecast)
const loadForecast = (value) => {
  if (!value) {
    value = "Yokohama";
  }

  try {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${value}&appid=c365d4d47e60924f0be2c58b61e60a62&units=metric`,
      {
        mode: "cors",
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (response) {
        console.log(response);
        let lon = response.coord.lon;
        let lat = response.coord.lat;
        fetch(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=c365d4d47e60924f0be2c58b61e60a62&units=metric`,
          {
            mode: "cors",
          }
        )
          .then(function (res) {
            return res.json();
          })
          .then(function (res) {
            console.log(res);
            return getInfo(response, res);
          });
      });
  } catch (error) {
    console.log(error);
  }
};

loadForecast();

//Get user query
form.addEventListener("submit", function () {
  let val = searchInput.value;
  loadForecast(val);

  form.reset();
});

//Create content function
const getInfo = (response, res) => {
  content.innerHTML = "";
  console.log(response);
  //New elements
  const title = document.createElement("h2");
  const tempMax = document.createElement("div");
  const tempMin = document.createElement("div");
  const temperature = document.createElement("div");
  const icon = response.weather[0].icon;
  const weatherIcon = document.createElement("img");
  weatherIcon.src = `http://openweathermap.org/img/w/${icon}.png`;
  weatherIcon.classList.add("weather-icon");
//   Get hourly data
const hourlyDisplay = document.createElement('div');
hourlyDisplay.classList.add('hourly-display');
let i = 1
  for (let hour of res.hourly) {
    i++
    // const hourlyData = document.createElement("p");
    let unix_timestamp = hour.dt;
    let date = new Date(unix_timestamp * 1000);
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    let formattedTime =
      hours + ":" + minutes.substr(-2); //+ ":" + seconds.substr(-2)
    const top = document.createElement('p');
    top.innerText = formattedTime;
    const center = document.createElement('img');
    center.src = `http://openweathermap.org/img/w/${hour.weather[0].icon}.png`
    const bottom = document.createElement('p');
    bottom.classList.add('hourly-bottom');
    bottom.innerText = hour.weather[0].description;
    const hourlyData = document.createElement('p');
    hourlyData.classList.add('hourly-data');
    hourlyData.append(top, center, bottom);
    hourlyDisplay.append(hourlyData);
    
    if(i === 8){break;}
  }

  //To be appended
  title.innerText = response.name;
  title.classList.add("weather-title");
  tempMax.innerHTML = `<p class="max-temp">${res.daily[0].temp.max} &deg;C</p>`;
  temperature.innerHTML = `<p class="current-temp">${response.main.temp} &deg;C</p>`;
  tempMin.innerHTML = `<p class="min-temp">${res.daily[0].temp.min} &deg;C</p>`;
  //Content
  content.append(title, weatherIcon, tempMax, temperature, tempMin, hourlyDisplay);
  content.classList.add("weather-content");
};
