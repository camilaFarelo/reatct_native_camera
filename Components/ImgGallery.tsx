import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { useSelector } from 'react-redux'
import FastImage from 'react-native-fast-image';
import IonIcon from 'react-native-vector-icons/Ionicons';

export const ImgGallery = () => {
    const images = useSelector(({images}) => images.images);
    if (!images?.length) {
        return (
            <View style={styles.notFountTextContainer}>
                <IonIcon name="camera" color="#3c4649" size={24} />
                <Text style={styles.notFountText}>Not images found</Text>
            </View>
        );
    }
    return (
        <FlatList
            data={images}
            renderItem={({item}) => (
              <View style={styles.imageContainerStyle}>
                  <FastImage
                    resizeMode="cover"
                    style={styles.imageStyle}
                    source={{
                      uri: item,
                    }}
                  />
              </View>
            )}
            numColumns={3}
            keyExtractor={(item, index) => index.toString()}
        />
    );
}

const styles = StyleSheet.create({
    notFountTextContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notFountText: {
        color: '#3c4649',
        fontSize: 20,
    },
    imageContainerStyle: {
        flex: 1,
        flexDirection: 'column',
        margin: 2,
        maxWidth: 125,
        borderRadius: 10,
        overflow: 'hidden',
    },
    imageStyle: {
        height: 120,
        width: '100%',
    },
});