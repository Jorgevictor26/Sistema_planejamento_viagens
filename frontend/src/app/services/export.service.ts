import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import { ToastService } from './toast.service';

type ExportType = 'trips' | 'expenses';
type ExportFormat = 'csv' | 'pdf';

@Injectable({ providedIn: 'root' })
export class ExportService {
  private readonly http = inject(HttpClient);
  private readonly toast = inject(ToastService);

  download(type: ExportType, format: ExportFormat): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/export/${type}.${format}`, {
      responseType: 'blob',
    }).pipe(
      tap((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = `${type}.${format}`;
        link.click();
        URL.revokeObjectURL(url);
        this.toast.success('Exportacao iniciada.');
      }),
    );
  }
}
