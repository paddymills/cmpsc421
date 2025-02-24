const key = "jhrg50qHxEn4Ou1VQq4Tb3IrnwC3WM5x";
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var selectedDayIndex = 0;
var dailyForecasts = [];
var hourlyForecasts = [];

window.onload = () => {
  let zip = document.getElementById("zip-input");
  zip.focus();

  document
    .getElementById("generate-btn")
    .addEventListener("click", async (e) => {
      let zipCode = zip.value;
      await getWeather(zipCode);
    });
  document
    .getElementById("zip-input")
    .addEventListener("keypress", async (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        document.getElementById("generate-btn").click();
      }
    });

  // for testing
  getWeather("17022");
};

async function getWeather(loc) {
  const geo = await fetch(
    `https://www.mapquestapi.com/geocoding/v1/address?key=${key}&location=${loc}`,
  );
  if (!geo.ok) {
    alert(`Failed to fetch geolocation data for ${loc}`);
    throw new Error(`Failed to fetch geolocation data for ${loc}`);
  }

  const geoData = await geo.json();
  const locData = geoData.results[0].locations[0];
  const latLong = locData.latLng;
  document.getElementById("weather-location").textContent =
    `${locData.adminArea5}, ${locData.adminArea3}, ${locData.adminArea1}`;
  console.log(geoData);
  console.log(
    `Geolocation for ${loc} is Latitude: ${latLong.lat}, Longitude: ${latLong.lng}`,
  );

  const weatherForecastApi = await fetch(
    `https://api.weather.gov/points/${latLong.lat},${latLong.lng}`,
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

  const forecast = await fetch(forecastConfig.properties.forecast);
  const forecastData = await forecast.json();
  console.log(forecastData);

  // save daily forecasts
  dailyForecasts = forecastData.properties.periods;
  renderDailyForcasts();

  const hourlyForecast = await fetch(forecastConfig.properties.forecastHourly);
  const hourlyForecastData = await hourlyForecast.json();
  console.log(hourlyForecastData);

  // save hourly forecasts
  hourlyForecasts = hourlyForecastData.properties.periods;
  renderHourlyForcasts();

  setCurrentWeather(hourlyForecastData.properties.periods[0]);
}

function renderDailyForcasts() {
  // show weather data for each day
  for (let i = 0; i < 10; i++) {
    const period = dailyForecasts[i];
    const date = new Date(period.startTime);
    document.getElementById(`date-${i}`).textContent =
      `${days[date.getDay()]} ${date.getDate()}`;
    document.getElementById(`icon-${i}`).src = period.icon;
    document.getElementById(`temp-${i}`).textContent =
      `${period.temperature}°${period.temperatureUnit}`;

    let container = document.getElementById(`daily-${i}`);
    container.classList.remove("white");
    container.classList.remove("blue-grey");
    container.classList.add(selectedDayIndex === i ? "white" : "blue-grey");

    container.addEventListener("click", (e) => {
      selectedDayIndex = i;
      renderDailyForcasts();
    });
  }

  renderHourlyForcasts();
}

function renderHourlyForcasts() {
  const width = 800;
  const height = 200;
  const marginTop = 20;
  const marginRight = 20;
  const marginBottom = 20;
  const marginLeft = 20;

  d3.select("#hourly-forecast").selectAll("*").remove();

  const date = dailyForecasts[0].startTime.substring(0, 10);
  const hourly = hourlyForecasts.filter(
    (forecast) => forecast.startTime.substring(0, 10) === date,
  );

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

  svg
    .append("g")
    .attr("transform", `translate(0, ${height - marginBottom})`)
    .call(xAxis);
  svg.append("g").attr("transform", `translate(${marginLeft}, 0)`).call(yAxis);

  const line = d3
    .line()
    .x((d) => x(new Date(d.startTime).getHours()))
    .y((d) => y(d.temperature));

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
}
