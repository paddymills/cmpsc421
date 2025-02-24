const key = "jhrg50qHxEn4Ou1VQq4Tb3IrnwC3WM5x";
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var selectedDayIndex = 0;
var dailyForecasts = [];
var hourlyForecasts = [];

window.onload = () => {
  let zip = document.getElementById("zip-input");
  zip.focus();

  // submit on click
  document
    .getElementById("generate-btn")
    .addEventListener("click", async (e) => {
      let zipCode = zip.value;
      await getWeather(zipCode);
    });

  // submit on enter key press
  document
    .getElementById("zip-input")
    .addEventListener("keypress", async (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        document.getElementById("generate-btn").click();
      }
    });

  // render graph on width changes
  document.addEventListener("resize", renderHourlyForecasts);

  if (window.location.search === "?env=dev") {
    console.log("Development environment");

    // fetch weather for Elizabethtown, PA
    document.getElementById("zip-input").value = "17022";
    document.getElementById("generate-btn").click();
  }
};

async function getWeather(loc) {
  // show progress bar
  document.getElementById("progress").classList.remove("hidden");

  // get geolocation data
  const geo = await fetch(
    `https://www.mapquestapi.com/geocoding/v1/address?key=${key}&location=${loc}`,
  );
  if (!geo.ok) {
    alert(`Failed to fetch geolocation data for ${loc}`);
    throw new Error(`Failed to fetch geolocation data for ${loc}`);
  }

  const geoData = await geo.json();
  const locData = geoData.results[0].locations[0];
  document.getElementById("weather-location").textContent =
    `${locData.adminArea5}, ${locData.adminArea3}, ${locData.adminArea1}`;
  console.log(geoData);

  // get weather forecast endpoints
  const weatherForecastApi = await fetch(
    `https://api.weather.gov/points/${locData.latLong.lat},${locData.latLong.lng}`,
  );
  if (!weatherForecastApi.ok) {
    weatherForecastApi.json().then((data) => {
      alert(data.title);
    });
    throw new Error(`Failed to fetch weather forecast data for ${loc}`);
  }

  // show weather data section
  document.getElementById("weather-data").hidden = false;

  const forecastConfig = await weatherForecastApi.json();
  console.log(forecastConfig);

  // fetch daily forecasts
  const forecast = await fetch(forecastConfig.properties.forecast);
  const forecastData = await forecast.json();
  console.log(forecastData);

  // save daily forecasts
  dailyForecasts = forecastData.properties.periods.filter(
    (period) => period.isDaytime,
  );
  renderDailyForcasts();

  // fetch hourly forecasts
  const hourlyForecast = await fetch(forecastConfig.properties.forecastHourly);
  const hourlyForecastData = await hourlyForecast.json();
  console.log(hourlyForecastData);

  // set current weather section data
  setCurrentWeather(hourlyForecastData.properties.periods[0]);

  // save hourly forecasts
  hourlyForecasts = hourlyForecastData.properties.periods;
  renderHourlyForecasts();

  // hide progress bar
  document.getElementById("progress").className = "hidden";
}

function renderDailyForcasts() {
  let mainContainer = document.getElementById("daily-forecasts");
  const push = Math.floor((12 - dailyForecasts.length) / 2);

  // delete daily forecast elements
  while (mainContainer.hasChildNodes()) {
    mainContainer.removeChild(child);
  }

  // show weather data for each day
  for (let i = 0; i < dailyForecasts.length; i++) {
    const period = dailyForecasts[i];
    const date = new Date(period.startTime);

    // <div id="daily-0" class="col s1 blue-grey lighten-4 forecast-day">
    //     <p id="date-0"></p>
    //     <img id="icon-0" src="">
    //     <p id="temp-0"></p>
    // </div>

    let container = document.createElement("div");
    container.id = `daily-${i}`;
    container.className = `col s1 push-s${push} lighten-4 forecast-day`;

    // set background color
    container.classList.add(selectedDayIndex === i ? "white" : "blue-grey");

    let pDay = document.createElement("p");
    pDay.id = `date-${i}`;
    pDay.textContent = `${days[date.getDay()]} ${date.getDate()}`;

    let imgDay = document.createElement("img");
    imgDay.id = `icon-${i}`;
    imgDay.src = period.icon;

    let pTemp = document.createElement("p");
    pTemp.id = `temp-${i}`;
    pTemp.textContent = `${period.temperature}°${period.temperatureUnit}`;

    // build container
    container.appendChild(pDay);
    container.appendChild(imgDay);
    container.appendChild(pTemp);
    container.addEventListener("click", (e) => {
      setSelectedDay(i);
    });

    // append child to main
    mainContainer.appendChild(container);
  }

  // render the graph for the selected day
  renderHourlyForecasts();
}

function setSelectedDay(index) {
  // reset select day background color
  document
    .getElementById(`daily-${selectedDayIndex}`)
    .classList.remove("white");
  document
    .getElementById(`daily-${selectedDayIndex}`)
    .classList.add("blue-grey");

  selectedDayIndex = index;

  // reset select day background color
  document
    .getElementById(`daily-${selectedDayIndex}`)
    .classList.remove("blue-grey");
  document.getElementById(`daily-${selectedDayIndex}`).classList.add("white");

  renderHourlyForecasts();
}

function renderHourlyForecasts() {
  // needs to be dynamically called when window is resized
  const width = document.getElementById("hourly-forecast").clientWidth;
  const height = 200;
  const marginTop = 20;
  const marginRight = 20;
  const marginBottom = 20;
  const marginLeft = 20;

  // clear existing content
  d3.select("#hourly-forecast").selectAll("*").remove();

  // get only selected day's hourly forecasts
  const date = dailyForecasts[selectedDayIndex].startTime.substring(0, 10);
  const hourly = hourlyForecasts.filter(
    (forecast) => forecast.startTime.substring(0, 10) === date,
  );

  // create x and y scales
  const x = d3.scaleUtc(
    d3.extent(hourly, (x) => new Date(x.startTime)),
    [marginLeft, width - marginRight],
  );
  const y = d3.scaleLinear(
    [0, d3.max(hourly, (d) => d.temperature)],
    [height - marginBottom, marginTop],
  );
  const svg = d3
    .select("#hourly-forecast")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y);

  // render x-axis (but not y)
  svg
    .append("g")
    .attr("transform", `translate(0, ${height - marginBottom})`)
    .call(xAxis);

  // render line
  const line = d3
    .line()
    .x((d) => x(new Date(d.startTime)))
    .y((d) => y(d.temperature));

  // render graph
  svg
    .append("path")
    .datum(hourly)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", line);

  return svg.node();
}

function setCurrentWeather(currentWeather) {
  // console.log(currentWeather);
  document.getElementById("weather-temp").textContent =
    `${currentWeather.temperature}°${currentWeather.temperatureUnit}`;
  document.getElementById("weather-icon").src = currentWeather.icon;
  document.getElementById("weather-precip").textContent =
    `Precipitation: ${currentWeather.probabilityOfPrecipitation.value || 0}%`;
  document.getElementById("weather-wind").textContent =
    `Wind: ${currentWeather.windSpeed} ${currentWeather.windDirection}`;
  document.getElementById("weather-humidity").textContent =
    `Humidity: ${currentWeather.relativeHumidity.value || 0}%`;
  document.getElementById("weather-description").textContent =
    `${currentWeather.shortForecast}`;
}
