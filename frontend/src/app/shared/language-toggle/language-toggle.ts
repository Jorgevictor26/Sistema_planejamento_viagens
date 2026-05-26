import { Component, inject } from '@angular/core';

import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-language-toggle',
  template: `
    <label class="language-toggle">
      <select [value]="language.language()" aria-label="Idioma" (change)="language.setLanguage($any($event.target).value)">
        <option value="pt">Pt</option>
        <option value="en">En</option>
      </select>
    </label>
  `,
  styles: `
    .language-toggle {
      display: flex;
      align-items: center;
      color: var(--text);
      font-size: 0.82rem;
      font-weight: 800;
    }

    select {
      height: 38px;
      border: 0;
      border-radius: 0;
      background: transparent;
      color: inherit;
      cursor: pointer;
      font: inherit;
      font-weight: 900;
      padding: 0 4px;
    }

    option {
      color: #172033;
    }
  `,
})
export class LanguageToggle {
  readonly language = inject(LanguageService);
}
