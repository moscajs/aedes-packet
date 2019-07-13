'use strict'

function Packet (original, broker) {
  this.cmd = original.cmd || 'publish'
  this.brokerId = original.brokerId || (broker && broker.id)
  this.brokerCounter = original.brokerCounter || (broker ? (++broker.counter) : 0)
  this.topic = original.topic
  this.payload = original.payload || Buffer.alloc(0)
  this.qos = original.qos || 0
  this.retain = original.retain || false
  // [MQTT-2.3.1-5]
  if (this.qos > 0 || this.cmd !== 'publish') {
    //  [MQTT-2.3.1-1]
    this.messageId = original.messageId || 1
  }
}

module.exports = Packet
