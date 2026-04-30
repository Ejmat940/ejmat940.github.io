// Sending requests
function sendRequests() {
  let appid = "fc7a085e5778203a175c4d5d6a611e5a";
  let city = "Warsaw";

  geocoding(appid, city);
}

// Get location
function geocoding(appid, city) {
  let URL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${appid}&units=metric&lang=pl`;

  const xhr = new XMLHttpRequest();
  xhr.open("GET", URL, true);

  xhr.onload = function() {
    if (xhr.status === 200) {
      const locations = JSON.parse(xhr.responseText);
      if (locations.length > 0) {
        const lat = locations[0].lat;
        const lon = locations[0].lon;

        // Current Weather (XMLHttpRequest)
        currentWeather(appid, lat, lon);

        // 5 Day Forecast (Fetch API)
        forecastWeather(appid, lat, lon);
      }
    } else {
      console.error("Błąd przy pobieraniu lokalizacji");
    }
  };

  xhr.onerror = function() {
    console.error("Błąd sieci przy pobieraniu lokalizacji");
  };

  xhr.send();
}

// Current Weather API (XMLHttpRequest)
function currentWeather(appid, lat, lon) {
  let URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appid}&units=metric&lang=pl`;

  const xhr = new XMLHttpRequest();
  xhr.open("GET", URL, true);

  xhr.onload = function() {
    if (xhr.status === 200) {
      const weatherData = JSON.parse(xhr.responseText);
      console.log(weatherData);
    } else {
      console.error("Błąd przy pobieraniu pogody");
    }
  };

  xhr.onerror = function() {
    console.error("Błąd sieci przy pobieraniu pogody");
  };

  xhr.send();
}

// 5 Day Forecast API (Fetch API)
function forecastWeather(appid, lat, lon) {
  let URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${appid}&units=metric&lang=pl`;

  fetch(URL)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      displayForecast(data);
    })
    .catch(error => {
      console.error("Błąd przy pobieraniu prognozy:", error);
    });
}

// Sending requests
function sendRequests() {
  let appid = "fc7a085e5778203a175c4d5d6a611e5a";
  let city = document.getElementById("location").value.trim();

  if (!city) {
    alert("Proszę wprowadzić nazwę miasta");
    return;
  }

  geocoding(appid, city);
}


// Display
function displayCurrentWeather(data) {
  const container = document.getElementById("currentWeatherContainer");

  const temp = data.main.temp;
  const feels_like = data.main.feels_like;
  const description = data.weather[0].description;
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;
  const city = data.name;
  const country = data.sys.country;

  const html = `
    <h2>Bieżąca pogoda w ${city}, ${country}</h2>
    <p><strong>Temperatura:</strong> ${temp}°C (uczuciowa: ${feels_like}°C)</p>
    <p><strong>Warunki:</strong> ${description}</p>
    <p><strong>Wilgotność:</strong> ${humidity}%</p>
    <p><strong>Prędkość wiatru:</strong> ${windSpeed} m/s</p>
  `;

  container.innerHTML = html;
}

function displayForecast(data) {
  const container = document.getElementById("forecastContainer");

  const weatherBackgrounds = {
    clear: "assets/sunny.png",
    clouds: "assets/clouds.png",
    rain: "assets/rain.png",
    drizzle: "assets/drizzle.png",
    thunderstorm: "assets/storm.png",
    snow: "assets/drizzle.png",
    mist: "assets/fog.png",
    fog: "assets/fog.png"
  };

  let html = "<div class='forecast-list'>";

  for (let i = 0; i < data.list.length; i += 8) {
    const forecast = data.list[i];
    const date = new Date(forecast.dt * 1000).toLocaleDateString("pl-PL");
    const time = new Date(forecast.dt * 1000).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
    const temp = forecast.main.temp;
    const description = forecast.weather[0].description;
    const humidity = forecast.main.humidity;
    const windSpeed = forecast.wind.speed;

    // pobieramy główny typ pogody
    const mainWeather = forecast.weather[0].main.toLowerCase();

    // wybieramy tło
    const bg = weatherBackgrounds[mainWeather] || "img/default.jpg";

    html += `
      <div class='forecast-item' style="
        background-image: url('${bg}');
        background-size: 300px;
        background-position: center;
        background-repeat: no-repeat;
        background-color: transparent;
      ">
        <p><strong>${date} ${time}</strong></p>
        <p>Temperatura: ${temp}°C</p>
        <p>Warunki: ${description}</p>
        <p>Wilgotność: ${humidity}%</p>
        <p>Wiatr: ${windSpeed} m/s</p>
      </div>
    `;
  }

  html += "</div>";
  container.innerHTML = html;
}
