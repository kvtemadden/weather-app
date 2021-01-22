$(document).ready(function () {
  var apiKey = "a99afdbd6713ff21bf81cee54d0392e4";
  var queryURL = "https://api.openweathermap.org/data/2.5/forecast?appid=" + apiKey;
  var cityName;
  var humidityToday;
  var windToday;
  var celsiusToday;
  var dateToday;
  var days = [5, 13, 21, 29, 37];
  var i;
  var latitude;
  var longitude;
  var searchHistory = {};
  var n = 8;
  var searchedCities = [];
  var citiesList = $("#history");
  var clickedLi;
  prevSession();


  function weatherSearch() {
    var city = $("#city-search");
    queryURL = queryURL + "&q=" + city.val() + ",GB";
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {
      latitude = response.city.coord.lat;
      longitude = response.city.coord.lon;
      cityName = response.city.name;
      uvIndex(response);
      todaysInfo(response);
      todaysContent(response);
      console.log(response);

      var x = 0;
      for (i = 0; i < days.length; i++) {
        var day = days[x];
        humidityOther = (response.list[day].main.humidity) + "%";
        celsiusOther = (response.list[day].main.temp - 273.15).toFixed(2) + "°C";
        // reformatting date as UK structure instead of US
        dateTimeOther = (response.list[day].dt_txt);
        dateOtherUSArray = dateTimeOther.split(" ");
        dateOtherUS = dateOtherUSArray[0];
        dateOtherArray = dateOtherUS.split("-");
        dateOther = dateOtherArray[2] + "/" + dateOtherArray[1] + "/" + dateOtherArray[0];
        iconOther = "http://openweathermap.org/img/w/" + response.list[day].weather[0].icon + ".png";
        x++;

        var mainTitle = $("#day" + i);
        var tempDayInfo = $("#day" + i + "-t");
        var humidityDayInfo = $("#day" + i + "-h");
        var iconDayInfo = $("#day" + i + "-img");

        mainTitle.text(dateOther);
        tempDayInfo.text(celsiusOther);
        humidityDayInfo.text(humidityOther);
        iconDayInfo.attr("src", iconOther);
        console.log("no crash");
      }
      x = 0;


      resetURL();

    });
  }

  function uvIndex(response) {
    var UVqueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&appid=a99afdbd6713ff21bf81cee54d0392e4";

    $.ajax({
      url: UVqueryURL,
      method: "GET"
    }).then(function (uvResponse) {
      console.log(uvResponse);
      var uvInd = uvResponse.current.uvi;
      console.log(uvInd);
      var uvInfo = $("#uv");
      uvInfo.text(uvInd);
      uvInfo.removeClass("bg-secondary");

      if (uvInd >= 0 && uvInd <= 2) {
        uvInfo.addClass("bg-green");
      }
      else if (uvInd == 3 | uvInd == 4) {
        uvInfo.addClass("bg-yellow");
      }
      else if (uvInd == 5 | uvInd == 6) {
        uvInfo.addClass("bg-orange");
      }
      else if (uvInd > 6) {
        uvInfo.addClass("bg-red");
      }


    });

  }

  $("#search").click(function (event) {
    event.preventDefault();
    weatherSearch();
    showPageContent();
    saveSearch();
    // updateSearchHistory();
    clearSearchField();
  });

function clearSearchField() {
  $("#city-search").val("");
}

$(document).on("click", "li", function (event) {
    event.preventDefault();
    debugger;

    clearSearchField();
    clickedLi = $(this).text();
    clickedSearchHistory();
    showPageContent();
  });

  function clickedSearchHistory() {
    queryURL = queryURL + "&q=" + clickedLi + ",GB";
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {
      latitude = response.city.coord.lat;
      longitude = response.city.coord.lon;
      cityName = response.city.name;
      uvIndex(response);
      todaysInfo(response);
      todaysContent(response);
      console.log(response);

      var x = 0;
      for (i = 0; i < days.length; i++) {
        var day = days[x];
        humidityOther = (response.list[day].main.humidity) + "%";
        celsiusOther = (response.list[day].main.temp - 273.15).toFixed(2) + "°C";
        // reformatting date as UK structure instead of US
        dateTimeOther = (response.list[day].dt_txt);
        dateOtherUSArray = dateTimeOther.split(" ");
        dateOtherUS = dateOtherUSArray[0];
        dateOtherArray = dateOtherUS.split("-");
        dateOther = dateOtherArray[2] + "/" + dateOtherArray[1] + "/" + dateOtherArray[0];
        iconOther = "http://openweathermap.org/img/w/" + response.list[day].weather[0].icon + ".png";
        x++;

        var mainTitle = $("#day" + i);
        var tempDayInfo = $("#day" + i + "-t");
        var humidityDayInfo = $("#day" + i + "-h");
        var iconDayInfo = $("#day" + i + "-img");

        mainTitle.text(dateOther);
        tempDayInfo.text(celsiusOther);
        humidityDayInfo.text(humidityOther);
        iconDayInfo.attr("src", iconOther);
      }
      x = 0;


      resetURL();

    });
  }

  function todaysInfo(response) {
    humidityToday = (response.list[0].main.humidity) + "%";
    windToday = (response.list[0].wind.speed) + " MPH";
    celsiusToday = (response.list[0].main.temp - 273.15).toFixed(2) + "°C";
    //reformatting date as UK structure instead of US
    dateTimeToday = (response.list[0].dt_txt);
    dateTodayUSArray = dateTimeToday.split(" ");
    dateTodayUS = dateTodayUSArray[0];
    dateTodayArray = dateTodayUS.split("-");
    dateToday = dateTodayArray[2] + "/" + dateTodayArray[1] + "/" + dateTodayArray[0];
    iconToday = "http://openweathermap.org/img/w/" + response.list[0].weather[0].icon + ".png";
  }

  function todaysContent() {
    //selecting all html elements for today's info
    var mainInfo = $("#main-title");
    var tempInfo = $("#temp");
    var windInfo = $("#wind-speed");
    var humidityInfo = $("#humidity");
    var iconInfo = $("#currentIcon");
    var uvInfo = $("#uv");

    mainInfo.text(cityName + " " + dateToday);
    tempInfo.text(celsiusToday);
    windInfo.text(windToday);
    humidityInfo.text(humidityToday);
    iconInfo.attr("src", iconToday);


  }

  function resetURL() {
    queryURL = "https://api.openweathermap.org/data/2.5/forecast?appid=" + apiKey;
  }

  var instructions = $("#how-to-use");

  function showPageContent() {
    if (instructions.hasClass("show") == true) {
      var hidden = $(".hide");
      hidden.addClass("show");
      hidden.removeClass("hide");
      instructions.removeClass("show");
      instructions.addClass("hide");
    }
  }

  function saveSearch() {
   
    var cityName = $("#city-search").val();
    debugger;
    if (searchedCities.length == 7) {
      searchedCities.shift();
    }
    
    searchedCities.push(cityName);

    searchHistory = {
      city: searchedCities,
    }

    var searchString = JSON.stringify(searchHistory);
      JSON.parse(searchString);
      localStorage.setItem("searchHistory", searchString);
      renderCities();
  }

  function prevSession() {
    var ls = localStorage.getItem("searchHistory");
    if (ls) {
      searchHistory = JSON.parse(ls);
      for (var i = 0; i < searchHistory.city.length; i++) {
        var current = searchHistory.city[i];
        var savedLi = $("<li>" + current + "</li>");
        if (searchedCities.length == 7) {
          searchedCities.shift();
        }
        searchedCities.push(current);
        savedLi.addClass("historyList card-body card");
        citiesList.prepend(savedLi);
    }
    }
    else {
    }
  }

  function renderCities() {
    
    citiesList.empty();

    for (var newCity = 0; newCity < searchedCities.length; newCity++) {
      var indvCity = searchedCities[newCity];

      var li = $("<li>" + indvCity + "</li>");
      li.addClass("historyList card-body card");
      citiesList.prepend(li);
  }
  }



});