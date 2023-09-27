import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Text, Linking, Modal, TouchableOpacity } from 'react-native';
import { Camera, CameraPermissionStatus } from 'react-native-vision-camera';
import type { Routes } from './Routes';

type Props = NativeStackScreenProps<Routes, 'PermissionsPage'>;
export const PermissionsModal = ({ navigation, modalVisible }: Props): React.ReactElement => {
  const [cameraPermissionStatus, setCameraPermissionStatus] = useState<CameraPermissionStatus>('not-determined');

  const requestCameraPermission = useCallback(async () => {
    console.log('Requesting camera permission...');
    const permission = await Camera.requestCameraPermission();
    console.log(`Camera permission status: ${permission}`);

    if (permission === 'denied') await Linking.openSettings();
    setCameraPermissionStatus(permission);
  }, []);

  useEffect(() => {
    if (cameraPermissionStatus === 'authorized') {
        navigation.replace('CameraPage');
    }
  }, [cameraPermissionStatus, navigation]);
  return (
    <Modal
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.container}>
          <View style={styles.modalView}>
              <Text style={styles.title}>Camera access required</Text>
              <View style={styles.permissionsContainer}>
                {cameraPermissionStatus !== 'granted' && (
                  <TouchableOpacity onPress={requestCameraPermission}>
                    <Text style={styles.permissionText}>Allow</Text>
                  </TouchableOpacity>
                )}
              </View>
          </View>
        </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    maxWidth: '100%',
    color: '#111f22',
  },
  modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  permissionsContainer: {
    marginTop: 10 * 2,
  },
  permissionText: {
    fontSize: 20,
    color: '#007aff',
    fontWeight: 'bold',
  },
});