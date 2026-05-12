import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { fetchPresensiByNim } from '../services/api';

const HistoryScreen = () => {
    const [presensiList, setPresensiList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    
    const NIM_MAHASISWA = "0325260031";

    useEffect(() => {
        loadPresensiHistory();
    }, []);

    const loadPresensiHistory = async () => {
        try {
            const data = await fetchPresensiByNim(NIM_MAHASISWA);
            setPresensiList(data);
        } catch (error) {
            console.error('Error loading history:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadPresensiHistory();
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.kodeMk}>{item.kodeMk}</Text>
                <Text style={[styles.status, item.status === 'Present' && styles.statusPresent]}>
                    {item.status === 'Present' ? '✓ Hadir' : item.status}
                </Text>
            </View>
            
            <Text style={styles.namaMatkul}>{item.namaMatkul}</Text>
            
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Pertemuan:</Text>
                <Text style={styles.detailValue}>ke-{item.pertemuanKe}</Text>
            </View>
            
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Ruangan:</Text>
                <Text style={styles.detailValue}>{item.ruangan}</Text>
            </View>
            
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tanggal:</Text>
                <Text style={styles.detailValue}>{item.date}</Text>
            </View>
            
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Jam:</Text>
                <Text style={styles.detailValue}>{item.jamPresensi}</Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>Memuat riwayat presensi...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Riwayat Presensi</Text>
            <Text style={styles.subtitle}>NIM: {NIM_MAHASISWA}</Text>
            
            <FlatList
                data={presensiList}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Belum ada riwayat presensi</Text>
                        <Text style={styles.emptySubText}>
                            Silakan scan QR Code dari dosen untuk melakukan presensi
                        </Text>
                    </View>
                }
                contentContainerStyle={presensiList.length === 0 && styles.emptyList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 5,
        color: '#333',
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 15,
        color: '#666',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 14,
        color: '#666',
    },
    card: {
        backgroundColor: '#fff',
        marginHorizontal: 15,
        marginVertical: 8,
        padding: 15,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    kodeMk: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007bff',
    },
    namaMatkul: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    status: {
        fontSize: 12,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 20,
        backgroundColor: '#e0e0e0',
        overflow: 'hidden',
    },
    statusPresent: {
        backgroundColor: '#4caf50',
        color: '#fff',
    },
    detailRow: {
        flexDirection: 'row',
        marginTop: 5,
    },
    detailLabel: {
        width: 70,
        fontSize: 14,
        color: '#666',
    },
    detailValue: {
        flex: 1,
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 10,
    },
    emptySubText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    emptyList: {
        flexGrow: 1,
        justifyContent: 'center',
    },
});

export default HistoryScreen;