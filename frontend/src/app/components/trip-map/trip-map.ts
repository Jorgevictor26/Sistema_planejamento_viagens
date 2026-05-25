import { Component, computed, input, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-trip-map',
  templateUrl: './trip-map.html',
  styleUrl: './trip-map.scss',
})
export class TripMap {
  private readonly sanitizer = inject(DomSanitizer);

  readonly latitude = input.required<number>();
  readonly longitude = input.required<number>();
  readonly label = input('Destino');

  readonly mapUrl = computed<SafeResourceUrl>(() => {
    const lat = this.latitude();
    const lon = this.longitude();
    const delta = 0.08;
    const bbox = [lon - delta, lat - delta, lon + delta, lat + delta].join(',');
    const url = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });
}
