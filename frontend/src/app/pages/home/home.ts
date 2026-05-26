import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';

import { Footer } from '../../components/footer/footer';
import { HeroSearch } from '../../components/hero-search/hero-search';
import { Navbar } from '../../components/navbar/navbar';
import { PopularDestinations } from '../../components/popular-destinations/popular-destinations';
import { WeatherWidget } from '../../components/weather-widget/weather-widget';
import { LanguageService } from '../../services/language.service';
import { CityResult } from '../../services/location.service';

@Component({
  selector: 'app-home-page',
  imports: [Footer, HeroSearch, Navbar, PopularDestinations, WeatherWidget, MatButtonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomePage {
  private readonly router = inject(Router);
  readonly language = inject(LanguageService);
  readonly selectedDestination = signal<CityResult | null>(null);
  readonly authModalOpen = signal(false);
  readonly detailsModalOpen = signal(false);

  openDestinationDetails(destination: CityResult): void {
    this.selectedDestination.set(destination);
    this.detailsModalOpen.set(true);
  }

  continueAsVisitor(): void {
    this.authModalOpen.set(false);
    document.getElementById('destinos')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  planTrip(destination: CityResult): void {
    localStorage.setItem('travel_planner_selected_destination', JSON.stringify({
      city: destination.name,
      country: destination.country,
      latitude: destination.latitude,
      longitude: destination.longitude,
    }));

    this.detailsModalOpen.set(false);
    void this.router.navigate(['/trips/new']);
  }
}
