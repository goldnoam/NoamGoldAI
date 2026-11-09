export enum LanguageCode {
  EN = 'en',
  HE = 'he',
  ZH = 'zh',
  HI = 'hi',
  RU = 'ru',
  DE = 'de',
  ES = 'es',
  FR = 'fr',
}

export interface Translation {
  title: string;
  subtitle: string;
  games: string;
  learn: string;
  tech: string;
  blog: string;
  gamesDesc: string;
  learnDesc: string;
  techDesc: string;
  blogDesc: string;
  visit: string;
  readArticles: string;
  footerRights: string;
  sendFeedback: string;
  share: string;
  copied: string;
  language: string;
  search: string;
  linkedin: string;
  lab: string;
  labDesc: string;
  moreSites: string;
  moreGames: string;
  articlesAndUpdates: string;
  articlesSubtitle: string;
}

export interface CardData {
  id: string;
  titleKey: keyof Translation;
  descKey: keyof Translation;
  url: string;
  icon: 'gamepad' | 'book' | 'cpu' | 'wrench' | 'newspaper';
  imageUrl: string;
}