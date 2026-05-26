import { Component, inject } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  imports: [MatTooltipModule],
  template: `
    <button
      class="theme-switch"
      type="button"
      [attr.aria-label]="theme.theme() === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'"
      [matTooltip]="theme.theme() === 'light' ? 'Modo escuro' : 'Modo claro'"
      [class.dark]="theme.theme() === 'dark'"
      (click)="theme.toggle()"
    >
      <span class="switch-track" aria-hidden="true">
        <span class="switch-thumb">{{ theme.theme() === 'light' ? '☾' : '☀' }}</span>
      </span>
    </button>
  `,
  styles: `
    .theme-switch {
      display: grid;
      width: 58px;
      height: 34px;
      place-items: center;
      border: 0;
      border-radius: 999px !important;
      padding: 0;
      background: transparent;
      cursor: pointer;
    }

    .switch-track {
      position: relative;
      display: block;
      width: 54px;
      height: 30px;
      border: 1px solid color-mix(in srgb, var(--accent) 32%, var(--border));
      border-radius: 999px;
      background: color-mix(in srgb, var(--accent) 10%, var(--surface));
      box-shadow: inset 0 1px 3px rgba(15, 23, 42, 0.08);
      transition: background 180ms ease, border-color 180ms ease;
    }

    .switch-thumb {
      position: absolute;
      top: 3px;
      left: 3px;
      display: grid;
      width: 22px;
      height: 22px;
      place-items: center;
      border-radius: 999px;
      background: var(--accent);
      color: var(--accent-contrast);
      font-size: 0.86rem;
      line-height: 1;
      box-shadow: 0 6px 16px color-mix(in srgb, var(--accent) 28%, transparent);
      transition: transform 200ms ease, background 180ms ease;
    }

    .theme-switch.dark .switch-track {
      background: color-mix(in srgb, var(--accent) 20%, var(--surface));
    }

    .theme-switch.dark .switch-thumb {
      transform: translateX(24px);
    }
  `,
})
export class ThemeToggle {
  readonly theme = inject(ThemeService);
}
