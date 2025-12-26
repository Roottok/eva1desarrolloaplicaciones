import { useTodos } from '@/hooks/useTodos';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View
} from 'react-native';

export default function EditTaskScreen() {
  const params = useLocalSearchParams();
  const id = params.id as string;
  const initialTitle = params.title as string;
  const initialCompleted = params.completed === 'true';

  const [title, setTitle] = useState(initialTitle || '');
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { editTask } = useTodos();

  const handleSave = async () => {
    if (!title.trim()) return Alert.alert('Error', 'El título no puede estar vacío');

    setIsSubmitting(true);
    const success = await editTask(id, title, isCompleted);
    setIsSubmitting(false);

    if (success) {
        Alert.alert('Éxito', 'Tarea actualizada');
        router.back();
    } else {
        Alert.alert('Error', 'No se pudo actualizar la tarea');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerTitle}>Editar Tarea</Text>

        <View style={styles.formCard}>
            <Text style={styles.label}>Título:</Text>
            <TextInput 
                style={styles.input} 
                value={title} 
                onChangeText={setTitle} 
            />

            <View style={styles.switchContainer}>
                <Text style={styles.label}>Estado: {isCompleted ? 'Terminada' : 'Pendiente'}</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isCompleted ? "#068b39ff" : "#f4f3f4"}
                    onValueChange={setIsCompleted}
                    value={isCompleted}
                />
            </View>

            <Pressable 
                style={[styles.saveButton, isSubmitting && styles.disabledButton]} 
                onPress={handleSave} 
                disabled={isSubmitting}
            >
                {isSubmitting ? <ActivityIndicator color="#fff"/> : <Text style={styles.saveButtonText}>GUARDAR CAMBIOS</Text>}
            </Pressable>

            <Pressable style={styles.cancelButton} onPress={() => router.back()}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
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
  label: { fontSize: 16, marginBottom: 5, fontWeight: '600', color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 16 },
  
  switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  
  saveButton: { backgroundColor: '#068b39ff', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  disabledButton: { backgroundColor: '#ccc' },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  
  cancelButton: { padding: 15, alignItems: 'center' },
  cancelButtonText: { color: '#d9534f', fontSize: 16 },
});