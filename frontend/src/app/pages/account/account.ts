import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

import { AuthService } from '../../services/auth.service';
import { CurrencyService } from '../../services/currency.service';
import { ThemeToggle } from '../../shared/theme-toggle/theme-toggle';

@Component({
  selector: 'app-account-page',
  imports: [MatCardModule, ThemeToggle],
  templateUrl: './account.html',
  styleUrl: './account.scss',
})
export class AccountPage {
  private readonly route = inject(ActivatedRoute);
  readonly auth = inject(AuthService);
  readonly currency = inject(CurrencyService);
  readonly mode = this.route.snapshot.data['mode'] as 'profile' | 'settings';
}
