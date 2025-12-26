import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export const imageService = {
  async uploadImage(uri: string): Promise<string | null> {
    try {
      
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error("No se pudo subir imagen");
        return null;
      }

      const formData = new FormData();
      const filename = uri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('image', { uri, name: filename, type });

      console.log("Subiendo imagen a /images...");

      const response = await api.post('/images', formData, {
        headers: { 
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}` 
        },
      });

      console.log("Imagen subida, URL:", response.data.data.url);
      return response.data.data.url; 
    } catch (error: any) {
      console.error("Error subiendo imagen:", error.response?.status, error.response?.data);
      return null;
    }
  }
};