function initialize() {

        retrieveTemperature();
        retrieveForecast();
        retrieveSituation();
        var weatherback = getElementById("weather");
        
        var weathericon = JSON.parse(xhr.response).icon;
        
        if (weathericon = 50){
          {weatherback.style = "06_1596083776.mp4"}//if (time is within 0800to 1000)
        else if (weathericon = 63){weatherback.style = "Rain - 28236.mp4"}
        //else if (weathericon = 50){weatherback.style =}
        //
}


function retrieveTemperature() {
    const xhr = new XMLHttpRequest();
    const url = "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread";

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var temperature = JSON.parse(xhr.response).temperature;
 
            var todayIcon= JSON.parse(xhr.response).icon;
            displayToday(todayIcon,temperature);


            const localStorage = window.localStorage;
            if (localStorage) {
                localStorage.setItem("temperature", JSON.stringify(temperature));
                localStorage.setItem("icon", JSON.stringify(TodayIcon));
            }
        }
    };

    xhr.open("get", url);
    xhr.send();
}


function retrieveForecast() {
    const xhr = new XMLHttpRequest();
    const url = "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=tc";

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var forecast = JSON.parse(xhr.response).weatherForecast;
            displayForecast(forecast);

  
            const localStorage = window.localStorage;
            if (localStorage) {
                localStorage.setItem("forecast", JSON.stringify(forecast));
            }
        }
    };

    xhr.open("get", url);
    xhr.send();
}

function retrieveSituation() {
    const xhr = new XMLHttpRequest();
    const url = "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=flw&lang=tc";

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var situation= JSON.parse(xhr.response).generalSituation;
            var forecastPeriod= JSON.parse(xhr.response).forecastPeriod;
            var forecastDesc= JSON.parse(xhr.response).forecastDesc;
            var outlook= JSON.parse(xhr.response).outlook;
            displayText(situation,forecastPeriod,forecastDesc,outlook);

  
            const localStorage = window.localStorage;
            if (localStorage) {
                localStorage.setItem("situation", JSON.stringify(situation));
                localStorage.setItem("forecastPeriod", JSON.stringify(forecastPeriod));
                localStorage.setItem("forecastDesc", JSON.stringify(forecastDesc));
                localStorage.setItem("outlook", JSON.stringify(outlook));
            }
        }
    };

    xhr.open("get", url);
    xhr.send();
}

function displayToday(todayIcon,temperature){
    
    document.getElementById("TodayIcon").src="https://www.hko.gov.hk/images/HKOWxIconOutline/pic"+todayIcon+".png";
    for (i=0;i<temperature.data.length;i++){
        if (temperature.data[i].place==document.getElementById("places").value){
            document.getElementById("TodayTemp").innerHTML=temperature.data[i].place +" "+ temperature.data[i].value + "°C";
        }
    }
}

function displayForecast(forecast) {
    forecast.forEach(addRowForecast);
}

function displayText(situation,forecastPeriod,forecastDesc,outlook) {
    document.getElementById("WeatherSituation").innerHTML=situation+"</br>"+forecastPeriod+"</br>"+forecastDesc+"</br>"+outlook;
}



function addRowForecast(forecast) {
    var forecastIcon = document.getElementById("forecastIcon");
    var Iconrow = forecastIcon.insertCell();
    var Iconurl = "https://www.hko.gov.hk/images/HKOWxIconOutline/pic"+forecast.ForecastIcon+".png"
    Iconrow.setAttribute('data-label', "icon");
    Iconrow.innerHTML = "<img src= "+Iconurl+" width=\"50\" height=\"50\">";

    var forecastDate = document.getElementById("forecastDate");
    var Daterow = forecastDate.insertCell();
    Daterow.setAttribute('data-label', "date");
    Daterow.innerHTML = forecast.forecastDate.substring(4, 6)+"/"+forecast.forecastDate.substring(6, 8);

    var forecastWeek = document.getElementById("forecastWeek");
    var Weekrow = forecastWeek.insertCell();
    Weekrow.setAttribute('data-label', "week");
    Weekrow.innerHTML = forecast.week;

    var forecastTemp = document.getElementById("forecastTemp");
    var Temprow = forecastTemp.insertCell();
    Temprow.setAttribute('data-label', "temp");
    Temprow.innerHTML = forecast.forecastMaxtemp.value+"°C";

}
