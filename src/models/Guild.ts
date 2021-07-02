import { model } from 'mongoose';
import { Guild as GuildSchema } from '@/schemas';

export default model('Guild', GuildSchema);
