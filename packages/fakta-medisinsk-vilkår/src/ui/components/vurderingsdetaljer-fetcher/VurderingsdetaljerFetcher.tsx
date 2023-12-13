import { Loader } from '@navikt/ds-react';
import { PageError } from '@navikt/ft-plattform-komponenter';
import { httpUtils } from '@fpsak-frontend/utils';
import React, { useMemo } from 'react';
import Vurdering from '../../../types/Vurdering';
import ContainerContext from '../../context/ContainerContext';

interface VurderingsdetaljerFetcherProps {
  url: string;
  contentRenderer: (vurdering: Vurdering) => JSX.Element;
}

const VurderingsdetaljerFetcher = ({ url, contentRenderer }: VurderingsdetaljerFetcherProps): JSX.Element => {
  const { httpErrorHandler } = React.useContext(ContainerContext);

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [vurdering, setVurdering] = React.useState<Vurdering>(null);
  const [hentVurderingHarFeilet, setHentVurderingHarFeilet] = React.useState<boolean>(false);

  const controller = useMemo(() => new AbortController(), [url]);

  function hentVurderingsdetaljer(): Promise<Vurdering> {
    return httpUtils.get(url, httpErrorHandler, { signal: controller.signal });
  }

  const handleError = () => {
    setIsLoading(false);
    setHentVurderingHarFeilet(true);
  };

  React.useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setHentVurderingHarFeilet(false);
    hentVurderingsdetaljer()
      .then((vurderingResponse: Vurdering) => {
        const fetchedVurdering = new Vurdering(vurderingResponse);
        if (isMounted) {
          setVurdering(fetchedVurdering);
          setIsLoading(false);
        }
      })
      .catch(handleError);

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [url]);

  if (isLoading) {
    return <Loader size="large" />;
  }
  if (hentVurderingHarFeilet) {
    return <PageError message="Noe gikk galt, vennligst prøv igjen senere" />;
  }

  return contentRenderer(vurdering);
};

export default VurderingsdetaljerFetcher;
