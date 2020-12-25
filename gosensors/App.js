import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gyroscope, Accelerometer, Magnetometer } from 'expo-sensors';

export default function App() {
  const [accData, setAccData] = useState({ x: 0, y: 0, z: 0 });
  const [gyroData, setGyroData] = useState({ x: 0, y: 0, z: 0 });
  const [magData, setMagData] = useState({ x: 0, y: 0, z: 0 });

  const [socket, setSocket] = useState(null);

  const [accSubscription, setAccSubscription] = useState(null);
  const [gyroSubscription, setGyroSubscription] = useState(null);
  const [magSubscription, setMagSubscription] = useState(null);


  const ENDPOINT = "ws://192.168.1.29:8080/ws";

  useEffect(() => {
    try {
      openSocket();
    } catch (error) {
      console.log(error)
    }
  }, []);

  const openSocket = () => {
    let socket_ = new WebSocket(ENDPOINT);

    socket_.onopen = () => {
      setSocket(socket_);
    }
  }

  const accSubscribe = () => {
    if (socket) {
      Accelerometer.setUpdateInterval(300);
      setAccSubscription(
        Accelerometer.addListener(accelerometerData => {
          socket.send(JSON.stringify({ type: "acc", data: accelerometerData }));
          setAccData(accelerometerData);
        })
      );
    }
    else {
      openSocket();
      accSubscribe();
    }
  }

  const accUnsubscribe = () => {
    accSubscription && accSubscription.remove();
    setAccSubscription(null);
    setAccData({ x: 0, y: 0, z: 0 });
  };

  const gyroSubscribe = () => {
    if (socket) {
      Gyroscope.setUpdateInterval(600);
      setGyroSubscription(
        Gyroscope.addListener(gyroscopeData => {
          socket.send(JSON.stringify({ type: "gyro", data: gyroscopeData }));
          setGyroData(gyroscopeData);
        })
      );
    }
    else {
      openSocket();
      gyroSubscribe();
    }
  }

  const gyroUnsubscribe = () => {
    gyroSubscription && gyroSubscription.remove();
    setGyroSubscription(null);
    setGyroData({ x: 0, y: 0, z: 0 });
  };

  const magSubscribe = () => {
    if (socket) {
      Magnetometer.setUpdateInterval(900);
      setMagSubscription(
        Magnetometer.addListener(magData => {
          socket.send(JSON.stringify({ type: "mag", data: magData }));
          setMagData(magData);
        })
      );
    }
    else {
      openSocket();
      magSubscribe();
    }
  }

  const magUnsubscribe = () => {
    magSubscription && magSubscription.remove();
    setMagSubscription(null);
    setMagData({ x: 0, y: 0, z: 0 });
  };

  const { x: a_x, y: a_y, z: a_z } = accData;
  const { x: g_x, y: g_y, z: g_z } = gyroData;
  const { x: m_x, y: m_y, z: m_z } = magData;

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <View style={styles.textContainer}>
          <Text style={accSubscription ? styles.p_text : styles.n_text}>Accelerometer:</Text>
          <Text style={styles.text}>
            x: {round(a_x)} y: {round(a_y)} z: {round(a_z)}
          </Text>
        </View>
        <TouchableOpacity onPress={accSubscription ? accUnsubscribe : accSubscribe} style={styles.button}>
          <Text>{accSubscription ? 'Off' : 'On'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.textContainer}>
          <Text style={gyroSubscription ? styles.p_text : styles.n_text}>Gyroscope:</Text>
          <Text style={styles.text}>
            x: {round(g_x)} y: {round(g_y)} z: {round(g_z)}
          </Text>
        </View>
        <TouchableOpacity onPress={gyroSubscription ? gyroUnsubscribe : gyroSubscribe} style={styles.button}>
          <Text>{gyroSubscription ? 'Off' : 'On'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.textContainer}>
          <Text style={magSubscription ? styles.p_text : styles.n_text}>Magnetometer:</Text>
          <Text style={styles.text}>
            x: {round(m_x)} y: {round(m_y)} z: {round(m_z)}
          </Text>
        </View>
        <TouchableOpacity onPress={magSubscription ? magUnsubscribe : magSubscribe} style={styles.button}>
          <Text>{magSubscription ? 'Off' : 'On'}</Text>
        </TouchableOpacity>
      </View>
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
  },
  p_text: {
    color: "green",
    textAlign: 'center',
  },
  n_text: {
    color: "red",
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
});
