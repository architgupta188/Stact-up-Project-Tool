import type { Response } from 'express';

export function createSSEResponse(res: Response) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  return {
    send: (event: string, data: object) => {
      // Embed event name inside the data payload so client can parse via data: lines
      const payload = { event, ...data };
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    },
    close: () => res.end(),
  };
}
