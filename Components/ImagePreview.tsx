import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux'
import { StyleSheet, View, ActivityIndicator, TouchableOpacity, Text, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { Routes } from './Routes';
import FastImage, { OnLoadEvent } from 'react-native-fast-image';
import { addImg } from './../actions/images'

type Props = NativeStackScreenProps<Routes, 'ImagePreview'>;

export const ImagePreview = ({navigation, route}: Props): React.ReactElement => {
  const [hasMediaLoaded, setHasMediaLoaded] = useState(false);
  const [savingImg, setSavingImg] = useState<'none' | 'saving' | 'saved'>('none');
  const dispatch = useDispatch();
  const { path, type } = route.params;


  const onMediaLoadEnd = useCallback(() => {
    setHasMediaLoaded(true);
  }, []);

  const onSaveImage = useCallback(async () => {
      try {
        setSavingImg('saving');
        dispatch(addImg(`file://${path}`));
        navigation.navigate('Home');
        setSavingImg('saved');
      } catch (e) {
        const message = e instanceof Error ? e.message : JSON.stringify(e);
        setSavingImg('none');
        Alert.alert('Failed to save!', `An unexpected error occured while trying to save your ${type}. ${message}`);
      }
  }, [path, type])

  const onRetakeImage = () => {
    navigation.navigate('CameraPage');
  }

  const source = useMemo(() => ({ uri: `file://${path}` }), [path]);
  const screenStyle = useMemo(() => ({ opacity: hasMediaLoaded ? 1 : 0 }), [hasMediaLoaded]);
  return (
    <View style={[styles.container, screenStyle]}>
        <View style={styles.imgContainer}>
            <FastImage source={source} style={{flex: 1}} resizeMode="cover" onLoadEnd={onMediaLoadEnd} />
        </View>
        <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.button} onPress={onSaveImage} disabledOpacity={0.4}>
                {savingImg === 'saving' && <ActivityIndicator color="white" />}
                {savingImg === 'none' && <Text style={styles.buttonText}>Save</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onRetakeImage} disabledOpacity={0.4}>
                <Text style={styles.buttonText}>Retake</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'white',
  },
  imgContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 50,
    borderRadius: 20,
    color: 'white',
    margin: 5,
    backgroundColor: '#24463a',
  },
  actionsContainer: {
    paddingBottom: 10,
    position: 'absolute',
    flexDirection: 'row',
    backgroundColor: 'transparent'
  },
});