import { model } from 'mongoose';
import { StudyProgramModule as StudyProgramModuleSchema } from '@/schemas';

export default model('StudyProgramModule', StudyProgramModuleSchema);
