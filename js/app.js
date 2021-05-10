var gpsPermission = sessionStorage.getItem("gpsPermission");
console.log(gpsPermission);

//set the default location
localStorage.setItem("defaultLatitude", 22.28552);
localStorage.setItem("defaultLongitude", 114.15769);
var userLocation = { 
    lat: parseFloat(localStorage.getItem("defaultLatitude")), 
    lng: parseFloat(localStorage.getItem("defaultLongitude")) 
};
var Weekarray =[];
var Maxarray =[];
var Minarray =[];
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

        retrieveWeather();
        retrieveForecast();
        retrieveSituation();
        ChangeBackground();
        setInterval(function(){        
            retrieveWeather();    }, 5000);
        setTimeout(function(){showChart();},1000);
       
        
        if(gpsPermission == 'undefined'){
            sessionStorage.setItem('gpsPermission', null);
        }
        if(gpsPermission == 'true'){
            console.log("GPS granted, no need to ask permission");
            userLocation = { 
                lat: parseFloat(localStorage.getItem("latitude")), 
                lng: parseFloat(localStorage.getItem("longitude")) 
            };
            //Update once
            updateLocation();
            // Update location periodly
            setInterval(updateLocation, 50000);
        }else if(gpsPermission == 'false'){
            console.log("GPS denied");
            userLocation = { 
                lat: parseFloat(localStorage.getItem("latitude")), 
                lng: parseFloat(localStorage.getItem("longitude")) 
            };
            //Update once
            updateLocation();
        }else{
            TestGeo(); 
        }     
}

// Get the video
var video = document.getElementById("weatherback");


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

function ChangeBackground(){
    var weatherback = document.getElementById("weatherback");
    var weathericon = parseInt(localStorage.getItem("nowIcon"));
    var SunnyDay =[50,51,52,53,54];
    var RainDay =[60,61,62,63,64,65];
    var Night=[70,71,72,73,74,75,76,77];
    for (i=0;i<SunnyDay.length;i++){
        if (weathericon==SunnyDay[i]){
            weatherback.src = "source/Good.mp4";
        }
    }
    for (i=0;i<RainDay.length;i++){
        if (weathericon==RainDay[i]){
            weatherback.src = "source/Rain.mp4";
        }
    }
    for (i=0;i<Night.length;i++){
        if (weathericon==Night[i]){
            weatherback.src = "source/GoodNight.mp4"; //有片再轉番
        }
    }
}
function retrieveWeather() {
    console.log("Retrieving temperature ");
    const xhr = new XMLHttpRequest();
    const url = "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread";

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var temperature = JSON.parse(xhr.response).temperature;
            var rainfall = JSON.parse(xhr.response).rainfall;
            var uvindex = JSON.parse(xhr.response).uvindex;
            var todayIcon = JSON.parse(xhr.response).icon;

            displayToday(todayIcon,temperature,rainfall,uvindex);

            const localStorage = window.localStorage;
            if (localStorage) {
                localStorage.setItem("temperature", JSON.stringify(temperature));
                localStorage.setItem("icon", JSON.stringify(TodayIcon));
                localStorage.setItem("rainfall", JSON.stringify(rainfall));
                localStorage.setItem("uvindex", JSON.stringify(uvindex));
            }
        }
    };

    xhr.open("get", url);
    xhr.send();
}


