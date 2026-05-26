import { Component, inject } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-global-loading',
  imports: [MatProgressBarModule],
  template: `
    @if (loading.loading()) {
      <mat-progress-bar mode="indeterminate" />
    }
  `,
  styles: `
    :host {
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      z-index: 1000;
    }
  `,
})
export class GlobalLoading {
  readonly loading = inject(LoadingService);
}
