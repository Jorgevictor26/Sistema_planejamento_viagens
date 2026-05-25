import { Injectable, signal } from '@angular/core';

type Language = 'pt' | 'en' | 'fr';

const dictionary = {
  pt: {
    navHome: 'Inicio',
    navTrips: 'Minhas viagens',
    navLogin: 'Entrar',
    navRegister: 'Criar conta',
    heroTitle: 'Encontre estadias, cidades e clima para sua proxima viagem.',
    heroText: 'Pesquise destinos reais, escolha uma cidade sugerida e comece com coordenadas e clima atual prontos.',
    searchLabel: 'Para onde voce vai?',
    searchPlaceholder: 'Ex: Lon',
    searchHint: 'Escolha uma cidade da lista. Paises digitados livremente nao sao aceitos.',
    popularTitle: 'Destinos populares',
    weatherTitle: 'Clima no destino',
    footerText: 'Planejamento de viagens moderno para explorar com mais contexto.',
  },
  en: {
    navHome: 'Home',
    navTrips: 'My trips',
    navLogin: 'Login',
    navRegister: 'Sign up',
    heroTitle: 'Find stays, cities and weather for your next trip.',
    heroText: 'Search real destinations, pick a suggested city and start with coordinates and current weather ready.',
    searchLabel: 'Where are you going?',
    searchPlaceholder: 'Example: Lon',
    searchHint: 'Choose a city from the list. Arbitrary countries are not accepted.',
    popularTitle: 'Popular destinations',
    weatherTitle: 'Destination weather',
    footerText: 'Modern travel planning with richer context.',
  },
  fr: {
    navHome: 'Accueil',
    navTrips: 'Mes voyages',
    navLogin: 'Connexion',
    navRegister: 'Creer un compte',
    heroTitle: 'Trouvez villes, sejours et meteo pour votre prochain voyage.',
    heroText: 'Recherchez des destinations reelles, choisissez une ville suggeree et partez avec les coordonnees.',
    searchLabel: 'Ou partez-vous ?',
    searchPlaceholder: 'Ex : Lon',
    searchHint: 'Choisissez une ville dans la liste. Les pays libres ne sont pas acceptes.',
    popularTitle: 'Destinations populaires',
    weatherTitle: 'Meteo du destination',
    footerText: 'Planification de voyages moderne avec plus de contexte.',
  },
} as const;

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly storageKey = 'travel_planner_language';
  readonly language = signal<Language>((localStorage.getItem(this.storageKey) as Language) || 'pt');

  t(key: keyof typeof dictionary.pt): string {
    return dictionary[this.language()][key];
  }

  setLanguage(language: Language): void {
    this.language.set(language);
    localStorage.setItem(this.storageKey, language);
  }
}
