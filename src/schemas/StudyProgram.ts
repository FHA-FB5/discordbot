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
  modules: [
    {
      module: {
        type: Schema.Types.ObjectId,
        ref: 'StudyProgramModule',
      },
      semester: {
        type: Number,
      },
    },
  ],
}, {
  timestamps: true,
  strict: false,
});