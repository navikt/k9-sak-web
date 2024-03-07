import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import { VerticalSpacer, ÅpneSakINyttVinduKnapp } from '@fpsak-frontend/shared-components';
import { safeJSONParse } from '@fpsak-frontend/utils';
import {
  Brevmottaker,
  TilgjengeligeVedtaksbrev,
  TilgjengeligeVedtaksbrevMedMaler,
  VedtaksbrevMal,
} from '@fpsak-frontend/utils/src/formidlingUtils';
import { DokumentDataType } from '@k9-sak-web/types/src/dokumentdata';
import { Edit } from '@navikt/ds-icons';
import { Alert, Button, Heading, Modal } from '@navikt/ds-react';
import React, { useEffect, useRef, useState } from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import { fieldnames } from '../../konstanter';
import FritekstEditor from './FritekstEditor';
import FritekstFeilmeldinger from './FritekstFeilmeldinger';
import styles from './RedigerFritekstbrev.module.css';
import {
  lagLagreHtmlDokumentdataRequest,
  seksjonSomKanRedigeres,
  utledPrefiksInnhold,
  utledRedigerbartInnhold,
  utledSkalInkludereKalender,
  utledStiler,
  utledSuffiksInnhold,
} from './RedigeringUtils';

interface ownProps {
  handleSubmit: (html: string, request: any) => void;
  hentFritekstbrevHtmlCallback: (parameters: any) => string;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  previewBrev: (event: React.SyntheticEvent, html?: string) => void;
  skalBrukeOverstyrendeFritekstBrev: boolean;
  tilgjengeligeVedtaksbrev: TilgjengeligeVedtaksbrev & TilgjengeligeVedtaksbrevMedMaler;
  readOnly: boolean;
  dokumentdata: DokumentDataType;
  innholdTilRedigering: string;
  inkluderKalender: boolean;
  kanInkludereKalender: boolean;
  dokumentdataInformasjonsbehov: any;
  overstyrtMottaker?: Brevmottaker;
  setForhaandsvisningKlart: React.Dispatch<React.SetStateAction<boolean>>;
}

