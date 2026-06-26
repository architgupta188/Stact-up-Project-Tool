import { Router } from 'express';
import { callGemini } from '../services/geminiService.js';

const router = Router();

const STARTUP_DISCOVERY_PROMPT = `SYSTEM: You are VentureIQ's Startup Discovery Engine. Generate realistic, AI-powered startup matching results for a student/early-career professional looking to join a startup.

Based on the student profile below, generate a comprehensive startup discovery response. The startups should be realistic-sounding (AI-generated but plausible) startup names and descriptions that match the student's skills and interests.

Student Profile:
{PROFILE}

Return ONLY valid JSON matching this exact schema:
{
  "aiMatchSummary": {
    "matchStrength": "Strong|Good|Moderate",
    "topDomain": "Primary domain that fits the student",
    "topRole": "Best role match based on skills",
    "profileStrength": 0,
    "recommendation": "1-2 sentence personalized recommendation"
  },
  "recommendedStartups": [
    {
      "id": "unique-id",
      "name": "Startup Name",
      "description": "1-2 sentence description",
      "domain": "AI|FinTech|EdTech|HealthTech|ClimateTech|SaaS|D2C|DeepTech|Logistics|Other",
      "stage": "Pre-Seed|Seed|Series A|Series B+|Bootstrapped",
      "fundingStage": "Unfunded|Pre-Seed ($50K-$500K)|Seed ($500K-$2M)|Series A ($2M-$15M)|Series B+ ($15M+)",
      "location": "City, Country",
      "remote": true,
      "matchScore": 0,
      "openRoles": [
        {
          "title": "Role Title",
          "type": "Developer|Designer|Marketing|Product|Data Science|Operations|Content|Sales",
          "skills": ["Skill 1", "Skill 2"],
          "experience": "0-1 years|1-3 years|3-5 years|5+ years",
          "compensation": "Equity only|₹3-6 LPA|₹6-12 LPA|₹12-25 LPA|₹25+ LPA|Competitive"
        }
      ],
      "founderName": "Founder Name",
      "founderTitle": "CEO & Co-founder",
      "founderBackground": "1 sentence founder background",
      "teamSize": 0,
      "highlights": ["Highlight 1", "Highlight 2"],
      "whyMatch": "1 sentence explaining why this matches the student's profile"
    }
  ],
  "trendingStartups": [
    {
      "id": "unique-id",
      "name": "Startup Name",
      "description": "1-2 sentence description",
      "domain": "AI|FinTech|EdTech|HealthTech|ClimateTech|SaaS",
      "stage": "Seed|Series A|Series B+",
      "fundingStage": "Seed ($500K-$2M)|Series A ($2M-$15M)|Series B+ ($15M+)",
      "location": "City, Country",
      "remote": true,
      "matchScore": 0,
      "openRoles": [{ "title": "Role", "type": "Developer", "skills": ["Skill"], "experience": "1-3 years", "compensation": "Competitive" }],
      "founderName": "Founder Name",
      "founderTitle": "CEO",
      "founderBackground": "Background",
      "teamSize": 0,
      "highlights": ["Highlight"],
      "trendReason": "Why this startup is trending"
    }
  ],
  "recentlyFundedStartups": [
    {
      "id": "unique-id",
      "name": "Startup Name",
      "description": "1-2 sentence description",
      "domain": "AI|FinTech|EdTech|HealthTech|ClimateTech|SaaS",
      "stage": "Seed|Series A|Series B+",
      "fundingStage": "Recently raised amount",
      "location": "City, Country",
      "remote": false,
      "matchScore": 0,
      "openRoles": [{ "title": "Role", "type": "Developer", "skills": ["Skill"], "experience": "1-3 years", "compensation": "Competitive" }],
      "founderName": "Founder Name",
      "founderTitle": "CEO",
      "founderBackground": "Background",
      "teamSize": 0,
      "highlights": ["Highlight"],
      "fundingDetail": "Just raised $X from Investor Y"
    }
  ],
  "openPositions": [
    {
      "id": "unique-id",
      "role": "Role Title",
      "type": "Developer|Designer|Marketing|Product|Data Science",
      "startup": "Startup Name",
      "domain": "AI|FinTech|EdTech|HealthTech|ClimateTech|SaaS",
      "skills": ["Skill 1", "Skill 2"],
      "experience": "0-1 years|1-3 years",
      "compensation": "Equity only|₹3-6 LPA|₹6-12 LPA|Competitive",
      "remote": true,
      "matchScore": 0,
      "description": "2-3 sentence role description"
    }
  ],
  "founderSpotlights": [
    {
      "name": "Founder Name",
      "startup": "Startup Name",
      "background": "2-3 sentence background",
      "advice": "1 sentence advice for students",
      "domain": "AI|FinTech|EdTech|HealthTech|ClimateTech|SaaS"
    }
  ]
}

IMPORTANT:
- Generate 5-6 recommended startups sorted by matchScore (highest first, 70-98 range)
- Generate 3-4 trending startups
- Generate 3-4 recently funded startups
- Generate 6-8 open positions
- Generate 3 founder spotlights
- matchScore is 0-100 based on how well the startup/role matches the student's skills and interests
- profileStrength is 0-100 based on how complete and competitive the student's profile is
- All startups should be realistic-sounding Indian startups with plausible details
- Skills in roles should be specific (e.g., "React", "Python", "Figma", not generic)
- Make the data feel real and specific to the student's domain preferences`;

router.post('/discover', async (req: any, res) => {
  try {
    const { interests, skills, preferredDomain, intent } = req.body;

    if (!interests?.length || !skills?.length) {
      return res.status(400).json({ error: 'Missing required profile fields' });
    }

    const profile = JSON.stringify({
      interests,
      skills,
      preferredDomain: preferredDomain || 'Any',
      intent: intent || 'join',
    }, null, 2);

        const prompt = STARTUP_DISCOVERY_PROMPT.replace('{PROFILE}', profile);
    const result = await callGemini(prompt);

    return res.json(result);
  } catch (error: any) {
    console.error('Discovery error:', error);
    return res.status(500).json({ error: 'Failed to generate startup matches', details: error.message });
  }
});

export default router;
