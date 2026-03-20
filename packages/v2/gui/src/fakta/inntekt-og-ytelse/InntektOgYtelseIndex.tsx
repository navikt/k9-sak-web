import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense, use } from 'react';
import { LoadingPanel } from '../../shared/loading-panel/LoadingPanel.js';
import { InntektOgYtelseApiContext } from './api/InntektOgYtelseApiContext.js';
import InntektOgYtelsePanel from './InntektOgYtelsePanel.js';

interface InntektOgYtelseIndexProps {
  behandlingUuid: string;
}

const InntektOgYtelseContent = ({ behandlingUuid }: InntektOgYtelseIndexProps) => {
  const api = use(InntektOgYtelseApiContext);
  if (!api) throw new Error('InntektOgYtelseApiContext er ikke tilgjengelig');

  const { data } = useSuspenseQuery({
    queryKey: ['inntektOgYtelse', behandlingUuid],
    queryFn: () => api.hentInntekter(behandlingUuid),
  });

  return <InntektOgYtelsePanel inntekter={data?.inntekt} />;
};

const InntektOgYtelseIndex = ({ behandlingUuid }: InntektOgYtelseIndexProps) => (
  <Suspense fallback={<LoadingPanel />}>
    <InntektOgYtelseContent behandlingUuid={behandlingUuid} />
  </Suspense>
);

export default InntektOgYtelseIndex;
