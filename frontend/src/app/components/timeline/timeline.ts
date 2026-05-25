import { Component, computed, input } from '@angular/core';

import { Itinerary } from '../../services/itinerary.service';

interface TimelineDay {
  day: number;
  items: Itinerary[];
}

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.html',
  styleUrl: './timeline.scss',
})
export class Timeline {
  readonly itineraries = input.required<Itinerary[]>();

  readonly days = computed<TimelineDay[]>(() => {
    const groups = new Map<number, Itinerary[]>();

    this.itineraries().forEach((item) => {
      groups.set(item.day, [...(groups.get(item.day) || []), item]);
    });

    return Array.from(groups.entries())
      .sort(([a], [b]) => a - b)
      .map(([day, items]) => ({
        day,
        items: items.sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99')),
      }));
  });
}
