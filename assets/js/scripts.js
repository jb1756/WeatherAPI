
var apiKey = "752fb1936b09d33d6b175bf141f8f0e8"

localStorage.clear();


function findCity() {
    var cityName = titleCase($("#cityName")[0].value.trim());

    var currentWeatherApiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + apiKey;

    fetchCurrentWeather(currentWeatherApiURL, cityName);
}

function fetchCurrentWeather(apiURL, cityName) {
    fetch(apiURL).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {

                $("#city-name")[0].textContent = cityName + " (" + moment().format('M/D/YYYY') + ")";

                $("#city-list").append('<button type="button" class="list-group-item list-group-item-light list-group-item-action city-name">' + cityName);

                const lat = data.coord.lat;
                const lon = data.coord.lon;

                var latLonPair = lat.toString() + " " + lon.toString();

                localStorage.setItem(cityName, latLonPair);

                var oneCallApiURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&units=imperial&appid=" + apiKey;
                console.log(oneCallApiURL)
                fetchOneCallWeather(oneCallApiURL);
            })
        } else {
            alert("Cannot find city!");
        }
    })
}

//throwing an error 401 regarding key. unsure why...
function fetchOneCallWeather(apiURL) {
    fetch(apiURL)
        .then(function (newResponse) {
            if (newResponse.ok) {
                newResponse.json().then(function (newData) {
                    getCurrentWeather(newData);
                })
            } else {
                throw new Error('Response not OK');
            }
        })
        .catch(function (error) {
            console.log('Error:', error);
        });
}


// This function gets the info for a city already in the list. It does not need to check whether the city exists as it was already checked when the city was first searched for.
function getListCity(coordinates) {
    apiURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + coordinates[0] + "&lon=" + coordinates[1] + "&exclude=minutely,hourly&units=imperial&appid=" + apiKey;

    fetch(apiURL).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                getCurrentWeather(data);
            })
        }
    })
}

function getCurrentWeather(data) {
    $(".results-panel").addClass("visible");
    console.log(data)
    $("#currentIcon")[0].src = "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
    $("#temperature")[0].textContent = "Temperature: " + data.temp + " \u2109";
    $("#humidity")[0].textContent = "Humidity: " + data.humidity + "% ";
    $("#wind-speed")[0].textContent = "Wind Speed: " + data.wind_speed + " MPH";
   
    getFutureWeather(data);
}

function getFutureWeather(data) {
    for (var i = 0; i < 5; i++) {
        var futureWeather = {
            //date: convertUnixTime(data, i),
            //icon: "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png",
            temp: data.main.temp,
            humidity: data.main.humidity
        }

        var currentSelector = "#day-" + i;
        $(currentSelector)[0].textContent = futureWeather.date;
        currentSelector = "#img-" + i;
        $(currentSelector)[0].src = futureWeather.icon;
        currentSelector = "#temp-" + i;
        $(currentSelector)[0].textContent = "Temp: " + futureWeather.temp + " \u2109";
        currentSelector = "#hum-" + i;
        $(currentSelector)[0].textContent = "Humidity: " + futureWeather.humidity + "%";
    }
}

// This function applies title case to a city name if there is more than one word.
function titleCase(city) {
    var updatedCity = city.toLowerCase().split(" ");
    var returnedCity = "";
    for (var i = 0; i < updatedCity.length; i++) {
        updatedCity[i] = updatedCity[i][0].toUpperCase() + updatedCity[i].slice(1);
        returnedCity += " " + updatedCity[i];
    }
    return returnedCity;
}

// This converts the UNIX time that is received from the server.
//function convertUnixTime(data, index) {
//    const dateObject = new Date(data.daily.dt * 1000);

 //   return (dateObject.toLocaleDateString());
//}

$("#search-button").on("click", function (e) {
    e.preventDefault();

    findCity();

    $("form")[0].reset();
})

$(".city-list-box").on("click", ".city-name", function () {

    var coordinates = (localStorage.getItem($(this)[0].textContent)).split(" ");
    coordinates[0] = parseFloat(coordinates[0]);
    coordinates[1] = parseFloat(coordinates[1]);

    $("#city-name")[0].textContent = $(this)[0].textContent + " (" + moment().format('M/D/YYYY') + ")";

    getListCity(coordinates);
})