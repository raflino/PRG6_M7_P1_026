import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View, Text, SafeAreaView, StyleSheet,
  TouchableOpacity, ScrollView, Alert, TextInput, ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';

const HomeScreen = ({ navigation }) => {
  const { userData } = useContext(AuthContext);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState('Memuat jam...');
  const [note, setNote] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const noteInputRef = useRef(null);
  const BASE_URL = "http://10.1.12.109:8080/api/presensi";

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('id-ID', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = async () => {
    if (isCheckedIn) return Alert.alert("Perhatian", "Anda sudah Check In.");
    if (note.trim() === '') {
      Alert.alert("Peringatan", "Catatan kehadiran wajib diisi!");
      noteInputRef.current.focus();
      return;
    }

    setIsPosting(true);
    const now = new Date();

    const payload = {
      kodeMk: "TRPL205",
      course: "Mobile Programming",
      status: "Present",
      nimMhs: userData.nim_mhs,
      pertemuanKe: 5,
      date: now.toISOString().split('T')[0],
      jamPresensi: now.toLocaleTimeString('id-ID', { hour12: false }),
      ruangan: "Lab Komputer 3",
      dosenPengampu: "Tim Dosen TRPL"
    };

    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        setIsCheckedIn(true);
        Alert.alert("Berhasil!", "Presensi masuk ke Database.", [
          { text: "Lihat Riwayat", onPress: () => navigation.navigate("History") }
        ]);
      } else {
        Alert.alert("Gagal", result.message || "Terjadi kesalahan di server.");
      }
    } catch (error) {
      Alert.alert("Error Jaringan", "Pastikan IP Laptop benar dan Spring Boot berjalan.");
      console.error(error);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Attendance App</Text>
          <Text style={styles.clockText}>{currentTime}</Text>
        </View>

        <View style={styles.card}>
          <MaterialIcons name="person" size={40} color="#555" />
          <View style={{ marginLeft: 15 }}>
            <Text style={styles.name}>{userData.name}</Text>
            <Text>NIM : {userData.nim_mhs}</Text>
            <Text>Class : {userData.class}</Text>
          </View>
        </View>

        <View style={styles.classCard}>
          <Text style={styles.subtitle}>Today's Class</Text>
          <Text>Mobile Programming (TRPL205)</Text>
          <Text>08:00 - 10:00</Text>
          <Text>Lab 3</Text>

          <TextInput
            ref={noteInputRef}
            style={styles.inputCatatan}
            placeholder="Tulis catatan (cth: Hadir lab)"
            value={note}
            onChangeText={setNote}
            editable={!isCheckedIn}
          />

          {isPosting ? (
            <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 15 }} />
          ) : (
            <TouchableOpacity
              style={[styles.button, isCheckedIn && styles.buttonDisabled]}
              onPress={handleCheckIn}
              disabled={isCheckedIn}
            >
              <Text style={styles.buttonText}>
                {isCheckedIn ? "CHECKED IN" : "CHECK IN SEKARANG"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  clockText: { fontSize: 16, color: '#666' },
  card: { flexDirection: 'row', backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 20, alignItems: 'center' },
  name: { fontSize: 18, fontWeight: 'bold' },
  classCard: { backgroundColor: 'white', padding: 15, borderRadius: 10 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  inputCatatan: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginTop: 15, marginBottom: 15 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#ccc' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});

export default HomeScreen;