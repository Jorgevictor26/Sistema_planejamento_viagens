import { Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  template: `<div class="skeleton" [style.height]="height()" [style.width]="width()"></div>`,
  styles: `
    .skeleton {
      overflow: hidden;
      border-radius: 8px;
      background: linear-gradient(90deg, var(--border), color-mix(in srgb, var(--border) 35%, var(--surface)), var(--border));
      background-size: 220% 100%;
      animation: shimmer 1.25s linear infinite;
    }

    @keyframes shimmer {
      to {
        background-position-x: -220%;
      }
    }
  `,
})
export class Skeleton {
  readonly width = input('100%');
  readonly height = input('120px');
}
