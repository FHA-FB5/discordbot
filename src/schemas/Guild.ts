import { Schema } from 'mongoose';

export default new Schema({
  guildId: {
    type: String,
    required: true,
  },
  primaryLocale: {
    type: String,
  },
  options: {
    prefix: {
      type: String,
    },
    locale: {
      type: String,
    },
    logType: {
      type: String,
      enum: ['runtime', 'extreme'],
    },
    logChannel: {
      type: String,
    },
    loggedEvents: [String],
  },
}, {
  timestamps: true,
  strict: false,
});