const { DEV: IS_DEV, VITE_LOCAL_STORYBOOK } = import.meta.env;
const mockUrlPrepend = VITE_LOCAL_STORYBOOK || IS_DEV ? '' : '/k9-sak-web';

export { mockUrlPrepend };
