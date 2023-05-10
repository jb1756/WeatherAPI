localStorage.clear();

function findCity() {
    var cityName = titleCase($("#cityName")[0].value.trim());

    var currentWeatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=67f8502939daf11dda7e8fe7391347e5";

    fetchCurrentWeather(currentWeatherApiUrl);
}

function fetchCurrentWeather(apiURL) {
    fetch(apiURL).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {

                $("#city-name")[0].textContent = cityName + " (" + moment().format('M/D/YYYY') + ")";

                $("#city-list").append('<button type="button" class="list-group-item list-group-item-light list-group-item-action city-name">' + cityName);

                const lat = data.coord.lat;
                const lon = data.coord.lon;

                var latLonPair = lat.toString() + " " + lon.toString();

                localStorage.setItem(cityName, latLonPair);

                var oneCallWeatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&units=imperial&appid=752fb1936b09d33d6b175bf141f8f0e8";

                fetchOneCallWeather(oneCallWeatherApiUrl);
            })
        } else {
            alert("Cannot find city!");
        }
    })
}

function fetchOneCallWeather(apiURL) {
    fetch(apiURL).then(function (newResponse) {
        if (newResponse.ok) {
            newResponse.json().then(function (newData) {
                getCurrentWeather(newData);
            })
        } else {
            throw new Error('Response not OK');
        }
    }).catch(function (error) {
        console.log('Error:', error);
    });
}






























































localStorage.clear();

function findCity() {
    var cityName = titleCase($("#cityName")[0].value.trim());

    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=";

    fetch(apiURL).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {

                $("#city-name")[0].textContent = cityName + " (" + moment().format('M/D/YYYY') + ")";

                $("#city-list").append('<button type="button" class="list-group-item list-group-item-light list-group-item-action city-name">' + cityName);

                const lat = data.coord.lat;
                const lon = data.coord.lon;

                var latLonPair = lat.toString() + " " + lon.toString();

                localStorage.setItem(cityName, latLonPair);

                apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&units=imperial&appid=";

                fetch(apiURL).then(function (newResponse) {
                    if (newResponse.ok) {
                        newResponse.json().then(function (newData) {
                            getCurrentWeather(newData);
                        })
                    }
                })
            })
        } else {
            alert("Cannot find city!");
        }
    })
}