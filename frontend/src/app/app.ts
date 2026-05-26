import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthService } from './services/auth.service';
import { GlobalLoading } from './shared/global-loading/global-loading';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GlobalLoading],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly auth = inject(AuthService);
}
