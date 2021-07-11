interface Environment {
  bot_client_id: number
  bot_client_secret: string
  bot_prefix: string
  bot_token: string
  mongodb_uri: string
  sentry_dsn: string
  keyv_uri: string
  shard: number,
  telegram_bot_token: string,
  telegram_feed_id: number
}

const environment: Environment = {
  bot_client_id: Number(process.env.BOT_CLIENT_ID),
  bot_client_secret: process.env.BOT_CLIENT_SECRET || '',
  bot_prefix: process.env.BOT_PREFIX || '',
  bot_token: process.env.BOT_TOKEN || '',
  mongodb_uri: process.env.MONGODB_URI || '',
  sentry_dsn: process.env.SENTRY_DSN || '',
  keyv_uri: process.env.KEYV_URI || '',
  shard: Number(process.env.SHARD) || 0,
  telegram_bot_token: process.env.TELEGRAM_BOT_TOKEN || '',
  telegram_feed_id: Number(process.env.TELEGRAM_FEED_ID) || -1,
};

export default environment;
