function initialize() {
    var status = "* Offline *";
    if (navigator.onLine) {
        status = "* Online *";
        retrieveTemperature();
    } else {
        const localStorage = window.localStorage;
        if (localStorage) {
            const temperature = localStorage.getItem("temperature.data");
            if (temperature) {
                displayTemperature(JSON.parse(temperature.data));
            }
        }
    }

    document.getElementById("status").innerHTML = status;

    document.body.addEventListener(
            "online",
            function () {
                document.getElementById("status").innerHTML = "Online";
            },
            false
            );
    document.body.addEventListener(
            "offline",
            function () {
                document.getElementById("status").innerHTML = "Offline";
            },
            false
            );
}

function retrieveTemperature() {
    const xhr = new XMLHttpRequest();
    const url = "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread";

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var temperature = JSON.parse(xhr.response).temperature;
            displayTemperature(temperature);

            // Store contact data to localstorage
            const localStorage = window.localStorage;
            if (localStorage) {
                localStorage.setItem("temperature", JSON.stringify(temperature));
            }
        }
    };

    xhr.open("get", url);
    xhr.send();
}

function displayTemperature(temperature) {
    document.getElementById("ttemperature").innerHTML="";
    for (i=0;i<temperature.data.length;i++){
        if (temperature.data[i].place==document.getElementById("places").value){
            addRow(temperature.data[i]);
        }

    }
}


function addRow(temperature) {
    var ttemperature = document.getElementById("ttemperature");
    var row = ttemperature.insertRow();
    var placeCell = row.insertCell();
    placeCell.setAttribute('data-label', "place");
    placeCell.innerHTML = temperature.place;

    var valueCell = row.insertCell();
    valueCell.setAttribute('data-label', "value");
    valueCell.innerHTML = temperature.value;

    var unitCell = row.insertCell();
    unitCell.setAttribute('data-label', "unit");
    unitCell.innerHTML = temperature.unit;
}
