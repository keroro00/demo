
var gpsPermission =  sessionStorage.getItem("gpsPermission");
var gettingData = false;
var openWeatherMapKey = "74b8a4e9e597a5d689d11a55ddc1405e";
var geoJSON;
var map;
var marker;
var request;
var defaultLocation;
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
		console.log('true');
		userLocation = { 
            lat: parseFloat(localStorage.getItem("latitude")), 
            lng: parseFloat(localStorage.getItem("longitude")) 
        };
        console.log(userLocation);
		setTimeout(updateLocation,3000);
	}else if(gpsPermission == 'false' && 
        (localStorage.getItem("latitude") != null && 
            localStorage.getItem("longitude") != null)){
        console.log("Permission denied, last found location found, using last found location");
        userLocation = { 
            lat: parseFloat(localStorage.getItem("latitude")), 
            lng: parseFloat(localStorage.getItem("longitude")) 
        };
        defaultLocation = false;
        setTimeout(updateLocation,3000);
    }else if(gpsPermission == 'false' && 
        (localStorage.getItem("latitude") == null && 
            localStorage.getItem("longitude") == null)){
        console.log("Permission denied, last found location not found, using default location");
        defaultLocation = true;
        setTimeout(updateLocation,3000);
    } 
	
	retrieveTemperature();
	
}

//function that initialize the google map component
function initMap(){
	console.log("initMap");
	console.log(userLocation);

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
		map.setCenter(new google.maps.LatLng(userLocation));
		
		//update the latitude and longitude
	    localStorage.setItem("latitude", lat);
		localStorage.setItem("longitude", lng);

		//update the address
		geoCoding(userLocation);
		console.log("Address coded");

	})

	//add interaction listeners to make weather requests
	google.maps.event.addListener(map, 'idle', checkIfDataRequested);
	
	console.log("Map inisalized");

}

//function for coding the geolocation from the marker's latitude and longitude
function geoCoding(userLocation){
	const geocoder = new google.maps.Geocoder();
	var display = document.getElementById("address");

	console.log(userLocation);
	
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
    			display.innerHTML = 
    				"Selected location:" +
    				"<br>" + 
    				address;
    			
        }else {
        console.log("No results found");
        display.innerHTML ="Not a valid location";
    	}
    }
    else {
      console.log("Geocoder failed due to: " + status);
      display.innerHTML ="Not a valid location";
	}
	});
}

function updateLocation(){
	console.log("updateLocation");
	console.log(gpsPermission);

	if(gpsPermission == 'true'){
		console.log("Using real time location");
		
	        console.log(userLocation);
	        marker.setPosition(new google.maps.LatLng(userLocation));

    }else if(gpsPermission == 'false' && defaultLocation == false){
    	console.log("Using last found location");
    	
    	console.log(userLocation);
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
	                    + "&cluster=yes&format=json"
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
	    if (results.list.length > 0) {
	        resetData();
	        for (var i = 0; i < results.list.length; i++) {
	          geoJSON.features.push(jsonToGeoJson(results.list[i]));
	        }
	        drawIcons(geoJSON);
	    }
  };

// For each result that comes back, convert the data to geoJSON
var jsonToGeoJson = function (weatherItem) {
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
	    windDegrees: weatherItem.wind.deg,
	    windGust: weatherItem.wind.gust,
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

// returns object
return feature;

  google.maps.event.addDomListener(window, 'load', initMap());
  };


function getCity(){
	var country = null, countryCode = null, city = null, cityAlt = null;
    var c, lc, component;
    for (var r = 0, rl = results.length; r < rl; r += 1) {
        var result = results[r];

        if (!city && result.types[0] === 'locality') {
            for (c = 0, lc = result.address_components.length; c < lc; c += 1) {
                component = result.address_components[c];

                if (component.types[0] === 'locality') {
                    city = component.long_name;
                    break;
                }
            }
        }
        else if (!city && !cityAlt && result.types[0] === 'administrative_area_level_1') {
            for (c = 0, lc = result.address_components.length; c < lc; c += 1) {
                component = result.address_components[c];

                if (component.types[0] === 'administrative_area_level_1') {
                    cityAlt = component.long_name;
                    break;
                }
            }
        } else if (!country && result.types[0] === 'country') {
            country = result.address_components[0].long_name;
            countryCode = result.address_components[0].short_name;
        }

        if (city && country) {
            break;
        }
    }
    console.log("City: " + city + ", City2: " + cityAlt + ", Country: " + country + ", Country Code: " + countryCode);
}

//Display the weather of today
function displayToday(todayIcon,temperature){
    document.getElementById("TodayIcon").src="https://www.hko.gov.hk/images/HKOWxIconOutline/pic"+todayIcon+".png";
    document.getElementById("TodayTemp").innerHTML=whereNear(temperature);
}

function retrieveTemperature() {
	console.log("Retrieving temperature ");
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

//Calculate Which station is near to user and show the temperature of it
function whereNear(temperature){
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
    return ( temperature.data[stationId].value + "°C");
}

