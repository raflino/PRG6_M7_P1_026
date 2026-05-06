import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { fetchLaporan, searchLaporan } from '../services/api';

const RiwayatScreen = () => {
  const [laporanData, setLaporanData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const loadData = async () => {
    try {
      const data = await fetchLaporan();
      setLaporanData(data);
      setFilteredData(data);
    } catch (error) {
      Alert.alert('Error', 'Gagal memuat data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = async (keyword) => {
    setSearchKeyword(keyword);
    
    if (keyword.trim() === '') {
      setFilteredData(laporanData);
      return;
    }
    
    setIsSearching(true);
    try {
      const results = await searchLaporan(keyword);
      setFilteredData(results);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    setSearchKeyword('');
    loadData();
  }, []);

  const getCategoryStyle = (kategori) => {
    switch (kategori) {
      case 'Kendala Mesin':
        return { backgroundColor: '#9da19e' };
      case 'Fasilitas':
        return { backgroundColor: '#9da19e' };
      case 'Kebersihan':
        return { backgroundColor: '#9da19e' };
      case 'Pelayanan':
        return { backgroundColor: '#9da19e' };
      case 'Keterlambatan':
        return { backgroundColor: '#9da19e' };
      case 'Tiket':
        return { backgroundColor: '#9da19e' };
      default:
        return { backgroundColor: '#9da19e' };
    }
  };

  const getStatusStyle = (status) => {
    if (status === 'Selesai') {
      return { backgroundColor: '#E8F5E9', textColor: '#4CAF50' };
    }
    return { backgroundColor: '#FFF3E0', textColor: '#FF9800' };
  };

  const renderItem = ({ item }) => {
    const categoryStyle = getCategoryStyle(item.kategori);
    const statusStyle = getStatusStyle(item.status);

    return (
      <TouchableOpacity style={styles.itemCard}>
        <View style={[styles.categoryBadge, { backgroundColor: categoryStyle.backgroundColor }]}>
          <MaterialIcons name={categoryStyle.icon} size={16} color={categoryStyle.textColor} />
          <Text style={[styles.categoryText, { color: categoryStyle.textColor }]}>
            {item.kategori}
          </Text>
        </View>

    
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
          <Text style={[styles.statusText, { color: statusStyle.textColor }]}>
            {item.status}
          </Text>
        </View>

       
        <Text style={styles.namaPelapor}>{item.namaPelapor}</Text>
        <View style={styles.keretaRow}>
          <MaterialIcons name="train" size={14} color="#666" />
          <Text style={styles.idKereta}>{item.idKereta}</Text>
        </View>

        <Text style={styles.deskripsi} numberOfLines={2}>
          {item.deskripsi}
        </Text>

        
        <View style={styles.tanggalRow}>
          <MaterialIcons name="access-time" size={12} color="#999" />
          <Text style={styles.tanggal}>{item.tanggal}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D32F2F" />
        <Text style={styles.loadingText}>Sedang memuat data laporan...</Text>
        <Text style={styles.loadingSubtext}>Mohon tunggu sebentar</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="search"
          value={searchKeyword}
          onChangeText={handleSearch}
        />
        {searchKeyword !== '' && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <MaterialIcons name="close" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {isSearching ? (
        <View style={styles.searchingContainer}>
          <ActivityIndicator size="small" color="#D32F2F" />
          <Text style={styles.searchingText}>Mencari...</Text>
        </View>
      ) : (
        <>
          <Text style={styles.resultCount}>
            Menampilkan {filteredData.length} laporan
          </Text>
          
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                colors={['#D32F2F']}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MaterialIcons name="inbox" size={50} color="#ccc" />
                <Text style={styles.emptyText}>Belum ada laporan</Text>
                <Text style={styles.emptySubtext}>
                  {searchKeyword ? 'Coba kata kunci lain' : 'Buat laporan baru di halaman Form'}
                </Text>
              </View>
            }
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#D32F2F',
    fontWeight: '500',
  },
  loadingSubtext: {
    marginTop: 4,
    fontSize: 12,
    color: '#999',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    fontSize: 14,
  },
  searchingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  searchingText: {
    marginLeft: 8,
    color: '#D32F2F',
  },
  resultCount: {
    fontSize: 12,
    color: '#666',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
    gap: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  namaPelapor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  keretaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  idKereta: {
    fontSize: 12,
    color: '#666',
  },
  deskripsi: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
    marginBottom: 8,
  },
  tanggalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tanggal: {
    fontSize: 10,
    color: '#999',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 5,
  },
});

export default RiwayatScreen;