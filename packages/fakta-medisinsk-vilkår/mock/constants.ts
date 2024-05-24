const { VITE_LOCAL_STORYBOOK, DEV: IS_DEV } = import.meta.env;
const mockUrlPrepend = VITE_LOCAL_STORYBOOK || IS_DEV ? '' : '/k9-sak-web';

export { mockUrlPrepend };
