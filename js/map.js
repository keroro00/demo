window.alert = function() { };
var gpsPermission =  sessionStorage.getItem("gpsPermission");
var gettingData = false;
var openWeatherMapKey = "aa50e1fbb29f1400fe5d6a121453eda5";
var geoJSON;
var map;
var marker;
var request;
var defaultLocation;
var ChangeChance=0;
var userLocation = { 
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

function initPage(){
	initMap();
	if(gpsPermission == 'true'){
		console.log('GPS permitted');
		userLocation = { 
            lat: parseFloat(localStorage.getItem("latitude")), 
            lng: parseFloat(localStorage.getItem("longitude")) 
        };
        console.log(userLocation);
        updateLocation();
		setTimeout(updateLocation,300);
	}else if(gpsPermission == 'false' && 
        (localStorage.getItem("latitude") != null && 
            localStorage.getItem("longitude") != null)){
        console.log("Permission denied, last found location found, using last found location");
        userLocation = { 
            lat: parseFloat(localStorage.getItem("latitude")), 
            lng: parseFloat(localStorage.getItem("longitude")) 
        };
        defaultLocation = false;
        updateLocation();
        setTimeout(updateLocation,300);
    }else if(gpsPermission == 'false' && 
        (localStorage.getItem("latitude") == null && 
            localStorage.getItem("longitude") == null)){
        console.log("Permission denied, last found location not found, using default location");
        defaultLocation = true;
        setTimeout(updateLocation,300);
    }else {
    	console.log("Error");
    }
	
	retrieveWeather();
	
}

//function that initialize the google map component
function initMap(){
	console.log("initMap");
	console.log("User locaion: "+userLocation);

  	// The map, centered at latest location
  	map = new google.maps.Map(document.getElementById("map"),
    	{
      		zoom: 10,
      		position: new google.maps.LatLng(userLocation),
      		disableDefaultUI: true,
      		styles: [
			      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
			      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
			      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
			      {
			        featureType: "administrative.locality",
			        elementType: "labels.text.fill",
			        stylers: [{ color: "#d59563" }],
			      },
			      {
			        featureType: "poi",
			        elementType: "labels.text.fill",
			        stylers: [{ color: "#d59563" }],
			      },
			      {
			        featureType: "poi.park",
			        elementType: "geometry",
			        stylers: [{ color: "#263c3f" }],
			      },
			      {
			        featureType: "poi.park",
			        elementType: "labels.text.fill",
			        stylers: [{ color: "#6b9a76" }],
			      },
			      {
			        featureType: "road",
			        elementType: "geometry",
			        stylers: [{ color: "#38414e" }],
			      },
			      {
			        featureType: "road",
			        elementType: "geometry.stroke",
			        stylers: [{ color: "#212a37" }],
			      },
			      {
			        featureType: "road",
			        elementType: "labels.text.fill",
			        stylers: [{ color: "#9ca5b3" }],
			      },
			      {
			        featureType: "road.highway",
			        elementType: "geometry",
			        stylers: [{ color: "#746855" }],
			      },
			      {
			        featureType: "road.highway",
			        elementType: "geometry.stroke",
			        stylers: [{ color: "#1f2835" }],
			      },
			      {
			        featureType: "road.highway",
			        elementType: "labels.text.fill",
			        stylers: [{ color: "#f3d19c" }],
			      },
			      {
			        featureType: "transit",
			        elementType: "geometry",
			        stylers: [{ color: "#2f3948" }],
			      },
			      {
			        featureType: "transit.station",
			        elementType: "labels.text.fill",
			        stylers: [{ color: "#d59563" }],
			      },
			      {
			        featureType: "water",
			        elementType: "geometry",
			        stylers: [{ color: "#17263c" }],
			      },
			      {
			        featureType: "water",
			        elementType: "labels.text.fill",
			        stylers: [{ color: "#515c6d" }],
			      },
			      {
			        featureType: "water",
			        elementType: "labels.text.stroke",
			        stylers: [{ color: "#17263c" }],
			      },
			    ],
    	}
  	);
  	const locationButton = document.createElement("button");
	locationButton.textContent = "Pan to Current Location";
	locationButton.classList.add("custom-map-control-button");
	map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
	locationButton.addEventListener("click", function (){

			console.log("Getting permission");
			navigator.geolocation.getCurrentPosition(resetLocation, positionError, {
            maximumAge: 30000, 
            timeout: 10000, 
            enableHighAccuracy: true});
            sessionStorage.setItem("gpsPermission", true);
	        updateLocation();
	        retrieveWeather();
		
			
	});


  	//create marker, marked the latest location
  	marker = new google.maps.Marker({
		position: new google.maps.LatLng(userLocation),
		map: map,
		icon:'',
	});

  	//add the location selection feature to the google map components
  	google.maps.event.addListener(map, 'click', function(event) {
  		console.log("Map clicked");

  		//get the location latitude and longitude
	    var latLng = event.latLng;
	    var lat = latLng.lat();
	    var lng = latLng.lng();
		userLocation = { 
			lat: parseFloat(lat), 
			lng: parseFloat(lng) 
		};

	    
		//update components
		marker.setPosition(new google.maps.LatLng(userLocation));
		//map.setCenter(new google.maps.LatLng(userLocation));
		map.panTo(new google.maps.LatLng(userLocation));
		
		//update the latitude and longitude
	    localStorage.setItem("latitude", lat);
		localStorage.setItem("longitude", lng);

		//update the address
		geoCoding(userLocation);
		console.log("Address coded");

		
		//update the temprature 
		// e25acabc91c93589301dce74749a6ddd5da195be
		retrieveWeather();
	})

	//add interaction listeners to make weather requests
	google.maps.event.addListener(map, 'idle', checkIfDataRequested);
	
	console.log("Map inisalized");

}

function ChangeBackground(todayIcon){
    var weatherback = document.getElementById("weatherback");
    var weathericon = parseInt(todayIcon);
    var SunnyDay =[50,51,80,81,82,83,84,85,90,91,92,93];
    var CloudyDay = [52,60,61];
    var RainDay =[53,54,62,63,64,65];
    var Night=[70,71,72,73,74,75,76,77];
    for (i=0;i<SunnyDay.length;i++){
        if (weathericon==SunnyDay[i]){
            weatherback.src = "source/Sunny.mp4";
        }
    }
    for(i=0;i<CloudyDay.length;i++){
        if (weathericon==CloudyDay[i]){
            weatherback.src = "source/Cloudy.mp4";
        }
    }
    for (i=0;i<RainDay.length;i++){
        if (weathericon==RainDay[i]){
            weatherback.src = "source/Rain.mp4";
        }
    }
    for (i=0;i<Night.length;i++){
        if (weathericon==Night[i]){
            weatherback.src = "source/FineNight.mp4"; 
        }
    }
}

//function for coding the geolocation from the marker's latitude and longitude
function geoCoding(userLocation){
	const geocoder = new google.maps.Geocoder();
	var display = document.getElementById("address");
	
	geocoder.geocode({ location: userLocation }, (results, status) => {
    	if (status === "OK") {
    		if (results[0]) {
    			var address = results[0].formatted_address.split(",");
	            console.log(address);
	            for (var i = address.length - 1; i >= 0; i--) {
	            	if(address[i] == " Hong Kong" || address[i] == "Hong Kong"){
	            		address.splice(i,1);
	            	}
	            	
	            }
	            if(address.length == 0){
	            	display.innerHTML = 
    				"Selected location:" +
    				"<br>" + 
    				"Hong Kong";
	            }else{
	            	display.innerHTML = 
    				"Selected location:" +
    				"<br>" + 
    				address;
	            }
    			
    			
        }else {
        console.log("No results found");
        display.innerHTML ="<font color='red'>Not a valid location</font>";
    	}
    }
    else {
      console.log("Geocoder failed due to: " + status);
      if(status == 'OVER_QUERY_LIMIT'){
      		display.innerHTML ="<font color='red'>OVER_REQUEST_LIMIT</font>";
      }else{
      	display.innerHTML ="<font color='red'>Not a valid location</font>";
      }
      
	}
	});
}

function updateLocation(){
	console.log("updateLocation");
	console.log(gpsPermission);

	if(gpsPermission == 'true'){
		console.log("Using real time location");
	    marker.setPosition(new google.maps.LatLng(userLocation));

    }else if(gpsPermission == 'false' && defaultLocation == false){
    	console.log("Using last found location");
	    marker.setPosition(new google.maps.LatLng(userLocation));
    }
    else if(gpsPermission == 'false' && defaultLocation == true){
        userLocation = { 
            lat: parseFloat(localStorage.getItem("defaultLatitude")), 
            lng: parseFloat(localStorage.getItem("defaultLongitude")) 
        };
        console.log("Using default location");
        
        marker.setPosition(new google.maps.LatLng(userLocation));

	}	
	console.log(userLocation);
	map.setCenter(userLocation);

	//code the latest location
	geoCoding(userLocation);
	console.log("Address coded");
}

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
}


