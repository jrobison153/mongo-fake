/* eslint-disable no-underscore-dangle,no-unused-expressions */
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import MongoCollectionFake from '../src/MongoCollectionFake';
import ObjectID from '../src/ObjectIdFake';

chai.use(chaiAsPromised);

describe('MongoCollectionFake tests', () => {

  const docs = [
    {
      id: 'doc1',
      a: '1',
    },
    {
      id: 'doc2',
      a: '2',
    },
    {
      id: 'doc3',
      a: '3',
    },
  ];

  let mongoCollectionFake;

  beforeEach(async () => {

    mongoCollectionFake = new MongoCollectionFake();
  });

  describe('given fake is setup for healthy system', () => {

    let insertResult;

    beforeEach(async () => {

      insertResult = await mongoCollectionFake.insertMany(docs);
    });

    describe('when insertingMany documents', () => {

      it('returns a resolved promise with insertedCount equal to the number of inserted documents', async () => {

        expect(insertResult.insertedCount).to.equal(3);
      });

      it('assigns each document an _id field of type ObjectID', async () => {

        const retrievedDocs = await mongoCollectionFake.find().toArray();

        const filteredDocs = retrievedDocs.filter((doc) => {

          return doc._id && doc._id.toHexString().length === 24;
        });

        expect(filteredDocs).to.have.lengthOf(3);
      });
    });

    describe('when finding documents', () => {

      it('returns all documents when no query is specified', async () => {

        const foundDocs = await mongoCollectionFake.find().toArray();

        const foundDocsStripped = stripKeysFromDocs(foundDocs, ['_id']);

        expect(foundDocsStripped).to.deep.equal(docs);
      });

      it('returns all documents when an empty query is specified', async () => {

        const foundDocs = await mongoCollectionFake.find({}).toArray();

        const foundDocsWithoutId = stripKeysFromDocs(foundDocs, ['_id']);

        expect(foundDocsWithoutId).to.deep.equal(docs);
      });

      it('returns subset of documents when $or query used on single object property', async () => {

        const orQuery = {
          $or: [
            {
              a: '1',
            },
            {
              a: '3',
            },
          ],
        };

        const foundDocs = await mongoCollectionFake.find(orQuery).toArray();

        const foundDocsWithoutIds = stripKeysFromDocs(foundDocs, ['_id']);

        const expectedDocs = [
          {
            id: 'doc1',
            a: '1',
          },
          {
            id: 'doc3',
            a: '3',
          },
        ];

        expect(foundDocsWithoutIds).to.deep.equal(expectedDocs);
      });

      describe('and $or query has an object match criteria', () => {

        it('returns all documents that match', async () => {

          const expectedDocs = mongoCollectionFake.docs;

          const docIds = expectedDocs.map((doc) => {

            return doc._id;
          });

          const orQueryGuts = docIds.map((id) => {

            return {
              _id: new ObjectID(id.toHexString()),
            };
          });

          const orQuery = {
            $or: orQueryGuts,
          };

          const foundDocs = await mongoCollectionFake.find(orQuery).toArray();

          expect(foundDocs).to.deep.equal(expectedDocs);
        });
      });
    });

    describe('when updating many documents', () => {

      describe('and no update is specified', () => {

        it('returns the number zero documents updated', async () => {

          const updateResult = await mongoCollectionFake.updateMany({}, {}, {});

          expect(updateResult.result.n).to.equal(0);
        });
      });

      describe('and no filter is specified', () => {

        let updateResult;

        beforeEach(async () => {

          updateResult = await mongoCollectionFake.updateMany({}, { $set: { a: 'I was updated' } }, {});
        });

        it('updates all the documents', async () => {
          const updatedDocs = await mongoCollectionFake.find().toArray();
          const allDocsUpdated = updatedDocs.every((doc) => {

            return doc.a === 'I was updated';
          });

          expect(allDocsUpdated).to.be.true;
        });

        it('returns the number of documents updated', async () => {

          expect(updateResult.result.n).to.equal(docs.length);
        });
      });

      describe('and an $or filter is specified', () => {

        it('updates only documents matching the filter', async () => {

          const filter = {
            $or: [
              {
                a: '1',
              },
              {
                a: '3',
              },
            ],
          };

          const updateResult = await mongoCollectionFake.updateMany(filter, { $set: { a: 'I was updated' } }, {});
          const foundDocs = await mongoCollectionFake.find({}).toArray();

          const updatedDocs = foundDocs.filter((doc) => {

            return doc.a === 'I was updated';
          });

          expect(updateResult.result.n).to.equal(2);
          expect(updatedDocs[0].id).to.be.oneOf(['doc1', 'doc3']);
          expect(updatedDocs[1].id).to.be.oneOf(['doc1', 'doc3']);
        });
      });
    });

    describe('when dropping a collection', () => {

      it('removes all documents', async () => {

        const fakeCollection = new MongoCollectionFake();

        fakeCollection.insertMany(docs);

        // guard assertion
        let foundDocs = await fakeCollection.find().toArray();
        expect(foundDocs).to.have.lengthOf(3);

        await fakeCollection.drop();

        foundDocs = await fakeCollection.find().toArray();
        expect(foundDocs).to.have.lengthOf(0);
      });
    });
  });
});

function stripKeysFromDocs(docs, keysToRemove) {

  const docsWithoutKeys = docs.map((doc) => {

    const docWithoutKeys = { ...doc };

    keysToRemove.forEach((key) => {

      delete docWithoutKeys[key];
    });

    return docWithoutKeys;
  });

  return docsWithoutKeys;
}
