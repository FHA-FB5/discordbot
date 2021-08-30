import mongoose from 'mongoose';
import { logger } from '@/utils';
import Config from '@/Config';

mongoose
  .connect(Config.mongodbUri, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .catch((error: Error) => {
    logger.log('error', 'mongoDB mongoose.connect', error);
  });
