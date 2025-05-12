export const navCallidHeaderName = 'Nav-Callid';

export interface NavCallidHeader {
  readonly headerName: typeof navCallidHeaderName;
  readonly headerValue: string;
}

const generateNewNavCallId = () => `CallId_${new Date().getTime()}_${Math.floor(Math.random() * 1000000000)}`;

export const generateNavCallidHeader = (): NavCallidHeader => ({
  headerName: navCallidHeaderName,
  headerValue: generateNewNavCallId(),
});

export const getNavCallidFromHeader = (request: Request): string | null => {
  const headerValue = request.headers.get(navCallidHeaderName);
  if (headerValue !== null && headerValue.startsWith('CallId_')) {
    return headerValue;
  }
  return null; // No valid Nav-Callid header found
};
