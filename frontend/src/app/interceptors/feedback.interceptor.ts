import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { EMPTY, catchError, finalize, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';
import { ToastService } from '../services/toast.service';

export const feedbackInterceptor: HttpInterceptorFn = (request, next) => {
  const loading = inject(LoadingService);
  const toast = inject(ToastService);
  const auth = inject(AuthService);

  loading.start();

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      const isAuthRequest = /\/(login|register|forgot-password)$/.test(request.url);

      if (error.status === 401 && !isAuthRequest && auth.token()) {
        auth.expireSession();
        return EMPTY;
      }

      if (error.status !== 401) {
        const details = error.error?.errors
          ? Object.values(error.error.errors).flat().join(' ')
          : '';

        toast.error(details || error.error?.message || 'Nao foi possivel concluir a operacao.');
      }

      return throwError(() => error);
    }),
    finalize(() => loading.stop()),
  );
};
