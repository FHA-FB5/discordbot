import { model } from 'mongoose';
import { Game as GameSchema } from '@/schemas';

export default model('Game', GameSchema);
