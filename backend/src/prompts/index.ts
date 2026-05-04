import type { StartupInput } from '../types/report.js';

export function buildClassifyPrompt(input: StartupInput): string {
  return `You are a startup classification engine. Analyse the following startup idea and return a structured JSON classification.

Startup:
- Idea: ${input.ideaName}
- Problem: ${input.problemStatement}
- Target Users: ${input.targetUsers}
- Industry: ${input.industry}
- Business Model: ${input.businessModel}
- Region: ${input.countryRegion}
- Stage: ${input.stage}

Return ONLY valid JSON matching this schema:
{
  "sector": "string — specific sub-sector within the industry",
  "businessModelType": "string — precise model type",
  "startupStage": "string — maturity assessment",
  "regionContext": "string — key regional factors",
  "searchKeywords": ["string — 5 keywords for news/trend search"]
}`;
}

export function buildScoringPrompt(input: StartupInput, newsContext: string, schemeContext: string): string {
  return `SYSTEM: You are a YC-style startup evaluator. You are blunt, structured, and precise.
You do not give empty encouragement. You identify real problems and real opportunities.
Respond ONLY with valid JSON matching the provided schema. No preamble or markdown.

Evaluate this startup idea on the following 10 dimensions, each scored 0-10.
Return a JSON object with scores and one-sentence rationale per dimension.

Startup:
- Idea: ${input.ideaName}
- Problem: ${input.problemStatement}
- Target Users: ${input.targetUsers}
- Industry: ${input.industry}
- Business Model: ${input.businessModel}
- Region: ${input.countryRegion}
- Stage: ${input.stage}
- Budget: ${input.budget}
- MVP Status: ${input.mvpStatus}
- Known Competitors: ${input.knownCompetitors || 'None specified'}

Market Context:
${newsContext}

Government Schemes Context:
${schemeContext}

Dimensions to score:
1. painLevel: How intense and real is the user pain? (0=no pain, 10=extreme pain)
2. urgency: How urgently do users need this solved today? (0=not urgent, 10=desperate)
3. marketSize: How large is the addressable market? (0=tiny niche, 10=massive global)
4. adoptionSpeed: How quickly would users adopt this? (0=very slow, 10=instant)
5. competitionIntensity: How crowded is the space? (0=extremely crowded, 10=no competition)
6. willingnessToPay: Would users pay for this? (0=never, 10=premium pricing accepted)
7. differentiation: How differentiated from existing solutions? (0=identical, 10=completely unique)
8. executionDifficulty: How achievable is this? (0=near impossible, 10=very easy to build)
9. mvpFeasibility: Can a lean MVP be built and tested quickly? (0=no, 10=in a weekend)
10. marketTiming: Is the timing right for this idea now? (0=too early/late, 10=perfect timing)

Return this EXACT JSON schema:
{
  "scores": {
    "painLevel": { "score": 0, "rationale": "..." },
    "urgency": { "score": 0, "rationale": "..." },
    "marketSize": { "score": 0, "rationale": "..." },
    "adoptionSpeed": { "score": 0, "rationale": "..." },
    "competitionIntensity": { "score": 0, "rationale": "..." },
    "willingnessToPay": { "score": 0, "rationale": "..." },
    "differentiation": { "score": 0, "rationale": "..." },
    "executionDifficulty": { "score": 0, "rationale": "..." },
    "mvpFeasibility": { "score": 0, "rationale": "..." },
    "marketTiming": { "score": 0, "rationale": "..." }
  },
  "compositeScore": 0,
  "verdict": "go|revise|no-go",
  "verdictRationale": "One sentence why"
}`;
}

export function buildStartupReportPrompt(
  input: StartupInput,
  scores: any,
  newsContext: string,
  schemeContext: string
): string {
  return `SYSTEM: You are VentureIQ, an AI startup validation engine modelled after top YC partners.
Generate a comprehensive startup validation report. Be blunt, specific, and action-oriented.
Respond ONLY with valid JSON matching the exact schema below. No preamble, no markdown.

Startup:
${JSON.stringify(input, null, 2)}

Scoring Results:
${JSON.stringify(scores, null, 2)}

Market News Context:
${newsContext}

Government Schemes Context:
${schemeContext}

Generate ALL of the following sections as structured JSON:
{
  "ideaSummary": "A concise, AI-rewritten 2-3 sentence summary of the idea, its value proposition, and target market",
  "problemAnalysis": "2-3 paragraphs analysing the depth and urgency of the problem. Be specific about WHY this problem matters and to whom.",
  "targetAudienceAnalysis": "2-3 paragraphs on how well-defined the user segment is, potential segment sizes, and gaps in targeting.",
  "marketOpportunity": {
    "tamEstimate": "Total addressable market estimate with reasoning",
    "samEstimate": "Serviceable addressable market estimate",
    "somEstimate": "Serviceable obtainable market in year 1-2",
    "narrative": "2-3 paragraphs on market dynamics, growth drivers, and opportunity sizing rationale"
  },
  "competitionAnalysis": {
    "competitors": [
      {
        "name": "Competitor name",
        "description": "What they do",
        "differentiator": "Gap vs this startup idea",
        "threat": "low|medium|high"
      }
    ],
    "positioning": "How this startup should position against competitors",
    "gaps": ["Market gap 1", "Market gap 2"]
  },
  "industryTrends": [
    { "title": "Trend headline", "summary": "1-2 sentence summary", "source": "Source name", "date": "Date" }
  ],
  "governmentSchemes": [
    { "name": "Scheme name", "description": "What it offers", "eligibility": "Who qualifies", "benefit": "Key benefit", "link": "URL if known" }
  ],
  "mvpSuggestions": "2-3 paragraphs with specific, narrow MVP recommendations. What to build first, what to leave out, how to test with users.",
  "risks": [
    { "risk": "Risk description", "severity": "low|medium|high", "mitigation": "How to mitigate" }
  ],
  "recommendations": [
    { "priority": 1, "action": "What to do", "reason": "Why this matters" }
  ],
  "fundingFit": "2 paragraphs on suitable funding type, investor profile, and when to raise.",
  "actionPlan": [
    { "week": 1, "goal": "Week goal", "tasks": ["Task 1", "Task 2"] },
    { "week": 2, "goal": "Week goal", "tasks": ["Task 1", "Task 2"] },
    { "week": 3, "goal": "Week goal", "tasks": ["Task 1", "Task 2"] },
    { "week": 4, "goal": "Week goal", "tasks": ["Task 1", "Task 2"] }
  ],
  "finalVerdict": "2-3 sentences. Direct, clear, with the core reasoning for the verdict."
}

IMPORTANT:
- Return 3-5 competitors (discover real ones based on the industry and region)
- Return 3-5 industry trends relevant to the sector
- Return 3-5 applicable government schemes for the region
- Return 3-5 risks with mitigations
- Return 5-7 prioritised recommendations
- Action plan MUST have 4 weeks with 3-5 tasks each
- All text should be substantive, not generic. Refer to specific companies, numbers, trends.`;
}

