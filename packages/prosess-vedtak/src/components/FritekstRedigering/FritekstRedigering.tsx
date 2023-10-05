import React, { useEffect, useRef, useState } from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';

import { Modal, Button } from '@navikt/ds-react';
import { Edit } from '@navikt/ds-icons';

import {
  Brevmottaker,
  TilgjengeligeVedtaksbrev,
  TilgjengeligeVedtaksbrevMedMaler,
  VedtaksbrevMal,
} from '@fpsak-frontend/utils/src/formidlingUtils';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import { DokumentDataType } from '@k9-sak-web/types/src/dokumentdata';
import { safeJSONParse } from '@fpsak-frontend/utils';
import {
  lagLagreHtmlDokumentdataRequest,
  seksjonSomKanRedigeres,
  utledPrefiksInnhold,
  utledRedigerbartInnhold,
  utledSkalInkludereKalender,
  utledStiler,
  utledSuffiksInnhold,
} from './RedigeringUtils';

import styles from './RedigerFritekstbrev.less';

import FritekstEditor from './FritekstEditor';
import { fieldnames } from '../../konstanter';

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
}: ownProps & WrappedComponentProps) => {
  useEffect(() => {
    Modal.setAppElement(document.body);
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
      <Modal open={visRedigering} onClose={() => setVisRedigering(false)} shouldCloseOnOverlayClick={false}>
        <div className={styles.modalInnehold}>
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
            suffiksInnhold={suffiksInnhold}
            prefiksInnhold={prefiksInnhold}
          />
        </div>
      </Modal>
    </>
  );
};

export default injectIntl(FritekstRedigering);
