/* eslint-disable class-methods-use-this */
import deepEqual from 'deep-equal';
import MongoCursorFake from './MongoCursorFake';
import ObjectID from './ObjectIdFake';

/**
 * Fake for the standard Mongo [Collection]{@link http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html} module.
 * Documents are stored in memory.
 */
class MongoCollectionFake {

  constructor() {

    this.docs = [];
    this.cursorFake = new MongoCursorFake();
  }

  /**
   * removes all stored documents
   *
   * [drop]{@link http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#drop}
   *
   * @returns {Promise.<T>}
   */
  drop() {

    this.docs = [];
    return Promise.resolve();
  }

  /**
   * find documents in the database
   *
   * [find]{@link http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#find}
   *
   * @param query currently has support for the following (anything else will be ignored and all documents will be returned)
   *  - no query, i.e. return all documents
   *  - '$or' type queries for strict equality, e.g. \{$or [ \{name: 'rimmer'\}, \{rank: 'third technician'\} ] \}
   * @returns {MongoCursorFake}
   */
  find(query) {

    let docsToIterateOver = this.docs;

    if (query && query.$or) {

      const queryDocs = query.$or;

      docsToIterateOver = this.filterDocsOr(queryDocs);
    }

    this.cursorFake.iterateOver(docsToIterateOver);

    return this.cursorFake;
  }

  /**
   * insert documents into the database
   *
   * [insertMany]{@link http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#insertMany}
   *
   * @param docs - Array of objects
   * @returns {Promise.<{insertedCount}>}
   */
  insertMany(docs) {

    const docsWithId = docs.map((doc) => {

      const updatedDocWithId = {
        _id: new ObjectID(),
        ...doc,
      };

      return updatedDocWithId;
    });

    this.docs = [...this.docs, ...docsWithId];

    return Promise.resolve({ insertedCount: docs.length });
  }

  /**
   * update many documents in the database
   *
   * [updateMany]{@link http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#updateMany}
   * @param filter currently has support for the following (anything else will be ignored and all documents will be updated)
   *  - no query, i.e. return all documents
   *  - '$or' type queries for strict equality, e.g. \{$or [ \{name: 'rimmer'\}, \{rank: 'third technician'\} ] \}
   * @param update - Supports $set
   * @param options - ignored
   * @returns {Promise.<T>}
   */
  // eslint-disable-next-line no-unused-vars
  updateMany(filter, update, options) {

    const updateObj = update.$set;
    let numDocsUpdated = 0;

    if (updateObj) {

      const propertiesToUpdate = Object.getOwnPropertyNames(updateObj);

      const keyToUpdate = propertiesToUpdate[0];

      this.docs.forEach((doc) => {

        const isMatching = MongoCollectionFake.isDocMatchingFilter(filter, doc);

        if (isMatching) {

          // eslint-disable-next-line no-param-reassign
          doc[keyToUpdate] = updateObj[keyToUpdate];

          numDocsUpdated += 1;
        }
      });
    }

    return Promise.resolve({ result: { n: numDocsUpdated } });
  }

  filterDocsOr(queryDocs) {

    let filteredDocs = [];

    queryDocs.forEach((queryDoc) => {

      const propertyToMatch = Object.keys(queryDoc)[0];

      const matchingDocs = this.docs.filter((doc) => {

        return MongoCollectionFake.isPropertyPresentAndMatching(doc, queryDoc, propertyToMatch);
      });

      filteredDocs = [...filteredDocs, ...matchingDocs];
    });

    return filteredDocs;
  }

  static isDocMatchingFilter(filter, doc) {

    let isMatching = false;

    if (filter && filter.$or) {

      filter.$or.forEach((queryDoc) => {

        const propertyToMatch = Object.keys(queryDoc)[0];

        isMatching = isMatching || MongoCollectionFake.isPropertyPresentAndMatching(doc, queryDoc, propertyToMatch);
      });
    } else {

      isMatching = true;
    }

    return isMatching;
  }

  static isPropertyPresentAndMatching(targetObj, testObj, property) {

    let propertyIsPresentAndMatching = false;
    const targetValue = targetObj[property];

    if (targetValue !== undefined) {

      propertyIsPresentAndMatching = deepEqual(targetValue, testObj[property], { strict: true });
    }

    return propertyIsPresentAndMatching;
  }
}


export default MongoCollectionFake;
