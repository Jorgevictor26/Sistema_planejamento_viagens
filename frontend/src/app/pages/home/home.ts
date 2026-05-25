import { Component, signal } from '@angular/core';

import { Footer } from '../../components/footer/footer';
import { HeroSearch } from '../../components/hero-search/hero-search';
import { Navbar } from '../../components/navbar/navbar';
import { PopularDestinations } from '../../components/popular-destinations/popular-destinations';
import { WeatherWidget } from '../../components/weather-widget/weather-widget';
import { CityResult } from '../../services/location.service';

@Component({
  selector: 'app-home-page',
  imports: [Footer, HeroSearch, Navbar, PopularDestinations, WeatherWidget],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomePage {
  readonly selectedDestination = signal<CityResult | null>(null);
}
