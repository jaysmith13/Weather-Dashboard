
var apiKey= "bea8d6bef63753c6c41771aac5c552ff";
var savedSearch = [];
var lastCity = "";
var currentCity = "";


var PreviouslySearchedCity = function(cityName) {
    $('.previously-search:contains("' + cityName + '")').remove();

    
    var PreviouslySearchedCityEntry = $("<p>");
   PreviouslySearchedCityEntry.addClass("previous-search");
    PreviouslySearchedCityEntry.text(cityName);
 
    searchInputContainer.append(searchHistoryEntry);
    var searchHistoryContainerEl = $("#search-history-container");
    searchHistoryContainerEl.append(searchInputContainer);

    var searchInputContainer = $("<div>");
    searchInputContainer.addClass("past-search-container");

    if (savedSearches.length > 0){
 
    var previousSavedSearches = localStorage.getItem("savedSearches");
        savedSearches = JSON.parse(previousSavedSearches);
    }

  
    savedSearches.push(cityName);
    localStorage.setItem("savedSearches", JSON.stringify(savedSearches));

    $("#search-input").val("");

};

// load saved search history entries into search history container
var RetrieveSearchHistory = function() {
    // get saved search history
    var RetrieveSearchHistory = localStorage.getItem("RetrieveSearches");

    // return false if there is no previous saved searches
    if (!RetrieveSearchHistory) {
        return false;
    }

    // turn saved search history string into array
  RetreieveSearchHistory = JSON.parse(RetrieveSearchHistory);

    // go through savedSearchHistory array and make entry for each item in the list
    for (var i = 0; i < RetrieveSearchHistory.length; i++) {
        searchHistoryList(RetrieveSearchHistory[i]);
    }
};

var currentWeatherSection = function(cityName) {
   
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
        // get response and turn it into objects
        .then(function(response) {
            return response.json();
        })
.then(function(response) {
    var cityLat = response.coord.lat;
    var cityLon = response.coord.lon;
            

            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`)
.then(function(response) {
    return response.json();
        })
                
.then(function(response){
     searchHistoryList(cityName);
var currentTitle = $("#current-title");
var currentDay = moment().format("M/D/YYYY");
currentTitle.text(`${cityName} (${currentDay})`);
 var currentIcon = $("#current-weather-icon");
currentIcon.addClass("current-weather-icon");
var currentIconCode = response.current.weather[0].icon;
 currentIcon.attr("src", `https://openweathermap.org/img/wn/${currentIconCode}@2x.png`);
 var currentWeatherContainer = $("#current-weather-container");
 currentWeatherContainer.addClass("current-weather-container");
              
var currentHumidity = $("#current-humidity");
currentHumidity.text("Humidity: " + response.current.humidity + "%");

                    
var currentTemperature = $("#current-temperature");
currentTemperature.text("Temperature: " + response.current.temp + " \u00B0F");

                    
 var currentUvIndex = $("#current-uv-index");
currentUvIndex.text("UV Index: ");
var currentNumber = $("#current-number");
currentNumber.text(response.current.uvi);

var currentWindSpeed = $("#current-wind-speed");
currentWindSpeed.text("Wind Speed: " + response.current.wind_speed + " MPH");

if (response.current.uvi <= 2) {
 currentNumber.addClass("uv-index-favorable");
} else if (response.current.uvi >= 3 && response.current.uvi <= 7) {
                        currentNumber.addClass("uv-index-moderate");
                    } else {
                        currentNumber.addClass("uv-index-severe");
                    }
                })
        })
        .catch(function(err) {
            $("#search-input").val("");
            alert("Please enter or input a valid city search.");
        });
};



// called when the search form is submitted
$("#search-form").on("submit", function() {
    event.preventDefault();
    var cityName = $("#search-input").val();

    if (cityName === "" || cityName == null) {
      
        alert("Please enter name of city.");
        event.preventDefault();
    } else {
        currentWeatherSection(cityName);
        fiveDayForecastSection(cityName);
    }
});

var fiveDayForecastSection = function(cityName) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
        
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            
            var cityLon = response.coord.lon;
            var cityLat = response.coord.lat;

            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`)
                
                .then(function(response) {
                    return response.json();
                })
                .then(function(response) {
                    console.log(response);

                    
                    var futureForecastTitle = $("#future-forecast-title");
                    futureForecastTitle.text("5-Day Forecast:")

                    
                    for (var i = 1; i <= 5; i++) {
                        
                        var futureCard = $(".future-card");
                        futureCard.addClass("future-card-details");

                       
                        var futureDate = $("#future-date-" + i);
                        date = moment().add(i, "d").format("M/D/YYYY");
                        futureDate.text(date);

                        
                        var futureIcon = $("#future-icon-" + i);
                        futureIcon.addClass("future-icon");
                        var futureIconCode = response.daily[i].weather[0].icon;
                        futureIcon.attr("src", `https://openweathermap.org/img/wn/${futureIconCode}@2x.png`);

                        
                        var futureTemp = $("#future-temp-" + i);
                        futureTemp.text("Temp: " + response.daily[i].temp.day + " \u00B0F");

                        
                        var futureHumidity = $("#future-humidity-" + i);
                        futureHumidity.text("Humidity: " + response.daily[i].humidity + "%");
                    }
                })
        })
};


$("#search-input-container").on("click", "p", function() {
   
    var PastCityName = $(this).text();
    currentWeatherSection(PastCityName);
    fiveDayForecastSection(PastCityName);

    //
    var PastCityClicked = $(this);
    PastCityClicked.remove();
});

RetrieveSearchHistory();