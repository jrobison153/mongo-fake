import MongoDatabaseFake from './MongoDatabaseFake';

/**
 * Fake the standard [MongoClient]{@link http://mongodb.github.io/node-mongodb-native/2.2/api/MongoClient.html}
 *
 */
class MongoClientFake {

  constructor() {

    this.db = new MongoDatabaseFake();
  }

  /**
   *
   * Connect to a fake MongoDatabase. Follows the standard Javascript [MongoDB driver connection process]{@link http://mongodb.github.io/node-mongodb-native/2.2/api/MongoClient.html#connect}.
   *
   * @returns {Promise.<MongoDatabaseFake>}
   */
  connect() {

    return Promise.resolve(this.db);
  }
}

export default MongoClientFake;
