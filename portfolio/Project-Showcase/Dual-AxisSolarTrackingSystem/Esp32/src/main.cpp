#include <esp_task_wdt.h>
#include <esp_adc_cal.h>
#include <Arduino.h>
#include "Endpoints.h"
#include "HTU.h"
#include "Lys.h"
#include "Wifi_Config.h"


    HTU21D humidity_temperature;
    DisplayHandler HTU;
    HardwareSerial RP(1); // Use UART1
    TFT_eSPI tft;
    LightSensor leftSensor(32);
    LightSensor rightSensor(33);
    LightSensor upSensor(39);
    LightSensor downSensor(36);
    AsyncWebServer server(80); // Initialisere AsyncWebServer til port 80
    
void handleRoot(AsyncWebServerRequest *request) {
    request->send(200, "text/html", index_html);
}

void readSensorsTask(void *pvParameters) {
    for (;;) {
        float temperature = humidity_temperature.getTemperature();
        float humidity = humidity_temperature.getHumidity();

        Serial.println("Temperature: " + String(temperature) + " °C");
        Serial.println("Humidity: " + String(humidity) + " %");

        HTU.showTempAndHumidity(temperature, humidity, 0, 90);
        vTaskDelay(pdMS_TO_TICKS(1000)); // Delay to prevent constant polling
    }
}

void setup() {
        esp_task_wdt_init(5, true); // Set WDT timeout to 5 seconds (or higher as needed)    
        Serial.begin(115200);
        Wire.setClock(100000);
    Wire.begin(SDA_PIN, SCL_PIN);
    HandleWiFi_init("iPhone", "12341234");
    RP.begin(115200, SERIAL_8N1, 27, 26); // RX=27, TX=26

    leftSensor.initLight();
    rightSensor.initLight();
    upSensor.initLight();
    downSensor.initLight();

    xTaskCreatePinnedToCore(readSensorsTask, "SensorReadTask", 2048, NULL, 1, NULL, 1);
    server.begin();
    server.on("/", HTTP_GET, handleRoot);
    server.on("/temperature", HTTP_GET, handleTemperature);
    server.on("/graph_Humidity", HTTP_GET, handleHumidity);
    server.on("/humidity", HTTP_GET, handleHumidity); // /PIR
    server.on("/graph_Temp", HTTP_POST, handleHumidity);
};


void loop() {
    // Temperature and Humidity reading
    // Light sensor readings
    int left = analogRead(32);
    int right = analogRead(33);
    int up = analogRead(39);
    int down = analogRead(36);


    // Log light intensities
    leftSensor.logLightIntensity(display, 0, 30);
    rightSensor.logLightIntensity(display, 0, 40);
    upSensor.logLightIntensity(display, 0, 50);
    downSensor.logLightIntensity(display, 0, 60);

    // Sunsearch function to find the sensor with the highest intensity
    leftSensor.Sunsearch(left, right, up, down, display);
    // Add delay to reduce the loop frequency and allow for serial readability
    esp_task_wdt_reset();
    delay(1000);
};



