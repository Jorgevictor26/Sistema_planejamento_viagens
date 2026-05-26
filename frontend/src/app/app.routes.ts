import { Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';
import { DashboardPage } from './pages/dashboard/dashboard';
import { FavoritesPage } from './pages/favorites/favorites';
import { ForgotPasswordPage } from './pages/forgot-password/forgot-password';
import { HomePage } from './pages/home/home';
import { ItineraryPage } from './pages/itinerary/itinerary';
import { LoginPage } from './pages/login/login';
import { NotFoundPage } from './pages/not-found/not-found';
import { RegisterPage } from './pages/register/register';
import { CreateTripPage } from './pages/create-trip/create-trip';
import { ExpensesPage } from './pages/expenses/expenses';
import { TripDetailsPage } from './pages/trip-details/trip-details';
import { TripsPage } from './pages/trips/trips';
import { PrivateLayout } from './components/private-layout/private-layout';
import { AccountPage } from './pages/account/account';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'forgot-password', component: ForgotPasswordPage },
  {
    path: '',
    component: PrivateLayout,
    canActivate: [authGuard],
    children: [
      { path: 'home', component: DashboardPage },
      { path: 'dashboard', component: DashboardPage },
      { path: 'trips', component: TripsPage },
      { path: 'trips/new', component: CreateTripPage },
      { path: 'trips/:id', component: TripDetailsPage },
      { path: 'expenses', component: ExpensesPage },
      { path: 'itinerary', component: ItineraryPage },
      { path: 'favorites', component: FavoritesPage },
      { path: 'profile', component: AccountPage, data: { mode: 'profile' } },
      { path: 'settings', component: AccountPage, data: { mode: 'settings' } },
    ],
  },
  { path: '404', component: NotFoundPage },
  { path: '**', component: NotFoundPage },
];
