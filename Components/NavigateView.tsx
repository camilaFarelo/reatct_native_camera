import React, { useEffect, useState } from 'react';
import {Text} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Camera, CameraPermissionStatus } from 'react-native-vision-camera';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CameraPage } from './CameraPage';
import { Home } from './Home';
import { ImagePreview } from './ImagePreview';

const Stack = createNativeStackNavigator();

export function NavigateView(): React.ReactElement | null {
    const [cameraPermission, setCameraPermission] = useState<CameraPermissionStatus>();

    useEffect(() => {
        Camera.getCameraPermissionStatus().then(setCameraPermission);
    }, []);

    if (cameraPermission == null) {
        // still loading
        return null;
    }

    const showPermissionsPage = cameraPermission !== 'authorized';
    return (
        <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                        statusBarStyle: 'dark',
                        animationTypeForReplace: 'push',
                    }}
                    initialRouteName="Home">
                    <Stack.Screen name="Home">
                        {props => <Home showPermissionsPage={showPermissionsPage} {...props}/>}
                    </Stack.Screen>
                    <Stack.Screen name="CameraPage" component={CameraPage} />
                    <Stack.Screen
                        name="ImagePreview"
                        component={ImagePreview}
                        options={{
                            animation: 'none',
                            presentation: 'transparentModal',
                        }}
                    />
                </Stack.Navigator>
        </NavigationContainer>
    );
}