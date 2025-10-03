#pragma once
#include <Wire.h>
#include <ESPAsyncWebServer.h>
#include <AsyncTCP.h>
#include <Arduino.h>
#include <HTU21D.h>  // Include the SparkFun HTU21D library

#define SDA_PIN 21
#define SCL_PIN 22

// HTU21D sensor class
class HTU21D_Sensor {
private:
    HTU21D htu21d;  // SparkFun HTU21D object
    bool sensorFound; // Flag to check if sensor was initialized properly 

public:
    HTU21D_Sensor() {
        // Constructor: Initialize I2C and HTU21D sensor
        Wire.begin(SDA_PIN, SCL_PIN);  // Initialize I2C bus
        if (!htu21d.begin()) {
            Serial.println("HTU21D sensor not detected.");
            sensorFound = false;
        } else {
            sensorFound = true;
            Serial.println("HTU21D sensor initialized.");
        }
    }

    // Read temperature in Celsius
    float readTemperature() {
        if (sensorFound) {
            return htu21d.getTemperature();  // Returns temperature in Celsius
        } else {
            Serial.println("Error: HTU21D sensor not found.");
            return NAN;
        }
    }

    // Read humidity as a percentage
    float readHumidity() {
        if (sensorFound) {
            return htu21d.getHumidity();  // Returns humidity as percentage
        } else {
            Serial.println("Error: HTU21D sensor not found.");
            return NAN;
        }
    }
};

// Global sensor instance
HTU21D_Sensor sensor;

// Web handler functions outside the HTU21D class
void handleTemperature(AsyncWebServerRequest *request) {
    float temp = sensor.readTemperature();
    if (isnan(temp)) {
        request->send(500, "text/plain", "Failed to read temperature");
    } else {
        request->send(200, "text/plain", String(temp));
    }
}

void handleHumidity(AsyncWebServerRequest *request) {
    float humidity = sensor.readHumidity();
    if (isnan(humidity)) {
        request->send(500, "text/plain", "Failed to read humidity");
    } else {
        request->send(200, "text/plain", String(humidity));
    }
}

void handleGraph_Temp(AsyncWebServerRequest *request) {
    handleTemperature(request);  // Use the same logic as handleTemperature
}

void handleGraph_Humidity(AsyncWebServerRequest *request) {
    handleHumidity(request);  // Use the same logic as handleHumidity
}
