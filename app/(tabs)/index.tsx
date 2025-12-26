import { useAuth } from '@/components/contex/auth-context';
import { useTodos } from '@/hooks/useTodos';
import { Task } from '@/types/Task';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TaskItem = ({ task, onToggle, onDelete, onEdit }: { task: Task, onToggle: any, onDelete: any, onEdit: any }) => (
    <View style={styles.taskItem}>
        <TouchableOpacity 
            onPress={() => onToggle(task.id, task.completed)} 
            style={styles.checkboxContainer}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
            <MaterialCommunityIcons 
                name={task.completed ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'} 
                size={28} 
                color={task.completed ? '#068b39ff' : '#aaa'} 
            />
        </TouchableOpacity>
        
        <View style={styles.taskContent}>
            <Text style={[styles.taskTitle, task.completed && styles.completedTaskTitle]}>
                {task.title}
            </Text>
            {task.location && (
                <Text style={styles.locationText}>
                    📍 {task.location.latitude?.toFixed(4)}, {task.location.longitude?.toFixed(4)}
                </Text>
            )}
        </View>
        
        {task.photoUri ? (
            <Image source={{ uri: task.photoUri }} style={styles.taskImage} />
        ) : null}

        <TouchableOpacity onPress={() => onEdit(task)} style={styles.actionButton} hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}>
             <MaterialCommunityIcons name="pencil" size={24} color="#f0ad4e" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onDelete(task.id)} style={styles.actionButton} hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}>
             <MaterialCommunityIcons name="delete" size={24} color="#d9534f" />
        </TouchableOpacity>
    </View>
);

const ListHeader = ({ onLogout, onRefresh }: { onLogout: () => void, onRefresh: () => void }) => (
    <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
            <TouchableOpacity onPress={onRefresh} style={styles.iconButton}>
                <MaterialCommunityIcons name="refresh" size={24} color="#068b39ff" />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>🍩 Springfield APP 🍩</Text>
            
            <TouchableOpacity onPress={onLogout} style={styles.iconButton}>
                <MaterialCommunityIcons name="logout" size={24} color="#d9534f" />
            </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>Examen</Text>
    </View>
);

const TaskListScreen: React.FC = () => {
    const { tasks, loading, loadTasks, toggleTaskStatus, deleteTask } = useTodos();
    const { logout } = useAuth();
    const router = useRouter();

    const handleEdit = (task: Task) => {
        router.push({
            pathname: '/edit-task',
            params: { 
                id: task.id, 
                title: task.title, 
                completed: String(task.completed) 
            }
        });
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={tasks}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TaskItem 
                        task={item} 
                        onToggle={toggleTaskStatus} 
                        onDelete={deleteTask}
                        onEdit={handleEdit}
                    />
                )}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={loadTasks} colors={['#068b39ff']} />
                }
                ListEmptyComponent={() => (
                    !loading ? <Text style={styles.emptyText}>No tienes tareas. ¡Crea una!</Text> : null
                )}
                ListHeaderComponent={<ListHeader onLogout={logout} onRefresh={loadTasks} />}
                contentContainerStyle={tasks.length === 0 ? styles.listEmpty : { paddingBottom: 100 }}
                style={{ width: '100%', paddingHorizontal: 10 }}
            />

            {loading && tasks.length === 0 && (
                <View style={styles.loaderOverlay}>
                    <ActivityIndicator size="large" color="#f9c235" />
                    <Text>Cargando...</Text>
                </View>
            )}

            <TouchableOpacity 
                style={styles.addButton} 
                onPress={() => router.push('/create-task')}
                activeOpacity={0.8}
            >
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f0f0', paddingTop: 10 },
    headerContainer: { alignItems: 'center', paddingVertical: 15, backgroundColor: '#fff', marginBottom: 10, borderRadius: 8, elevation: 2 },
    headerTop: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#f9c235' },
    headerSubtitle: { fontSize: 12, color: '#666' },
    iconButton: { padding: 8 },
    listEmpty: { flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 300 },
    emptyText: { fontSize: 18, color: '#666', textAlign: 'center', marginTop: 20 },
    
    taskItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 10, elevation: 3 },
    checkboxContainer: { padding: 5, marginRight: 10 },
    taskContent: { flex: 1, marginRight: 5 },
    taskTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
    completedTaskTitle: { textDecorationLine: 'line-through', color: '#888' },
    locationText: { fontSize: 11, color: '#666', fontStyle: 'italic', marginTop: 2 },
    taskImage: { width: 50, height: 50, borderRadius: 8, resizeMode: 'cover', marginHorizontal: 5, backgroundColor: '#eee' },
    
    actionButton: { padding: 8, marginLeft: 2 },
    
    loaderOverlay: { position: 'absolute', top: '50%', left: 0, right: 0, alignItems: 'center' },
    addButton: { position: 'absolute', bottom: 30, right: 30, width: 60, height: 60, borderRadius: 30, backgroundColor: '#068b39ff', justifyContent: 'center', alignItems: 'center', elevation: 5 },
    addButtonText: { fontSize: 32, color: '#fff', lineHeight: 34, paddingBottom: 2 },
});

export default TaskListScreen;