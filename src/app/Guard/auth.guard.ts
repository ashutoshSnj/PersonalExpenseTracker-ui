import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
 const router = inject(Router);

  const token = localStorage.getItem('expense_tracker_token');
  if (token) {
    return true;
  }
  return router.parseUrl('/login');

};
