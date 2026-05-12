const mockPresensiData = [
 
];
export const fetchPresensiByNim = async (nim) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = mockPresensiData.filter(item => item.nimMhs === nim);
      resolve([...filtered]);
    }, 500);
  });
};

export const submitPresensi = async (qrData, nimMhs) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newPresensi = {
        id: Date.now().toString(),
        kodeMk: qrData.kodeMk,
        nimMhs: nimMhs,
        pertemuanKe: qrData.pertemuanKe,
        date: new Date().toISOString().split('T')[0],
        jamPresensi: new Date().toLocaleTimeString('en-GB'),
        status: "Present",
        ruangan: qrData.ruangan,
        namaMatkul: qrData.namaMatkul || `Matkul ${qrData.kodeMk}`
      };
      
      mockPresensiData.unshift(newPresensi);
      resolve(newPresensi);
    }, 1000);
  });
};

export default {
  fetchPresensiByNim,
  submitPresensi
};