#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <fcntl.h>
#include <unistd.h>

// Device files for servo and stepper motor pins
#define SERVO_DEV "/dev/plat_drv0"
#define STEPPER_DEV1 "/dev/plat_drv1"
#define STEPPER_DEV2 "/dev/plat_drv2"
#define STEPPER_DEV3 "/dev/plat_drv3"
#define STEPPER_DEV4 "/dev/plat_drv4"

// Stepper motor sequence
const int stepSequence[4][4] = {
    {1, 0, 0, 1},
    {1, 1, 0, 0},
    {0, 1, 1, 0},
    {0, 0, 1, 1}
};

// Function to move servo motor to a specific angle
void moveServo(int angle) {
    char buffer[32];
    int fd = open(SERVO_DEV, O_WRONLY);
    if (fd < 0) {
        perror("Error opening servo device");
        return;
    }

    // Write angle to servo device
    snprintf(buffer, sizeof(buffer), "%d", angle);
    if (write(fd, buffer, strlen(buffer)) < 0) {
        perror("Error writing to servo device");
    }

    close(fd);
}

// Function to write stepper motor pin values
void writeStepperPin(const char *device, int value) {
    char buffer[2];
    int fd = open(device, O_WRONLY);
    if (fd < 0) {
        perror("Error opening stepper device");
        return;
    }

    // Write value (0 or 1) to the stepper pin
    snprintf(buffer, sizeof(buffer), "%d", value);
    if (write(fd, buffer, strlen(buffer)) < 0) {
        perror("Error writing to stepper device");
    }

    close(fd);
}

// Function to reset stepper motor pins
void resetStepper() {
    writeStepperPin(STEPPER_DEV1, 0);
    writeStepperPin(STEPPER_DEV2, 0);
    writeStepperPin(STEPPER_DEV3, 0);
    writeStepperPin(STEPPER_DEV4, 0);
}

// Function to rotate stepper motor
void rotateStepper(int steps, int clockwise) {
    for (int i = 0; i < steps; i++) {
        int stepIndex = clockwise ? i % 4 : (3 - (i % 4));
        writeStepperPin(STEPPER_DEV1, stepSequence[stepIndex][0]);
        writeStepperPin(STEPPER_DEV2, stepSequence[stepIndex][1]);
        writeStepperPin(STEPPER_DEV3, stepSequence[stepIndex][2]);
        writeStepperPin(STEPPER_DEV4, stepSequence[stepIndex][3]);
        usleep(2000); // Step delay in microseconds
    }
    resetStepper();
}

// Function to parse sensor data (dummy placeholder)
void parseSensorData(const char *data) {
    // Placeholder for sensor data parsing logic
}

// Function to determine sun direction based on sensor data (dummy placeholder)
const char *determineSunDirection() {
    // Placeholder for logic to determine direction
    return "Unknown"; // Example return value
}

int main() {
    // Open the serial port to read data from ESP32
    FILE *serialInput = fopen("/dev/ttyS0", "r"); // Adjust serial port if necessary
    if (!serialInput) {
        fprintf(stderr, "Error: Cannot open serial port\n");
        return 1;
    }

    char line[256];
    while (1) {
        if (fgets(line, sizeof(line), serialInput)) {
            // Parse sensor data
            parseSensorData(line);
            const char *direction = determineSunDirection();

            // Perform motor control based on direction
            if (strcmp(direction, "Venstre") == 0) {
                printf("Sun direction: Left\n");
                rotateStepper(50, 0); // Rotate stepper left
            } else if (strcmp(direction, "Højre") == 0) {
                printf("Sun direction: Right\n");
                rotateStepper(50, 1); // Rotate stepper right
            } else if (strcmp(direction, "Op") == 0) {
                printf("Sun direction: Up\n");
                moveServo(90); // Move servo up
            } else if (strcmp(direction, "Ned") == 0) {
                printf("Sun direction: Down\n");
                moveServo(0); // Move servo down
            } else {
                printf("Sun direction: Unknown\n");
            }
        }

        usleep(100000); // Small delay between readings
    }

    fclose(serialInput);
    return 0;
}
