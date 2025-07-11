import { get } from '@fpsak-frontend/utils';
import { PageContainer } from '@k9-sak-web/gui/shared/pageContainer/PageContainer.js';
import WriteAccessBoundContent from '@k9-sak-web/gui/shared/write-access-bound-content/WriteAccessBoundContent.js';
import { Alert, Button } from '@navikt/ds-react';
import { useContext, useEffect, useMemo, useReducer, type JSX } from 'react';
import { RettVedDød } from '../../../types/RettVedDød';
import ContainerContext from '../../context/ContainerContext';
import RettVedDødForm from '../rett-ved-død-form/RettVedDødForm';
import RettVedDødVurderingsdetaljer from '../rett-ved-død-vurderingsdetaljer/RettVedDødVurderingsdetaljer';
import ActionType from './actionTypes';
import rettVedDødReducer from './reducer';

const RettVedDødController = (): JSX.Element => {
  const [state, dispatch] = useReducer(rettVedDødReducer, {
    hasFailed: false,
    isLoading: true,
    rettVedDød: null,
    editMode: false,
  });
  const { rettVedDød, editMode, isLoading, hasFailed } = state;
  const { readOnly, endpoints, httpErrorHandler } = useContext(ContainerContext);
  const controller = useMemo(() => new AbortController(), []);

  const getRettVedDød = () =>
    get<RettVedDød>(endpoints.rettVedDod, httpErrorHandler, {
      signal: controller.signal,
    });

  useEffect(() => {
    let isMounted = true;
    getRettVedDød()
      .then(response => {
        if (isMounted) {
          dispatch({ type: ActionType.OK, rettVedDød: response });
        }
      })
      .catch(() => {
        dispatch({ type: ActionType.FAILED });
        isMounted = false;
        controller.abort();
      });
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const getContent = () => {
    const getHeading = () => <h2 className="m-0 text-xl font-semibold">Rett til pleiepenger ved barnets død</h2>;

    if (rettVedDød && (!editMode || readOnly)) {
      return (
        <>
          <div className="flex">
            {getHeading()}
            <WriteAccessBoundContent
              contentRenderer={() => (
                <Button
                  variant="tertiary"
                  size="xsmall"
                  className="ml-2"
                  onClick={() => dispatch({ type: ActionType.ENABLE_EDIT })}
                >
                  Rediger vurdering
                </Button>
              )}
              readOnly={readOnly}
            />
          </div>
          <RettVedDødVurderingsdetaljer rettVedDød={rettVedDød} />
        </>
      );
    }

    return (
      <>
        <Alert variant="info" className="mb-8 max-w-screen-lg">
          Kontroller om søker har søkt om pleiepenger for en periode som varer minst seks uker etter barnets dødsdato.
          Dersom det ikke er gjort, se unntaksrutinen ved barns død.
        </Alert>
        {getHeading()}
        <div className="mt-3 border-2 border-solid border-warning-yellow p-5 max-w-screen-lg">
          <Alert variant="warning">Vurder hvor lang periode søker har rett på pleiepenger ved barnets død.</Alert>
          <RettVedDødForm rettVedDød={rettVedDød} onCancelClick={() => dispatch({ type: ActionType.ABORT_EDIT })} />
        </div>
      </>
    );
  };

  if (readOnly && !rettVedDød) {
    return null;
  }

  return (
    <PageContainer isLoading={isLoading} hasError={hasFailed}>
      {getContent()}
    </PageContainer>
  );
};

export default RettVedDødController;
