const { VITE_LOCAL_STORYBOOK } = import.meta.env;
const mockUrlPrepend = VITE_LOCAL_STORYBOOK ? '' : '/k9-sak-web';

export { mockUrlPrepend };