function retrieveForecast() {
    const xhr = new XMLHttpRequest();
    const url = "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd";

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
function whereNear(data){
    
    try{
        var minimum = 1;
        var stationId;
       if (localStorage.getItem("latitude")!= null & localStorage.getItem("longitude")!= null){
            latitudeOfUser = localStorage.getItem("latitude")
            longitudeOfUser = localStorage.getItem("longitude")
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
        return ( data.data[stationId].value );
    }
    catch(err){
        console.log(err);
    }
    
}

//Display the weather of today
function displayToday(todayIcon,temperature,rainfall,uvindex){
    document.getElementById("TodayIcon").src="https://www.hko.gov.hk/images/HKOWxIconOutline/pic"+todayIcon+".png";
    document.getElementById("TodayTemp").innerHTML=whereNear(temperature)+ "°C";
    
    setTimeout(function(){
    console.log("Getting rainfall");
    if(whereNear(rainfall) == undefined){
        document.getElementById("rainfall").innerHTML="Rainfall: 0mm";
    }else{
        document.getElementById("rainfall").innerHTML="Rainfall: " + whereNear(rainfall) + "mm";
    }
    console.log("Rainfall displayed");

    
        console.log("Getting uv index");
            if(whereNear(uvindex) == undefined){
                document.getElementById("uvindex").innerHTML="UV index: 0";
            }else{
                document.getElementById("uvindex").innerHTML="UVindex: " + whereNear(uvindex);
            }
            console.log("UV index displayed");
    },1000);
    
    
}

//Display the future days weather forecast
function displayForecast(forecast) {
    document.getElementById("forecastIcon").innerHTML="";
    document.getElementById("forecastDate").innerHTML="";
    document.getElementById("forecastWeek").innerHTML="";
    document.getElementById("forecastMaxTemp").innerHTML="";
    document.getElementById("forecastMinTemp").innerHTML="";
    Weekarray=[];
    for (i=0;i<7;i++){addRowForecast(forecast[i]);}
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
        var week='';
    switch (forecast.week){
        case 'Monday':
            week = "Mon";
            break;
        case 'Tuesday':
            week = "Tue";
            break;
        case 'Wednesday':
            week = "Wed";
            break;  
        case 'Thursday':
            week = "Thur";
            break; 
        case 'Friday':
            week = "Fri";
            break;
        case 'Saturday':
            week = "Sat";
            break;
        case 'Sunday':
            week = "Sun";
            break;
    }
    Weekrow.innerHTML =week;
    Weekarray.push(week);

    var forecastMaxTemp = document.getElementById("forecastMaxTemp"); //highest temp
    var MaxTemprow = forecastMaxTemp.insertCell();
    MaxTemprow.setAttribute('data-label', "maxtemp");
    MaxTemprow.innerHTML = forecast.forecastMaxtemp.value+"°C";

    var forecastMinTemp = document.getElementById("forecastMinTemp"); //lowest temp
    var MinTemprow = forecastMinTemp.insertCell();
    MinTemprow.setAttribute('data-label', "mintemp");
    MinTemprow.innerHTML = forecast.forecastMintemp.value+"°C";
    GetMaxAndMin(forecast.forecastMaxtemp.value,forecast.forecastMintemp.value);
    
}

    function GetMaxAndMin(Max,Min){   //the highest and lowest temperature for each day
        Maxarray.push(Max);
        Minarray.push(Min);
    }


//function that check if the brower support geolocation
//if yes, then call the function getLocation
//if no, then call the function positionError
function TestGeo(){
    console.log("Test GPS service");
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
    console.log(position);
    //get the latitude and longitude
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    //save the current location for offline use
    localStorage.setItem("latitude", latitude);
    localStorage.setItem("longitude", longitude);
    console.log(latitude);
    console.log(longitude);
    sessionStorage.setItem("gpsPermission", true);
    console.log("GPS premitted");
    
    //Update once
    updateLocation();
    // Update location periodly
    setInterval(updateLocation, 50000);
    
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
    sessionStorage.setItem("gpsPermission", false);
    console.log("GPS permission denied");
    var permission = sessionStorage.getItem("gpsPermission");
    console.log(permission);
    if(permission == 'false' && 
        (localStorage.getItem("latitude") != null && 
            localStorage.getItem("longitude") != null)){
        console.log("Permission denied, last found location found, using last found location");
        const latlng = { 
            lat: parseFloat(localStorage.getItem("latitude")), 
            lng: parseFloat(localStorage.getItem("longitude")) 
        };
        geoCoding(latlng);
    }else if(permission == 'false' && 
        (localStorage.getItem("latitude") == null && 
            localStorage.getItem("longitude") == null)){
        console.log("Permission denied, last found location not found, using default location");
        const latlng = { 
            lat: parseFloat(localStorage.getItem("defaultLatitude")), 
            lng: parseFloat(localStorage.getItem("defaultLongitude")) 
        };
        geoCoding(latlng);
    } 
}

function geoCoding(latlng){
    console.log(latlng);
    const geocoder = new google.maps.Geocoder();
    var display = document.getElementById("location");
    geocoder.geocode({ location: latlng }, (results, status) => {
    if (status === "OK") {
        if (results[0]) {
            console.log("Displaying location");
            var address = results[0].formatted_address.split(",");
            console.log(address);
            var area = address[address.length-2];
            console.log(area);
            display.innerHTML = area;
        }else {
            window.alert("No results found");
            }
     }else {
          window.alert("Geocoder failed due to: " + status);
        }
    });
}

function updateLocation(){
    var permission = sessionStorage.getItem("gpsPermission");
        if(permission == true || 
        (localStorage.getItem("latitude") != null && 
            localStorage.getItem("longitude") != null)){
            console.log("Permission granted, using current location");
            const latlng = { 
                lat: parseFloat(localStorage.getItem("latitude")), 
                lng: parseFloat(localStorage.getItem("longitude")) 
            };
            geoCoding(latlng);
        }
}
function showChart(){
  var xValues = Weekarray;
  var yValues = Maxarray;
  var yValues2 = Minarray;

 

  new Chart(document.getElementById("line-chart"), {
  type: "line",
  data: {
    labels: xValues,
    datasets: [{
      fill: false,
      lineTension: 0,
      backgroundColor: "rgba(255,255,255,1.0)",
      borderColor: "rgba(255,255,255,0.8)",
      borderWidth: 1,
      data: yValues
    },{
      fill: false,
      lineTension: 0,
      backgroundColor: "rgba(255,255,255,1.0)",
      borderColor: "rgba(255,255,255,0.8)",
      borderWidth: 1,
      data: yValues2
    }]
  },
  options: {
    legend: {display: false},
    scales: {
      yAxes: [{
        ticks: {
          min: 10, max:36,
             stepSize: 2,
    fontColor: 'white'
        }
      }],

      xAxes: [{
          ticks: {
              fontColor: 'white'
          },
      }]

    }
  }
});
}
function sunTime(){

  var today = new moment();
  // console.log(today);
  console.log(today.format());
  var todayYear = today.format("YYYY");
  var todayMonth = today.format("MM");
  var todayDay = today.format("DD");
  $.get(`https://data.weather.gov.hk/weatherAPI/opendata/opendata.php?dataType=SRS&lang=tc&rformat=json&year=${todayYear}&month=${todayMonth}&day=${todayDay}`,function(srsdata){
  console.log(srsdata);
  // console.log(srsdata.data[0][1])
  document.getElementById("todaySunriseTime").innerHTML = srsdata.data[0][1];
  document.getElementById("todaySunsetTime").innerHTML = srsdata.data[0][3];
},'json');

  var displayToday = today.format('LLLL');
  console.log(displayToday);
  document.getElementById("indexDisplayToday").innerHTML = displayToday;
// function displaySRS(srsdata){
//    document.getElementById("todaySunriseTime").innerHTML = srsdata.data[0][1];
// }


}
