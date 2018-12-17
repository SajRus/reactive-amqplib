RxJs v6 wrapper for the amqplib

# RxJS v6 wrapper for amqplib
reactive-amqplib is a wrapper for using amqplib NodeJS package with RxJS V6.

## Gettings started

To include this library in your project, all you need to do is install it using NPM.

```
$ yarn add reactive-amqplib
```
or 

```
$ npm install reactive-amqplib --save
```

## Examples

Here is a basic example of creating a connection to a RabbitMQ server, creating a channel and waiting for messages from the queue.

```javascript
const config = {
  queue: 'test_queue',
  host: 'amqp://localhost'
};

// Process stream
const connection = RxAmqpLib.newConnection(config.host).pipe(
  RxJsOperators.flatMap(connection => connection.createChannel()),
  RxJsOperators.flatMap(channel => channel.assertExchange(config.exchange, config.exchangeType, { durable: false })),
  RxJsOperators.flatMap(reply => reply.channel.assertQueue('', { exclusive: true })),
  RxJsOperators.flatMap(reply =>  RxJs.from(severities).pipe(
    RxJsOperators.flatMap(severity => reply.channel.bindQueue(reply.queue, config.exchange, severity)),
    RxJsOperators.bufferCount(severities.length),
    RxJsOperators.mapTo(reply)
    )),
  RxJsOperators.tap(() => console.log(' [*] Waiting for logs.')),
  RxJsOperators.flatMap(reply => reply.channel.consume(reply.queue, { noAck: true }))
);

connection.subscribe(
  msg => console.log(" [x] %s: '%s'", msg.content.toString()),
  err => console.error(err),
  () => console.info('completed')
);
```

## More Examples

1. ### Comming Soon


## Build it Yourself

Should you wish to build the library yourself, either for personal use, or for contribution, please ensure there are no errors emitted during the build process with `npm run build`.

```
$ git clone https://github.com/SajRus/reactive-amqplib.git
$ cd reactive-amqplib
$ yarn
$ yarn run build
```

## Project created with TypeScript Starter

Quickly create and configure a new library or Node.js project, for more info and build options visit [https://github.com/bitjson/typescript-starter]