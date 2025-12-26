import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export const pickImage = async () => {
    try {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permiso necesario', 'Se necesita acceso a la galería para seleccionar imágenes.');
            return null;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
            base64: true, 
        });

        if (!result.canceled) {
            return result.assets[0];
        }
        return null;
    } catch (error) {
        Alert.alert('Error', 'Hubo un problema al abrir la galería.');
        return null;
    }
};