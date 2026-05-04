import { env } from '../config/env.js';
export async function fetchNews(keywords, country) {
    const query = keywords.join(' OR ');
    try {
        const url = new URL('https://newsapi.org/v2/everything');
        url.searchParams.set('q', query);
        url.searchParams.set('sortBy', 'relevancy');
        url.searchParams.set('pageSize', '5');
        url.searchParams.set('language', 'en');
        url.searchParams.set('apiKey', env.NEWS_API_KEY);
        const response = await fetch(url.toString());
        const data = await response.json();
        if (data.status !== 'ok' || !data.articles) {
            console.warn('NewsAPI returned non-ok status:', data.status);
            return [];
        }
        return data.articles.slice(0, 5).map(a => ({
            title: a.title || '',
            description: a.description || '',
            source: { name: a.source?.name || 'Unknown' },
            url: a.url || '',
            publishedAt: a.publishedAt || '',
        }));
    }
    catch (error) {
        console.error('NewsAPI fetch failed:', error);
        return [];
    }
}
export function formatNewsContext(articles) {
    if (articles.length === 0)
        return 'No recent news articles found.';
    return articles.map((a, i) => `[${i + 1}] "${a.title}" — ${a.source.name} (${a.publishedAt?.slice(0, 10) || 'recent'})\n${a.description || 'No description.'}`).join('\n\n');
}
//# sourceMappingURL=newsService.js.map