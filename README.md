## Concurrent Websocket Implementation with Go

This repository contains a mobile app (gosensors folder) and a go server (server folder).

Mobile app folder contains a react native app that acts as a client for the go server which sends `accelerometer`, `gyroscope` and `magnetometer` data in different intervals through websocket. 

Server folder contains a concurrent websocket server implementation written in go. Which acts as a hub for all the clients and broadcasts the incoming sensor data from mobile app to other connected clients.

### Endpoints

There is two endpoint in go server one is `/` and other one is `/ws`.

`/` : Serves a basic website that visualize the incoming sensor data in real time.

`/ws` : Websocket endpoint that connects all clients to server and broadcasts incoming sensor data to other clients. 

### Demo

![](demo.gif)