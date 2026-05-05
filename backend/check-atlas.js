require('dotenv').config();
const { MongoClient } = require('mongodb');

async function check() {
  const uri = process.env.MONGO_URI; // Asegúrate que sea la de Atlas
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Conectado a Atlas. Listando todas las bases de datos:");
    
    const admin = client.db().admin();
    const dbs = await admin.listDatabases();
    
    for (let dbInfo of dbs.databases) {
      console.log(`\nDB Encontrada: ${dbInfo.name}`);
      const currentDb = client.db(dbInfo.name);
      const collections = await currentDb.listCollections().toArray();
      for (let col of collections) {
        const count = await currentDb.collection(col.name).countDocuments();
        console.log(`   - Colección: ${col.name} (${count} documentos)`);
      }
    }
  } finally {
    await client.close();
  }
}
check();