// Add the markers to the map
  var drawIcons = function (weather) {
     map.data.addGeoJson(geoJSON);
     // Set the flag to finished
     gettingData = false;
  };

  // Clear data layer and geoJSON
  var resetData = function () {
	    geoJSON = {
	      type: "FeatureCollection",
	      features: []
	    };
	    map.data.forEach(function(feature) {
	      map.data.remove(feature);
	    });
  };

var checkIfDataRequested = function(){
	// Stop extra requests being sent
    while (gettingData === true) {
      request.abort();
      gettingData = false;
    }
    getCoords();
  };

// Get the coordinates from the Map bounds
var getCoords = function() {
	var bounds = map.getBounds();
	var NE = bounds.getNorthEast();
	var SW = bounds.getSouthWest();
	getWeather(NE.lat(), NE.lng(), SW.lat(), SW.lng());
};

// Make the weather request
var getWeather = function(northLat, eastLng, southLat, westLng) {
	gettingData = true;
	var requestString = "http://api.openweathermap.org/data/2.5/box/city?bbox="
	                    + westLng + "," + northLat + "," //left top
	                    + eastLng + "," + southLat + "," //right bottom
	                    + map.getZoom()
	                    + "&cluster=yes&format=json&lang=en"
	                    + "&APPID=" + openWeatherMapKey;
	request = new XMLHttpRequest();
	request.onload = proccessResults;
	request.open("get", requestString, true);
	request.send();
};

