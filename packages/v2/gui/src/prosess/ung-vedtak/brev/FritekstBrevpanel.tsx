import type {
  ung_kodeverk_dokument_DokumentMalType as DokumentMalType,
  ung_sak_kontrakt_formidling_vedtaksbrev_VedtaksbrevValg,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import { FileSearchIcon } from '@navikt/aksel-icons';
import { Button, Heading, Modal, VStack } from '@navikt/ds-react';
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
  vedtaksbrevValg?: ung_sak_kontrakt_formidling_vedtaksbrev_VedtaksbrevValg | undefined;
  forhåndsvisningIsLoading: boolean;
}

export const FritekstBrevpanel = ({
  readOnly,
  hentOriginalHtml,
  lagreVedtaksbrev,
  handleForhåndsvis,
  fieldIndex,
  vedtaksbrevValg,
  forhåndsvisningIsLoading,
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
      if (vedtaksbrevValg?.dokumentMalType) {
        formMethods.setValue(`vedtaksbrevValg.${fieldIndex}.redigertHtml`, html);
        lagreVedtaksbrev({ redigertHtml: html, nullstill, dokumentMalType: vedtaksbrevValg.dokumentMalType.kilde });
      }
    },
    [formMethods, lagreVedtaksbrev, vedtaksbrevValg, fieldIndex],
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
  }, [setRedigerbartInnholdKlart, formMethods, hentOriginalHtml, redigertBrevHtml, fieldIndex]);

  const handleLagre = useCallback(
    async (html: string, nullstill?: boolean) => {
      await handleFritekstSubmit(html, nullstill);
    },
    [handleFritekstSubmit],
  );

  useEffect(() => {
    const asyncEffect = async () => {
      if (firstRender.current || !redigerbartInnholdKlart) {
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
    <VStack gap="space-8">
      <Heading size="small" level="3">
        {vedtaksbrevValg?.dokumentMalType?.navn}
      </Heading>
      <div>
        <Button
          variant="tertiary"
          onClick={handleForhåndsvis}
          size="small"
          icon={<FileSearchIcon aria-hidden fontSize="1.5rem" />}
          loading={forhåndsvisningIsLoading}
          type="button"
        >
          Forhåndsvis brev
        </Button>
      </div>

      <div>
        {!readOnly && vedtaksbrevValg?.enableRediger && (
          <Button variant="secondary" type="button" onClick={() => setVisRedigering(true)} size="small">
            Rediger automatisk brev
          </Button>
        )}

        <Modal open={visRedigering} onClose={handleModalClose} width="53.75rem" aria-label="Rediger brev">
          {visRedigering && (
            <FritekstEditor
              handleSubmit={handleLagre}
              lukkEditor={lukkEditor}
              handleForhåndsvis={handleForhåndsvis}
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
    </VStack>
  );
};
