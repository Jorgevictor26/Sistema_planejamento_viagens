import { AfterViewInit, Component, ElementRef, computed, effect, inject, input, signal, viewChild } from '@angular/core';

import { LanguageService } from '../../services/language.service';

declare global {
  interface Window {
    L?: any;
  }
}

@Component({
  selector: 'app-trip-map',
  templateUrl: './trip-map.html',
  styleUrl: './trip-map.scss',
})
export class TripMap implements AfterViewInit {
  private static leafletLoading?: Promise<void>;

  private readonly language = inject(LanguageService);
  private readonly mapHost = viewChild.required<ElementRef<HTMLElement>>('mapHost');
  private map: any;
  private marker: any;
  private tileLayer: any;
  private readonly ready = signal(false);
  readonly loadError = signal(false);

  readonly latitude = input.required<number>();
  readonly longitude = input.required<number>();
  readonly label = input('Destino');
  readonly mapLocale = computed(() => this.language.language() === 'en' ? 'en' : 'pt');

  constructor() {
    effect(() => {
      const lat = this.latitude();
      const lon = this.longitude();

      if (this.ready()) {
        this.render(lat, lon);
      }
    });

    effect(() => {
      this.mapLocale();

      if (this.ready() && this.map) {
        this.applyTileLayer();
      }
    });
  }

  ngAfterViewInit(): void {
    this.loadLeaflet().then(() => {
      this.ready.set(true);
      this.render(this.latitude(), this.longitude());
    }).catch(() => this.loadError.set(true));
  }

  private render(lat: number, lon: number): void {
    if (!window.L) {
      return;
    }

    if (!this.map) {
      this.map = window.L.map(this.mapHost().nativeElement, {
        zoomControl: false,
        scrollWheelZoom: false,
      });

      this.applyTileLayer();

      window.L.control.zoom({ position: 'bottomright' }).addTo(this.map);
    }

    this.map.setView([lat, lon], 12);

    if (!this.marker) {
      this.marker = window.L.marker([lat, lon]).addTo(this.map);
    } else {
      this.marker.setLatLng([lat, lon]);
    }

    this.marker.bindPopup(this.label()).openPopup();
  }

  private applyTileLayer(): void {
    if (!window.L || !this.map) {
      return;
    }

    if (this.tileLayer) {
      this.map.removeLayer(this.tileLayer);
    }

    this.tileLayer = window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(this.map);
  }

  private loadLeaflet(): Promise<void> {
    if (window.L) {
      return Promise.resolve();
    }

    if (TripMap.leafletLoading) {
      return TripMap.leafletLoading;
    }

    TripMap.leafletLoading = new Promise<void>((resolve, reject) => {
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(css);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Leaflet indisponivel.'));
      document.body.appendChild(script);
    });

    return TripMap.leafletLoading;
  }
}
