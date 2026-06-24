import api from './api';

const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const exportService = {
  exportPDF: async () => {
    const res = await api.get('/export/pdf', { responseType: 'blob' });
    downloadBlob(res.data, 'lendtrack-records.pdf');
  },
  exportExcel: async () => {
    const res = await api.get('/export/excel', { responseType: 'blob' });
    downloadBlob(res.data, 'lendtrack-records.xlsx');
  },
};
