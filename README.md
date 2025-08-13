# HCI Smart Home Application

This project is a full-stack, end-to-end prototype of a smart home mobile application. It includes a React front-end, a Node.js backend server, and a simulated ESP32 device running in Wokwi.

## Project Architecture

The system operates in four main parts:
1.  **React Front-End:** A mobile app interface where the user can view rooms and toggle devices on or off.
2.  **Node.js/Express Backend:** An API server that receives commands from the React app via HTTP requests.
3.  **MQTT Broker:** A message broker (HiveMQ public broker) that decouples the backend from the IoT device. The backend publishes messages to specific "topics."
4.  **ESP32 Wokwi Simulation:** A virtual IoT device that subscribes to the MQTT topics. It listens for messages and controls virtual hardware (LEDs and a servo motor) accordingly.



## How to Run
### Frontend (React App)
```bash
cd frontend
npm install
npm start
```
### Backend (Node.js Server)
```bash
cd backend
npm install
node server.js
```
### Wokwi Simulation
1.  Go to [Wokwi.com](https://wokwi.com/).
2.  Create a new ESP32 project.
3.  Replace the default `sketch.ino` and `diagram.json` with the files from the `/wokwi_simulation` folder.
4.  Add your WiFi credentials if needed and run the simulation.
