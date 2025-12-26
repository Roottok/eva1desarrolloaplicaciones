import { AuthProvider, useAuth } from '@/components/contex/auth-context';
import { TaskProvider } from '@/components/contex/task-context';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

const InitialLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated && segments[0] === 'login') {
      router.replace('/(tabs)');
    } else if (!isAuthenticated && segments[0] !== 'login') {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return <Slot />;
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <TaskProvider>
        <InitialLayout />
      </TaskProvider>
    </AuthProvider>
  );
}