export function buildInvestorReportPrompt(input: any, newsContext: string): string {
  return `SYSTEM: You are VentureIQ, an AI investment intelligence engine for angel investors and VCs.
Generate a comprehensive sector intelligence report. Be data-driven and specific.
Respond ONLY with valid JSON. No preamble.

Investor Profile:
${JSON.stringify(input, null, 2)}

Market Context:
${newsContext}

Generate this JSON:
{
  "sectorOverview": "3-4 paragraphs on the current state of the selected sectors, key players, and momentum indicators.",
  "trendingCategories": [
    { "name": "Category name", "growthSignal": "high|medium|low", "description": "2-sentence description", "examples": ["Example startup type 1", "Example 2"] }
  ],
  "redFlags": [
    { "flag": "Risk name", "detail": "Why this is concerning" }
  ],
  "policyImpact": "2-3 paragraphs on how government policies affect these sectors. Be specific about Indian policies if geography is India.",
  "opportunityMap": [
    { "sector": "Sub-sector name", "maturity": 1-10, "growthRate": 1-10, "marketSize": "Estimated size" }
  ],
  "sectorsToWatch": ["Sector 1", "Sector 2", "Sector 3"],
  "dueDiligenceAngles": ["What to check 1", "What to check 2"]
}

Return 5 trending categories, 3-5 red flags, 5-8 opportunity map items, 3-5 sectors to watch, and 5-7 due diligence angles.`;
}

export function buildStudentReportPrompt(input: any, newsContext: string): string {
  return `SYSTEM: You are VentureIQ, an AI career and startup discovery engine for students.
Generate a personalised discovery report. Be practical, encouraging but honest.
Respond ONLY with valid JSON. No preamble.

Student Profile:
${JSON.stringify(input, null, 2)}

Market Context:
${newsContext}

Generate this JSON:
{
  "ideaMatches": [
    { "rank": 1, "name": "Idea name", "description": "2-3 sentences", "feasibility": "Beginner|Intermediate|Advanced", "budgetRequired": "Amount needed", "keyChallenge": "Main challenge" }
  ],
  "skillsToLearn": [
    { "skill": "Skill name", "priority": 1, "resource": "Where to learn (specific course/platform)" }
  ],
  ${input.intent === 'build' ? `"mvpRoadmap": [
    { "month": 1, "goal": "Month goal", "tasks": [{ "task": "Task name", "category": "Research|Build|Talk to Users|Launch" }] },
    { "month": 2, "goal": "Month goal", "tasks": [{ "task": "Task name", "category": "category" }] },
    { "month": 3, "goal": "Month goal", "tasks": [{ "task": "Task name", "category": "category" }] }
  ],` : ''}
  "freeResources": [
    { "name": "Resource name", "url": "URL", "description": "What it offers" }
  ],
  "studentPrograms": [
    { "name": "Program name", "description": "What it offers", "eligibility": "Who can apply" }
  ],
  "validationGuide": "3-4 paragraphs on how to validate a startup idea with zero or minimal budget. Practical, step-by-step advice."
}

Return 3 idea matches, 5-7 skills to learn, 5+ free resources, 3-5 student programs.`;
}

export function buildChatSystemPrompt(reportOutput: any): string {
  return `SYSTEM: You are VentureIQ's follow-up AI assistant. The user has just received a startup validation report and wants to dig deeper.

Report context:
${JSON.stringify(reportOutput, null, 2)}

Rules:
- Answer questions specifically about THIS report and THIS startup idea
- Reference specific scores, sections, and recommendations from the report
- Be concise but substantive
- Use the same blunt, YC-advisor tone
- If asked about something outside the report scope, briefly address it but redirect to actionable next steps
- Format your responses with clear paragraphs and bullet points where appropriate`;
}
