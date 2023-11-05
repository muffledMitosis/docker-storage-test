# A speed test on docker storage.

Contains code that stress tests a docker writable layer and mounted volume
storage

## To Run

```console
docker-compose up -d
npm install
node stressTest.js
python plotResults.py
```

The example image and CSV files are running the stuff from my machine.