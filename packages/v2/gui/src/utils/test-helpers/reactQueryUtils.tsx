import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';

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
  const { rerender, ...result } = render(<QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>);
  return {
    ...result,
    rerender: (rerenderUi: React.ReactElement) =>
      rerender(<QueryClientProvider client={testQueryClient}>{rerenderUi}</QueryClientProvider>),
  };
}

interface QueryClientWrapperProps {
  children: React.ReactNode;
}

export const QueryClientWrapper = ({ children }: QueryClientWrapperProps) => {
  const queryClient = createTestReactQueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
