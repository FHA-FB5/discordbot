import mongoose from 'mongoose';
import environment from '@/environment';
import { logger } from '@/utils';

mongoose
  .connect(environment.mongodb_uri, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .catch((error: Error) => {
    logger.log('error', 'mongoDB mongoose.connect', error);
  });
