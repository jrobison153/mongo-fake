import MongoCollectionFake from './MongoCollectionFake';

/**
 * Fake [MongoDatabase]{@link http://mongodb.github.io/node-mongodb-native/2.2/api/Cursor.html}
 */
class MongoDatabaseFake {

  constructor() {

    this.collectionFake = new MongoCollectionFake();
  }

  /**
   * Get the fake Mongo collection
   *
   * [collection]{@link http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html#collection}
   *
   * @returns {MongoCollectionFake}
   */
  collection() {

    return this.collectionFake;
  }
}

export default MongoDatabaseFake;
