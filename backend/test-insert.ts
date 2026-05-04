import { db } from './src/db/index.js';
import { reports } from './src/db/schema.js';

async function test() {
  try {
    const input = {
      role: 'startup', ideaName: 'Green Toys',
      problemStatement: 'I developed an AI-based system that analyzes toy images to evaluate sustainability, estimate environmental impact, and determine appropriate age groups. The system also recommends eco-friendly alternatives with purchase links. It helps parents and consumers make informed, sustainable toy choices while promoting environmentally responsible consumption and improving transparency in toy selection.',
      targetUsers: 'Parents of young children, eco-conscious consumers, toy retailers, early childhood educators, and online shoppers seeking safe, sustainable toy options.',
      industry: 'Manufacturing',
      businessModel: 'D2C / E-commerce',
      countryRegion: 'India, Rajasthan',
      stage: 'MVP Live', budget: '1-5 Lakhs', mvpStatus: 'Prototype built'
    };
    
    // We need a userId, fetch the first user
    const { users } = await import('./src/db/schema.js');
    const [user] = await db.select().from(users).limit(1);
    
    if(!user) return console.log('No user');

    const [report] = await db.insert(reports).values({
      userId: user.id,
      role: input.role,
      status: 'pending',
      inputData: input,
      ideaName: input.ideaName,
    }).returning();
    console.log('Inserted:', report.id);
  } catch(e) {
    console.error('Insert error:', e);
  } finally {
    process.exit(0);
  }
}
test();
