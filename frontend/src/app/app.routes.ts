import { Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';
import { DashboardPage } from './pages/dashboard/dashboard';
import { ForgotPasswordPage } from './pages/forgot-password/forgot-password';
import { HomePage } from './pages/home/home';
import { LoginPage } from './pages/login/login';
import { RegisterPage } from './pages/register/register';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'forgot-password', component: ForgotPasswordPage },
  { path: 'dashboard', component: DashboardPage, canActivate: [authGuard] },
  { path: '**', redirectTo: 'dashboard' },
];
