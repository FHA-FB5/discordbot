import { Schema } from 'mongoose';

export default new Schema({
  guild: {
    type: Schema.Types.ObjectId,
    ref: 'Guild',
  },
  name: {
    type: String,
    required: true,
  },
  abbreviation: {
    type: String,
    required: true,
  },
  roleId: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
  strict: false,
});