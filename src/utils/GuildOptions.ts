import { Guild } from '@/models';
import keyv from './keyv';

export default class GuildOptions {
  guildId: string;

  constructor(guildId: string) {
    this.guildId = guildId;
  }

  async get(): Promise<{
    locale?: string
  }> {
    const guildOptionsKeyv = keyv('guildOptions');
    let guildOptions = await guildOptionsKeyv.get(this.guildId);

    // if config was not found, load it from the db
    if (!guildOptions) {
      const guild = (await Guild.findOne({ guildId: this.guildId }).select([
        'options',
        'primaryLocale',
      ]).lean());

      // check if options was found
      if (guild) {
        guildOptions = guild.options;

        // set default options if neeeded
        if (!guildOptions.locale) {
          if (guild.primaryLocale === 'de') {
            guildOptions.locale = 'de-DE';
          } else {
            guildOptions.locale = 'en-GB';
          }
        }

        await guildOptionsKeyv.set(this.guildId, guildOptions, 20000);
      }
    }

    return guildOptions;
  }
}
