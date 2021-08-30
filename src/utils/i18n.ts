import { I18n } from 'i18n';
import logger from './logger';

const i18n = new I18n();
i18n.configure({
  locales: ['de-DE', 'en-GB'],
  defaultLocale: 'de-DE',
  retryInDefaultLocale: true,
  directory: `${__dirname}/../locales`,
  objectNotation: true,
  logDebugFn(msg) {
    logger.log('debug', 'i18n', msg);
  },
  logWarnFn(msg) {
    logger.log('warn', 'i18n', msg);
  },
  logErrorFn(msg) {
    logger.log('error', 'i18n', msg);
  },
});

function getMessage(phrase: string, config: { count?: number, locale?: string } = { }) {
  // set locale if set and existing
  if (config.locale && i18n.getLocales().includes(config.locale)) {
    i18n.setLocale(config.locale);
  }

  // check if pluralisation is used
  if (config.count || config.count === 0) {
    return i18n.__n(phrase, config.count);
  }
  return i18n.__(phrase);
}

export {
  i18n,
  getMessage,
};
