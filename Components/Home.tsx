import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import type { Routes } from './Routes';
import { PermissionsModal } from './PermissionsModal';
import { ImgGallery } from './ImgGallery';

type Props = NativeStackScreenProps<Routes, 'ImagesView'>;

export const Home = ({navigation, showPermissionsPage}: Props): React.ReactElement => {
 const [modalVisible, setModalVisible] = useState(false);
 const onOpenCamara = () => {
     if (showPermissionsPage) {
        return setModalVisible(true);
     }
    navigation.navigate(showPermissionsPage ? 'PermissionsPage' : 'CameraPage');
 }
  return (
    <View style={styles.container}>
        <PermissionsModal modalVisible={modalVisible} onSetModalVisible={setModalVisible} navigation={navigation}/>
        <ImgGallery/>
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onOpenCamara}>
                <Icon name="camera" size={30} color="#fff"/>
            </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    backgroundColor: '#24463a',
  },
  buttonContainer: {
    padding: 10,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    color: 'yellow',
    backgroundColor: '#111f22',
  },
});