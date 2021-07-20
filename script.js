$(document).ready(function () {
  var searchButton = $("#search-button");
  var cityInput = $("#city-input");
  var cityList = $("#city-list");
  var currentCity;
  var appendedItems = 0;
  var requestUrl;
  var bigCont = $("#big-container");
  var wBox = $("#weather-box");
  var cityName = $("#city-name");
  var currDate = $("#current-date");
  var localTemperature = $("#temp");
  var localWind = $("#wind");
  var localHumidity = $("#humidity");
  var localUV = $("#UV");
  var bigIcon = $("#big-icon");
  var cityLat;
  var cityLon;
  var fcst1Date = $("#day-1-date");
  var fcst2Date = $("#day-2-date");
  var fcst3Date = $("#day-3-date");
  var fcst4Date = $("#day-4-date");
  var fcst5Date = $("#day-5-date");
  var fcst1Temp = $("#day-1-temp");
  var fcst2Temp = $("#day-2-temp");
  var fcst3Temp = $("#day-3-temp");
  var fcst4Temp = $("#day-4-temp");
  var fcst5Temp = $("#day-5-temp");
  var fcst1Wind = $("#day-1-wind");
  var fcst2Wind = $("#day-2-wind");
  var fcst3Wind = $("#day-3-wind");
  var fcst4Wind = $("#day-4-wind");
  var fcst5Wind = $("#day-5-wind");
  var fcst1Hum = $("#day-1-hum");
  var fcst2Hum = $("#day-2-hum");
  var fcst3Hum = $("#day-3-hum");
  var fcst4Hum = $("#day-4-hum");
  var fcst5Hum = $("#day-5-hum");
  var fcst1Icon = $("#fcstIcon1");
  var fcst2Icon = $("#fcstIcon2");
  var fcst3Icon = $("#fcstIcon3");
  var fcst4Icon = $("#fcstIcon4");
  var fcst5Icon = $("#fcstIcon5");

  //array used to manage and render local storage. Initialized to Empty or to Contain saved key:value pairs
  var savedCities = JSON.parse(localStorage.getItem("weathercities")) || [];

  function renderSavedItems() {
    for (var i = 0; i < savedCities.length; i++) {
      currentCity = savedCities[i].cityname;

      //keep original format for 2 name cities for display on appended li
      var formatCity = currentCity.replace("+", " ");

      var appendLi = $("<button>")
        .addClass("list-item")
        .attr("id", currentCity)
        .text(formatCity)
        .on("click", function () {
          currentCity = $(this).text();
          requestUrl =
            "https://api.openweathermap.org/data/2.5/weather?q=" +
            currentCity +
            "&units=imperial&appid=255055a794435e93d10c1986c06d9c9b";

          getWeatherAPI();
        });
      cityList.append(appendLi);
    }
  }

  function getWeatherAPI() {
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.cod == "404") {
          cityName.text("City Not Found");
          wBox.attr("style", "display:block");
          bigCont.attr("style", "display:none");
          return;
        }

        //Display Current Condition and Forecast Windows if Hidden
        bigCont.attr("style", "display:block");
        wBox.attr("style", "display:block");

        cityName.text(data.name);

        var today = moment().format(" (MM/DD/YYYY)");
        currDate.text(today);
        localTemperature.text(data.main.temp);
        localWind.text(data.wind.speed);
        localHumidity.text(data.main.humidity);
        cityLat = data.coord.lat;
        cityLon = data.coord.lon;

        var newReqUrl =
          "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          cityLat +
          "&lon=" +
          cityLon +
          "&exclude=minutely,hourly&units=imperial&appid=255055a794435e93d10c1986c06d9c9b";

        console.log(newReqUrl);
        fetch(newReqUrl)
          .then(function (response) {
            return response.json();
          })
          .then(function (data2) {
            localUV.text(data2.current.uvi);

            //set UV Color Index
            var indexUV = data2.current.uvi;
            if (indexUV <= 2) {
              localUV.attr("class", "uv-low");
            } else if (indexUV > 2 && indexUV <= 5) {
              localUV.attr("class", "uv-moderate");
            } else localUV.attr("class", "uv-high");

            //Current Day Icon
            var iconRef = data2.current.weather[0].icon;
            bigIcon.attr(
              "src",
              "https://openweathermap.org/img/wn/" + iconRef + "@2x.png"
            );

            // Set fcst dates
            var day1 = data2.daily[1].dt;
            var day2 = data2.daily[2].dt;
            var day3 = data2.daily[3].dt;
            var day4 = data2.daily[4].dt;
            var day5 = data2.daily[5].dt;

            fcst1Date.text(moment.unix(day1).format("MM/DD/YY"));
            fcst2Date.text(moment.unix(day2).format("MM/DD/YY"));
            fcst3Date.text(moment.unix(day3).format("MM/DD/YY"));
            fcst4Date.text(moment.unix(day4).format("MM/DD/YY"));
            fcst5Date.text(moment.unix(day5).format("MM/DD/YY"));

            // Set fcst temps
            var day1 = data2.daily[1].temp.day;
            var day2 = data2.daily[2].temp.day;
            var day3 = data2.daily[3].temp.day;
            var day4 = data2.daily[4].temp.day;
            var day5 = data2.daily[5].temp.day;

            fcst1Temp.text(day1);
            fcst2Temp.text(day2);
            fcst3Temp.text(day3);
            fcst4Temp.text(day4);
            fcst5Temp.text(day5);

            // Set fcst wind
            var day1 = data2.daily[1].wind_speed;
            var day2 = data2.daily[2].wind_speed;
            var day3 = data2.daily[3].wind_speed;
            var day4 = data2.daily[4].wind_speed;
            var day5 = data2.daily[5].wind_speed;

            fcst1Wind.text(day1);
            fcst2Wind.text(day2);
            fcst3Wind.text(day3);
            fcst4Wind.text(day4);
            fcst5Wind.text(day5);

            // Set fcst humidity
            var day1 = data2.daily[1].humidity;
            var day2 = data2.daily[2].humidity;
            var day3 = data2.daily[3].humidity;
            var day4 = data2.daily[4].humidity;
            var day5 = data2.daily[5].humidity;

            fcst1Hum.text(day1);
            fcst2Hum.text(day2);
            fcst3Hum.text(day3);
            fcst4Hum.text(day4);
            fcst5Hum.text(day5);

            // Set fcst icon
            var day1 = data2.daily[1].weather[0].icon;
            var day2 = data2.daily[2].weather[0].icon;
            var day3 = data2.daily[3].weather[0].icon;
            var day4 = data2.daily[4].weather[0].icon;
            var day5 = data2.daily[5].weather[0].icon;

            fcst1Icon.attr(
              "src",
              "https://openweathermap.org/img/wn/" + day1 + ".png"
            );
            fcst2Icon.attr(
              "src",
              "https://openweathermap.org/img/wn/" + day2 + ".png"
            );
            fcst3Icon.attr(
              "src",
              "https://openweathermap.org/img/wn/" + day3 + ".png"
            );
            fcst4Icon.attr(
              "src",
              "https://openweathermap.org/img/wn/" + day4 + ".png"
            );
            fcst5Icon.attr(
              "src",
              "https://openweathermap.org/img/wn/" + day5 + ".png"
            );
          });
      });
  }

  //https://api.openweathermap.org/data/2.5/onecall?lat=35.6895&lon=139.6917&exclude=minutely,hourly&units=imperial&appid=255055a794435e93d10c1986c06d9c9b

  //on click append button to list and pull weather for input city
  searchButton.on("click", function (event) {
    event.preventDefault();

    //get city in input field. If it is two words, replace the " " with a "+" as required by the API"
    currentCity = cityInput.val().replace(" ", "+").trim();

    //keep original format for 2 name cities for display on appended li
    var formatCity = currentCity.replace("+", " ");

    //build request URL using base API string and input city name
    requestUrl =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      currentCity +
      "&units=imperial&appid=255055a794435e93d10c1986c06d9c9b";
    getWeatherAPI();

    //append new item to list with properties and click event functionality
    var appendLi = $("<button>")
      .addClass("list-item")
      .attr("id", currentCity)
      .text(formatCity)
      .on("click", function () {
        currentCity = $(this).text();
        requestUrl =
          "https://api.openweathermap.org/data/2.5/weather?q=" +
          currentCity +
          "&units=imperial&appid=255055a794435e93d10c1986c06d9c9b";

        getWeatherAPI();
      });

    cityList.append(appendLi);
    cityInput.val("");

    //store appended city in local storage
    appendedItems++;
    savedCities.push({ citynum: appendedItems, cityname: currentCity });
    localStorage.setItem("weathercities", JSON.stringify(savedCities));
  });
  renderSavedItems();
});
