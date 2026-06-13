import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

      const roles: string[] = JSON.parse(
        localStorage.getItem('expense_tracker_roles') || '[]'
      );
      
           if (roles.includes('ROLE_ADMIN')) {
        return true
      }
   router.navigate(['/unauthorized']);
   return false;
  
};
