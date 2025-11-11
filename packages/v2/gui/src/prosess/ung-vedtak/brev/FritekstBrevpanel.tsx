import type {
  ung_kodeverk_dokument_DokumentMalType as DokumentMalType,
  ung_sak_kontrakt_formidling_vedtaksbrev_editor_VedtaksbrevEditorResponse as VedtaksbrevEditorResponse,
  ung_sak_kontrakt_formidling_vedtaksbrev_VedtaksbrevValg,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import { FileSearchIcon } from '@navikt/aksel-icons';
import { Button, Heading, Modal, VStack } from '@navikt/ds-react';
import { useQuery, type UseMutateFunction } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { type FormData } from '../FormData';
import type { UngVedtakBackendApiType } from '../UngVedtakBackendApiType';
import FritekstEditor from './FritekstEditor';

const getSeksjonerData = (fritekstEditorData: VedtaksbrevEditorResponse | undefined) => {
  const seksjoner = fritekstEditorData?.redigert ?? fritekstEditorData?.original ?? [];
  return seksjoner;
};

const getRedigerbartInnhold = (fritekstEditorData: VedtaksbrevEditorResponse | undefined) =>
  fritekstEditorData?.redigert?.find(r => r.type === 'REDIGERBAR')?.innhold;

const getOriginalHtml = (fritekstEditorData: VedtaksbrevEditorResponse | undefined) =>
  fritekstEditorData?.original?.find(r => r.type === 'REDIGERBAR')?.innhold;

interface FriktekstBrevpanelProps {
  readOnly: boolean;
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
  behandlingId: number;
  api: UngVedtakBackendApiType;
}

export const FritekstBrevpanel = ({
  readOnly,
  lagreVedtaksbrev,
  handleForhåndsvis,
  fieldIndex,
  vedtaksbrevValg,
  forhåndsvisningIsLoading,
  behandlingId,
  api,
}: FriktekstBrevpanelProps) => {
  const [visRedigering, setVisRedigering] = useState(false);
  const firstRender = useRef<boolean>(true);
  const [redigerbartInnholdKlart, setRedigerbartInnholdKlart] = useState<boolean>(false);
  const [redigerbartInnhold, setRedigerbartInnhold] = useState<string>('');
  const [originalHtml, setOriginalHtml] = useState<string>('');
  const formMethods = useFormContext<FormData>();
  const redigertBrevHtml = useWatch({
    control: formMethods.control,
    name: `vedtaksbrevValg.${fieldIndex}.redigertHtml`,
  });

  const { data: fritekstEditorData } = useQuery({
    queryKey: ['fritekstEditorData', behandlingId, vedtaksbrevValg?.dokumentMalType, api],
    queryFn: async () => {
      if (vedtaksbrevValg?.dokumentMalType) {
        const response = await api.formidling_editor(`${behandlingId}`, vedtaksbrevValg.dokumentMalType.kilde);
        return response;
      }
      return {};
    },
    enabled: !!vedtaksbrevValg?.enableRediger,
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
    const originalHtmlStreng = getOriginalHtml(fritekstEditorData);
    if (originalHtmlStreng) {
      setOriginalHtml(originalHtmlStreng);
      formMethods.setValue(`vedtaksbrevValg.${fieldIndex}.originalHtml`, originalHtmlStreng);
    }

    const redigerbartInnholdFraData = getRedigerbartInnhold(fritekstEditorData);

    if (redigerbartInnholdFraData) {
      setRedigerbartInnhold(redigerbartInnholdFraData);
    } else {
      formMethods.setValue(`vedtaksbrevValg.${fieldIndex}.redigertHtml`, originalHtmlStreng ?? '');
      setRedigerbartInnhold(originalHtmlStreng ?? '');
    }

    setRedigerbartInnholdKlart(true);
  }, [fritekstEditorData, formMethods, fieldIndex]);

  const handleLagre = useCallback(
    async (html: string, nullstill?: boolean) => {
      await handleFritekstSubmit(html, nullstill);
    },
    [handleFritekstSubmit],
  );

  useEffect(() => {
    const asyncEffect = async () => {
      if ((firstRender.current || !redigerbartInnholdKlart) && fritekstEditorData) {
        await hentFritekstbrevMal();
        firstRender.current = false;
      }
    };
    void asyncEffect();
  }, [firstRender, redigertBrevHtml, handleLagre, hentFritekstbrevMal, redigerbartInnholdKlart, fritekstEditorData]);

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
              htmlSeksjoner={getSeksjonerData(fritekstEditorData)}
            />
          )}
        </Modal>
      </div>
    </VStack>
  );
};
