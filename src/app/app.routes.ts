import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { AddExpense } from './pages/add-expense/add-expense';
import { Chart2 } from './pages/chart/chart';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard },
  { path: 'add-expense', component: AddExpense },
  { path: 'chart', component: Chart2 }
];