#pragma once
const char index_html[] PROGMEM = R"rawliteral(
<!DOCTYPE HTML>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        html {
            font-family: Arial;
            display: inline-block;
            margin: 0px auto;
            text-align: center;
        }

        h2 {
            font-size: 3.0rem;
        }

        p {
            font-size: 3.0rem;
        }

        .units {
            font-size: 1.2rem;
        }

        .dht-labels {
            font-size: 1.5rem;
            vertical-align: middle;
            padding-bottom: 15px;
        }

        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 500px;
            margin: 50px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
            text-align: middle;
            margin-bottom: 20px;
        }

        .form-group {
            margin-bottom: 10px;
        }

        label {
            display: block;
            margin-bottom: 5px;
        }

        input[type="number"] {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }

        button {
            width: 100%;
            padding: 10px;
            background-color: #007bff;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        button:hover {
            background-color: #b30f00;
        }
    </style>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossorigin="anonymous">
</head>

<body>
    <h2>Solar Tracking systems</h2>
    <p>
        <i class="fas fa-thermometer-half" style="color:#9e7305;"></i>
        <span class="dht-labels">Temperature</span>
        <span id="temperature">I2C Fail</span>
        <sup class="units">&deg;C</sup>
    </p>
    <p>
        <i class="fas fa-shower" style="color:#9e7305;"></i>
        <span class="dht-labels">humidity</span>
        <span id="humidity">I2C Fail</span>
    </p>

    <div id="chart-combined" style="width: 100%; height: 400px;"></div>

    <div class="container">
        <h1>Set Setpoint</h1>
        <form id="setpointForm">
            <div class="form-group">
                <label for="setpoint">Setpoint:</label>
                <input type="number" id="setpointInput" name="setpoint" step="1" required 
                       oninvalid="this.setCustomValidity('SetPoint mangler!')" 
                       oninput="this.setCustomValidity('')">
            </div>
            <div class="form-group">
                <label for="maxLimit">Max Limit:</label>
                <input type="number" id="maxLimitInput" name="maxLimit" step="1">
            </div>
            <div class="form-group">
                <label for="minLimit">Min Limit:</label>
                <input type="number" id="minLimitInput" name="minLimit" step="1">
            </div>
            <button type="submit">Set</button>
        </form>
        <div id="setpointMessage"></div>
    </div>

    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script>
    var combinedChart = new Highcharts.Chart({
    chart: { renderTo: 'chart-combined' },
    title: { text: 'Temperature and Humidity Over Time' },
    series: [
        {
            name: 'Temperature',
            type: 'line',
            yAxis: 0,
            data: [],
            color: '#059e8a',
        },
        {
            name: 'Humidity',
            type: 'line',
            yAxis: 1,
            data: [],
            color: '#1f78b4',
        }
    ],
    plotOptions: {
        line: {
            animation: true,
            dataLabels: { enabled: false }
        }
    },
    xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: { second: '%H:%M:%S' }
    },
    yAxis: [
        {
            title: { text: 'Temperature (°C)' },
            opposite: false // Temperature axis on the left
        },
        {
            title: { text: 'Humidity (%)' },
            opposite: true // Humidity axis on the right
        }
    ],
    time: {
        useUTC: false,
        timezone: "Europe/Copenhagen"
    },
    credits: { enabled: false }
});

// Update the chart data dynamically
setInterval(function () {
    var currentTime = (new Date()).getTime();

    // Update Temperature
    var tempXhttp = new XMLHttpRequest();
    tempXhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var temperature = parseFloat(this.responseText);
            combinedChart.series[0].addPoint([currentTime, temperature], true, true);
        }
    };
    tempXhttp.open("GET", "/graph_Temp", true);
    tempXhttp.send();

    // Update Humidity
    var humXhttp = new XMLHttpRequest();
    humXhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var humidity = parseFloat(this.responseText);
            combinedChart.series[1].addPoint([currentTime, humidity], true, true);
        }
    };
    humXhttp.open("GET", "/graph_Humidity", true);
    humXhttp.send();
}, 1000);

        setInterval(function () {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    document.getElementById("temperature").innerHTML = this.responseText;
                }
            };
            xhttp.open("GET", "/temperature", true);
            xhttp.send();
        }, 1000);

        setInterval(function () {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    document.getElementById("humidity").innerHTML = this.responseText;
                }
            };
            xhttp.open("GET", "/humidity", true);
            xhttp.send();
        }, 1000);

        document.getElementById("setpointForm").addEventListener("submit", function (event) {
            event.preventDefault();

            var setpoint = document.getElementById("setpointInput").value;
            var maxLimit = document.getElementById("maxLimitInput").value;
            var minLimit = document.getElementById("minLimitInput").value;

            var requestData = "setpoint=" + encodeURIComponent(setpoint) +
                              "&maxLimit=" + encodeURIComponent(maxLimit) +
                              "&minLimit=" + encodeURIComponent(minLimit);

            fetch("/setpoint", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: requestData 
            })
            .then(response => response.text())
            .then(data => {
                document.getElementById("setpointMessage").textContent = "Setpoint successfully sent to server: " + data;
            });
        });
    </script>
</body>
</html>
)rawliteral";
