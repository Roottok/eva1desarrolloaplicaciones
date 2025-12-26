import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export const authService = {
  async login(email: string, password: string) {
    try {
      console.log("📨 Enviando a:", api.getUri() + '/auth/login');
      
      // Axios stringify el body automáticamente, no uses JSON.stringify
      const response = await api.post('/auth/login', { 
        email: email.trim(), 
        password: password.trim() 
      });

      console.log("✅ Éxito:", response.status);
      
      const token = response.data.data?.token;

      if (token) {
        await AsyncStorage.setItem('userToken', token);
        return true;
      }
      return false;
    } catch (error: any) {
      // 🕵️‍♂️ AQUÍ VAMOS A VER EL ERROR REAL
      if (error.response) {
        // El servidor respondió con un error (ej: 400, 401, 500)
        console.error("❌ Error Servidor:", error.response.status, error.response.data);
      } else if (error.request) {
        // La petición salió pero no hubo respuesta (Problema de red)
        console.error("❌ Sin respuesta (Network Error). ¿Es HTTPS?", error.message);
      } else {
        console.error("❌ Error configuración:", error.message);
      }
      return false;
    }
  },

  async logout() {
    await AsyncStorage.removeItem('userToken');
  }
};