/**
 * Fake for the standard [Mongo Cursor]{@link http://mongodb.github.io/node-mongodb-native/2.2/api/Cursor.html}.
 */
class MongoCursorFake {

  /**
   * get documents as an array
   *
   * [toArray]{@link http://mongodb.github.io/node-mongodb-native/2.2/api/Cursor.html#toArray}
   *
   * @returns {Promise.<T>}
   */
  toArray() {

    return Promise.resolve(this.docsToIterateOver);
  }

  iterateOver(docs) {

    this.docsToIterateOver = docs;
  }
}

export default MongoCursorFake;
