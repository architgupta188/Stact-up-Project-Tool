import { db } from './src/db/index.js';
import { users } from './src/db/schema.js';
import jwt from 'jsonwebtoken';
import { env } from './src/config/env.js';

async function test() {
  const [user] = await db.select().from(users).limit(1);
  if (!user) return console.log('no user');
  
  const token = jwt.sign({ id: user.id }, env.JWT_SECRET, { expiresIn: '15m' });
  console.log(token);
  process.exit(0);
}
test();
