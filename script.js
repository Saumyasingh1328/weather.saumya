document.addEventListener('DOMContentLoaded', function() {
    const apiKey = 'YOUR_API_KEY_HERE'; // Replace with your OpenWeatherMap API key
    const weatherResult = document.getElementById('weatherResult');
    const getWeatherButton = document.getElementById('getWeather');
    const cityInput = document.getElementById('city');

    // Load last searched city from local storage
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
        cityInput.value = lastCity;
        getWeather(lastCity);
    }

    // Event listener for the get weather button
    getWeatherButton.addEventListener('click', function() {
        const city = cityInput.value.trim();
        if (city) {
            localStorage.setItem('lastCity', city);
            getWeather(city);
        } else {
            displayError('Please enter a city name.');
        }
    });

    // Function to fetch and display weather data
    function getWeather(city) {
        weatherResult.innerHTML = '<p>Loading...</p>';
        const url = `https://api.openweathermap.org/data/2.5/weather?q={city}&appid={apiKey}&units=metric`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.cod === 200) {
                    displayWeather(data);
                } else {
                    throw new Error(data.message);
                }
            })
            .catch(error => {
                displayError(error.message);
            });
    }

    // Function to display weather data
    function displayWeather(data) {
        const weatherIconUrl = `http://openweathermap.org/img/wn/{data.weather[0].icon}@2x.png`;
        const weather = `
            <h2>{data.name}, {data.sys.country}</h2>
            <img src="{weatherIconUrl}" alt="{data.weather[0].description}">
            <p>Temperature: {data.main.temp} &deg;C</p>
            <p>Weather: {data.weather[0].description}</p>
            <p>Humidity: {data.main.humidity} %</p>
            <p>Wind Speed: {data.wind.speed} m/s</p>
        `;
        weatherResult.innerHTML = weather;
    }

    // Function to display errors
    function displayError(message) {
        weatherResult.innerHTML = `<p>Error: {message}</p>`;
    }

    // Function to get weather based on user's geolocation
    function getWeatherByLocation(lat, lon) {
        weatherResult.innerHTML = '<p>Loading...</p>';
        const url = `https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={apiKey}&units=metric`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.cod === 200) {
                    displayWeather(data);
                } else {
                    throw new Error(data.message);
                }
            })
            .catch(error => {
                displayError(error.message);
            });
    }

    // Get user's current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                getWeatherByLocation(position.coords.latitude, position.coords.longitude);
            },
            error => {
                displayError('Unable to retrieve your location. Please enter a city manually.');
            }
        );
    } else {
        displayError('Geolocation is not supported by this browser.');
    }
});
