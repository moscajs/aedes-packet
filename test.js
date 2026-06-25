'use strict'

const { test } = require('tap')
const Packet = require('./')

test('Packet defaults - PUBLISH, QoS 0', function (t) {
  const instance = new Packet({})
  t.equal(instance.cmd, 'publish')
  t.equal(instance.brokerId, undefined)
  t.equal(instance.brokerCounter, 0)
  t.equal(instance.topic, undefined)
  t.same(instance.payload, Buffer.alloc(0))
  t.equal(instance.qos, 0)
  t.equal(instance.dup, false)
  t.equal(instance.retain, false)
  t.notOk(Object.prototype.hasOwnProperty.call(instance, 'messageId'))
  t.end()
})

test('Packet defaults - PUBREL, QoS 0', function (t) {
  const instance = new Packet({ cmd: 'pubrel' })
  t.equal(instance.cmd, 'pubrel')
  t.equal(instance.brokerId, undefined)
  t.equal(instance.brokerCounter, 0)
  t.equal(instance.topic, undefined)
  t.same(instance.payload, Buffer.alloc(0))
  t.equal(instance.qos, 0)
  t.equal(instance.dup, false)
  t.equal(instance.retain, false)
  t.ok(Object.prototype.hasOwnProperty.call(instance, 'messageId'))
  t.equal(instance.messageId, undefined)
  t.end()
})

test('Packet defaults - PUBLISH, QoS 1', function (t) {
  const instance = new Packet({ qos: 1 })
  t.equal(instance.cmd, 'publish')
  t.equal(instance.brokerId, undefined)
  t.equal(instance.brokerCounter, 0)
  t.equal(instance.topic, undefined)
  t.same(instance.payload, Buffer.alloc(0))
  t.equal(instance.qos, 1)
  t.equal(instance.dup, false)
  t.equal(instance.retain, false)
  t.ok(Object.prototype.hasOwnProperty.call(instance, 'messageId'))
  t.equal(instance.messageId, undefined)
  t.end()
})

test('Packet defaults - PUBLISH, dup=true', function (t) {
  const instance = new Packet({ dup: true })
  t.equal(instance.cmd, 'publish')
  t.equal(instance.brokerId, undefined)
  t.equal(instance.brokerCounter, 0)
  t.equal(instance.topic, undefined)
  t.same(instance.payload, Buffer.alloc(0))
  t.equal(instance.qos, 0)
  t.equal(instance.dup, true)
  t.equal(instance.retain, false)
  t.equal(instance.messageId, undefined)
  t.end()
})

test('Packet copies over most data', function (t) {
  const original = {
    cmd: 'pubrel',
    brokerId: 'A56c',
    brokerCounter: 42,
    topic: 'hello',
    payload: 'world',
    qos: 2,
    dup: true,
    retain: true,
    messageId: 24
  }
  const instance = new Packet(original)
  const expected = {
    cmd: 'pubrel',
    brokerId: 'A56c',
    brokerCounter: 42,
    topic: 'hello',
    payload: 'world',
    qos: 2,
    dup: true,
    retain: true
  }

  t.ok(Object.prototype.hasOwnProperty.call(instance, 'messageId'))
  t.equal(instance.messageId, undefined)
  delete instance.messageId
  t.same(instance, expected)
  t.end()
})

test('Packet fills in broker data', function (t) {
  const broker = {
    id: 'A56c',
    counter: 41
  }
  const original = {
    cmd: 'pubrel',
    topic: 'hello',
    payload: 'world',
    qos: 2,
    retain: true,
    messageId: 24
  }
  const instance = new Packet(original, broker)
  const expected = {
    cmd: 'pubrel',
    brokerId: 'A56c',
    brokerCounter: 42,
    topic: 'hello',
    payload: 'world',
    qos: 2,
    dup: false,
    retain: true
  }

  t.ok(Object.prototype.hasOwnProperty.call(instance, 'messageId'))
  t.equal(instance.messageId, undefined)
  delete instance.messageId
  t.same(instance, expected)
  t.end()
})

test('Packet copies clientId and nl if they exist', function (t) {
  const original = {
    clientId: 'client-id',
    nl: false
  }
  const instance = new Packet(original)
  const expected = {
    clientId: 'client-id',
    nl: false,
    cmd: 'publish',
    brokerId: undefined,
    brokerCounter: 0,
    topic: undefined,
    payload: Buffer.alloc(0),
    qos: 0,
    dup: false,
    retain: false
  }

  t.same(instance, expected)
  t.end()
})

test('Packet does not copy clientId and nl if they dont exist', function (t) {
  const original = {}
  const instance = new Packet(original)
  const expected = {
    cmd: 'publish',
    brokerId: undefined,
    brokerCounter: 0,
    topic: undefined,
    payload: Buffer.alloc(0),
    qos: 0,
    dup: false,
    retain: false
  }

  t.same(instance, expected)
  t.end()
})

test('Packet copies MQTT v5 properties if they exist', function (t) {
  const original = {
    topic: 'hello',
    payload: 'world',
    properties: {
      contentType: 'application/json',
      responseTopic: 'reply/here',
      correlationData: Buffer.from('id-1'),
      userProperties: { foo: 'bar' },
      payloadFormatIndicator: true
    }
  }
  const instance = new Packet(original)
  t.same(instance.properties, original.properties)
  t.end()
})

test('Packet does not add a properties key when absent', function (t) {
  const instance = new Packet({ topic: 'hello' })
  t.notOk(Object.prototype.hasOwnProperty.call(instance, 'properties'))
  t.end()
})

test('Packet copies the internal messageExpiry timestamp if it exists', function (t) {
  const instance = new Packet({ topic: 'hello', messageExpiry: 1234567890 })
  t.equal(instance.messageExpiry, 1234567890)
  t.end()
})

test('Packet does not add a messageExpiry key when absent', function (t) {
  const instance = new Packet({ topic: 'hello' })
  t.notOk(Object.prototype.hasOwnProperty.call(instance, 'messageExpiry'))
  t.end()
})
