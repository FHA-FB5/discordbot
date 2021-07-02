/* eslint-disable no-console */
import Kafka, { MessageKey, MessageValue } from 'node-rdkafka';
import { logger } from '@/utils';

export default class KafkaProducer {
  producer: Kafka.Producer;

  topic: string;

  constructor(topic: string, message: MessageValue, key: MessageKey) {
    this.topic = topic;

    this.producer = new Kafka.Producer({
      // debug: 'all',
      'metadata.broker.list': 'localhost:9092',
      dr_cb: true,
    });

    this.producer.on('event.log', (log) => {
      logger.log('info', 'kafka producer event.log', log);
    });

    this.producer.on('event.error', (err) => {
      logger.log('error', 'kafka producer event.error', err);
    });

    this.producer.on('delivery-report', (err, report) => {
      logger.log('info', 'kafka producer delivery-report err', err);
      logger.log('info', 'kafka producer delivery-report report', report);
    });

    this.producer.on('disconnected', (arg) => {
      logger.log('info', 'kafka producer disconnected', arg);
    });

    this.producer.on('ready', (arg) => {
      logger.log('info', 'kafka producer ready', arg);

      try {
        this.producer.produce(this.topic, null, message, key, Date.now());
      } catch (err) {
        logger.log('error', 'kafka producer ready', err);
      }
    });
  }

  connect() {
    this.producer.connect();
  }
}
