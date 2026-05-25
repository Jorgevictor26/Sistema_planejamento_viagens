import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ThemeToggle } from '../../shared/theme-toggle/theme-toggle';

@Component({
  selector: 'app-forgot-password-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ThemeToggle,
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPasswordPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  readonly loading = signal(false);
  readonly feedback = signal('');

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.feedback.set('');

    this.auth.forgotPassword(this.form.controls.email.value).subscribe({
      next: (response) => this.feedback.set(response.message),
      error: (error) => this.feedback.set(error.error?.message || 'Nao foi possivel enviar o link.'),
      complete: () => this.loading.set(false),
    });
  }
}
