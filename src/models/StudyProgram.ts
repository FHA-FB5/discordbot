import { model } from 'mongoose';
import { StudyProgram as StudyProgramSchema } from '@/schemas';

export default model('StudyProgram', StudyProgramSchema);
