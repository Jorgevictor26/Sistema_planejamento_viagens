import { Injectable, signal } from '@angular/core';

type Language = 'pt' | 'en';

const dictionary = {
  pt: {
    navHome: 'Inicio',
    navTrips: 'Minhas viagens',
    navExpenses: 'Despesas',
    navItinerary: 'Roteiro',
    navFavorites: 'Favoritos',
    navDashboard: 'Dashboard',
    navLogin: 'Entrar',
    navRegister: 'Criar conta',
    navExplore: 'Explorar destinos',
    navAbout: 'Sobre',
    heroEyebrow: 'Travel Planner System',
    heroTitle: 'Descubra o mundo sem complicações.',
    heroText: 'Planeje viagens inesquecíveis. Explore Angola, África e o mundo com clima, mapas, restaurantes e atrações no mesmo lugar.',
    heroStart: 'Começar agora',
    heroExplore: 'Explorar destinos',
    searchTitle: 'Pesquisar',
    searchText: 'Digite uma cidade e selecione uma sugestão real.',
    searchLabel: 'Para onde quer viajar?',
    searchPlaceholder: 'Digite Luanda, Cape Town, Zanzibar...',
    searchReady: 'Pesquisar destino',
    searchSelect: 'Selecione uma sugestão',
    searchHint: 'Escolha uma das sugestões para continuar com mapa, clima e coordenadas corretas.',
    popularTitle: 'Destinos populares',
    popularEyebrow: 'Recomendações',
    popularText: 'Angola em primeiro plano, África por perto e clássicos turísticos para completar o roteiro.',
    weatherTitle: 'Clima no destino',
    footerText: 'Planejamento de viagens moderno para explorar com mais contexto.',
    detailsEyebrow: 'Detalhes do destino',
    detailsText: 'Veja mapa, clima e locais próximos antes de criar a viagem.',
    createTrip: 'Criar viagem',
    recommendationsLabel: 'Categorias recomendadas',
    beaches: 'Praias',
    beachesTitle: 'Melhores praias',
    beachesText: 'Cabo Ledo, Benguela, Zanzibar e Cape Town para dias de mar com bons restaurantes por perto.',
    adventure: 'Aventura',
    adventureTitle: 'Serra, deserto e trilhas',
    adventureText: 'Lubango, Namibe e Marrakech combinam paisagens fortes com roteiros fotográficos.',
    economy: 'Económicas',
    economyTitle: 'Viagens inteligentes',
    economyText: 'Compare orçamento médio, clima e distâncias antes de montar a viagem completa.',
  },
  en: {
    navHome: 'Home',
    navTrips: 'My trips',
    navExpenses: 'Expenses',
    navItinerary: 'Itinerary',
    navFavorites: 'Favorites',
    navDashboard: 'Dashboard',
    navLogin: 'Login',
    navRegister: 'Sign up',
    navExplore: 'Explore destinations',
    navAbout: 'About',
    heroEyebrow: 'Travel Planner System',
    heroTitle: 'Discover the world without the friction.',
    heroText: 'Plan memorable trips. Explore Angola, Africa and the world with weather, maps, restaurants and attractions in one place.',
    heroStart: 'Start now',
    heroExplore: 'Explore destinations',
    searchTitle: 'Search',
    searchText: 'Type a city and choose a real suggestion.',
    searchLabel: 'Where do you want to travel?',
    searchPlaceholder: 'Type Luanda, Cape Town, Zanzibar...',
    searchReady: 'Search destination',
    searchSelect: 'Choose a suggestion',
    searchHint: 'Choose one suggestion to continue with the right map, weather and coordinates.',
    popularTitle: 'Popular destinations',
    popularEyebrow: 'Recommendations',
    popularText: 'Angola first, Africa nearby, and classic destinations to complete your itinerary.',
    weatherTitle: 'Destination weather',
    footerText: 'Modern travel planning with richer context.',
    detailsEyebrow: 'Destination details',
    detailsText: 'Check the map, weather and nearby places before creating the trip.',
    createTrip: 'Create trip',
    recommendationsLabel: 'Recommended categories',
    beaches: 'Beaches',
    beachesTitle: 'Best beaches',
    beachesText: 'Cabo Ledo, Benguela, Zanzibar and Cape Town for seaside days with good restaurants nearby.',
    adventure: 'Adventure',
    adventureTitle: 'Mountains, desert and trails',
    adventureText: 'Lubango, Namibe and Marrakech combine strong landscapes with photo-friendly routes.',
    economy: 'Budget',
    economyTitle: 'Smarter trips',
    economyText: 'Compare average budget, weather and distances before building the full trip.',
  },
} as const;

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly storageKey = 'travel_planner_language';
  readonly language = signal<Language>(this.normalize(localStorage.getItem(this.storageKey)));

  constructor() {
    document.documentElement.lang = this.language();
  }

  t(key: keyof typeof dictionary.pt): string {
    return dictionary[this.language()][key];
  }

  setLanguage(language: Language): void {
    this.language.set(language);
    localStorage.setItem(this.storageKey, language);
    document.documentElement.lang = language;
  }

  private normalize(language: string | null): Language {
    return language === 'en' ? 'en' : 'pt';
  }
}
