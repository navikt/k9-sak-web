/**
 * Performance-optimized test utilities
 *
 * Key improvements:
 * 1. Reuse IntlProvider instances
 * 2. Minimal re-renders
 * 3. Lazy cleanup
 */

import { render as rtlRender } from '@testing-library/react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import nbMessages from '../i18n/nb_NO.json';

// Create cache once and reuse across tests for better performance
const intlCache = createIntlCache();

// Memoize intl instances per locale to avoid recreation
const intlInstances = new Map();

function getIntl(messages = nbMessages, locale = 'nb-NO') {
  const key = `${locale}`;
  if (!intlInstances.has(key)) {
    intlInstances.set(
      key,
      createIntl(
        {
          locale,
          messages,
        },
        intlCache,
      ),
    );
  }
  return intlInstances.get(key);
}

/**
 * Optimized render function with IntlProvider
 * Reuses IntlProvider instance for better performance
 */
export function renderWithIntl(ui: React.ReactElement, { messages = nbMessages, locale = 'nb-NO', ...options } = {}) {
  const intl = getIntl(messages, locale);

  function Wrapper({ children }: { children: React.ReactNode }) {
    return <RawIntlProvider value={intl}>{children}</RawIntlProvider>;
  }

  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

/**
 * For tests that don't need IntlProvider - faster
 */
export { render, screen, waitFor, within } from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
