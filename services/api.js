

const mockApiData = [
  {
    id: '1',
    namaPelapor: 'Rafli Nova Ramadhan',
    idKereta: 'Argo Bromo (701A)',
    kategori: 'Kendala Mesin',
    deskripsi: 'Mesin kereta mengeluarkan suara tidak normal saat berjalan, getaran terasa hingga ke gerbong penumpang.',
    tanggal: '2026-05-05 10:30:00',
    status: 'Diproses'
  },
  {
    id: '2',
    namaPelapor: 'aultry efin',
    idKereta: 'Taksaka (702B)',
    kategori: 'Fasilitas',
    deskripsi: 'AC di gerbong eksekutif tidak berfungsi dengan baik, suhu sangat panas.',
    tanggal: '2026-05-04 14:20:00',
    status: 'Selesai'
  },
  {
    id: '3',
    namaPelapor: 'Cristiano ronaldo',
    idKereta: 'Argo Wilis (703C)',
    kategori: 'Kebersihan',
    deskripsi: 'Toilet di kereta sangat kotor dan tidak tersedia air bersih.',
    tanggal: '2026-05-03 09:15:00',
    status: 'Diproses'
  },
  {
    id: '4',
    namaPelapor: 'Megawati',
    idKereta: 'Gajayana (704D)',
    kategori: 'Pelayanan',
    deskripsi: 'Petugas tidak ramah saat memeriksa tiket dan kurang memberikan informasi.',
    tanggal: '2026-05-02 16:45:00',
    status: 'Selesai'
  },
  {
    id: '5',
    namaPelapor: 'Joko Anwar',
    idKereta: 'Bima (705E)',
    kategori: 'Kendala Mesin',
    deskripsi: 'Kereta sering berhenti mendadak di tengah perjalanan tanpa pemberitahuan.',
    tanggal: '2026-05-01 11:00:00',
    status: 'Diproses'
  }
];

export const fetchLaporan = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockApiData]);
    }, 1500);
  });
};

export const submitLaporan = async (laporanBaru) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newLaporan = {
        id: Date.now().toString(),
        ...laporanBaru,
        tanggal: new Date().toLocaleString('id-ID'),
        status: 'Sedang diproses'
      };
      mockApiData.unshift(newLaporan); 
      resolve(newLaporan);
    }, 1000);
  });
};

export const searchLaporan = async (keyword) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = mockApiData.filter(item =>
        item.namaPelapor.toLowerCase().includes(keyword.toLowerCase())
      );
      resolve(filtered);
    }, 500);
  });
};