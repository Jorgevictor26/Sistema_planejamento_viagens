import { Injectable, signal } from '@angular/core';

type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'travel_planner_theme';
  readonly theme = signal<Theme>((localStorage.getItem(this.storageKey) as Theme) || 'light');

  constructor() {
    this.apply(this.theme());
  }

  toggle(): void {
    this.apply(this.theme() === 'light' ? 'dark' : 'light');
  }

  private apply(theme: Theme): void {
    this.theme.set(theme);
    localStorage.setItem(this.storageKey, theme);
    document.body.classList.toggle('dark-theme', theme === 'dark');
  }
}
