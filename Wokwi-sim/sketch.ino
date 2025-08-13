#include <WiFi.h>
#include <PubSubClient.h>
#include <ESP32Servo.h>

// --- Pin Definitions ---
#define LIGHT_PIN 2 
#define FAN_PIN   4 
#define AC_PIN    5

// --- WiFi and MQTT Configuration ---
const char* ssid = "Wokwi-GUEST";
const char* password = "";
const char* mqtt_server = "broker.hivemq.com";

// --- Global Objects ---
WiFiClient espClient;
PubSubClient client(espClient);
Servo fanServo;

// --- State Variables ---
bool fanIsOn = false; // Master switch for the fan

// --- New state variables for non-blocking fan control ---
int fan_pos = 0;                      // Current position of the servo
int fan_increment = 1;                // Direction to move (1 for forward, -1 for reverse)
unsigned long last_fan_update = 0;    // Time of the last servo move (in milliseconds)
const int fan_update_interval = 15;   // Milliseconds between each 1-degree step (controls speed)


// --- Function to handle incoming MQTT messages ---
void callback(char* topic, byte* payload, unsigned int length) {
  payload[length] = '\0'; 
  String message = String((char*)payload);
  Serial.printf("Message arrived on topic: %s. Message: %s\n", topic, message.c_str());

  if (String(topic) == "home/light/state") {
    if (message == "ON") {
      digitalWrite(LIGHT_PIN, HIGH);
    } else if (message == "OFF") {
      digitalWrite(LIGHT_PIN, LOW);
    }
  } else if (String(topic) == "home/fan/state") {
    if (message == "ON") {
      fanIsOn = true;
      Serial.println("Fan switch turned ON. Starting oscillation.");
    } else if (message == "OFF") {
      fanIsOn = false;
      fanServo.write(0); // Immediately return to home position
      Serial.println("Fan switch turned OFF. Stopping oscillation.");
    }
  } else if (String(topic) == "home/ac/state") {
    if (message == "ON") {
      digitalWrite(AC_PIN, HIGH);
    } else if (message == "OFF") {
      digitalWrite(AC_PIN, LOW);
    }
  }
}

// --- setup_wifi() and reconnect() functions are unchanged ---
void setup_wifi() {
  delay(10); Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println("\nWiFi connected"); Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("WokwiESP32Client-HomeAuto-Servo")) {
      Serial.println("connected");
      client.subscribe("home/light/state"); client.subscribe("home/fan/state"); client.subscribe("home/ac/state");
    } else {
      Serial.print("failed, rc="); Serial.print(client.state()); Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

// --- Setup Function ---
void setup() {
  Serial.begin(115200);
  pinMode(LIGHT_PIN, OUTPUT);
  pinMode(AC_PIN, OUTPUT);
  fanServo.attach(FAN_PIN);
  
  digitalWrite(LIGHT_PIN, LOW);
  digitalWrite(AC_PIN, LOW);
  fanServo.write(0); // Start at home position

  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

// --- Loop Function with NON-BLOCKING Oscillation Logic ---
void loop() {
  // These two lines are critical. They MUST be called on every pass of the loop.
  if (!client.connected()) {
    reconnect();
  }
  client.loop(); // Processes incoming MQTT messages. Now it runs constantly!

  // Only run the fan logic if the master switch is on.
  if (fanIsOn) {
    // Check if enough time has passed since the last servo move.
    if (millis() - last_fan_update > fan_update_interval) {
      last_fan_update = millis(); // IMPORTANT: Reset the timer for the next interval

      // Move the servo by one step in the current direction.
      fan_pos = fan_pos + fan_increment;
      fanServo.write(fan_pos);

      // If the servo reaches an edge, reverse the direction.
      if (fan_pos >= 180) {
        fan_increment = -1; // Change direction to reverse
      }
      if (fan_pos <= 0) {
        fan_increment = 1;  // Change direction to forward
      }
    }
  }
}