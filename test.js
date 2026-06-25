'use strict'

const { test } = require('node:test')
const { strict: assert } = require('node:assert')
const Packet = require('./')

test('Packet defaults - PUBLISH, QoS 0', function () {
  const instance = new Packet({})
  assert.strictEqual(instance.cmd, 'publish')
  assert.strictEqual(instance.brokerId, undefined)
  assert.strictEqual(instance.brokerCounter, 0)
  assert.strictEqual(instance.topic, undefined)
  assert.deepStrictEqual(instance.payload, Buffer.alloc(0))
  assert.strictEqual(instance.qos, 0)
  assert.strictEqual(instance.dup, false)
  assert.strictEqual(instance.retain, false)
  assert.strictEqual(Object.prototype.hasOwnProperty.call(instance, 'messageId'), false)
})

test('Packet defaults - PUBREL, QoS 0', function () {
  const instance = new Packet({ cmd: 'pubrel' })
  assert.strictEqual(instance.cmd, 'pubrel')
  assert.strictEqual(instance.brokerId, undefined)
  assert.strictEqual(instance.brokerCounter, 0)
  assert.strictEqual(instance.topic, undefined)
  assert.deepStrictEqual(instance.payload, Buffer.alloc(0))
  assert.strictEqual(instance.qos, 0)
  assert.strictEqual(instance.dup, false)
  assert.strictEqual(instance.retain, false)
  assert.strictEqual(Object.prototype.hasOwnProperty.call(instance, 'messageId'), true)
  assert.strictEqual(instance.messageId, undefined)
})

test('Packet defaults - PUBLISH, QoS 1', function () {
  const instance = new Packet({ qos: 1 })
  assert.strictEqual(instance.cmd, 'publish')
  assert.strictEqual(instance.brokerId, undefined)
  assert.strictEqual(instance.brokerCounter, 0)
  assert.strictEqual(instance.topic, undefined)
  assert.deepStrictEqual(instance.payload, Buffer.alloc(0))
  assert.strictEqual(instance.qos, 1)
  assert.strictEqual(instance.dup, false)
  assert.strictEqual(instance.retain, false)
  assert.strictEqual(Object.prototype.hasOwnProperty.call(instance, 'messageId'), true)
  assert.strictEqual(instance.messageId, undefined)
})

test('Packet defaults - PUBLISH, dup=true', function () {
  const instance = new Packet({ dup: true })
  assert.strictEqual(instance.cmd, 'publish')
  assert.strictEqual(instance.brokerId, undefined)
  assert.strictEqual(instance.brokerCounter, 0)
  assert.strictEqual(instance.topic, undefined)
  assert.deepStrictEqual(instance.payload, Buffer.alloc(0))
  assert.strictEqual(instance.qos, 0)
  assert.strictEqual(instance.dup, true)
  assert.strictEqual(instance.retain, false)
  assert.strictEqual(instance.messageId, undefined)
})

test('Packet copies over most data', function () {
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

  assert.strictEqual(Object.prototype.hasOwnProperty.call(instance, 'messageId'), true)
  assert.strictEqual(instance.messageId, undefined)
  delete instance.messageId
  assert.deepStrictEqual(Object.assign({}, instance), expected)
})

test('Packet fills in broker data', function () {
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

  assert.strictEqual(Object.prototype.hasOwnProperty.call(instance, 'messageId'), true)
  assert.strictEqual(instance.messageId, undefined)
  delete instance.messageId
  assert.deepStrictEqual(Object.assign({}, instance), expected)
})

test('Packet copies clientId and nl if they exist', function () {
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

  assert.deepStrictEqual(Object.assign({}, instance), expected)
})

test('Packet does not copy clientId and nl if they dont exist', function () {
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

  assert.deepStrictEqual(Object.assign({}, instance), expected)
})

test('Packet copies MQTT v5 properties if they exist', function () {
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
  assert.deepStrictEqual(instance.properties, original.properties)
})

test('Packet does not add a properties key when absent', function () {
  const instance = new Packet({ topic: 'hello' })
  assert.strictEqual(Object.prototype.hasOwnProperty.call(instance, 'properties'), false)
})

test('Packet copies the internal messageExpiry timestamp if it exists', function () {
  const instance = new Packet({ topic: 'hello', messageExpiry: 1234567890 })
  assert.strictEqual(instance.messageExpiry, 1234567890)
})

test('Packet does not add a messageExpiry key when absent', function () {
  const instance = new Packet({ topic: 'hello' })
  assert.strictEqual(Object.prototype.hasOwnProperty.call(instance, 'messageExpiry'), false)
})
