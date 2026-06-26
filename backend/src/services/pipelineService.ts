import { db } from '../db/index.js';
import { reports } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { callGemini } from './geminiService.js';
import { fetchNews, formatNewsContext } from './newsService.js';
import {
  buildClassifyPrompt,
  buildScoringPrompt,
  buildStartupReportPrompt,
  buildInvestorReportPrompt,
  buildStudentReportPrompt,
  buildStudentDiscoveryPrompt,
} from '../prompts/index.js';
import type { StartupInput, InvestorInput, StudentInput, ReportInput } from '../types/report.js';

type SSE = { send: (event: string, data: object) => void; close: () => void };

const PIPELINE_STEPS = [
  'Classifying your idea...',
  'Researching market trends...',
  'Scanning government schemes...',
  'Evaluating competition...',
  'Calculating validation score...',
  'Writing your full report...',
];

export async function runStartupPipeline(
  reportId: string,
  input: StartupInput,
  sse: SSE
): Promise<void> {
  const startTime = Date.now();

  try {
    await db.update(reports).set({ status: 'generating' }).where(eq(reports.id, reportId));

    // Step 1: Classify
    sse.send('pipeline_step', { step: 1, label: PIPELINE_STEPS[0] });
    let classification;
    try {
      classification = await callGemini(buildClassifyPrompt(input));
    } catch {
      classification = { searchKeywords: [input.industry, input.ideaName, input.businessModel] };
    }

    // Step 2: Research
    sse.send('pipeline_step', { step: 2, label: PIPELINE_STEPS[1] });
    const keywords = classification.searchKeywords || [input.industry, input.ideaName];
    const newsArticles = await fetchNews(keywords, input.countryRegion);
    const newsContext = formatNewsContext(newsArticles);

    // Step 3: Government schemes
    sse.send('pipeline_step', { step: 3, label: PIPELINE_STEPS[2] });
    let schemeContext = '';
    try {
      const schemeResult = await callGemini(
        `List 3-5 government schemes in ${input.countryRegion} applicable to a ${input.industry} startup at ${input.stage} stage. Return as a JSON array of objects with fields: name, description, eligibility, benefit, link. No preamble.`
      );
      schemeContext = JSON.stringify(schemeResult);
    } catch {
      schemeContext = 'No government scheme data available.';
    }

    // Step 4: Score
    sse.send('pipeline_step', { step: 4, label: PIPELINE_STEPS[3] });
    sse.send('pipeline_step', { step: 5, label: PIPELINE_STEPS[4] });
    const scoreResult = await callGemini(buildScoringPrompt(input, newsContext, schemeContext));

    // Step 5: Report
    sse.send('pipeline_step', { step: 6, label: PIPELINE_STEPS[5] });
    const reportSections = await callGemini(
      buildStartupReportPrompt(input, scoreResult, newsContext, schemeContext)
    );

    const compositeScore = scoreResult.compositeScore != null ? Math.round(Number(scoreResult.compositeScore)) : Math.round(
      Object.values(scoreResult.scores || {}).reduce((sum: number, s: any) => sum + (Number(s.score) || 0), 0) / 10 * 10
    );
    const verdict = compositeScore >= 70 ? 'go' : compositeScore >= 40 ? 'revise' : 'no-go';

    const outputData = {
      role: 'startup' as const,
      generatedAt: new Date().toISOString(),
      dimensionScores: scoreResult.scores || {},
      compositeScore,
      verdict: scoreResult.verdict || verdict,
      verdictRationale: scoreResult.verdictRationale || reportSections.finalVerdict || 'Analysis complete.',
      confidencePercentage: scoreResult.confidencePercentage || 70,
      topVerdictReasons: scoreResult.topVerdictReasons || [],
      pivotStrategy: scoreResult.pivotStrategy || '',
      keySuccessFactor: scoreResult.keySuccessFactor || '',
      executiveSummary: scoreResult.executiveSummary || null,
      monetizationAnalysis: reportSections.monetizationAnalysis || null,
      fundingReadiness: reportSections.fundingReadiness || null,
      ycAssessment: reportSections.ycAssessment || null,
      sections: {
        ideaSummary: reportSections.ideaSummary || '',
        problemAnalysis: reportSections.problemAnalysis || '',
        targetAudienceAnalysis: reportSections.targetAudienceAnalysis || '',
        marketOpportunity: reportSections.marketOpportunity || { tamEstimate: '', samEstimate: '', somEstimate: '', narrative: '' },
        competitionAnalysis: reportSections.competitionAnalysis || { competitors: [], positioning: '', gaps: [] },
        industryTrends: reportSections.industryTrends || [],
        governmentSchemes: reportSections.governmentSchemes || [],
        mvpSuggestions: reportSections.mvpSuggestions || '',
        risks: reportSections.risks || [],
        recommendations: reportSections.recommendations || [],
        fundingFit: reportSections.fundingFit || '',
        actionPlan: reportSections.actionPlan || [],
        finalVerdict: reportSections.finalVerdict || '',
      },
      newsArticles,
      researchContext: newsContext,
    };

    const generationMs = Date.now() - startTime;

    await db.update(reports).set({
      status: 'complete',
      outputData,
      score: compositeScore,
      verdict: outputData.verdict as 'go' | 'revise' | 'no-go',
      generationMs,
      updatedAt: new Date(),
    }).where(eq(reports.id, reportId));

    sse.send('pipeline_complete', { reportId, score: compositeScore, verdict: outputData.verdict });
  } catch (error: any) {
    console.error('Pipeline failed:', error);
    await db.update(reports).set({ status: 'failed', updatedAt: new Date() }).where(eq(reports.id, reportId));
    sse.send('pipeline_error', { message: 'Analysis failed. Please try again.', code: 'PIPELINE_ERROR' });
  } finally {
    sse.close();
  }
}

