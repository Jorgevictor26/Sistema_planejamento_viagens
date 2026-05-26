import { Injectable, signal } from '@angular/core';

type Language = 'pt' | 'en';
type DictionaryKey = keyof typeof dictionary.pt;

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

const staticTranslations: Record<string, string> = {
  'Inicio': 'Home',
  'Início': 'Home',
  'Minhas viagens': 'My trips',
  'Minhas Viagens': 'My trips',
  'Despesas': 'Expenses',
  'Roteiro': 'Itinerary',
  'Favoritos': 'Favorites',
  'destino': 'destination',
  'hotel': 'hotel',
  'restaurante': 'restaurant',
  'restaurantes': 'restaurants',
  'museu': 'museum',
  'praia': 'beach',
  'transporte': 'transport',
  'atração': 'attraction',
  'atrações': 'attractions',
  'alimentação': 'food',
  'compras': 'shopping',
  'passeio': 'tour',
  'Entrar': 'Login',
  'Criar conta': 'Sign up',
  'Explorar destinos': 'Explore destinations',
  'Sobre': 'About',
  'Configurações': 'Settings',
  'Terminar sessão': 'Logout',
  'Navegação privada': 'Private navigation',
  'Fechar menu': 'Close menu',
  'Abrir menu': 'Open menu',
  'Pesquisar viagem...': 'Search trip...',
  'Moeda': 'Currency',
  'Idioma': 'Language',
  'Utilizador': 'User',
  'Sessão ativa': 'Active session',
  'Perfil': 'Profile',
  'Painel geral': 'Overview',
  'Gestão das suas viagens': 'Manage your trips',
  'Gastos, destinos, agenda e próximas ações reunidos num painel só.': 'Expenses, destinations, schedule and next actions in one dashboard.',
  'Nova viagem': 'New trip',
  'Viagens CSV': 'Trips CSV',
  'Viagens PDF': 'Trips PDF',
  'Despesas CSV': 'Expenses CSV',
  'Despesas PDF': 'Expenses PDF',
  'Total gasto em viagens': 'Total spent on trips',
  'viagens cadastradas no sistema.': 'trips registered in the system.',
  'Viagens': 'Trips',
  'Planejadas e registradas': 'Planned and registered',
  'Destinos e locais salvos': 'Saved destinations and places',
  'Orçamento das viagens': 'Trip budget',
  'Gasto atual': 'Current spending',
  'Sem despesas': 'No expenses',
  'Destinos populares': 'Popular destinations',
  'Ver todos': 'View all',
  'Criar primeira viagem': 'Create first trip',
  'Escolha um destino real': 'Choose a real destination',
  'Agenda de viagens': 'Trip schedule',
  'Sem': 'None',
  'Novo': 'New',
  'Nenhuma viagem agendada': 'No scheduled trips',
  'Crie uma viagem para montar o seu calendário.': 'Create a trip to build your calendar.',
  'Despesas recentes': 'Recent expenses',
  'Ver extrato': 'View statement',
  'Nenhuma despesa registrada ainda.': 'No expenses registered yet.',
  'Finanças': 'Finances',
  'Controle os gastos da viagem com clareza.': 'Track trip spending clearly.',
  'Acompanhe despesas, orçamento e saldo em uma visão organizada por viagem e categoria.': 'Track expenses, budget and balance in an organized view by trip and category.',
  'Resumo financeiro': 'Financial summary',
  'Viagem': 'Trip',
  'Todas': 'All',
  'Gasto filtrado': 'Filtered spending',
  'Orçamento': 'Budget',
  'Sem orçamento': 'No budget',
  'Saldo': 'Balance',
  'Escolha uma viagem': 'Choose a trip',
  'Editar despesa': 'Edit expense',
  'Nova despesa': 'New expense',
  'Salvando...': 'Saving...',
  'Adicionar gasto': 'Add expense',
  'Análise': 'Analysis',
  'despesa(s)': 'expense(s)',
  'Filtros': 'Filters',
  'Filtrar lista': 'Filter list',
  'Categoria': 'Category',
  'De': 'From',
  'Ate': 'To',
  'Filtrar': 'Filter',
  'Limpar': 'Clear',
  'Despesas cadastradas': 'Registered expenses',
  'item(ns)': 'item(s)',
  'Anterior': 'Previous',
  'Proxima': 'Next',
  'Guarde lugares que fazem a viagem valer a pena.': 'Save places that make the trip worthwhile.',
  'Titulo': 'Title',
  'Tipo': 'Type',
  'Localizacao': 'Location',
  'Cidade, pais ou endereco': 'City, country or address',
  'Imagem URL': 'Image URL',
  'Salvar favorito': 'Save favorite',
  'Recuperar senha': 'Recover password',
  'Recupere o acesso com segurança.': 'Recover access securely.',
  'Informe seu email e enviaremos as instruções de redefinição de senha.': 'Enter your email and we will send password reset instructions.',
  'Enviaremos as instruções por email': 'We will send instructions by email',
  'Email inválido': 'Invalid email',
  'Email invalido': 'Invalid email',
  'Enviando...': 'Sending...',
  'Enviar link': 'Send link',
  'Voltar ao login': 'Back to login',
  'Angola, África e mundo': 'Angola, Africa and the world',
  'Planeje viagens com contexto real.': 'Plan trips with real context.',
  'Pesquise destinos, veja mapa e clima, descubra lugares próximos e mantenha todos os detalhes organizados.': 'Search destinations, see maps and weather, discover nearby places and keep every detail organized.',
  'Bem-vindo de volta!': 'Welcome back!',
  'Senha': 'Password',
  'Senha obrigatoria': 'Password required',
  'Entrando...': 'Logging in...',
  'Esqueci a senha': 'Forgot password',
  'Crie sua conta': 'Create your account',
  'Comece a desenhar sua proxima rota.': 'Start sketching your next route.',
  'Guarde seus destinos, explore cidades reais e tenha as primeiras pistas do clima antes de montar o roteiro.': 'Save your destinations, explore real cities and get early weather clues before building the itinerary.',
  'Registrar': 'Register',
  'Informe seus dados': 'Enter your details',
  'Nome': 'Name',
  'Confirmar senha': 'Confirm password',
  'Criando...': 'Creating...',
  'Ja tenho conta': 'I already have an account',
  'Pagina nao encontrada': 'Page not found',
  'O endereco que voce tentou acessar nao existe ou foi movido.': 'The address you tried to access does not exist or was moved.',
  'Voltar ao dashboard': 'Back to dashboard',
  'Criar roteiro': 'Create itinerary',
  'Monte o roteiro da viagem sem perder o ritmo.': 'Build your trip itinerary without losing momentum.',
  'Organize atividades por dia, horário e local em uma visão simples de acompanhar.': 'Organize activities by day, time and location in an easy view.',
  'Resumo do roteiro': 'Itinerary summary',
  'atividades': 'activities',
  'dias': 'days',
  'com horário': 'scheduled',
  'Editar atividade': 'Edit activity',
  'Nova atividade': 'New activity',
  'Linha do tempo': 'Timeline',
  'dia(s)': 'day(s)',
  'Encontrar atividades': 'Find activities',
  'Dia': 'Day',
  'Pesquisar': 'Search',
  'Atividade, local ou descricao': 'Activity, place or description',
  'Atividades cadastradas': 'Registered activities',
  'Detalhes': 'Details',
  'Voltar': 'Back',
  'Fechar edicao': 'Close editing',
  'Editar': 'Edit',
  'Excluir': 'Delete',
  'Carregando viagem...': 'Loading trip...',
  'Resumo da viagem': 'Trip summary',
  'Período': 'Period',
  'Não definido': 'Not set',
  'Locais próximos': 'Nearby places',
  'Restaurantes, hotéis, cafés, praias, museus e atrações para esta viagem.': 'Restaurants, hotels, cafes, beaches, museums and attractions for this trip.',
  'Salve lugares diretamente como favoritos e mantenha tudo conectado ao seu planejamento.': 'Save places directly as favorites and keep everything connected to your planning.',
  'Local próximo': 'Nearby place',
  'Salvar nos favoritos': 'Save to favorites',
  'Nenhum local retornado pela API para este destino ainda.': 'No place returned by the API for this destination yet.',
  'As suas aventuras organizadas num só lugar.': 'Your adventures organized in one place.',
  'País': 'Country',
  'Ex.: Angola': 'Ex.: Angola',
  'Data inicial': 'Start date',
  'Data final': 'End date',
  'Paginacao': 'Pagination',
  'Total gasto': 'Total spent',
  'Saldo restante': 'Remaining balance',
  'Sem despesas para analisar.': 'No expenses to analyze.',
  'Viagem *': 'Trip *',
  'Categoria *': 'Category *',
  'Valor em Kwanza (AOA) *': 'Amount in Kwanza (AOA) *',
  'Data': 'Date',
  'Descricao': 'Description',
  'Atualizar despesa': 'Update expense',
  'Controlar gasto': 'Track expense',
  'Cancelar': 'Cancel',
  'Carregando despesas...': 'Loading expenses...',
  'Valor': 'Amount',
  'Acoes': 'Actions',
  'Sem data': 'No date',
  'Nenhuma despesa encontrada.': 'No expense found.',
  'Remover': 'Remove',
  'Carregando favoritos...': 'Loading favorites...',
  'Nenhum favorito salvo.': 'No favorite saved.',
  'Planeamento moderno para Angola, África e o mundo, com mapas, clima, despesas e favoritos conectados.': 'Modern planning for Angola, Africa and the world, with connected maps, weather, expenses and favorites.',
  'Links rápidos': 'Quick links',
  'Explorar': 'Explore',
  'Destinos': 'Destinations',
  'Contacto': 'Contact',
  'Todos os direitos reservados.': 'All rights reserved.',
  'coordenadas guardadas automaticamente': 'coordinates saved automatically',
  'Nenhuma imagem para preview.': 'No image to preview.',
  'Dia *': 'Day *',
  'Atividade *': 'Activity *',
  'Horário': 'Time',
  'Selecionar horário': 'Select time',
  'Hora': 'Hour',
  'Minuto': 'Minute',
  'Periodo': 'Period',
  'Sugestões de horário': 'Time suggestions',
  'Local': 'Place',
  'Atualizar atividade': 'Update activity',
  'Adicionar atividade': 'Add activity',
  'Carregando roteiro...': 'Loading itinerary...',
  'Nenhuma atividade cadastrada.': 'No activity registered.',
  'Proximas viagens': 'Upcoming trips',
  'Agenda recente': 'Recent schedule',
  'Ver todas': 'View all',
  'Nenhuma viagem cadastrada ainda.': 'No trip registered yet.',
  'Total de viagens': 'Total trips',
  'Nenhum dia organizado ainda.': 'No day organized yet.',
  'Carregando viagens...': 'Loading trips...',
  'Nenhuma viagem encontrada.': 'No trip found.',
  'Mapa indisponível no momento.': 'Map unavailable right now.',
  'Selecionar arquivos': 'Select files',
  'Planeamento em tempo real': 'Real-time planning',
  'Clima, mapa e lugares próximos': 'Weather, map and nearby places',
  'Escolha uma cidade real no autocomplete para carregar automaticamente coordenadas, previsão simples, mapa Leaflet/OpenStreetMap e recomendações próximas.': 'Choose a real city in autocomplete to load coordinates, simple forecast, Leaflet/OpenStreetMap map and nearby recommendations automatically.',
  'Clima': 'Weather',
  'Sensação': 'Feels like',
  'Humidade': 'Humidity',
  'Vento': 'Wind',
  'Clima atual indisponível.': 'Current weather unavailable.',
  'Restaurantes, hotéis, cafés, praias, museus e atrações': 'Restaurants, hotels, cafes, beaches, museums and attractions',
  'Nenhum local retornado pelas APIs de locais para este destino.': 'No place returned by the places APIs for this destination.',
  'Comece pela pesquisa inteligente.': 'Start with smart search.',
  'Digite “Lua” para Luanda ou “Cap” para Cape Town e selecione uma sugestão válida.': 'Type “Lua” for Luanda or “Cap” for Cape Town and choose a valid suggestion.',
  'Dados da viagem': 'Trip details',
  'Escolha o destino e preencha o que já souber.': 'Choose the destination and fill in what you already know.',
  'Os campos com * são obrigatórios. A imagem é opcional e serve apenas como capa visual da viagem.': 'Fields with * are required. The image is optional and is only used as the trip cover.',
  'Pesquisar cidade *': 'Search city *',
  'coordenadas automáticas': 'automatic coordinates',
  'Destino selecionado': 'Selected destination',
  'Coordenadas salvas de forma oculta para mapa, clima e locais próximos.': 'Coordinates are saved in the background for map, weather and nearby places.',
  'Orçamento em Kwanza (AOA)': 'Budget in Kwanza (AOA)',
  'Imagem de capa da viagem (opcional)': 'Trip cover image (optional)',
  'Foto do destino ou uma imagem que represente a viagem': 'Destination photo or an image that represents the trip',
  'Criar viagem': 'Create trip',
  'Conta': 'Account',
  'Sessão autenticada': 'Authenticated session',
  'Preferências': 'Preferences',
  'Modo visual e moeda': 'Visual mode and currency',
  'O tema e a moeda ficam persistidos para manter o painel consistente.': 'Theme and currency are persisted to keep the dashboard consistent.',
  'A sua identidade de viajante.': 'Your traveler identity.',
  'Ajuste o sistema ao seu jeito de viajar.': 'Adjust the system to your travel style.',
  'Conta gratuita': 'Free account',
  'Planeje melhor quando a sua viagem fica guardada.': 'Planning is better when your trip is saved.',
  'Crie uma conta para salvar viagens, controlar despesas, montar roteiros, guardar favoritos e consultar clima e mapas sempre que voltar.': 'Create an account to save trips, track expenses, build itineraries, keep favorites and check weather and maps whenever you return.',
  'Viagens salvas': 'Saved trips',
  'Roteiros': 'Itineraries',
  'Clima e mapas': 'Weather and maps',
  'Iniciar sessão': 'Log in',
  'Continuar como visitante': 'Continue as visitor',
};

