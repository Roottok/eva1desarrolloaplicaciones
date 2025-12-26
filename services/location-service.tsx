import * as Location from 'expo-location';

export async function getCurrentLocation() {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    alert('Permiso de ubicación denegado. No se podrá guardar la localización de la tarea.');
    return null; 
  }

  let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
  
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
}