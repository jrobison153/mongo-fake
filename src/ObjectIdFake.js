import uuid from 'uuid';

/**
 * Fake the standard Mongo [ObjectID]{@link http://mongodb.github.io/node-mongodb-native/2.2/api/ObjectID.html},
 * uses a simple UUID with dashes removed.
 *
 */
class ObjectIdFake {

  constructor(id) {

    if (id) {

      this.id = id;
    } else {

      const tempId = uuid.v4();

      const uuidNoDashes = tempId.replace(/-/g, '');

      this.id = uuidNoDashes.substring(0, 24);
    }
  }

  toHexString() {

    return this.id;
  }
}

export default ObjectIdFake;
