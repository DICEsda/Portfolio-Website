#pragma once
#include <WiFi.h>
#include <esp_task_wdt.h>
#include "DisplayHandler.h"
#include <WiFi.h>
#include <TFT_eSPI.h>

// Create an instance of the DisplayHandler class
DisplayHandler display;


// Initialize WiFi configuration
void HandleWiFi_init(const char* ssid, const char* password) {
    esp_task_wdt_add(NULL);   // Add the task to watchdog monitoring
    
    display.initDisplay();    // Initialize display once
    
    WiFi.begin(ssid, password);  // Start WiFi connection
    display.showMessage("Connecting to WiFi...", 10, 20);  // Show message on display

    int dots = 0;  // To cycle dots on the display while connecting
    while (WiFi.status() != WL_CONNECTED) {
        String statusMsg = "Status: ";
        
        // Add dots to status message to indicate progress
        for (int i = 0; i < dots; i++) {
            statusMsg += ".";
        }
        
        // Display connection status with dots cycling
        display.showMessage(statusMsg.c_str(), 10, 50);  
        dots = (dots + 1) % 4;  // Cycle dots (0 to 3)
        
        delay(1000);  // Wait for a second before retrying
        yield();      // Allow other tasks to run and reset the watchdog
    }
    display.Clear();
    // When WiFi is connected, display the connection success message
    String ipMessage = "WiFi Connected!\nIP: " + WiFi.localIP().toString();
    display.showMessage(ipMessage.c_str(), 0, 0);  // Clear and display the final message

}
