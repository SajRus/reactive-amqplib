'use strict';
const RxJsOperators = require('rxjs/operators');
const RxJs = require('rxjs');
const RxAmqpLib = require('../index');
const config = {
  exchange: 'logs',
  exchangeType: 'fanout',
  host: 'amqp://'
};
const severities = process.argv.slice(2);

// const severities = ['info', 'warning', 'error'];

if (severities.length < 1) {
  console.warn('Usage: receive_logs.ts [info] [warning] [error]');
  process.exit(1);
}

const connection = RxAmqpLib.newConnection(config.host).pipe(
  RxJsOperators.flatMap(connection => connection.createChannel()),
  RxJsOperators.flatMap(channel =>
    channel.assertExchange(config.exchange, config.exchangeType, {
      durable: false
    })
  ),
  RxJsOperators.flatMap(reply =>
    reply.channel.assertQueue('', { exclusive: true })
  ),
  RxJsOperators.flatMap(reply =>
    RxJs.from(severities).pipe(
      RxJsOperators.flatMap(severity =>
        reply.channel.bindQueue(reply.queue, config.exchange, severity)
      ),
      RxJsOperators.bufferCount(severities.length),
      RxJsOperators.mapTo(reply)
    )
  ),
  RxJsOperators.tap(() => console.log(' [*] Waiting for logs.')),
  RxJsOperators.flatMap(reply =>
    reply.channel.consume(reply.queue, { noAck: true })
  )
);

connection.subscribe(
  msg => console.log(" [x] %s: '%s'", msg.content.toString()),
  err => console.error(err),
  () => console.info('completed')
);
