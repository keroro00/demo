
var gpsPermission = null;
var gettingData = false;
var openWeatherMapKey = "74b8a4e9e597a5d689d11a55ddc1405e";
var geoJSON;
var map;
var request;

//set the default location
localStorage.setItem("defaultLatitude", 22.28552);
localStorage.setItem("defaultLongitude", 114.15769);
var userLocation = { 
	lat: parseFloat(localStorage.getItem("defaultLatitude")), 
	lng: parseFloat(localStorage.getItem("defaultLongitude")) 
};

function initPage(){
	var userLocation = { 
		lat: parseFloat(localStorage.getItem("defaultLatitude")), 
		lng: parseFloat(localStorage.getItem("defaultLongitude")) 
	};
	TestGeo();
	console.log(userLocation);
	initMap();
	
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

	
	console.log('this');
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
    initMap();
    console.log(gpsPremission);
}



//function that initialize the google map component
function initMap(){

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
  	const marker = new google.maps.Marker({
		position: new google.maps.LatLng(userLocation),
		map: map,
		icon:'',
	});

  	//Update location once
  	initLocation();

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
	    sessionStorage.setItem("latitude", lat);
		sessionStorage.setItem("longitude", lng);

		//update the address
		geoCoding();
		console.log("Address coded");
	})

	//add interaction listeners to make weather requests
	google.maps.event.addListener(map, 'idle', checkIfDataRequested);
	
}



//function for coding the geolocation from the marker's latitude and longitude
function geoCoding(){
	const geocoder = new google.maps.Geocoder();
	var display = document.getElementById("address");
	const selectedLocation = {
		lat: parseFloat(sessionStorage.getItem("latitude")),
		lng: parseFloat(sessionStorage.getItem("longitude")),
	};

	geocoder.geocode({ location: selectedLocation }, (results, status) => {
    	if (status === "OK") {
    		if (results[0]) {
    			display.innerHTML = results[0].formatted_address;
    		}else {
		        window.alert("No results found");
		    	}
		 }else {
		      window.alert("Geocoder failed due to: " + status);
			}
	});
}

function initLocation(){
	console.log('run');
	if(gpsPermission == true && 
        (sessionStorage.getItem("latitude") != null && 
            sessionStorage.getItem("longitude") != null)){

	        const userLocation = { 
	            lat: parseFloat(sessionStorage.getItem("latitude")), 
	            lng: parseFloat(sessionStorage.getItem("longitude")) 
	        };
	        console.log("Using real time location");
	        
	        marker.setPosition(new google.maps.LatLng(userLocation));

	    }else if(gpsPermission == false && 
	        (sessionStorage.getItem("latitude") != null && 
	            sessionStorage.getItem("longitude") != null)){

	        const userLocation = { 
	            lat: parseFloat(sessionStorage.getItem("latitude")), 
	            lng: parseFloat(sessionStorage.getItem("longitude")) 
	        };
	        console.log("Using last known location");
	        
	        marker.setPosition(new google.maps.LatLng(userLocation));

	    }else if(gpsPermission == false && 
	        (sessionStorage.getItem("latitude") == null && 
	            sessionStorage.getItem("longitude") == null)){

	        const userLocation = { 
	            lat: parseFloat(localStorage.getItem("defaultLatitude")), 
	            lng: parseFloat(localStorage.getItem("defaultLongitude")) 
	        };
	        console.log("Using default location");
	        
	        marker.setPosition(new google.maps.LatLng(userLocation));
	}	
		
		map.setCenter(userLocation);

		//code the latest location
		geoCoding();
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