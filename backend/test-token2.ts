import { db } from './src/db/index.js';
import { users, reports } from './src/db/schema.js';
import jwt from 'jsonwebtoken';
import { env } from './src/config/env.js';

async function test() {
  const [user] = await db.select().from(users).limit(1);
  const token = jwt.sign({ sub: user.id, email: user.email }, env.JWT_SECRET, { expiresIn: '15m' });
  
  const res = await fetch('http://localhost:3000/api/report/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      role: 'startup',
      ideaName: 'Green Toys',
      problemStatement: 'I developed an AI-based system that analyzes toy images to evaluate sustainability, estimate environmental impact, and determine appropriate age groups. The system also recommends eco-friendly alternatives with purchase links. It helps parents and consumers make informed, sustainable toy choices while promoting environmentally responsible consumption and improving transparency in toy selection.',
      targetUsers: 'Parents of young children, eco-conscious consumers, toy retailers, early childhood educators, and online shoppers seeking safe, sustainable toy options.',
      industry: 'Manufacturing',
      businessModel: 'D2C / E-commerce',
      countryRegion: 'India, Rajasthan',
      stage: 'MVP Live',
      budget: '1-5 Lakhs',
      mvpStatus: 'Prototype built',
      knownCompetitors: ''
    })
  });
  
  const text = await res.text();
  console.log('STATUS:', res.status, res.statusText);
  console.log('BODY HEAD:', text.slice(0, 500));
  process.exit(0);
}
test();
