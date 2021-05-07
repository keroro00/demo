var gpsPermission = null;

//set the default location
localStorage.setItem("defaultLatitude", 22.28552);
localStorage.setItem("defaultLongitude", 114.15769);
const userLocation = { 
    lat: parseFloat(localStorage.getItem("defaultLatitude")), 
    lng: parseFloat(localStorage.getItem("defaultLongitude")) 
};


var latitudeOfStation = [];
latitudeOfStation[0]= 22.31194; //King's Park
latitudeOfStation[1]= 22.30194; //Hong Kong Observatory
latitudeOfStation[2]= 22.24778; //Wong Chuk Hang
latitudeOfStation[3]= 22.52861; //Ta Kwu Ling
latitudeOfStation[4]= 22.46889; //Lau Fau Shan
latitudeOfStation[5]= 22.44611; //Tai Po
latitudeOfStation[6]= 22.4025; //Sha Tin
latitudeOfStation[7]= 22.38583; //Tuen Mun
latitudeOfStation[8]= 22.37556; //Sai Kung
latitudeOfStation[9]= 22.20111; //Cheung Chau
latitudeOfStation[10]= 22.31667; //CHek Lap Kok
latitudeOfStation[11]= 22.34417; // Tsing Yi
latitudeOfStation[12]= 22.43611; //Shek Kong
latitudeOfStation[13]= 22.38361; //Tsuen Wan Ho Koon
latitudeOfStation[14]= 22.37556; //Tsuen Wan Shing Mun Valley
latitudeOfStation[15]= 22.27833; //Hong Kong Park
latitudeOfStation[16]= 22.28167; //Shau Kei Wan
latitudeOfStation[17]= 22.33500; //Kowloon City
latitudeOfStation[18]= 22.27056; //Happy Valley
latitudeOfStation[19]= 22.33944; //Wong Tai Sin
latitudeOfStation[20]= 22.21417; //Stanley
latitudeOfStation[21]= 22.31861; //Kwun Tong
latitudeOfStation[22]= 22.33583; //Sham Shui Po
latitudeOfStation[23]= 22.30472; // Kai Tak Runway Park
latitudeOfStation[24]= 22.44083; //Yuen Long Park
latitudeOfStation[25]= 22.47528; //Tai Mei Tuk 

var longitudeOfStation = [];
longitudeOfStation[0]= 114.17278;
longitudeOfStation[1]= 114.17417;
longitudeOfStation[2]= 114.17361;
longitudeOfStation[3]= 114.15667;
longitudeOfStation[4]= 113.98361;
longitudeOfStation[5]= 114.17889;
longitudeOfStation[6]= 114.21;
longitudeOfStation[7]= 113.96417;
longitudeOfStation[8]= 114.27444;
longitudeOfStation[9]= 114.02667;
longitudeOfStation[10]= 113.91667;
longitudeOfStation[11]= 114.11;
longitudeOfStation[12]= 114.08472;
longitudeOfStation[13]= 114.10778;
longitudeOfStation[14]= 114.12667;
longitudeOfStation[15]= 114.16222;
longitudeOfStation[16]= 114.23611;
longitudeOfStation[17]= 114.18472;
longitudeOfStation[18]= 114.18361;
longitudeOfStation[19]= 114.20528;
longitudeOfStation[20]= 114.21861;
longitudeOfStation[21]= 114.22472;
longitudeOfStation[22]= 114.13694;
longitudeOfStation[23]= 114.21694;
longitudeOfStation[24]= 114.01833;
longitudeOfStation[25]= 114.2375;

function initialize() {

        retrieveTemperature();
        retrieveForecast();
        retrieveSituation();
        setInterval(function(){        
            retrieveTemperature();    }, 5000);
      //var weatherback = getElementById("weather");  grab the background
        //getElementById("weather").style = 
        //if (weather= sunny){
        //  if (time is within 0800to 1000){weatherback.style =} Set the background
        //wlse if (weather= cloudy){weatherback.style =}
        //else if (weather=  rainy){weatherback.style =}
        //
        /*  var weatherback = getElementById("weather");
        
        var weathericon = JSON.parse(xhr.response).icon;
        
        if (weathericon = 50){
          {weatherback.style = "06_1596083776.mp4"}//if (time is within 0800to 1000)
        else if (weathericon = 63){weatherback.style = "Rain - 28236.mp4"}*/
        //else if (weathericon = 50){weatherback.style =}
        //

        TestGeo();
}
// Get the video
var video = document.getElementById("myVideo");

// Get the button
var btn = document.getElementById("myBtn");

