$(document).ready(function () {
//  All information used globally across script document
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
    var city = $("#city-search"); // getting search form
    queryURL = queryURL + "&q=" + city.val() + ",GB"; // building search url
    $.ajax({ //getting info from api via ajax
      url: queryURL,
      method: "GET"
    }).then(function (response) {
      latitude = response.city.coord.lat; 
      longitude = response.city.coord.lon;
      cityName = response.city.name;
      // running relevant functions
      uvIndex(response); 
      todaysInfo(response);
      todaysContent(response);
      console.log(response); //logging api info
      // getting information for all of the days
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
        // getting relevant 5 day forecast html
        var mainTitle = $("#day" + i);
        var tempDayInfo = $("#day" + i + "-t");
        var humidityDayInfo = $("#day" + i + "-h");
        var iconDayInfo = $("#day" + i + "-img");
        // setting the weather info for the page
        mainTitle.text(dateOther);
        tempDayInfo.text(celsiusOther);
        humidityDayInfo.text(humidityOther);
        iconDayInfo.attr("src", iconOther);
        console.log("no crash");
      }
      // resetting days for next use
      x = 0;

      // resetting url for api call
      resetURL();

    });
  }

  // setting info for uv index
  function uvIndex() {
    // building api info from last api call
    var UVqueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&appid=a99afdbd6713ff21bf81cee54d0392e4";

    $.ajax({ // api call
      url: UVqueryURL,
      method: "GET"
    }).then(function (uvResponse) {
      // getting uvi info and appending it to page
      var uvInd = uvResponse.current.uvi;
      var uvInfo = $("#uv");
      uvInfo.text(uvInd);
      
      // setting relevant colour depending on the extremity of uv index
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

  // on click of search button
  $("#search").click(function (event) {
    // prevent default action
    event.preventDefault();
    // run these functions
    weatherSearch();
    showPageContent();
    saveSearch();
    clearSearchField();
  });

function clearSearchField() {
  //clears the search field
  $("#city-search").val("");
}

// on click of search history item...
$(document).on("click", "li", function (event) {
  // run these functions
    event.preventDefault();
    clearSearchField();
    clickedLi = $(this).text(); // gets text from list item
    clickedSearchHistory();
    showPageContent();
  });

  function clickedSearchHistory() {
    queryURL = queryURL + "&q=" + clickedLi + ",GB"; // builds api url
    $.ajax({ // api call
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

        for (var j = 0; j > searchedCities.length; j++) {
          debugger;
        if (j == searchedCities[j]) {
          searchedCities.splice(j);
        }
        }

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
    // gets info for today
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
    // sets text for above info
    mainInfo.text(cityName + " " + dateToday);
    tempInfo.text(celsiusToday);
    windInfo.text(windToday);
    humidityInfo.text(humidityToday);
    iconInfo.attr("src", iconToday);


  }

  function resetURL() {
    // resets url
    queryURL = "https://api.openweathermap.org/data/2.5/forecast?appid=" + apiKey;
  }

  // gets instructions
  var instructions = $("#how-to-use");

  function showPageContent() {
    // hides the instructions and shows the weather information
    if (instructions.hasClass("show") == true) {
      var hidden = $(".hide");
      hidden.addClass("show");
      hidden.removeClass("hide");
      instructions.removeClass("show");
      instructions.addClass("hide");
    }
  }

  function saveSearch() {
    var cityName = $("#city-search").val(); //gets user input

    for (var j = 0; j < searchedCities.length; j++) {
    if (cityName == searchedCities[j]) {
      searchedCities.splice(j, 1);
    }
    }

    if (searchedCities.length == 7) { 
      searchedCities.shift(); // maintains length of history to 7 options
    }
    
    searchedCities.push(cityName); //adds newest search to array

    searchHistory = { // sets new object
      city: searchedCities,
    }

    // sets to local storage
    var searchString = JSON.stringify(searchHistory);
      JSON.parse(searchString);
      localStorage.setItem("searchHistory", searchString);
      renderCities();
  }

  function prevSession() {
    var ls = localStorage.getItem("searchHistory"); //sets variable that gets info from local storage
    if (ls) { // if previous search exists...
      searchHistory = JSON.parse(ls); //makes info usable
      for (var i = 0; i < searchHistory.city.length; i++) { // for all info in local storage...
        var current = searchHistory.city[i];
        var savedLi = $("<li>" + current + "</li>"); // sets list item
        if (searchedCities.length == 7) { // maintains history to 7
          searchedCities.shift();
        }
        searchedCities.push(current); // updates new session string
        savedLi.addClass("historyList card-body card"); // adds class to make list appear as buttons
        citiesList.prepend(savedLi); // adds to the top
    }
    }
  }

  function renderCities() {
    
    citiesList.empty(); // resets to prevent duplicates

    for (var newCity = 0; newCity < searchedCities.length; newCity++) {
      var indvCity = searchedCities[newCity];

      var li = $("<li>" + indvCity + "</li>"); // sets list item
      li.addClass("historyList card-body card"); // adds class to make list appears as buttons
      citiesList.prepend(li); // adds to top of list
  }
  }



});