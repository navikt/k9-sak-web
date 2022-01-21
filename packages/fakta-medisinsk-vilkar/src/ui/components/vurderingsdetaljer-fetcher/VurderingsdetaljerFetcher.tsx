import { get } from '@navikt/k9-http-utils';
import { PageError } from '@navikt/k9-react-components';
import React, { useMemo } from 'react';
import axios from 'axios';
import Spinner from 'nav-frontend-spinner';
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

    const httpCanceler = useMemo(() => axios.CancelToken.source(), [url]);

    function hentVurderingsdetaljer(): Promise<Vurdering> {
        return get(url, httpErrorHandler, { cancelToken: httpCanceler.token });
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
            httpCanceler.cancel();
        };
    }, [url]);

    if (isLoading) {
        return <Spinner />;
    }
    if (hentVurderingHarFeilet) {
        return <PageError message="Noe gikk galt, vennligst prøv igjen senere" />;
    }

    return contentRenderer(vurdering);
};

export default VurderingsdetaljerFetcher;
