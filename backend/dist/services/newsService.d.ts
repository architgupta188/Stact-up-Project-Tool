interface NewsArticle {
    title: string;
    description: string;
    source: {
        name: string;
    };
    url: string;
    publishedAt: string;
}
export declare function fetchNews(keywords: string[], country?: string): Promise<NewsArticle[]>;
export declare function formatNewsContext(articles: NewsArticle[]): string;
export {};