const FritekstRedigering = ({
  handleSubmit,
  hentFritekstbrevHtmlCallback,
  setFieldValue,
  previewBrev,
  skalBrukeOverstyrendeFritekstBrev,
  tilgjengeligeVedtaksbrev,
  readOnly,
  dokumentdata,
  innholdTilRedigering,
  inkluderKalender,
  kanInkludereKalender,
  dokumentdataInformasjonsbehov,
  overstyrtMottaker,
  setForhaandsvisningKlart,
}: ownProps & WrappedComponentProps) => {
  useEffect(() => {
    setForhaandsvisningKlart(false);
  }, []);
  const redigerbarDokumentmal: VedtaksbrevMal = tilgjengeligeVedtaksbrev.maler.find(
    vb => vb.dokumentMalType === dokumentMalType.MANUELL,
  );
  const firstRender = useRef<boolean>(true);
  const [henterMal, setHenterMal] = useState<boolean>(false);
  const [visRedigering, setVisRedigering] = useState<boolean>(false);
  const [redigerbartInnholdKlart, setRedigerbartInnholdKlart] = useState<boolean>(false);
  const [brevStiler, setBrevStiler] = useState<string>('');
  const [prefiksInnhold, setPrefiksInnhold] = useState<string>('');
  const [suffiksInnhold, setSuffiksInnhold] = useState<string>('');
  const [redigerbartInnhold, setRedigerbartInnhold] = useState<string>('');
  const [originalHtml, setOriginalHtml] = useState<string>('');

  const hentFritekstbrevMal = async () => {
    setHenterMal(true);
    const request: { dokumentMal: string; dokumentdata?: any[]; overstyrtMottaker?: Brevmottaker } = {
      dokumentMal: redigerbarDokumentmal.redigerbarMalType,
    };

    if (dokumentdataInformasjonsbehov) {
      request.dokumentdata = dokumentdataInformasjonsbehov;
    }

    if (overstyrtMottaker) {
      request.overstyrtMottaker = safeJSONParse(overstyrtMottaker);
    }

    const responseHtml = await hentFritekstbrevHtmlCallback(request);
    setFieldValue(fieldnames.REDIGERT_MAL, redigerbarDokumentmal.redigerbarMalType);

    setBrevStiler(utledStiler(responseHtml));
    const seksjonerSomKanRedigeres = seksjonSomKanRedigeres(responseHtml);
    setPrefiksInnhold(utledPrefiksInnhold(seksjonerSomKanRedigeres));
    setSuffiksInnhold(utledSuffiksInnhold(seksjonerSomKanRedigeres));

    const originalHtmlStreng = utledRedigerbartInnhold(responseHtml);
    setOriginalHtml(originalHtmlStreng);
    setFieldValue(fieldnames.ORIGINAL_HTML, originalHtmlStreng);

    if (!dokumentdata?.REDIGERTBREV) {
      const skalInkludereKalender = utledSkalInkludereKalender(responseHtml);
      setFieldValue(fieldnames.INKLUDER_KALENDER_VED_OVERSTYRING, skalInkludereKalender);
    }

    if (innholdTilRedigering) setRedigerbartInnhold(innholdTilRedigering);
    else {
      setFieldValue(fieldnames.REDIGERT_HTML, originalHtmlStreng);
      setRedigerbartInnhold(originalHtmlStreng);
    }

    await setRedigerbartInnholdKlart(true);
    setForhaandsvisningKlart(true);
    setHenterMal(false);
  };

  const lukkEditor = () => setVisRedigering(false);

  const handleLagre = async html => {
    handleSubmit(
      html,
      lagLagreHtmlDokumentdataRequest({
        dokumentdata,
        redigerbarDokumentmal,
        redigertHtml: html,
        originalHtml,
        inkluderKalender,
        overstyrtMottaker,
      }),
    );
  };

  useEffect(() => {
    if (!firstRender.current && overstyrtMottaker && !henterMal) {
      hentFritekstbrevMal();
    }
  }, [firstRender, overstyrtMottaker]);

  useEffect(() => {
    if (!firstRender.current && redigerbartInnholdKlart) {
      handleLagre(innholdTilRedigering);
    } else {
      hentFritekstbrevMal();
      firstRender.current = false;
    }
  }, [firstRender, inkluderKalender]);

  useEffect(() => {
    if (innholdTilRedigering) setRedigerbartInnhold(innholdTilRedigering);
  }, [innholdTilRedigering]);

  const handleForhåndsvis = (e: React.SyntheticEvent, html: string) => previewBrev(e, html);

  const oppdaterFormFelt = (html: string) => setFieldValue(fieldnames.REDIGERT_HTML, html);

  return (
    <>
      <h3>
        <FormattedMessage id="RedigeringAvFritekstBrev.RedigerBrevTittel" />
      </h3>
      <Button
        variant="secondary"
        type="button"
        onClick={() => setVisRedigering(true)}
        disabled={readOnly || !redigerbartInnholdKlart}
        loading={!redigerbartInnholdKlart}
        icon={<Edit aria-hidden />}
        size="small"
      >
        <FormattedMessage id="RedigeringAvFritekstBrev.Rediger" />
      </Button>
      <Modal open={visRedigering} onClose={() => setVisRedigering(false)} width="53.75rem" aria-label="Rediger brev">
        <Modal.Header>
          <Heading level="3" size="small">
            <FormattedMessage id="RedigeringAvFritekstBrev.Rediger" />
          </Heading>
          <VerticalSpacer sixteenPx />
          <Alert variant="info" size="small">
            <FormattedMessage id="RedigeringAvFritekstBrev.Infotekst" />
            <ÅpneSakINyttVinduKnapp />
          </Alert>
          <FritekstFeilmeldinger />
        </Modal.Header>
        <Modal.Body>
          <div className={styles.modalInnehold}>
            {visRedigering && (
              <FritekstEditor
                handleSubmit={handleLagre}
                lukkEditor={lukkEditor}
                handleForhåndsvis={handleForhåndsvis}
                oppdaterFormFelt={oppdaterFormFelt}
                setFieldValue={setFieldValue}
                kanInkludereKalender={kanInkludereKalender}
                skalBrukeOverstyrendeFritekstBrev={skalBrukeOverstyrendeFritekstBrev}
                readOnly={readOnly}
                redigerbartInnholdKlart={redigerbartInnholdKlart}
                redigerbartInnhold={redigerbartInnhold}
                originalHtml={originalHtml}
                brevStiler={brevStiler}
                prefiksInnhold={prefiksInnhold}
                suffiksInnhold={suffiksInnhold}
              />
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default injectIntl(FritekstRedigering);
