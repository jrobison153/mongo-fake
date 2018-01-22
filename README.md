# Introduction

An ultra lightweight test fake implementation of mongo

What's a test fake? Check out [this](https://8thlight.com/blog/uncle-bob/2014/05/14/TheLittleMocker.html) short blog.

Fakes the 2.x version of the standard [Node Mongo Driver](http://mongodb.github.io/node-mongodb-native/2.2/)

# Usage

Install the module and save as a dev dependency

```bash
npm install mongo-fake --save-dev
```

or

```bash
yarn add mongo-fake --dev
```

Import or require into your test code and use as you would the standard mongo driver (with limitations based on supported capabilities listed below)

```javascript
import mongoFake from 'mongo-fake';


const someFunction = async () => {
  
  const mongoClient = mongo.MongoClient;
  const db = await mongoClient.connect()
  const collection = db.collection('aCollection');
  
  await collection.drop();
  await collection.insertMany([{a: 1}, {a: 2}, {a: 3, b: 4}]);
  const cursor = collection.find({});
  
  cursor.toArray().forEach((doc) => {
    
    // do something to the documents
  })
}

```

You can also take a look at the unit tests for more examples of usage.

# Mongo Functionality Currently Faked

The following functionality has been faked, admittedly there isn't much yet. Pretty much just enough to support my own testing so far. I will continue to build out more support as I needed, feel free to contribute.

[API Docs](https://jrobison153.github.io/mongo-fake/index.html)