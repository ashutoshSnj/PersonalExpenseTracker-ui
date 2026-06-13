import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const noAuthGuard: CanActivateFn = (route, state) => {
 
  const router = inject(Router);

  const token = localStorage.getItem('expense_tracker_token');
  if (token) {
    return router.parseUrl('/dashboard');
  }
  return true;
};
