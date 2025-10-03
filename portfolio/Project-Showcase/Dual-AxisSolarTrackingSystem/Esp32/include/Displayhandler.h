#pragma once
#include <TFT_eSPI.h>

class DisplayHandler {
private:
    TFT_eSPI tft;


public:
    // Constructor initializes the TFT object
    DisplayHandler() : tft(TFT_eSPI()) {}

    // Initialize the display
    void initDisplay() {
        tft.init();
        tft.setRotation(1); // Set orientation
        tft.fillScreen(TFT_BLACK);
        tft.setTextColor(TFT_WHITE, TFT_BLACK);
        tft.setTextSize(1);
    }

    void Clear(){
        tft.fillScreen(TFT_BLACK);
    }

 // Show a message on the display
void showMessage(const char* message, int x, int y, bool clear = true) {

    tft.setCursor(x, y);
    tft.println(message);
}

// Show sensor data on the display
void showData(const char* label, int value, float voltage, int x, int y, bool clear = false) {

    String message = String(label) + ": " + String(value) + " Voltage: " + String(voltage, 2) + " V";
    tft.setCursor(x, y);
    tft.println(message);
}

// Show direction and maximum intensity value on the display
void showDirection(const String& direction, int value, int x, int y, bool clear = false) {
    if (clear) {
        tft.fillScreen(TFT_BLACK); // Clear the screen if clear is true
    }
    String message_1 = "Max Intensity: " + direction;
    tft.setCursor(x, y);
    tft.println(message_1);

    String message_2 = "Value: " + String(value);
    tft.setCursor(x, y + 20); // Adjust y-coordinate for the second line
    tft.println(message_2);
}

void showTempAndHumidity(float temperature, float humidity, int x, int y) {
    tft.setCursor(x, y);
    tft.println("Temperature: ");
    tft.println(String(temperature)); // Display directly with 2 decimal places

    tft.setCursor(x, y + 20);
    tft.println("Humidity: ");
    tft.println(String(humidity));
}

};