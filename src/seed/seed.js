// src/seed/seed.js
/**
 * Seeder: generate 1000 employees and create unique index on email.
 * Usage:
 *   $env:MONGODB_URI="your-uri"; node src/seed/seed.js
 */

const { connectToMongo, getDb, closeMongo } = require('../db/client');

function generateEmployees(count = 1000) {
  const firstNames = [
  'Alex','Sam','Jordan','Taylor','Casey','Riley','Jamie','Morgan','Avery','Cameron','Evan','Drew','Kai','Noah','Liam','Mia','Ava','Olivia','Sophia','Isabella','Elijah','James','Benjamin','Lucas','Henry','Emma','Charlotte','Amelia','Harper','Ella','Chloe','Aria','Lily','Zoe','Nora','Hannah','Levi','Owen','Wyatt','Miles','Julian','Leo','Jack','Mason','Ethan','Grace','Scarlett','Victoria','Layla','Penelope'];
  const lastNames = [
  'Smith','Johnson','Brown','Williams','Jones','Garcia','Miller','Davis','Rodriguez','Martinez','Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin','Lee','Perez','Thompson','White','Harris','Sanchez','Clark','Ramirez','Lewis','Robinson','Walker','Young','Allen','King','Wright','Scott','Torres','Nguyen','Hill','Flores'];
  const positions = ['Engineer','Designer','Product Manager','QA','HR','Sales','Support','Ops','Data Analyst','DevOps'];
  const departments = ['Engineering','Product','Design','QA','HR','Sales','Support','Operations','Data'];

  const arr = [];
  for (let i = 0; i < count; i++) {
    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}.${i}@example.com`;
    arr.push({
      firstName: fn,
      lastName: ln,
      email,
      position: positions[Math.floor(Math.random() * positions.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
  return arr;
}

async function runSeed() {
  try {
    await connectToMongo();
    const db = getDb();
    console.log('Connected to DB for seeding');

    // Ensure unique index on email
    await db.collection('employees').createIndex({ email: 1 }, { unique: true });
    console.log('Ensured unique index on employees.email');

    // Count existing docs
    const existing = await db.collection('employees').countDocuments();
    console.log('Existing employee count:', existing);

    const target = 1000;
    const toInsert = Math.max(0, target - existing);
    if (toInsert <= 0) {
      console.log('No new employees to insert (target already met).');
      return;
    }
    const employees = generateEmployees(toInsert);

    // Insert in batches to avoid too large single insert
    const batchSize = 500;
    for (let i = 0; i < employees.length; i += batchSize) {
      const batch = employees.slice(i, i + batchSize);
      const { insertedCount } = await db.collection('employees').insertMany(batch);
      console.log(`Inserted batch ${i / batchSize + 1}: ${insertedCount}`);
    }

    console.log('Seeding complete.');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await closeMongo();
    process.exit(0);
  }
}

if (require.main === module) {
  runSeed();
}