// Take the JSON results and proccess them
  var proccessResults = function() {
	    console.log(this);
	    var results = JSON.parse(this.responseText);
	    console.log(results);
	    if (results.list.length > 0) {
	        resetData();
	        for (var i = 0; i < results.list.length; i++) {
	          geoJSON.features.push(jsonToGeoJson(results.list[i]));
	        }
	        drawIcons(geoJSON);

	    }
  };

// For each result that comes back, convert the data to geoJSON
function jsonToGeoJson(weatherItem) {
	var feature = {
	  type: "Feature",
	  properties: {
	    city: weatherItem.name,
	    weather: weatherItem.weather[0].main,
	    temperature: weatherItem.main.temp,
	    min: weatherItem.main.temp_min,
	    max: weatherItem.main.temp_max,
	    humidity: weatherItem.main.humidity,
	    pressure: weatherItem.main.pressure,
	    windSpeed: weatherItem.wind.speed,
	    windDegree: weatherItem.wind.deg,
	    windGust: weatherItem.wind.gust,
	    visibility: weatherItem.visibility,
	    icon: "http://openweathermap.org/img/w/"
	          + weatherItem.weather[0].icon  + ".png",
	    coordinates: [weatherItem.coord.Lon, weatherItem.coord.Lat]
	  },
	  geometry: {
	    type: "Point",
	    coordinates: [weatherItem.coord.Lon, weatherItem.coord.Lat]
	  }
	  
};

// Set the custom marker icon
map.data.setStyle(function(feature) {
	  return {
	    icon: {
	      url: feature.getProperty('icon'),
	      anchor: new google.maps.Point(25, 25)
	    }
	  };
});

localStorage.setItem("windSpeed", weatherItem.wind.speed);
localStorage.setItem("windDegree", weatherItem.wind.deg);
localStorage.setItem("pressure", weatherItem.main.pressure);
localStorage.setItem("visibility", weatherItem.visibility);

// returns object
return feature;



  google.maps.event.addDomListener(window, 'load', initMap());
  };

//function that get the current location
function getLocation(position) {
    //get the latitude and longitude
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    //save the current location for offline use
    localStorage.setItem("latitude", latitude);
    localStorage.setItem("longitude", longitude);
    console.log(latitude);
    console.log(longitude);
    localStorage.setItem("gpsPermission", true);
    console.log("GPS premitted");
    
    //Update once
    updateLocation();
    // Update location periodly
    setInterval(updateLocation, 80000);
    
}

function resetLocation(position){
	//get the latitude and longitude
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    //save the current location for offline use
    localStorage.setItem("latitude", latitude);
    localStorage.setItem("longitude", longitude);
    console.log(latitude);
    console.log(longitude);
    localStorage.setItem("gpsPermission", true);
    console.log("GPS premitted");

    userLocation = { 
        lat: parseFloat(localStorage.getItem("latitude")), 
        lng: parseFloat(localStorage.getItem("longitude")) 
    };

    marker.setPosition(new google.maps.LatLng(userLocation));
    console.log(userLocation);
	map.setCenter(userLocation);

	//code the latest location
	geoCoding(userLocation);
	console.log("Address coded");
    
}

