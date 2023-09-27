import * as React from 'react';
import { useRef, useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { CameraRuntimeError, PhotoFile, useCameraDevices, useCameraFormat, useFrameProcessor } from 'react-native-vision-camera';
import { Camera } from 'react-native-vision-camera';
import { MAX_ZOOM_FACTOR } from './Constants';
import Reanimated, { Extrapolate, interpolate, useAnimatedGestureHandler, useAnimatedProps, useSharedValue } from 'react-native-reanimated';
import { useEffect } from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import type { Routes } from './Routes';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/core';
import { examplePlugin } from './frame-processors/ExamplePlugin';
import { TakePhotoButton } from './TakePhotoButton';

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
Reanimated.addWhitelistedNativeProps({
  zoom: true,
});

const SCALE_FULL_ZOOM = 3;
const BUTTON_SIZE = 40;

type Props = NativeStackScreenProps<Routes, 'CameraPage'>;
export const CameraPage = ({ navigation }: Props): React.ReactElement => {
  const camera = useRef<Camera>(null);
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const zoom = useSharedValue(0);
  const isActive = true;

  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>('back');
  const [flash, setFlash] = useState<'off' | 'on'>('off');

  const devices = useCameraDevices();
  const device = devices?.[cameraPosition];

  const format = useCameraFormat(device, [
    { videoResolution: { width: 3048, height: 2160 } },
    { fps: 60 }
  ])

  const supportsFlash = device?.hasFlash ?? false;

  const onInitialized = useCallback(() => {
    console.log('Camera initialized!');
    setIsCameraInitialized(true);
  }, []);
  const onMediaCaptured = useCallback(
    (media: PhotoFile, type: 'photo') => {
      navigation.navigate('ImagePreview', {
        path: media.path,
        type: type,
      });
    },
    [navigation],
  );
  const onCloseCamera = () => {
    navigation.goBack();
  };
  const onFlipCameraPressed = useCallback(() => {
    setCameraPosition((p) => (p === 'back' ? 'front' : 'back'));
  }, []);
  const onFlashPressed = useCallback(() => {
    setFlash((f) => (f === 'off' ? 'on' : 'off'));
  }, []);

  return (
    <View style={styles.container}>
      {device == null ? null : (
          <Reanimated.View style={StyleSheet.absoluteFill}>
              <ReanimatedCamera
                ref={camera}
                style={StyleSheet.absoluteFill}
                device={device}
                format={format}
                isActive={true}
                onInitialized={onInitialized}
                orientation="portrait"
                photo={true}
              />
          </Reanimated.View>
      )}

      <TakePhotoButton
        style={styles.captureButton}
        camera={camera}
        onMediaCaptured={onMediaCaptured}
        flash={supportsFlash ? flash : 'off'}
        enabled={isCameraInitialized && isActive}
      />

      <View style={styles.rightButtonRow}>
        <TouchableOpacity style={styles.button} onPress={onCloseCamera} disabledOpacity={0.4}>
          <IonIcon name="close" color="white" size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onFlipCameraPressed} disabledOpacity={0.4}>
          <IonIcon name="camera-reverse" color="white" size={24} />
        </TouchableOpacity>
        {supportsFlash && (
          <TouchableOpacity style={styles.button} onPress={onFlashPressed} disabledOpacity={0.4}>
            <IonIcon name={flash === 'on' ? 'flash' : 'flash-off'} color="white" size={24} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  captureButton: {
    position: 'absolute',
    alignSelf: 'center',
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: 'rgba(140, 140, 140, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginLeft: 5,
  },
});
