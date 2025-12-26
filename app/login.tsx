import { useAuth } from '@/components/contex/auth-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

const LoginScreen = () => {
  const [email, setEmail] = useState('eduardo.h@ipss.cl');
  const [password, setPassword] = useState('test123');
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa correo y contraseña');
      return;
    }
    await login(email.trim(), password.trim());
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>🍩Springfield App🍩</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="email-outline" size={24} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="lock-outline" size={24} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#999"
            />
          </View>

          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>INGRESAR</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  contentContainer: { flex: 1, justifyContent: 'center', padding: 20 },
  headerContainer: { alignItems: 'center', marginBottom: 40 },
  // Eliminé el estilo 'logo' ya que no se usa
  title: { fontSize: 28, fontWeight: 'bold', color: '#f9c235', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 5 },
  formContainer: { backgroundColor: 'white', padding: 20, borderRadius: 15, elevation: 5 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ddd', marginBottom: 20, paddingHorizontal: 10 },
  icon: { marginRight: 10 },
  input: { flex: 1, height: 50, fontSize: 16, color: '#333' },
  button: { backgroundColor: '#068b39ff', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

export default LoginScreen;