import { Alert, Box, Button, Heading, Modal } from '@navikt/ds-react';
import type { QueryObserverResult, UseMutateFunction } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { type FormData } from '../FormData';
import FritekstEditor from './FritekstEditor';
import {
  seksjonSomKanRedigeres,
  utledPrefiksInnhold,
  utledRedigerbartInnhold,
  utledStiler,
  utledSuffiksInnhold,
} from './RedigeringUtils';

interface FriktekstBrevpanelProps {
  readOnly: boolean;
  redigertBrevHtml: string | undefined;
  hentFritekstbrevHtmlCallback: () => Promise<QueryObserverResult<any, Error>>;
  lagreVedtaksbrev: UseMutateFunction<unknown, Error, string, unknown>;
}

export const FritekstBrevpanel = ({
  readOnly,
  hentFritekstbrevHtmlCallback,
  lagreVedtaksbrev,
}: FriktekstBrevpanelProps) => {
  const [visRedigering, setVisRedigering] = useState(false);
  const firstRender = useRef<boolean>(true);
  const [redigerbartInnholdKlart, setRedigerbartInnholdKlart] = useState<boolean>(false);
  const [brevStiler, setBrevStiler] = useState<string>('');
  const [prefiksInnhold, setPrefiksInnhold] = useState<string>('');
  const [suffiksInnhold, setSuffiksInnhold] = useState<string>('');
  const [redigerbartInnhold, setRedigerbartInnhold] = useState<string>('');
  const [originalHtml, setOriginalHtml] = useState<string>('');
  const formMethods = useFormContext<FormData>();
  const redigertBrevHtml = useWatch({ control: formMethods.control, name: 'redigertHtml' });

  const handleFritekstSubmit = useCallback(
    async (html: string) => {
      formMethods.setValue('redigertHtml', html);
      await lagreVedtaksbrev(html);
    },
    [formMethods, lagreVedtaksbrev],
  );

  const lukkEditor = () => setVisRedigering(false);

  const hentFritekstbrevMal = useCallback(async () => {
    const { data: responseHtml } = await hentFritekstbrevHtmlCallback();

    setBrevStiler(utledStiler(responseHtml));
    const seksjonerSomKanRedigeres = seksjonSomKanRedigeres(responseHtml);
    setPrefiksInnhold(utledPrefiksInnhold(seksjonerSomKanRedigeres));
    setSuffiksInnhold(utledSuffiksInnhold(seksjonerSomKanRedigeres));

    const originalHtmlStreng = utledRedigerbartInnhold(responseHtml);
    if (originalHtmlStreng) {
      setOriginalHtml(originalHtmlStreng);
      formMethods.setValue('originalHtml', originalHtmlStreng);
    }

    if (redigertBrevHtml) {
      setRedigerbartInnhold(redigertBrevHtml);
    } else {
      formMethods.setValue('redigertHtml', originalHtmlStreng ?? '');
      setRedigerbartInnhold(originalHtmlStreng ?? '');
    }

    await setRedigerbartInnholdKlart(true);
    // setForhaandsvisningKlart(true);
  }, [setRedigerbartInnholdKlart, formMethods, hentFritekstbrevHtmlCallback, redigertBrevHtml]);

  const handleLagre = useCallback(
    async (html: string) => {
      await handleFritekstSubmit(html);
    },
    [handleFritekstSubmit],
  );

  useEffect(() => {
    if (!firstRender.current) {
      void hentFritekstbrevMal();
    }
  }, [firstRender, hentFritekstbrevMal]);

  useEffect(() => {
    const asyncEffect = async () => {
      if (!firstRender.current && redigerbartInnholdKlart) {
        // await handleLagre(redigertBrevHtml);
      } else {
        await hentFritekstbrevMal();
        firstRender.current = false;
      }
    };
    void asyncEffect();
  }, [firstRender, redigertBrevHtml, handleLagre, hentFritekstbrevMal, redigerbartInnholdKlart]);

  useEffect(() => {
    if (redigertBrevHtml) setRedigerbartInnhold(redigertBrevHtml);
  }, [redigertBrevHtml]);

  return (
    <Box marginBlock="0 4">
      <Heading size="small" level="2">
        Brev
      </Heading>
      {!readOnly && (
        <Box marginBlock="3">
          <Alert variant="info" size="small">
            Innhold fra det automatiske brevet kan nå redigeres
          </Alert>
        </Box>
      )}
      <div>
        <Heading size="small" level="3">
          Rediger brev til søker
        </Heading>
        <Box marginBlock="4 0">
          <Button
            variant="secondary"
            type="button"
            onClick={() => setVisRedigering(true)}
            // disabled={readOnly || !redigerbartInnholdKlart}
            // loading={!redigerbartInnholdKlart}
            // icon={<Edit aria-hidden />}
            size="small"
          >
            Rediger brev
          </Button>
        </Box>
        <Modal open={visRedigering} onClose={() => setVisRedigering(false)} width="53.75rem" aria-label="Rediger brev">
          {visRedigering && (
            <FritekstEditor
              handleSubmit={handleLagre}
              lukkEditor={lukkEditor}
              //   handleForhåndsvis={handleForhåndsvis}
              //   setFieldValue={setFieldValue}
              // kanInkludereKalender={kanInkludereKalender}
              //   skalBrukeOverstyrendeFritekstBrev={skalBrukeOverstyrendeFritekstBrev}
              readOnly={readOnly}
              redigerbartInnholdKlart={redigerbartInnholdKlart}
              redigerbartInnhold={redigerbartInnhold ?? ''}
              originalHtml={originalHtml}
              brevStiler={brevStiler}
              prefiksInnhold={prefiksInnhold}
              suffiksInnhold={suffiksInnhold}
            />
          )}
        </Modal>
      </div>
    </Box>
  );
};
