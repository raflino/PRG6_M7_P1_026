import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function DetailScreen({ route }) {
  const { dataPresensi } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerIcon}>
          <MaterialIcons 
            name={dataPresensi.status === "Present" ? "check-circle" : "cancel"} 
            size={60} 
            color={dataPresensi.status === "Present" ? "#4CAF50" : "#f44336"} 
          />
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Mata Kuliah</Text>
          <Text style={styles.value}>{dataPresensi.course}</Text>
          
          <Text style={styles.label}>Kode Mata Kuliah</Text>
          <Text style={styles.value}>{dataPresensi.kodeMk}</Text>
          
          <Text style={styles.label}>Tanggal</Text>
          <Text style={styles.value}>{dataPresensi.date}</Text>
          
          <Text style={styles.label}>Jam Presensi</Text>
          <Text style={styles.value}>{dataPresensi.jamPresensi}</Text>
          
          <Text style={styles.label}>Pertemuan Ke-</Text>
          <Text style={styles.value}>{dataPresensi.pertemuanKe}</Text>
          
          <Text style={styles.label}>Status</Text>
          <Text style={[styles.value, dataPresensi.status === "Present" ? styles.presentText : styles.absentText]}>
            {dataPresensi.status}
          </Text>
          
          <Text style={styles.label}>NIM Mahasiswa</Text>
          <Text style={styles.value}>{dataPresensi.nimMhs}</Text>
          
          <Text style={styles.label}>Ruangan</Text>
          <Text style={styles.value}>{dataPresensi.ruangan}</Text>
          
          <Text style={styles.label}>Dosen Pengampu</Text>
          <Text style={styles.value}>{dataPresensi.dosenPengampu}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerIcon: {
    alignItems: 'center',
    marginBottom: 20,
  },
  infoContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  presentText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  absentText: {
    color: '#f44336',
    fontWeight: 'bold',
  },
});