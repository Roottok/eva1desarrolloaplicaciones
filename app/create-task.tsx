import { useTodos } from '@/hooks/useTodos';
import { pickImage } from '@/services/file-photo-service';
import { imageService } from '@/services/image-service';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function CreateTaskScreen() {
  const [title, setTitle] = useState('');
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { createTask } = useTodos();

  const handlePickImage = async () => {
    const result = await pickImage();
    if (result) {
        setLocalImageUri(result.uri); 
    }
  };

  const handleCreate = async () => {
    if (!title.trim()) return Alert.alert('Falta el título');

    setIsSubmitting(true);
    let finalPhotoUrl = "";

    if (localImageUri) {
        const uploadedUrl = await imageService.uploadImage(localImageUri);
        if (uploadedUrl) {
            finalPhotoUrl = uploadedUrl;
        } else {
            Alert.alert("Aviso", "Falló la subida de imagen, se guardará sin foto.");
        }
    }

    const newTask = {
      title,
      completed: false,
      location: { latitude: -33.4489, longitude: -70.6693 },
      photoUri: finalPhotoUrl 
    };

    const success = await createTask(newTask);
    setIsSubmitting(false);

    if (success) {
        Alert.alert('Éxito', 'Tarea creada');
        router.back();
    } else {
        Alert.alert('Error', 'No se pudo guardar la tarea');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerTitle}>Nueva Tarea</Text>
        <View style={styles.formCard}>
            <Text style={styles.label}>Título:</Text>
            <TextInput style={styles.input} placeholder="Ir al Kwik-E-Mart" value={title} onChangeText={setTitle} />

            <Pressable style={styles.photoButton} onPress={handlePickImage}>
                <MaterialCommunityIcons name="camera" size={24} color="#fff" />
                <Text style={styles.photoButtonText}>{localImageUri ? 'Cambiar Foto' : 'Imagenes'}</Text>
            </Pressable>

            {localImageUri ? (
                <Image 
                    source={{ uri: localImageUri }} 
                    style={styles.imagePreview} 
                />
            ) : null}

            <Pressable style={[styles.createButton, isSubmitting && styles.disabledButton]} onPress={handleCreate} disabled={isSubmitting}>
                {isSubmitting ? <ActivityIndicator color="#fff"/> : <Text style={styles.createButtonText}>GUARDAR TAREA</Text>}
            </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  scrollContainer: { padding: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#f9c235', textAlign: 'center', marginVertical: 20 },
  formCard: { backgroundColor: 'white', padding: 20, borderRadius: 15 },
  label: { fontSize: 16, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 15 },
  photoButton: { flexDirection: 'row', backgroundColor: '#3498db', padding: 10, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  photoButtonText: { color: 'white', marginLeft: 10, fontWeight: 'bold' },
  imagePreview: { width: '100%', height: 200, borderRadius: 10, marginBottom: 15, resizeMode: 'cover' },
  createButton: { backgroundColor: '#068b39ff', padding: 15, borderRadius: 10, alignItems: 'center' },
  disabledButton: { backgroundColor: '#ccc' },
  createButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});