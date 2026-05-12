import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { submitPresensi } from '../services/api';

const HomeScreen = ({ navigation }) => {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [loading, setLoading] = useState(false);
    const NIM_MAHASISWA = "0325260031";

    const handleBarCodeScanned = async ({ data }) => {
        if (scanned || loading) return;
        
        setScanned(true);
        
        try {
            
            const qrData = JSON.parse(data);
            
            
            if (!qrData.kodeMk || !qrData.pertemuanKe || !qrData.ruangan) {
                Alert.alert(
                    "QR Tidak Valid",
                    "QR Code tidak sesuai format presensi.",
                    [{ text: "Scan Lagi", onPress: () => setScanned(false) }]
                );
                return;
            }
            
            Alert.alert(
                "Konfirmasi Presensi",
                `Mata Kuliah: ${qrData.kodeMk}\nPertemuan ke-${qrData.pertemuanKe}\nRuangan: ${qrData.ruangan}\n\nLanjutkan presensi?`,
                [
                    { 
                        text: "Batal", 
                        onPress: () => setScanned(false),
                        style: "cancel" 
                    },
                    { 
                        text: "Ya, Presensi", 
                        onPress: () => submitPresensiData(qrData)
                    }
                ]
            );
        } catch (error) {
            Alert.alert(
                "QR Tidak Valid",
                "Pastikan Anda memindai QR Code presensi yang benar.",
                [{ text: "Scan Lagi", onPress: () => setScanned(false) }]
            );
        }
    };

    const submitPresensiData = async (qrData) => {
        setLoading(true);
        
        try {
            const result = await submitPresensi(qrData, NIM_MAHASISWA);
            
            Alert.alert(
                "Berhasil!",
                `Presensi untuk ${qrData.kodeMk} pertemuan ke-${qrData.pertemuanKe} telah dicatat.`,
                [
                    { 
                        text: "Lihat Riwayat", 
                        onPress: () => {
                            setScanned(false);
                            setLoading(false);
                            navigation.navigate('History');
                        }
                    },
                    { 
                        text: "Scan Lagi", 
                        onPress: () => {
                            setScanned(false);
                            setLoading(false);
                        }
                    }
                ]
            );
        } catch (error) {
            Alert.alert("Error", "Gagal menyimpan presensi. Silakan coba lagi.");
            setScanned(false);
            setLoading(false);
        }
    };

    if (!permission) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Memuat izin kamera...</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Aplikasi butuh akses kamera untuk presensi</Text>
                <TouchableOpacity style={styles.button} onPress={requestPermission}>
                    <Text style={styles.buttonText}>Berikan Izin Kamera</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>Menyimpan presensi...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing="front"
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ['qr'],
                }}
            />
            
            <View style={styles.overlay}>
                <View style={styles.scanArea}>
                    <View style={styles.cornerTopLeft} />
                    <View style={styles.cornerTopRight} />
                    <View style={styles.cornerBottomLeft} />
                    <View style={styles.cornerBottomRight} />
                </View>
                <Text style={styles.scanText}>
                    Arahkan QR Code ke dalam kotak
                </Text>
                {scanned && !loading && (
                    <TouchableOpacity 
                        style={styles.scanButton} 
                        onPress={() => setScanned(false)}
                    >
                        <Text style={styles.scanButtonText}>Scan Lagi</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    camera: {
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        color: '#fff',
        textAlign: 'center',
        margin: 20,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 10,
        alignSelf: 'center',
        marginTop: 20,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    scanArea: {
        width: 250,
        height: 250,
        position: 'relative',
    },
    cornerTopLeft: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 40,
        height: 40,
        borderTopWidth: 4,
        borderLeftWidth: 4,
        borderColor: '#00ff00',
    },
    cornerTopRight: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 40,
        height: 40,
        borderTopWidth: 4,
        borderRightWidth: 4,
        borderColor: '#00ff00',
    },
    cornerBottomLeft: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 40,
        height: 40,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
        borderColor: '#00ff00',
    },
    cornerBottomRight: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 40,
        height: 40,
        borderBottomWidth: 4,
        borderRightWidth: 4,
        borderColor: '#00ff00',
    },
    scanText: {
        color: '#fff',
        fontSize: 16,
        marginTop: 20,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    scanButton: {
        backgroundColor: '#ffc107',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        marginTop: 20,
    },
    scanButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default HomeScreen;