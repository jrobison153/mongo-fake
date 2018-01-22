import MongoClientFake from './MongoClientFake';
import ObjectIdFake from './ObjectIdFake';

/**
 * @summary Top most mongo fake. Use this type to access the MongoClient and the ObjectID fakes. Mirrors
 * the [MongoDB 2.x Javascript driver]{@link http://mongodb.github.io/node-mongodb-native/2.2/}
 *
 * @description Usage:
 *
 *  - [mongoFake.MongoClient]{@link http://mongodb.github.io/node-mongodb-native/2.2/reference/ecmascript6/connecting/} - get the MongoClient (fake)
 *  - [mongoFake.ObjectID]{@link http://mongodb.github.io/node-mongodb-native/2.2/api/ObjectID.html} - Get the ObjectID (fake)
 *
 * @type {{MongoClient: MongoClientFake, ObjectID: ObjectIdFake}}
 */
const mongoFake = {

  MongoClient: new MongoClientFake(),
  ObjectID: ObjectIdFake,
};

/**
 * Create a new MongoClient, essentially blowing away any previous database operations. Use this
 * function between tests if you want to guarantee a clean starting point.
 */
mongoFake.reset = () => {

  mongoFake.MongoClient = new MongoClientFake();
};

export default mongoFake;
