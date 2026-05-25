import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  imports: [MatButtonModule, MatTooltipModule],
  template: `
    <button
      mat-icon-button
      type="button"
      [attr.aria-label]="theme.theme() === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'"
      [matTooltip]="theme.theme() === 'light' ? 'Modo escuro' : 'Modo claro'"
      (click)="theme.toggle()"
    >
      <span class="theme-icon" aria-hidden="true">{{ theme.theme() === 'light' ? '☾' : '☀' }}</span>
    </button>
  `,
  styles: `
    .theme-icon {
      display: inline-block;
      font-size: 1.35rem;
      font-weight: 800;
      line-height: 1;
      transform: translateY(-1px);
    }
  `,
})
export class ThemeToggle {
  readonly theme = inject(ThemeService);
}
