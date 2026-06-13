import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  exportToCSV(data: any[], fileName: string) {

  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);

  const rows = data.map(row =>
    headers.map(field => row[field])
  );

  const csvContent =
    [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const time = now.toTimeString().slice(0,5).replace(':','-');

  const fullName = `${fileName}_${date}_${time}.csv`;

  link.setAttribute('href', url);
  link.setAttribute('download', fullName);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

}
}