//Display the weather data of today
function displayToday(todayIcon,temperature,rainfall,uvindex,humidity){
    if (ChangeChance<1){
        ChangeBackground(todayIcon);
        ChangeChance++;
    }

    setTimeout(function(){
        

        document.getElementById("TodayIcon").src = "https://www.hko.gov.hk/images/HKOWxIconOutline/pic"+todayIcon+".png";
        document.getElementById("TodayTemp").innerHTML = "<i class='fas fa-thermometer-half'></i> " + whereNear(temperature)+ "°C";
        
     
        getDirection( parseInt(localStorage.getItem("windDegree")) );
		document.getElementById("windDegree").innerHTML = localStorage.getItem("windDegree") + "° <i class='fas fa-location-arrow' id='windDirection' ></i>";
        document.getElementById("windDirection").style.transform = "rotate(" + (parseInt(localStorage.getItem("windDegree"))-45) + "deg)" ;        
        document.getElementById("windindex").innerHTML =  "<i class='fas fa-wind'></i> " + localStorage.getItem("windSpeed")*10 + "m/s";

        /* not displayed weather information
		document.getElementById("rainfall").innerHTML = whereNear(rainfall)+ "mm";
        document.getElementById("pressure").innerHTML = localStorage.getItem("pressure") + "hPa";
        document.getElementById("visibility").innerHTML = (parseInt(localStorage.getItem("visibility"))/1000) + "km";
		document.getElementById("humidityindex").innerHTML =  humidity.data[0].value + "%";
        
        document.getElementById("windDirection").innerHTML = localStorage.getItem("windDirection");
        if(uvindex == ""){
                document.getElementById("uvindex").innerHTML = "0/10";
        }else{
            document.getElementById("uvindex").innerHTML = uvindex.data[0].value + "/10";
        }
        */
        
    },1000);
}

function retrieveWeather() {
	console.log("Retrieving weather ");
    const xhr = new XMLHttpRequest();
    const url = "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread";

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var temperature = JSON.parse(xhr.response).temperature;
            var rainfall = JSON.parse(xhr.response).rainfall;
            var uvindex = JSON.parse(xhr.response).uvindex;
            var humidity = JSON.parse(xhr.response).humidity;
            var todayIcon = JSON.parse(xhr.response).icon;

            displayToday(todayIcon,temperature,rainfall,uvindex,humidity);

            const localStorage = window.localStorage;
            if (localStorage) {
                localStorage.setItem("temperature", JSON.stringify(temperature));
                localStorage.setItem("icon", JSON.stringify(TodayIcon));
                localStorage.setItem("rainfall", JSON.stringify(rainfall));
                localStorage.setItem("uvindex", JSON.stringify(uvindex));
                localStorage.setItem("humidity", JSON.stringify(humidity));
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
    	if(data.data[stationId].value == undefined){
    		return (data.data[stationId].max);
    	}
    	return ( data.data[stationId].value );
    }
    catch(err){
    	return (data.stationId.max);
    }
    
}

//function for getting the wind direction in word
function getDirection(windDegree){
    console.log(windDegree);
    switch(windDegree){
        case 0:
            var result = "N";
            console.log("North");
            break;

        case 90:
            var result = "E";
            console.log("East");
            break;

        case 180:
            var result = "S";
            console.log("South");
            break;

        case 270:
            var result = "W";
            console.log("West");
            break;

        case 360:
            var result = "N";
            console.log("North");
            break;

        default:
            if(windDegree>=40 && windDegree<=50){
                var result = "SW";  //South west
                console.log("South west");
            }else if(windDegree>0 && windDegree<40){
                var result = "SSW"  //South south west
                console.log("South south west");
            }else if(windDegree>50 && windDegree<90){
                var result = "WSW"  //West south west
                console.log("West south west");
            }else if(windDegree>=130 && windDegree<=140){
                var result = "NW"   //North west
                console.log("North west");
            }else if(windDegree>90 && windDegree<130){
                var result = "WNW"  //West north west
                console.log("West north west");
            }else if(windDegree>130 && windDegree<180){
                var result = "NNW"  //North north west
                console.log("North north west");
            }else if(windDegree>=220 && windDegree<=230){
                var result = "NE"   //North east
                console.log("North east");
            }else if(windDegree>180 && windDegree<220){
                var result = "NNE"  //North north east
                console.log("North north east");
            }else if(windDegree>230 && windDegree<=270){
                var result = "ENE"  //East north east
                console.log("East north east");
            }else if(windDegree>=310 && windDegree<=320){
                var result = "SE"   //South east
                console.log("South east");
            }else if(windDegree>270 && windDegree<310){
                var result = "ESE"  //East south east
                console.log("East south east");
            }else if(windDegree>320 && windDegree<360){
                var result = "SSE"  //South south east
                console.log("South south east");
            }
    }
    localStorage.setItem("windDirection", result);
}
