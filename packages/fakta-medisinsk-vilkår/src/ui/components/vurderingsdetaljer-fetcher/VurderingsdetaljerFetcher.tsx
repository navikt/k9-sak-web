import { httpUtils } from '@fpsak-frontend/utils';
import { Alert, Loader } from '@navikt/ds-react';
import React, { type JSX } from 'react';
import Vurdering from '../../../types/Vurdering';
import ContainerContext from '../../context/ContainerContext';

interface VurderingsdetaljerFetcherProps {
  url: string;
  contentRenderer: (vurdering: Vurdering) => JSX.Element;
}

const VurderingsdetaljerFetcher = ({ url, contentRenderer }: VurderingsdetaljerFetcherProps): JSX.Element => {
  const { errorNotifier } = React.useContext(ContainerContext);

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [vurdering, setVurdering] = React.useState<Vurdering | null>(null);
  const [hentVurderingHarFeilet, setHentVurderingHarFeilet] = React.useState<boolean>(false);

  React.useEffect(() => {
    const controller = new AbortController();

    let isMounted = true;
    setIsLoading(true);
    setHentVurderingHarFeilet(false);
    httpUtils
      .get(url, errorNotifier, { signal: controller.signal })
      .then((vurderingResponse: Vurdering) => {
        const fetchedVurdering = new Vurdering(vurderingResponse);
        if (isMounted) {
          setVurdering(fetchedVurdering);
          setIsLoading(false);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setHentVurderingHarFeilet(true);
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [errorNotifier, url]);

  if (isLoading) {
    return <Loader size="large" />;
  }
  if (hentVurderingHarFeilet) {
    return <Alert variant="error">Noe gikk galt, vennligst prøv igjen senere.</Alert>;
  }
  if (!vurdering) {
    return <Alert variant="error">Kunne ikke hente vurderingsdetaljer.</Alert>;
  }
  return contentRenderer(vurdering);
};

export default VurderingsdetaljerFetcher;
