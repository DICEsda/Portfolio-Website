#pragma once
#include <Arduino.h>
#include <driver/adc.h>
#include <Displayhandler.h>

class LightSensor {

private:
    int sensorPin;  // Pin connected to the light sensor

public:
    // Constructor to initialize the pin
    LightSensor(int pin) : sensorPin(pin) {}

    void initLight() {
        adc1_config_width(ADC_WIDTH_BIT_12);
        // Set 11 dB attenuation
        adc1_config_channel_atten(ADC1_CHANNEL_0, ADC_ATTEN_DB_12); // GPIO36
        adc1_config_channel_atten(ADC1_CHANNEL_1, ADC_ATTEN_DB_12); // GPIO35
        adc1_config_channel_atten(ADC1_CHANNEL_4, ADC_ATTEN_DB_12); // GPIO32
        adc1_config_channel_atten(ADC1_CHANNEL_5, ADC_ATTEN_DB_12); // GPIO33
        Serial.println("ADC1 channels configured with 11 dB attenuation");
    }

    // Method to read and log the light intensity, also display on TFT
    void logLightIntensity(DisplayHandler& display, int x, int y) {
        int sensorValue = analogRead(sensorPin);
        float voltage = sensorValue * (3.3 / 4095.0);

        // Display data on TFT screen
        display.showData("Light Intensity", sensorValue, voltage, x, y);

        // Example logic based on sensor value (for serial monitor)
        if (sensorValue > 3000) {
            Serial.println("High light intensity - solar panels adjusted optimally.");
            Serial.println(sensorValue);
        } else if (sensorValue < 1000) {
            Serial.println("Low light intensity - consider changing solar panel direction.");
            Serial.println(sensorValue);

        }
    }

    // Find the sensor with the highest intensity and display it
    void Sunsearch(int Left, int Right, int Up, int Down, DisplayHandler& display) {
        int maxIntensity = Left;
        String direction = "Venstre";  // Left

        if (Right > maxIntensity) {
            maxIntensity = Right;
            direction = "Højre";  // Right
        }
        if (Up > maxIntensity) {
            maxIntensity = Up;
            direction = "Op";  // Up
        }
        if (Down > maxIntensity) {
            maxIntensity = Down;
            direction = "Ned";  // Down
        }

        // Output the result on the TFT display
        display.showDirection(direction, maxIntensity, 10, 100);

        // You can also print this to the serial monitor if needed
        Serial.print("Maximum intensity is in direction: ");
        Serial.print(direction);
        Serial.print(" with value: ");
        Serial.println(maxIntensity);
    }
};