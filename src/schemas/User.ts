import { Schema } from 'mongoose';

export default new Schema({
  userID: {
    type: String,
    required: true,
  },
  guilds: [
    {
      guild: {
        type: Schema.Types.ObjectId,
        ref: 'Guild',
      },
      studyPrograms: [
        {
          studyProgram: {
            type: Schema.Types.ObjectId,
            ref: 'StudyProgram',
          },
          semester: {
            type: Number,
          },
        },
      ],
      studyProgramModules: [
        {
          type: Schema.Types.ObjectId,
          ref: 'StudyProgramModule',
        },
      ],
      games: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Game',
        },
      ],
    },
  ],
}, {
  timestamps: true,
  strict: false,
});