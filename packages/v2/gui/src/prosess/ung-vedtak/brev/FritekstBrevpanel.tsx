import type {
  ung_kodeverk_dokument_DokumentMalType as DokumentMalType,
  ung_kodeverk_KodeverdiSomObjektUng_kodeverk_dokument_DokumentMalType,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import { Alert, Box, Button, Heading, Modal } from '@navikt/ds-react';
import type { UseMutateFunction } from '@tanstack/react-query';
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
  hentOriginalHtml: () => Promise<any>;
  lagreVedtaksbrev: UseMutateFunction<
    unknown,
    Error,
    {
      redigertHtml: string;
      nullstill?: boolean;
      dokumentMalType: DokumentMalType;
    },
    unknown
  >;
  handleForhåndsvis: () => void;
  fieldIndex: number;
  dokumentMalType?: ung_kodeverk_KodeverdiSomObjektUng_kodeverk_dokument_DokumentMalType | undefined;
}

export const FritekstBrevpanel = ({
  readOnly,
  hentOriginalHtml,
  lagreVedtaksbrev,
  handleForhåndsvis,
  fieldIndex,
  dokumentMalType,
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
  const redigertBrevHtml = useWatch({
    control: formMethods.control,
    name: `vedtaksbrevValg.${fieldIndex}.redigertHtml`,
  });

  const handleFritekstSubmit = useCallback(
    async (html: string, nullstill?: boolean) => {
      if (dokumentMalType) {
        formMethods.setValue(`vedtaksbrevValg.${fieldIndex}.redigertHtml`, html);
        lagreVedtaksbrev({ redigertHtml: html, nullstill, dokumentMalType: dokumentMalType.kilde });
      }
    },
    [formMethods, lagreVedtaksbrev, dokumentMalType, fieldIndex],
  );

  const lukkEditor = () => setVisRedigering(false);

  const hentFritekstbrevMal = useCallback(async () => {
    const responseHtml = await hentOriginalHtml();

    setBrevStiler(utledStiler(responseHtml));
    const seksjonerSomKanRedigeres = seksjonSomKanRedigeres(responseHtml);
    setPrefiksInnhold(utledPrefiksInnhold(seksjonerSomKanRedigeres));
    setSuffiksInnhold(utledSuffiksInnhold(seksjonerSomKanRedigeres));

    const originalHtmlStreng = utledRedigerbartInnhold(responseHtml);
    if (originalHtmlStreng) {
      setOriginalHtml(originalHtmlStreng);
      formMethods.setValue(`vedtaksbrevValg.${fieldIndex}.originalHtml`, originalHtmlStreng);
    }

    if (redigertBrevHtml) {
      setRedigerbartInnhold(redigertBrevHtml);
    } else {
      formMethods.setValue(`vedtaksbrevValg.${fieldIndex}.redigertHtml`, originalHtmlStreng ?? '');
      setRedigerbartInnhold(originalHtmlStreng ?? '');
    }

    setRedigerbartInnholdKlart(true);
    // setForhaandsvisningKlart(true);
  }, [setRedigerbartInnholdKlart, formMethods, hentOriginalHtml, redigertBrevHtml, fieldIndex]);

  const handleLagre = useCallback(
    async (html: string, nullstill?: boolean) => {
      await handleFritekstSubmit(html, nullstill);
    },
    [handleFritekstSubmit],
  );

  // useEffect(() => {
  //   if (!firstRender.current) {
  //     void hentFritekstbrevMal();
  //   }
  // }, [firstRender, hentFritekstbrevMal]);

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

  const handleModalClose = () => {
    setVisRedigering(false);
  };

  return (
    <Box.New marginBlock="0 4">
      <Heading size="small" level="3">
        {dokumentMalType?.navn}
      </Heading>
      {!readOnly && (
        <Box.New marginBlock="3">
          <Alert variant="info" size="small">
            Innhold fra det automatiske brevet kan nå redigeres
          </Alert>
        </Box.New>
      )}
      <Box.New paddingBlock="5" borderRadius="medium">
        <Heading size="small" level="4">
          Rediger brev til søker
        </Heading>
        <Box.New marginBlock="4 0">
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
        </Box.New>
        <Modal open={visRedigering} onClose={handleModalClose} width="53.75rem" aria-label="Rediger brev">
          {visRedigering && (
            <FritekstEditor
              handleSubmit={handleLagre}
              lukkEditor={lukkEditor}
              handleForhåndsvis={handleForhåndsvis}
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
      </Box.New>
    </Box.New>
  );
};
