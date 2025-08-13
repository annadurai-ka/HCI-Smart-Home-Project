# Smart Home Control - HCI Final Project

This repository contains the final project for an HCI and Application Design course. The project is a full-stack smart home control application that allows a user to manage various IoT devices through a web interface. It demonstrates a complete interaction loop, from a user action on the frontend to a physical response on a simulated IoT device.


![alt text](https://github.com/annadurai-ka/HCI-Smart-Home-Project/blob/29bdf7794b15c230072c369649bbc54ceb3f8faa/Front_end/1.Home_screen_UI.png "Logo Title Text 1")
![alt text](https://github.com/annadurai-ka/HCI-Smart-Home-Project/blob/e97e54ec2ed81c739c4a0cf25cd85e1569f3e0d0/Front_end/2.%20Profile_Screen_UI.png "Logo Title Text 1")
![alt text](https://github.com/annadurai-ka/HCI-Smart-Home-Project/blob/fa587c27430ff1af01fca8339041b40e8783fb09/Front_end/3.Control_screen_1_UI.png "Logo Title Text 1")
![alt text](https://github.com/annadurai-ka/HCI-Smart-Home-Project/blob/acdae14f3e94eec074951840bd7c3d81ee79221d/Front_end/4.Control_screen_2_UI.png "Logo Title Text 1")
---

## Project Architecture

The application is built on a modern, decoupled architecture, consisting of three main components that communicate in real-time:

1.  **Frontend (React):** A responsive user interface built with React and styled with Tailwind CSS. It provides the user with a dashboard to view and control their smart devices.
2.  **Backend (Node.js & Express):** A simple server that acts as a bridge between the frontend and the MQTT broker. It exposes a REST API endpoint that the frontend calls to send commands.
3.  **IoT Device (ESP32 on Wokwi):** A simulated ESP32 microcontroller running on the Wokwi platform. It connects to an MQTT broker to listen for commands from the backend and controls simulated hardware (LEDs and a servo motor).

The data flow is as follows:
**`React App (User Click)`** → **`HTTP POST Request`** → **`Node.js Server`** → **`MQTT Publish`** → **`HiveMQ Broker`** → **`MQTT Subscribe`** → **`ESP32 (Device Action)`**

---

## Features

* **Home Dashboard:** A central screen displaying a weather widget and a list of all rooms.
* **Room Control Panels:** Dedicated pages for each room where users can toggle individual devices on and off.
* **Real-time Device Control:** User actions on the web interface are instantly sent to the simulated IoT device via MQTT.
* **Profile Page:** A user profile screen displaying personal information and app utilities.
* **Responsive Design:** The UI is designed to work on mobile-sized screens, matching the initial Figma prototype.

---

## Technology used

* **Frontend:** React, Tailwind CSS, Lucide React (Icons)
* **Backend:** Node.js, Express.js, `cors`
* **IoT & Communication:**
    * MQTT (via HiveMQ public broker)
    * `mqtt.js` (Node.js client)
    * `PubSubClient` (Arduino library)
* **Simulation:** Wokwi for ESP32

---

## Project Structure

The repository is organized into three main directories:

```

.
├── /backend/         \# Contains the Node.js Express server
├── /esp32/           \# Contains the Arduino code and diagram for the Wokwi simulation
└── /frontend/        \# Contains the React application

````

---

## 🚀 Setup and Installation

To run this project, you will need to set up the backend, frontend, and the Wokwi simulation.

### 1. Backend Server

The backend server listens for requests from the frontend and publishes MQTT messages.

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Run the server
node server.js

# The server will be running on http://localhost:5000
````

### 2\. Frontend Application

The React app provides the user interface for controlling the devices.

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start

# The application will open in your browser at http://localhost:3000
```

### 3\. ESP32 Simulation (Wokwi)

The IoT device is simulated in the browser using Wokwi.

1.  Go to the [Wokwi Project Page](https://wokwi.com/). *(**Note:** You will need to replace this with the actual link to your saved Wokwi project.)*
2.  The project contains three files: `sketch.ino`, `diagram.json`, and `wokwi.toml`.
3.  Ensure the ESP32 is connected to the "Wokwi-GUEST" WiFi by default.
4.  Start the simulation by clicking the "Start" (▶) button. The serial monitor will show the device connecting to WiFi and the MQTT broker.

Once all three components are running, you can click the toggle buttons in the web application and see the LEDs and servo motor react in the Wokwi simulation in real-time.

