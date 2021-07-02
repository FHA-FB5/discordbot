import { I18n } from 'i18n';

declare module 'discord.js' {
  export interface Client {
    commands: Collection<unknown, Command>
    i18n: I18n
  }
}
