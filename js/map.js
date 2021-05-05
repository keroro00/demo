var gpsPremission = null;

//set the default location
localStorage.setItem("defaultLatitude", 22.28552);
localStorage.setItem("defaultLongitude", 114.15769);
const userLocation = { 
	lat: parseFloat(localStorage.getItem("defaultLatitude")), 
	lng: parseFloat(localStorage.getItem("defaultLongitude")) 
};

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
	gpsPremission = true;
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
    gpsPremission = false;
    initMap();
    console.log(gpsPremission);
}

//function that initialize the google map component
function initMap(){

	console.log(userLocation);

  	// The map, centered at latest location
  	const map = new google.maps.Map(document.getElementById("map"),
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

  	// Update location every 5 seconds
  	setInterval(function() {

  		if(gpsPremission == null){
    		marker.setMap(null);
    	}else
  		if(gpsPremission == true || (sessionStorage.getItem("latitude") != null && sessionStorage.getItem("longitude") != null)){
    		const userLocation = { 
    			lat: parseFloat(sessionStorage.getItem("latitude")), 
    			lng: parseFloat(sessionStorage.getItem("longitude")) 
    		};
    		console.log("location found");
    		
    		marker.setPosition(new google.maps.LatLng(userLocation));
    		
    	}else{
    		marker.setPosition(new google.maps.LatLng(userLocation));
    		
    	}
		
    	map.setCenter(marker.getPosition());
    	
		//code the latest location
		codeAddress();
		console.log("Address coded");
	}, 5000);

  	//add the location selection feature to the google map components
  	google.maps.event.addListener(map, 'click', function(event) {
  		console.log("Map clicked");

  		//get the location latitude and longitude
	    var latLng = event.latLng;
	    var lat = latLng.lat();
	    var lng = latLng.lng();
		const userLocation = { 
			lat: parseFloat(lat), 
			lng: parseFloat(lng) 
		};

	    
		//update components
		marker.setPosition(new google.maps.LatLng(userLocation));
		map.setCenter(new google.maps.LatLng(userLocation));
		codeAddress();
		console.log("Address coded");

		//update the latitude and longitude for offline use
	    sessionStorage.setItem("latitude", lat);
		sessionStorage.setItem("longitude", lng);
	})

}

//function for coding the geolocation from the marker's latitude and longitude
function codeAddress(){
	const geocoder = new google.maps.Geocoder();
	var display = document.getElementById("address");
	const latlng = {
		lat: parseFloat(sessionStorage.getItem("latitude")),
		lng: parseFloat(sessionStorage.getItem("longitude")),
	};

	geocoder.geocode({ location: latlng }, (results, status) => {
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

//function for handleing location selecting event 
function markPlaces(location){
	console.log("Map clicked");
	
	var clickedLocation = new google.maps.LatLng(location);

	marker.setMap(null);
	const marker = new google.maps.Marker({
		position: new google.maps.LatLng(userLocation),
		map: map,
		icon:'',
	});
}