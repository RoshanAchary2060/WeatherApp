let weatherAPIKey = '79e56c23b7de46fa8cec1f88a88f829c';
let weatherBaseEndPoint = 'https://api.openweathermap.org/data/2.5/weather?appid=' + weatherAPIKey + '&units=metric';
let forecastEndPoint = "https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=" + weatherAPIKey;
let geocodingBaseEndPoint = 'http://api.openweathermap.org/geo/1.0/direct?limit=5&appid=' + weatherAPIKey + '&q=';
let datalist = document.querySelector("#suggestions");
let searchInp = document.querySelector(".weather_search");
let city = document.querySelector('.weather_city');
let day = document.querySelector('.weather_day');
let humidity = document.querySelector('.weather_indicator--humidity>.value');
let wind = document.querySelector('.weather_indicator--wind>.value');
let pressure = document.querySelector('.weather_indicator--pressure>.value');
let temperature = document.querySelector('.weather_temperature>.value');
let image = document.querySelector('.weather_image');
let forecastBlock = document.querySelector('.weather_forecast');
let weatherImages = [
	{
		url: 'images/broken-clouds.jpg',
		ids: [803, 804]
	},
	{
		url: 'images/clear-sky.jpeg',
		ids: [800]
	},
	{
		url: 'images/few-clouds.png',
		ids: [801]
	},
	{
		url: 'images/mist.jpg',
		ids: [701, 7111, 721, 731, 741, 751, 761, 762, 771, 781]
	},
	{
		url: 'images/rain.jpeg',
		ids: [500, 501, 502, 503, 504]
	},
	{
		url: 'images/scattered-clouds.jpg',
		ids: [802]
	},
	{
		url: 'images/shower-rain.jpeg',
		ids: [520, 521, 522, 531, 300, 301, 302, 310, 311, 312, 313, 314, 321]
	},
	{
		url:
			'images/snow.png',
		ids: [511, 600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622]
	},
	{
		url: 'images/thunderstorm.png',
		ids: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232]
	}
];

let getWeatherByCityName = async (city) => {
	let endPoint = weatherBaseEndPoint + '&q=' + city;
	let response = await fetch(endPoint);
	let weather = await response.json();
	return weather;
};

let getForecastByCityID = async (id) => {
	let endpoint = forecastEndPoint + '&id=' + id;
	let result = await fetch(endpoint);
	let forecast = await result.json();
	let forecastlist = forecast.list;
	let daily = [];
	forecastlist.forEach((day) => {
		let date_txt = day.dt_txt;
		date_txt = date_txt.replace(' ', 'T');
		let date = new Date(date_txt);
		let hours = date.getHours();
		if (hours === 12) {
			daily.push(day);
		}
	});
	//	console.log(daily);
	return daily;
}

let updateCurrentWeather = (data) => {
	console.log(data);
	let iconUrl = 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png';
	//	image.src = iconUrl;
	city.innerText = data.name;
	day.innerText = dayOfWeek();
	humidity.innerText = data.main.humidity;
	pressure.innerText = data.main.pressure;
	let windDirection;
	let deg = data.wind.deg;
	if (deg > 45 && deg <= 135) { windDirection = "East"; }
	else if (deg > 135 && deg <= 225) { windDirection = "South"; }
	else if (deg > 225 && deg <= 315) { windDirection = "West"; }
	else { windDirection = "North"; }
	wind.innerText = windDirection + ", " + data.wind.speed;
	temperature.innerText = data.main.temp > 0 ? "+" + Math.round(data.main.temp) : Math.round(data.main.temp);
	let imgID = data.weather[0].id;
	weatherImages.forEach((obj) => {
		if (obj.ids.indexOf(imgID) != -1) {
			image.src = obj.url;
		}
	})
}

let dayOfWeek = (dt = new Date().getTime()) => {
	let today = new Date(dt).toLocaleDateString("en-EN", { weekday: "long" });
	return today;
}

let weatherForCity = async (city) => {
	let weather = await getWeatherByCityName(city);
	if (weather.cod === '404') {
		Swal.fire({ icon: "error", title: 'OOPS...', text: 'You typed wrong city name' })
		return;
	}
	updateCurrentWeather(weather);
	let id = weather.id;
	let forecast = await getForecastByCityID(id);
	updateForecast(forecast);
}
searchInp.addEventListener('keydown', async (e) => {
	if (e.keyCode === 13) {
		weatherForCity(searchInp.value);
	}
});
searchInp.addEventListener('input', async () => {
	if (searchInp.value.length <= 2) {
		return;
	}
	let endpoint = geocodingBaseEndPoint + searchInp.value;
	let result = await fetch(endpoint);
	result = await result.json();
	datalist.innerHTML = '';
	result.forEach((city) => {
		let option = document.createElement("option");
		option.value = `${city.name}${city.state ? "," + city.state : ""},${city.country}`;
		datalist.appendChild(option);
	})
//	console.log(result);
})

let updateForecast = (forecast) => {
	forecastBlock.innerHTML = '';
	let forecastItem = '';
	forecast.forEach((day) => {
		let iconUrl = 'http://openweathermap.org/img/wn/' + day.weather[0].icon + '@2x.png';
		let temperature = day.main.temp > 0 ? "+" + Math.round(day.main.temp) : Math.round(data.main.temp);
		let dayName = dayOfWeek(day.dt * 1000);
		forecastItem += `<article class="weather_forecast_item"><img src="${iconUrl}" alt="${day.weather[0].description}" class="weather_forecast_icon" /><h3 class="weather_forecast_day">${dayName}</h3><p class="weather_forecast_temperature"><span class="value">${temperature}</span> &deg;C</p></article>`
	});
	forecastBlock.innerHTML = forecastItem;
}