export async function runInvestorPipeline(
  reportId: string,
  input: InvestorInput,
  sse: SSE
): Promise<void> {
  const startTime = Date.now();

  try {
    await db.update(reports).set({ status: 'generating' }).where(eq(reports.id, reportId));

    sse.send('pipeline_step', { step: 1, label: 'Analysing investment sectors...' });
    const keywords = input.preferredSectors.slice(0, 3);
    const newsArticles = await fetchNews(keywords, input.geography);
    const newsContext = formatNewsContext(newsArticles);

    sse.send('pipeline_step', { step: 2, label: 'Researching market trends...' });
    sse.send('pipeline_step', { step: 3, label: 'Evaluating opportunities...' });

    const reportSections = await callGemini(buildInvestorReportPrompt(input, newsContext));

    const outputData = {
      role: 'investor' as const,
      generatedAt: new Date().toISOString(),
      sections: {
        sectorOverview: reportSections.sectorOverview || '',
        trendingCategories: reportSections.trendingCategories || [],
        redFlags: reportSections.redFlags || [],
        policyImpact: reportSections.policyImpact || '',
        opportunityMap: reportSections.opportunityMap || [],
        sectorsToWatch: reportSections.sectorsToWatch || [],
        dueDiligenceAngles: reportSections.dueDiligenceAngles || [],
      },
    };

    await db.update(reports).set({
      status: 'complete',
      outputData,
      generationMs: Date.now() - startTime,
      updatedAt: new Date(),
    }).where(eq(reports.id, reportId));

    sse.send('pipeline_complete', { reportId, score: null, verdict: 'na' });
  } catch (error: any) {
    console.error('Investor pipeline failed:', error);
    await db.update(reports).set({ status: 'failed', updatedAt: new Date() }).where(eq(reports.id, reportId));
    sse.send('pipeline_error', { message: 'Analysis failed.', code: 'PIPELINE_ERROR' });
  } finally {
    sse.close();
  }
}

export async function runStudentPipeline(
  reportId: string,
  input: StudentInput,
  sse: SSE
): Promise<void> {
  const startTime = Date.now();

  try {
    await db.update(reports).set({ status: 'generating' }).where(eq(reports.id, reportId));

    sse.send('pipeline_step', { step: 1, label: 'Understanding your profile...' });
    const keywords = [...input.interests.slice(0, 2), input.preferredDomain];
    const newsArticles = await fetchNews(keywords, 'India');
    const newsContext = formatNewsContext(newsArticles);

    if (input.intent === 'join') {
      sse.send('pipeline_step', { step: 2, label: 'Matching with modern startups...' });
      sse.send('pipeline_step', { step: 3, label: 'Calculating role compatibility...' });

      const discoveryData = await callGemini(buildStudentDiscoveryPrompt(input, newsContext));

      const outputData = {
        role: 'student' as const,
        intent: 'join' as const,
        generatedAt: new Date().toISOString(),
        discoveryData: discoveryData || null,
      };

      await db.update(reports).set({
        status: 'complete',
        outputData,
        generationMs: Date.now() - startTime,
        updatedAt: new Date(),
      }).where(eq(reports.id, reportId));

      sse.send('pipeline_complete', { reportId, score: null, verdict: 'na' });
    } else {
      sse.send('pipeline_step', { step: 2, label: 'Discovering matching ideas...' });
      sse.send('pipeline_step', { step: 3, label: 'Building your roadmap...' });

      const reportSections = await callGemini(buildStudentReportPrompt(input, newsContext));

      const outputData = {
        role: 'student' as const,
        intent: input.intent,
        generatedAt: new Date().toISOString(),
        sections: {
          ideaMatches: reportSections.ideaMatches || [],
          skillsToLearn: reportSections.skillsToLearn || [],
          mvpRoadmap: reportSections.mvpRoadmap || undefined,
          freeResources: reportSections.freeResources || [],
          studentPrograms: reportSections.studentPrograms || [],
          validationGuide: reportSections.validationGuide || '',
        },
      };

      await db.update(reports).set({
        status: 'complete',
        outputData,
        generationMs: Date.now() - startTime,
        updatedAt: new Date(),
      }).where(eq(reports.id, reportId));

      sse.send('pipeline_complete', { reportId, score: null, verdict: 'na' });
    }
  } catch (error: any) {
    console.error('Student pipeline failed:', error);
    await db.update(reports).set({ status: 'failed', updatedAt: new Date() }).where(eq(reports.id, reportId));
    sse.send('pipeline_error', { message: 'Analysis failed.', code: 'PIPELINE_ERROR' });
  } finally {
    sse.close();
  }
}

export async function runPipeline(
  reportId: string,
  input: ReportInput,
  sse: SSE
): Promise<void> {
  sse.send('pipeline_start', { reportId });

  switch (input.role) {
    case 'startup':
      return runStartupPipeline(reportId, input, sse);
    case 'investor':
      return runInvestorPipeline(reportId, input, sse);
    case 'student':
      return runStudentPipeline(reportId, input, sse);
  }
}
