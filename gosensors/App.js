import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gyroscope, Accelerometer } from 'expo-sensors';

export default function App() {
  const [gyroData, setGyroData] = useState({ x: 0, y: 0, z: 0 });
  const [accData, setAccData] = useState({ x: 0, y: 0, z: 0 });

  const [gyroSubscription, setGyroSubscription] = useState(null);
  const [accSubscription, setAccSubscription] = useState(null);
  const ENDPOINT = "ws://192.168.1.29:8080/ws";

  useEffect(() => {
    try {
      let socket_ = new WebSocket(ENDPOINT);

      socket_.onopen = () => {
        Accelerometer.setUpdateInterval(1000);
        Gyroscope.setUpdateInterval(300);

        setAccSubscription(
          Accelerometer.addListener(accelerometerData => {
            socket_.send(JSON.stringify(accelerometerData));
            setAccData(accelerometerData);
          })
        );

        setGyroSubscription(
          Gyroscope.addListener(gyroscopeData => {
            socket_.send(JSON.stringify(gyroscopeData));
            setGyroData(gyroscopeData);
          })
        );
      }
    } catch (error) {
      console.log(error)
    }

    return () => _unsubscribe();
  }, []);

  const _unsubscribe = () => {

    accSubscription && accSubscription.remove();
    setAccSubscription(null);

    gyroSubscription && gyroSubscription.remove();
    setGyroSubscription(null);
  };

  const { x: g_x, y: g_y, z: g_z } = gyroData;
  const { x: a_x, y: a_y, z: a_z } = accData;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Gyroscope:</Text>
      <Text style={styles.text}>
        x: {round(g_x)} y: {round(g_y)} z: {round(g_z)}
      </Text>
      <Text style={styles.text}>Accelerometer:</Text>
      <Text style={styles.text}>
        x: {round(a_x)} y: {round(a_y)} z: {round(a_z)}
      </Text>
    </View>
  );
}

function round(n) {
  if (!n) {
    return 0;
  }
  return Math.floor(n * 100) / 100;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  text: {
    textAlign: 'center',
  }
});
