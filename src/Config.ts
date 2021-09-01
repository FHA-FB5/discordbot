import dotenv from 'dotenv';
import env from 'env-var';

dotenv.config();

export default class Config {

  /* bot config */
  static botClientID: string = env.get('BOT_CLIENT_ID').required().asString();

  static botClientSecret: string = env.get('BOT_CLIENT_SECRET').required().asString();

  static botToken: string = env.get('BOT_TOKEN').required().asString();

  static botShard: number = env.get('BOT_SHARD').required().asInt();

  /* dev config */
  static devMode: boolean = env.get('DEV_MODE').default('false').asBool();

  static devGuildId: string | undefined = env.get('DEV_GUILD_ID').asString();

  /* mongo config */
  static mongodbUri: string = env.get('MONGODB_URI').required().asString();

  /* keyv config */
  static keyvUri: string = env.get('KEYV_URI').required().asString();

  /* service config */
  static serviceName: string = env.get('SERVICE_NAME').default('discordbot').asString();

  /* sentry config */
  static sentryDSN: string | undefined = env.get('SENTRY_DSN').asString();
}