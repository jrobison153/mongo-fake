import { expect } from 'chai';
import MongoCursorFake from '../src/MongoCursorFake';

describe('MongoCursorFake Tests', () => {

  describe('when getting documents as an Array', () => {

    it('returns all documents', async () => {

      const cursorFake = new MongoCursorFake();
      const docs = [
        {
          a: 'a',
        },
        {
          b: '2',
        },
      ];

      cursorFake.iterateOver(docs);

      const retrievedDocs = await cursorFake.toArray();

      expect(retrievedDocs).to.deep.equal(docs);
    });
  });
});