const reverseStaticTranslations = Object.fromEntries(
  Object.entries(staticTranslations).map(([pt, en]) => [en, pt]),
) as Record<string, string>;

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly storageKey = 'travel_planner_language';
  readonly language = signal<Language>(this.normalize(localStorage.getItem(this.storageKey)));
  private observer?: MutationObserver;
  private translating = false;

  constructor() {
    document.documentElement.lang = this.language();
    queueMicrotask(() => {
      this.translatePage();
      this.startObserver();
    });
  }

  t(key: DictionaryKey): string {
    return dictionary[this.language()][key];
  }

  setLanguage(language: Language): void {
    this.language.set(language);
    localStorage.setItem(this.storageKey, language);
    document.documentElement.lang = language;
    this.translatePage();
  }

  private normalize(language: string | null): Language {
    return language === 'en' ? 'en' : 'pt';
  }

  private startObserver(): void {
    this.observer = new MutationObserver(() => {
      if (!this.translating) {
        this.translatePage();
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  private translatePage(): void {
    this.translating = true;
    this.translateElement(document.body);
    this.translating = false;
  }

  private translateElement(root: HTMLElement): void {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);

    while (walker.nextNode()) {
      const node = walker.currentNode;
      const text = node.textContent || '';
      const translated = this.translateText(text);

      if (translated !== text) {
        node.textContent = translated;
      }
    }

    root.querySelectorAll<HTMLElement>('[placeholder], [aria-label], [alt], [title]').forEach((element) => {
      ['placeholder', 'aria-label', 'alt', 'title'].forEach((attribute) => {
        const value = element.getAttribute(attribute);

        if (!value) {
          return;
        }

        const translated = this.translateText(value);

        if (translated !== value) {
          element.setAttribute(attribute, translated);
        }
      });
    });
  }

  private translateText(value: string): string {
    const trimmed = value.trim();

    if (!trimmed) {
      return value;
    }

    const translated = this.translateLiteral(trimmed);

    if (translated === trimmed) {
      return value;
    }

    return value.replace(trimmed, translated);
  }

  private translateLiteral(value: string): string {
    const map = this.language() === 'en' ? staticTranslations : reverseStaticTranslations;

    if (map[value]) {
      return map[value];
    }

    const pageMatch = value.match(/^Pagina (\d+) de (\d+)$/);

    if (this.language() === 'en' && pageMatch) {
      return `Page ${pageMatch[1]} of ${pageMatch[2]}`;
    }

    const englishPageMatch = value.match(/^Page (\d+) of (\d+)$/);

    if (this.language() === 'pt' && englishPageMatch) {
      return `Pagina ${englishPageMatch[1]} de ${englishPageMatch[2]}`;
    }

    const tripsMatch = value.match(/^(\d+) viagens cadastradas no sistema\.$/);

    if (this.language() === 'en' && tripsMatch) {
      return `${tripsMatch[1]} trips registered in the system.`;
    }

    const englishTripsMatch = value.match(/^(\d+) trips registered in the system\.$/);

    if (this.language() === 'pt' && englishTripsMatch) {
      return `${englishTripsMatch[1]} viagens cadastradas no sistema.`;
    }

    return value;
  }
}
