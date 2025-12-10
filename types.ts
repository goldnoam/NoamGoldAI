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
  gamesDesc: string;
  learnDesc: string;
  techDesc: string;
  visit: string;
  footerRights: string;
  sendFeedback: string;
  share: string;
  copied: string;
  language: string;
}

export interface CardData {
  id: string;
  titleKey: keyof Translation;
  descKey: keyof Translation;
  url: string;
  icon: 'gamepad' | 'book' | 'cpu';
}
