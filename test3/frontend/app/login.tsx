import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const API_URL = Constants.manifest?.extra?.API_URL || "http://localhost:8001/api";

export default function Login() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const router = useRouter();

const handleLogin = async () => {
  try {
    const res = await fetch(`${API_URL}/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    const meRes = await fetch(`${API_URL}/me/`, {
      headers: { Authorization: `Bearer ${data.access}` },
    });
    const meData = await meRes.json();

    await AsyncStorage.setItem('access', data.access);
    await AsyncStorage.setItem('role', meData.is_admin ? 'admin' : 'user');


    router.replace('/(tabs)');
  } catch (err: any) {
    Alert.alert('Error', err.message);
  }
};

  const handleRegister = async () => {
    try {
      const res = await fetch(`${API_URL}/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      if (!res.ok) throw new Error('Registration failed');
      Alert.alert('Registered successfully! Now login.');
      setIsRegister(false);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegister ? 'Register' : 'Login'}</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        placeholderTextColor="#aaa"
      />
      {isRegister && (
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholderTextColor="#aaa"
        />
      )}
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#aaa"
      />
      <TouchableOpacity style={styles.button} onPress={isRegister ? handleRegister : handleLogin}>
        <Text style={styles.buttonText}>{isRegister ? 'Register' : 'Login'}</Text>
      </TouchableOpacity>
      <Text style={styles.toggle} onPress={() => setIsRegister(!isRegister)}>
        {isRegister ? 'Already have an account? Login' : 'No account? Register'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#064c8a' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#fff' },
  input: { borderWidth: 1, padding: 12, marginVertical: 5, borderRadius: 10, borderColor: '#ccc', backgroundColor: '#fff', color: '#000' },
  button: { backgroundColor: '#00bfff', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  toggle: { color: 'lightblue', marginTop: 10, textAlign: 'center' },
});
