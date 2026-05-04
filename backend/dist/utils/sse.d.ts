import type { Response } from 'express';
export declare function createSSEResponse(res: Response): {
    send: (event: string, data: object) => void;
    close: () => Response<any, Record<string, any>>;
};
