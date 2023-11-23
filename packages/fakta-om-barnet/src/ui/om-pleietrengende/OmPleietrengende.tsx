import { PageContainer } from '@navikt/ft-plattform-komponenter';
import { get } from '@fpsak-frontend/utils';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import Pleietrengende from '../../types/Pleietrengende';
import PleietrengendeResponse from '../../types/PleietrengendeResponse';
import ContainerContext from '../context/ContainerContext';

const OmPleietrengende = (): JSX.Element => {
  const { endpoints, httpErrorHandler } = useContext(ContainerContext);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFailed, setHasFailed] = useState(false);
  const [pleietrengende, setPleietrengende] = useState<Pleietrengende>(null);
  const controller = useMemo(() => new AbortController(), []);

  const getOmPleietrengende = () =>
    get<PleietrengendeResponse>(endpoints.omPleietrengende, httpErrorHandler, {
      signal: controller.signal,
    });

  useEffect(() => {
    let isMounted = true;
    getOmPleietrengende()
      .then(response => {
        if (isMounted) {
          const nyPleietrengende = new Pleietrengende(response);
          setPleietrengende(nyPleietrengende);
          setIsLoading(false);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setHasFailed(true);
        isMounted = false;
        controller.abort();
      });
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <PageContainer isLoading={isLoading} hasError={hasFailed}>
      {pleietrengende && (
        <div className="flex items-center mt-10">
          <p className="my-0 mr-7">
            Navn:
            <span className="font-semibold ml-1">{pleietrengende.navn}</span>
          </p>

          <p className="my-0 mr-7">
            Fødselsnummer:
            <span className="font-semibold ml-1">{pleietrengende.fnr}</span>
          </p>

          <p className="my-0 mr-7">
            Diagnose:
            <span className="font-semibold ml-1">{pleietrengende.diagnosekoder}</span>
          </p>
          {pleietrengende.dødsdato ? (
            <p className="text-white bg-black rounded pr-2 pl-2 my-0 leading-6">{`Død ${pleietrengende.dødsdato}`}</p>
          ) : null}
        </div>
      )}
    </PageContainer>
  );
};
export default OmPleietrengende;
