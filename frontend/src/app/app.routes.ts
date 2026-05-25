import { Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';
import { DashboardPage } from './pages/dashboard/dashboard';
import { FavoritesPage } from './pages/favorites/favorites';
import { ForgotPasswordPage } from './pages/forgot-password/forgot-password';
import { HomePage } from './pages/home/home';
import { ItineraryPage } from './pages/itinerary/itinerary';
import { LoginPage } from './pages/login/login';
import { RegisterPage } from './pages/register/register';
import { CreateTripPage } from './pages/create-trip/create-trip';
import { ExpensesPage } from './pages/expenses/expenses';
import { TripDetailsPage } from './pages/trip-details/trip-details';
import { TripsPage } from './pages/trips/trips';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'forgot-password', component: ForgotPasswordPage },
  { path: 'dashboard', component: DashboardPage, canActivate: [authGuard] },
  { path: 'trips', component: TripsPage, canActivate: [authGuard] },
  { path: 'trips/new', component: CreateTripPage, canActivate: [authGuard] },
  { path: 'trips/:id', component: TripDetailsPage, canActivate: [authGuard] },
  { path: 'expenses', component: ExpensesPage, canActivate: [authGuard] },
  { path: 'itinerary', component: ItineraryPage, canActivate: [authGuard] },
  { path: 'favorites', component: FavoritesPage, canActivate: [authGuard] },
  { path: '**', redirectTo: 'dashboard' },
];
