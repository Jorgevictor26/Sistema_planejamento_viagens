import { Component, output } from '@angular/core';

import { CityResult } from '../../services/location.service';
import { DestinationCard } from '../destination-card/destination-card';

type PopularDestination = CityResult & { image: string; tagline: string };

@Component({
  selector: 'app-popular-destinations',
  imports: [DestinationCard],
  templateUrl: './popular-destinations.html',
  styleUrl: './popular-destinations.scss',
})
export class PopularDestinations {
  readonly selected = output<CityResult>();

  readonly destinations: PopularDestination[] = [
    {
      type: 'city',
      id: 'popular-london',
      name: 'London',
      city: 'London',
      country: 'UK',
      country_code: 'UK',
      region: 'England',
      latitude: 51.5074,
      longitude: -0.1278,
      population: 8982000,
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=80',
      tagline: 'Bairros historicos, mercados vivos e cultura em todas as esquinas.',
    },
    {
      type: 'city',
      id: 'popular-luanda',
      name: 'Luanda',
      city: 'Luanda',
      country: 'Angola',
      country_code: 'AO',
      region: 'Luanda',
      latitude: -8.839,
      longitude: 13.2894,
      population: 2571861,
      image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=900&q=80',
      tagline: 'Costa Atlantica, energia urbana e dias quentes para explorar.',
    },
    {
      type: 'city',
      id: 'popular-long-beach',
      name: 'Long Beach',
      city: 'Long Beach',
      country: 'USA',
      country_code: 'USA',
      region: 'California',
      latitude: 33.7701,
      longitude: -118.1937,
      population: 451307,
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
      tagline: 'Praia, marina e base perfeita para uma escapada pela California.',
    },
  ];
}
