import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const messageService = inject(MessageService);
 const router = inject(Router);
  return next(req).pipe(
    
    catchError((error) => {
      if (error.status === 401 && !req.url.includes('/login')) {

    localStorage.removeItem('expense_tracker_token');
    localStorage.removeItem('expense_tracker_roles');
    localStorage.removeItem('expense_tracker_user');

    const message =
      error?.error?.message ||
      'Session expired. Please login again.';

    messageService.add({
      severity: 'warn',
      summary: 'Unauthorized',
      detail: message
    });

    router.navigate(['/login']);

    return throwError(() => error);
  }

  const errorMessage =
    error?.error?.message ||
    'Something went wrong';

  messageService.add({
    severity: 'error',
    summary: 'Error',
    detail: errorMessage
  });

  return throwError(() => error);

    })
  );
};