import React, { ReactElement } from 'react';
import { render as rtlRender } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import { reducer } from 'redux-form';
import { QueryClient, QueryClientProvider } from 'react-query';
// eslint-disable-next-line import/no-relative-packages
import defaultMessages from '../../../public/sprak/nb_NO.json';
// eslint-disable-next-line import/no-relative-packages
export { default as messages } from '../../../public/sprak/nb_NO.json';

export function renderWithIntl(ui: ReactElement, { locale, messages, ...renderOptions }: any = {}) {
  const Wrapper = ({ children }) => (
    <IntlProvider locale={locale || 'nb-NO'} messages={messages || defaultMessages}>
      {children}
    </IntlProvider>
  );

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

export function renderWithReduxForm(ui: ReactElement, { ...renderOptions } = {}) {
  const Wrapper = ({ children }) => (
    <Provider store={createStore(combineReducers({ form: reducer }))}>{children}</Provider>
  );

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

export function renderWithIntlAndReduxForm(ui: ReactElement, { locale, messages, ...renderOptions }: any = {}) {
  const Wrapper = ({ children }) => (
    <Provider store={createStore(combineReducers({ form: reducer }))}>
      <IntlProvider locale={locale || 'nb-NO'} messages={messages || defaultMessages} onError={() => null}>
        {children}
      </IntlProvider>
    </Provider>
  );

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

const createTestReactQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

export function renderWithReactQueryClient(ui: React.ReactElement) {
  const testQueryClient = createTestReactQueryClient();
  const { rerender, ...result } = rtlRender(<QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>);
  return {
    ...result,
    rerender: (rerenderUi: React.ReactElement) =>
      rerender(<QueryClientProvider client={testQueryClient}>{rerenderUi}</QueryClientProvider>),
  };
}

export * from '@testing-library/react';
