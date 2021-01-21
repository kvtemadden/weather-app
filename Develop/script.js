$( document ).ready(function() {
var apiKey = "a99afdbd6713ff21bf81cee54d0392e4";
var queryURL = "https://api.openweathermap.org/data/2.5/forecast?appid=" + apiKey;
var cityName;
var humidityToday;
var windToday;
var celsiusToday;
var dateToday;



  function weatherSearch() {
    var city = $("#city-search");
    queryURL = queryURL + "&q=" + city.val() + ",GB";
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
        
        cityName = response.city.name;
        todaysInfo(response);
        todaysContent(response);
        logs(response);
        resetURL();

      });
  }

  $("#search").on("click", function(event){
    event.preventDefault();
    weatherSearch();
    showPageContent();

  });

  function todaysInfo(response) {
    humidityToday = (response.list[0].main.humidity) + "%";
    windToday = (response.list[0].wind.speed) + " MPH";
    celsiusToday = (response.list[0].main.temp - 273.15).toFixed(2) + "°C";
    //reformatting date as UK structure instead of US
    dateTimeToday =  (response.list[0].dt_txt);
    dateTodayUSArray = dateTimeToday.split(" ");
    dateTodayUS = dateTodayUSArray[0];
    dateTodayArray = dateTodayUS.split("-");
    dateToday = dateTodayArray[2] + "/" + dateTodayArray[1] + "/" + dateTodayArray[0];
    iconToday = "http://openweathermap.org/img/w/" + response.list[0].weather[0].icon + ".png";
  }

  function todaysContent(response) {
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

  function logs(response) {
    console.log(queryURL);
    console.log(response);
    console.log(cityName);
    console.log(celsiusToday);
    console.log(windToday);
    console.log(humidityToday);
    console.log(dateToday);
  }

  function showPageContent() {
    var hidden = $(".hide");
    hidden.addClass("show");
    hidden.removeClass("hide");
    var instructions = $("#how-to-use");
    instructions.removeClass("show");
    instructions.addClass("hide");

  }


});