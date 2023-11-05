const { MongoClient } = require('mongodb');
const { performance } = require('perf_hooks');
const fs = require('fs');
const path = require('path');

const urlPersistent = 'mongodb://localhost:27017';
const urlVolatile = 'mongodb://localhost:27018';
const dbName = 'testdb';
const collectionName = 'testcol';
const numberOfTests = 100; // Number of tests to run

// Function to generate a random object of a given size in bytes
function generateDataObject(size) {
  const object = {};
  while (new Buffer.from(JSON.stringify(object)).length < size) {
    object[Math.random().toString(36).substring(2, 15)] = Math.random().toString(36).substring(2, 15);
  }
  return object;
}

async function stressTest(url, dataSize) {
  const client = new MongoClient(url);
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  // Write test
  const dataObject = generateDataObject(dataSize);
  let startTime = performance.now();
  await collection.insertOne(dataObject);
  let endTime = performance.now();
  const writeTime = endTime - startTime;

  // Read test
  startTime = performance.now();
  await collection.findOne(dataObject);
  endTime = performance.now();
  const readTime = endTime - startTime;

  await client.close();
  return { writeTime, readTime };
}

async function runTests() {
  const results = [['TestNumber', 'DataSize', 'PersistentWriteTime', 'PersistentReadTime', 'VolatileWriteTime', 'VolatileReadTime']];

  for (let i = 0; i < numberOfTests; i++) {
    const dataSize = (i + 1) * 1000; // Increase data size by 1KB in each iteration
    console.log(`Running test ${i + 1} with data size: ${dataSize} bytes`);

    const persistentResults = await stressTest(urlPersistent, dataSize);
    const volatileResults = await stressTest(urlVolatile, dataSize);

    results.push([i + 1, dataSize, persistentResults.writeTime, persistentResults.readTime, volatileResults.writeTime, volatileResults.readTime]);
  }

  // Write results to CSV
  const csvContent = results.map(e => e.join(",")).join("\n");
  fs.writeFileSync(path.join(__dirname, 'results.csv'), csvContent);
  console.log('Tests completed. Results saved to results.csv');
}

runTests().catch(console.dir);