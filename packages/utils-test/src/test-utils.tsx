import { render as rtlRender } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { IntlProvider } from 'react-intl';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import { reducer, reduxForm } from 'redux-form';
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

export function renderWithIntlAndReduxForm(
  ui: ReactElement,
  { locale, messages, initialValues, ...renderOptions }: any = {},
) {
  const MockForm = reduxForm({ form: 'mock', onSubmit: vi.fn() })(({ handleSubmit, children }) => (
    <form onSubmit={handleSubmit}>{children}</form>
  ));
  const Wrapper = ({ children }) => (
    <Provider store={createStore(combineReducers({ form: reducer }))}>
      <IntlProvider locale={locale || 'nb-NO'} messages={messages || defaultMessages} onError={() => null}>
        <MockForm initialValues={initialValues}>{children}</MockForm>
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