// Pause and play the video, and change the button text
function myFunction() {
  if (video.paused) {
    video.play();
    btn.innerHTML = "Pause";
  } else {
    video.pause();
    btn.innerHTML = "Play";
  }
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

//Calculate Which station is near to user and show the temperature of it
function whereNear(temperature){
    var minimum = 1;
    var stationId;
   if (sessionStorage.getItem("latitude")!= null & sessionStorage.getItem("longitude")!= null){
        latitudeOfUser = sessionStorage.getItem("latitude")
        longitudeOfUser = sessionStorage.getItem("longitude")
    }
    else{
        latitudeOfUser = localStorage.getItem("defaultLatitude");
        longitudeOfUser = localStorage.getItem("defaultLongitude");
    }
    for (i=0;i<9;i++){
        x = latitudeOfStation[i]-latitudeOfUser;
        y = longitudeOfStation[i]-longitudeOfUser;
        var Distance = Math.sqrt((x*x)+(y*y));
        if (Distance < minimum){
            minimum = Distance;
            stationId = i;
        }
    }
    return (temperature.data[stationId].place +" "+ temperature.data[stationId].value + "°C");
}

//Display the weather of today
function displayToday(todayIcon,temperature){
    document.getElementById("TodayIcon").src="https://www.hko.gov.hk/images/HKOWxIconOutline/pic"+todayIcon+".png";
    document.getElementById("TodayTemp").innerHTML=whereNear(temperature);
}

//Display the future days weather forecast
function displayForecast(forecast) {
    document.getElementById("forecastIcon").innerHTML="";
    document.getElementById("forecastDate").innerHTML="";
    document.getElementById("forecastWeek").innerHTML="";
    document.getElementById("forecastTemp").innerHTML="";
    forecast.forEach(addRowForecast);
}

//useless now , can del it later
function displayText(situation,forecastPeriod,forecastDesc,outlook) {
    document.getElementById("WeatherSituation").innerHTML=situation+"</br>"+forecastPeriod+"</br>"+forecastDesc+"</br>"+outlook;
}


//Add the forecast in a row
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


//function that check if the brower support geolocation
//if yes, then call the function getLocation
//if no, then call the function positionError
function TestGeo(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(getLocation, positionError, {
            maximumAge: 30000, 
            timeout: 10000, 
            enableHighAccuracy: true});}
    else{
        alert("Sorry, but it looks like your browser does not support geolocation.");
    }
}

//function that get the current location
function getLocation(position) {
    //get the latitude and longitude
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    //save the current location for offline use
    sessionStorage.setItem("latitude", latitude);
    sessionStorage.setItem("longitude", longitude);
    console.log(latitude);
    console.log(longitude);
    gpsPermission = true;
    console.log("GPS premitted");
    
    //Update location once
    displayLocation();
    
    // Update location every 5 mins
    setInterval(function(){
        if(gpsPermission == true || 
        (sessionStorage.getItem("latitude") != null && 
            sessionStorage.getItem("longitude") != null)){
            console.log("Permission granted, using current location");
            const latlng = { 
                lat: parseFloat(sessionStorage.getItem("latitude")), 
                lng: parseFloat(sessionStorage.getItem("longitude")) 
            };
            geoCoding(latlng);
        }else if(gpsPermission == false){
            console.log("No permission, using default location");
            const latlng = { 
                lat: parseFloat(localStorage.getItem("defaultLatitude")), 
                lng: parseFloat(localStorage.getItem("defaultLongitude")) 
            };
            geoCoding(latlng);
        }
    }, 5000);
    
}

//function that display any error inculde permission denied error
//then the function will initialize the map with the last known/selected location
function positionError( error ) { 

    switch ( error.code ) { 
        case error.PERMISSION_DENIED:                   
            console.error( "User denied the request for Geolocation." ); 
            break; 

        case error.POSITION_UNAVAILABLE:        
            console.error( "Location information is unavailable." ); 
            break; 

        case error.TIMEOUT:         
            console.error( "The request to get user location timed out." ); 
            break; 

        case error.UNKNOWN_ERROR: 
            console.error( "An unknown error occurred." ); 
            break; 
    }
    gpsPermission = false;
    console.log("GPS permission denied");
    displayLocation();  
}

//function for coding the geolocation from the marker's latitude and longitude
function displayLocation(){
    if(gpsPermission == true && 
        (sessionStorage.getItem("latitude") != null && 
            sessionStorage.getItem("longitude") != null)){
        console.log("Permission granted, using current location");
        const latlng = { 
            lat: parseFloat(sessionStorage.getItem("latitude")), 
            lng: parseFloat(sessionStorage.getItem("longitude")) 
        };
        geoCoding(latlng);
    }else if(gpsPermission == false && 
        (sessionStorage.getItem("latitude") != null && 
            sessionStorage.getItem("longitude") != null)){
        console.log("Permission denied, last found location found, using last found location");
        const latlng = { 
            lat: parseFloat(sessionStorage.getItem("latitude")), 
            lng: parseFloat(sessionStorage.getItem("longitude")) 
        };
        geoCoding(latlng);
    }else if(gpsPermission == false && 
        (sessionStorage.getItem("latitude") == null && 
            sessionStorage.getItem("longitude") == null)){
        console.log("Permission denied, last found location not found, using default location");
        const latlng = { 
            lat: parseFloat(localStorage.getItem("defaultLatitude")), 
            lng: parseFloat(localStorage.getItem("defaultLongitude")) 
        };
        geoCoding(latlng);
    }
    
}

function geoCoding(latlng){
    const geocoder = new google.maps.Geocoder();
    var display = document.getElementById("address");

    geocoder.geocode({ location: latlng }, (results, status) => {
    if (status === "OK") {
        if (results[0]) {
            console.log("Displaying location");

            console.log(area);
            var address = results[0].formatted_address.split(",");
            var area = address[1];
            display.innerHTML = area;
        }else {
            window.alert("No results found");
            }
     }else {
          window.alert("Geocoder failed due to: " + status);
        }
    });
}
