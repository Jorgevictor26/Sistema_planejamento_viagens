import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly snackBar = inject(MatSnackBar);

  success(message: string): void {
    this.open(message, 'success-toast');
  }

  error(message: string): void {
    this.open(message, 'error-toast');
  }

  info(message: string): void {
    this.open(message, 'info-toast');
  }

  private open(message: string, panelClass: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 3500,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass,
    });
  }
}
