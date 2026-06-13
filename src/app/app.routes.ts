import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { IncomeComponent } from './components/income/income.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './Guard/auth.guard';
import { adminGuard } from './Guard/admin.guard';
import { noAuthGuard } from './Guard/no-auth.guard';
import { UnauthorizedComponent } from './components/shared/unauthorized/unauthorized.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SmartinsightsComponent } from './components/smartinsights/smartinsights.component';

export const routes: Routes = [
     {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [noAuthGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [noAuthGuard]
  },

  {
    path: 'expense',
    component: ExpenseComponent,
    canActivate: [authGuard]
  },
  {
    path: 'income',
    component: IncomeComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin/users',
    component: UserManagementComponent,
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/categories',
    component: CategoriesComponent,
    canActivate: [authGuard, adminGuard]
  },

  {
    path:'unauthorized',
    component:UnauthorizedComponent
  },

   {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  }
  ,
   {
    path: 'in',
    component: SmartinsightsComponent,
  }
  
  ,
  {
    path: '**',
    redirectTo: ''
  }
];
