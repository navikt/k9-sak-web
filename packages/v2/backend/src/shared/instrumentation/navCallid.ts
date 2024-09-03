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
