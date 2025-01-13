import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render as rtlRender } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import { reducer, reduxForm } from 'redux-form';
import defaultMessages from '../../../public/sprak/nb_NO.json';
export { default as messages } from '../../../public/sprak/nb_NO.json';

export function renderWithIntl(ui: ReactElement<any>, { locale, messages, ...renderOptions }: any = {}) {
  const Wrapper = ({ children }) => (
    <IntlProvider locale={locale || 'nb-NO'} messages={messages || defaultMessages}>
      {children}
    </IntlProvider>
  );

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

export function renderWithIntlAndReduxForm(
  ui: ReactElement<any>,
  { locale, messages, initialValues, ...renderOptions }: any = {},
) {
  const MockForm = reduxForm({ form: 'mock', onSubmit: vi.fn() })(({ children }) => <div>{children}</div>);
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

export function renderWithIntlAndReactQueryClient(ui: React.ReactElement<any>, { locale, messages }: any = {}) {
  const testQueryClient = createTestReactQueryClient();
  const { rerender, ...result } = rtlRender(
    <QueryClientProvider client={testQueryClient}>
      <IntlProvider locale={locale || 'nb-NO'} messages={messages || defaultMessages} onError={() => null}>
        {ui}
      </IntlProvider>
    </QueryClientProvider>,
  );
  return {
    ...result,
    rerender: (rerenderUi: React.ReactElement<any>) =>
      rerender(
        <QueryClientProvider client={testQueryClient}>
          <IntlProvider locale={locale || 'nb-NO'} messages={messages || defaultMessages} onError={() => null}>
            {rerenderUi}
          </IntlProvider>
        </QueryClientProvider>,
      ),
  };
}

export * from '@testing-library/react';
