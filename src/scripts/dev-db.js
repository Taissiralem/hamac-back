// Base MongoDB locale pour le développement (aucune installation de MongoDB requise).
// Les données sont conservées dans ./.dev-db entre deux lancements.
// Usage : npm run db:dev  puis, dans un autre terminal, npm run dev
const path = require("path");
const fs = require("fs");
const { MongoMemoryServer } = require("mongodb-memory-server");

const dbPath = path.join(__dirname, "..", "..", ".dev-db");
fs.mkdirSync(dbPath, { recursive: true });

(async () => {
  const server = await MongoMemoryServer.create({
    instance: { port: 27017, dbPath, storageEngine: "wiredTiger" },
  });
  console.log(`MongoDB de dev prête : ${server.getUri()}hamac`);
  const stop = async () => {
    await server.stop({ doCleanup: false });
    process.exit(0);
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
})();
