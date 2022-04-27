test('Packet copies clientId and nl if they exist', function (t) {
  const original = {
    clientId: 'client-id',
    nl: false,
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

  t.deepEqual(instance, expected)
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

  t.deepEqual(instance, expected)
  t.end()
})
