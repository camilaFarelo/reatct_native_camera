import React, { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View, ViewProps, TouchableOpacity, Text } from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  State,
  TapGestureHandler,
  TapGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import Reanimated, {
  cancelAnimation,
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  withSpring,
  withTiming,
  useAnimatedGestureHandler,
  useSharedValue,
  withRepeat,
} from 'react-native-reanimated';
import type { Camera, PhotoFile, TakePhotoOptions, VideoFile } from 'react-native-vision-camera';
import { CAPTURE_BUTTON_SIZE } from './Constants';


const BORDER_WIDTH = CAPTURE_BUTTON_SIZE * 0.1;

interface Props extends ViewProps {
  camera: React.RefObject<Camera>;
  onMediaCaptured: (media: PhotoFile | VideoFile, type: 'photo' | 'video') => void;

  minZoom: number;
  maxZoom: number;
  cameraZoom: Reanimated.SharedValue<number>;

  flash: 'off' | 'on';

  enabled: boolean;

}

const _TakePhotoButton: React.FC<Props> = ({
  camera,
  onMediaCaptured,
  flash,
  enabled,
  style,
  ...props
}): React.ReactElement => {
  const takePhotoOptions = useMemo<TakePhotoOptions>(
    () => ({
      photoCodec: 'jpeg',
      qualityPrioritization: 'speed',
      flash: flash,
      quality: 90,
      enableShutterSound: false,
    }),
    [flash],
  );

  const takePhoto = useCallback(async () => {
    try {
      if (camera.current == null) throw new Error('Camera ref is null!');
      const photo = await camera.current.takePhoto(takePhotoOptions);
      onMediaCaptured(photo, 'photo');
    } catch (e) {
    }
  }, [camera, onMediaCaptured, takePhotoOptions]);

  const onTakePhoto = useCallback(
    async () => {
      await takePhoto();
    },
    [takePhoto],
  );

  const shadowStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          scale: withSpring(0, {
            mass: 1,
            damping: 35,
            stiffness: 300,
          }),
        },
      ],
    }),
    [],
  );

  return (
    <View style={styles.flex}>
        <Reanimated.View style={[styles.shadow, shadowStyle]} />
        <TouchableOpacity style={styles.button} onPress={onTakePhoto} disabled={!enabled}/>
    </View>
  );
};

export const TakePhotoButton = React.memo(_TakePhotoButton);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10,
  },
  shadow: {
    position: 'absolute',
    width: CAPTURE_BUTTON_SIZE,
    height: CAPTURE_BUTTON_SIZE,
    borderRadius: CAPTURE_BUTTON_SIZE / 2,
    backgroundColor: '#e34077',
  },
  button: {
    width: CAPTURE_BUTTON_SIZE,
    height: CAPTURE_BUTTON_SIZE,
    borderRadius: CAPTURE_BUTTON_SIZE / 2,
    borderWidth: BORDER_WIDTH,
    borderColor: 'white',
  },
});