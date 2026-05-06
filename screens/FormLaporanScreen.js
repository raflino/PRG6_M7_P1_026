import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import { submitLaporan } from '../services/api';

const FormLaporanScreen = ({ navigation }) => {
  const [namaPelapor, setNamaPelapor] = useState('');
  const [idKereta, setIdKereta] = useState('Argo Bromo (701A)');
  const [kategori, setKategori] = useState('Kendala Mesin');
  const [deskripsi, setDeskripsi] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const daftarKereta = [
    'Argo Bromo (701A)',
    'Taksaka (702B)',
    'Argo Wilis (703C)',
    'Gajayana (704D)',
    'Bima (705E)',
    'Turangga (706F)'
  ];

  const daftarKategori = [
    { label: 'Kendala Mesin', value: 'Kendala Mesin', color: '#D32F2F' },
    { label: 'Fasilitas', value: 'Fasilitas', color: '#1976D2' },
    { label: 'Kebersihan', value: 'Kebersihan', color: '#388E3C' },
    { label: 'Pelayanan', value: 'Pelayanan', color: '#F57C00' },
    { label: 'Keterlambatan', value: 'Keterlambatan', color: '#7B1FA2' },
    { label: 'Tiket', value: 'Tiket', color: '#C2185B' }
  ];

  const isFormValid = namaPelapor.trim() !== '' && deskripsi.trim().length >= 20;

  const handleSubmit = async () => {
    if (!isFormValid) {
     
    }

    setIsSubmitting(true);

    try {
      const laporanBaru = {
        namaPelapor: namaPelapor.trim(),
        idKereta,
        kategori,
        deskripsi: deskripsi.trim()
      };

      const result = await submitLaporan(laporanBaru);
      
      Alert.alert(
        'Berhasil!',
        `Laporan Anda telah terkirim.\nID Laporan: ${result.id}`,
        [
          { 
            text: 'Lihat Riwayat', 
            onPress: () => navigation.navigate('Riwayat') 
          },
          { 
            text: 'OK', 
            style: 'cancel' 
          }
        ]
      );

      setNamaPelapor('');
      setDeskripsi('');
      
    } catch (error) {
      Alert.alert('Error', 'Gagal mengirim laporan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deskripsiLength = deskripsi.length;
  const isDeskripsiValid = deskripsiLength >= 20;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Buat Laporan Baru</Text>
          <Text style={styles.subtitle}>
            Silakan isi form di bawah ini untuk melaporkan keluhan atau saran Anda
          </Text>

          <Text style={styles.label}>Nama Pelapor</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan nama lengkap Anda"
            value={namaPelapor}
            onChangeText={setNamaPelapor}
          />

          <Text style={styles.label}>ID Kereta</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={idKereta}
              onValueChange={(itemValue) => setIdKereta(itemValue)}
              style={styles.picker}
            >
              {daftarKereta.map((kereta, index) => (
                <Picker.Item key={index} label={kereta} value={kereta} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Kategori Kendala</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={kategori}
              onValueChange={(itemValue) => setKategori(itemValue)}
              style={styles.picker}
            >
              {daftarKategori.map((kat, index) => (
                <Picker.Item key={index} label={kat.label} value={kat.value} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Deskripsi</Text>
          <TextInput
            style={[styles.textArea, !isDeskripsiValid && deskripsiLength > 0 && styles.inputWarning]}
            placeholder="Jelaskan keluhan atau saran Anda secara detail..."
            value={deskripsi}
            onChangeText={setDeskripsi}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
          
          {isFormValid && (
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <MaterialIcons name="send" size={20} color="#fff" />
                  <Text style={styles.submitButtonText}>Kirim Laporan</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {!isFormValid && (
            <View style={styles.infoContainer}>
              <MaterialIcons name="info" size={16} color="#ffffff" />
              <Text style={styles.infoText}>
                {deskripsiLength < 20 
                  ? `Deskripsi masih kurang ${20 - deskripsiLength} karakter lagi` 
                  : 'Nama Pelapor harus diisi'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fafafa',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fafafa',
    minHeight: 100,
  },
  inputWarning: {
    backgroundColor: '#FFF8E1',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fafafa',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 5,
    gap: 5,
  },
  counterText: {
    fontSize: 12,
  },
  counterValid: {
    color: '#4CAF50',
  },
  counterInvalid: {
    color: '#ffffff',
  },
  submitButton: {
    backgroundColor: '#D32F2F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    gap: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
 
});

export default FormLaporanScreen;