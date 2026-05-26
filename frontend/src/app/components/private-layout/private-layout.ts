import { Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { CurrencyService, AppCurrency } from '../../services/currency.service';
import { LanguageToggle } from '../../shared/language-toggle/language-toggle';
import { ThemeToggle } from '../../shared/theme-toggle/theme-toggle';

@Component({
  selector: 'app-private-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LanguageToggle, ThemeToggle],
  templateUrl: './private-layout.html',
  styleUrl: './private-layout.scss',
})
export class PrivateLayout {
  readonly auth = inject(AuthService);
  readonly currency = inject(CurrencyService);
  private readonly router = inject(Router);
  readonly sidebarHidden = signal(false);
  readonly drawerOpen = signal(false);
  readonly userMenuOpen = signal(false);

  readonly navItems = [
    { label: 'Início', icon: '⌂', link: '/' },
    { label: 'Dashboard', icon: '◫', link: '/dashboard' },
    { label: 'Minhas Viagens', icon: '⌖', link: '/trips' },
    { label: 'Roteiro', icon: '☷', link: '/itinerary' },
    { label: 'Despesas', icon: '¤', link: '/expenses' },
    { label: 'Favoritos', icon: '☆', link: '/favorites' },
    { label: 'Configurações', icon: '⚙', link: '/settings' },
  ];

  constructor() {
    if (this.auth.isAuthenticated() && !this.auth.currentUser()) {
      this.auth.me().subscribe();
    }
  }

  @HostListener('document:click')
  closeMenus(): void {
    this.userMenuOpen.set(false);
  }

  toggleDrawer(): void {
    if (window.matchMedia('(max-width: 920px)').matches) {
      this.drawerOpen.set(!this.drawerOpen());
      return;
    }

    this.sidebarHidden.set(!this.sidebarHidden());
  }

  setCurrency(value: string): void {
    this.currency.setCurrency(value as AppCurrency);
  }

  searchTrips(value: string): void {
    const query = value.trim();

    if (!query) {
      return;
    }

    void this.router.navigate(['/trips'], { queryParams: { q: query } });
  }

  initials(): string {
    const name = this.auth.currentUser()?.name || 'Utilizador';
    return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  }

  logout(): void {
    this.userMenuOpen.set(false);
    this.auth.logout();
  }
}
