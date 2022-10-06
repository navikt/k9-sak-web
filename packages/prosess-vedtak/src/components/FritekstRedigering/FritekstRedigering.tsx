import React, { useEffect, useState } from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';

import { Modal, Button } from '@navikt/ds-react';
import { Edit, Cancel } from '@navikt/ds-icons';

import {
  TilgjengeligeVedtaksbrev,
  TilgjengeligeVedtaksbrevMedMaler,
  VedtaksbrevMal,
} from '@fpsak-frontend/utils/src/formidlingUtils';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import { DokumentDataType } from '@k9-sak-web/types/src/dokumentdata';
import {
  lagLagreHtmlDokumentdataRequest,
  utledPrefiksInnhold,
  utledRedigerbartInnhold,
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
  setEditorErTilbakestilt: React.Dispatch<React.SetStateAction<boolean>>;
  tilgjengeligeVedtaksbrev: TilgjengeligeVedtaksbrev & TilgjengeligeVedtaksbrevMedMaler;
  readOnly: boolean;
  dokumentdata: DokumentDataType;
  innholdTilRedigering: string;
  inkluderKalender: boolean;
}

const FritekstRedigering = ({
  handleSubmit,
  hentFritekstbrevHtmlCallback,
  setFieldValue,
  previewBrev,
  tilgjengeligeVedtaksbrev,
  readOnly,
  dokumentdata,
  innholdTilRedigering,
  inkluderKalender,
  setEditorErTilbakestilt,
}: ownProps & WrappedComponentProps) => {
  useEffect(() => {
    Modal.setAppElement(document.body);
  }, []);
  const redigerbarDokumentmal: VedtaksbrevMal = tilgjengeligeVedtaksbrev.maler.find(
    vb => vb.dokumentMalType === dokumentMalType.MANUELL,
  );

  const [visRedigering, setVisRedigering] = useState<boolean>(false);
  const [redigerbartInnholdKlart, setRedigerbartInnholdKlart] = useState<boolean>(false);
  const [brevStiler, setBrevStiler] = useState<string>('');
  const [prefiksInnhold, setPrefiksInnhold] = useState<string>('');
  const [suffiksInnhold, setSuffiksInnhold] = useState<string>('');
  const [redigerbartInnhold, setRedigerbartInnhold] = useState<string>('');
  const [originalHtml, setOriginalHtml] = useState<string>('');

  const hentFritekstbrevMal = async () => {
    const request = { dokumentMal: redigerbarDokumentmal.redigerbarMalType };
    const responseHtml = await hentFritekstbrevHtmlCallback(request);
    setFieldValue(fieldnames.REDIGERT_MAL, redigerbarDokumentmal.redigerbarMalType);

    setBrevStiler(utledStiler(responseHtml));
    setPrefiksInnhold(utledPrefiksInnhold(responseHtml));
    setSuffiksInnhold(utledSuffiksInnhold(responseHtml));

    const originalHtmlStreng = utledRedigerbartInnhold(responseHtml);
    setOriginalHtml(originalHtmlStreng);
    setFieldValue(fieldnames.ORIGINAL_HTML, originalHtmlStreng);

    if (innholdTilRedigering) await setRedigerbartInnhold(innholdTilRedigering);
    else {
      setFieldValue(fieldnames.REDIGERT_HTML, originalHtmlStreng);
      await setRedigerbartInnhold(originalHtmlStreng);
    }

    setRedigerbartInnholdKlart(true);
  };

  useEffect(() => {
    hentFritekstbrevMal();
  }, []);

  useEffect(() => {
    if (innholdTilRedigering) setRedigerbartInnhold(innholdTilRedigering);
  }, [innholdTilRedigering]);

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
      }),
    );
    lukkEditor();
  };

  const handleTilbakestill = () => {
    setRedigerbartInnholdKlart(false);
    setFieldValue(fieldnames.REDIGERT_HTML, originalHtml);
    setRedigerbartInnhold(originalHtml);
    setRedigerbartInnholdKlart(true);
    setEditorErTilbakestilt(true);
  };

  const handleForhåndsvis = (e: React.SyntheticEvent, html: string) => previewBrev(e, html);

  const oppdaterFormFelt = (html: string) => setFieldValue(fieldnames.REDIGERT_HTML, html);

  return (
    <>
      <div className={styles.knapper}>
        <Button
          variant="secondary"
          type="button"
          onClick={() => setVisRedigering(true)}
          disabled={readOnly}
          icon={<Edit aria-hidden />}
          size="small"
        >
          <FormattedMessage id="RedigeringAvFritekstBrev.Rediger" />
        </Button>
        <Button
          variant="tertiary"
          icon={<Cancel aria-hidden />}
          size="small"
          type="button"
          onClick={handleTilbakestill}
          disabled={readOnly}
        >
          Tilbakestill
        </Button>
      </div>
      <Modal open={visRedigering} onClose={() => setVisRedigering(false)} shouldCloseOnOverlayClick={false}>
        <div className={styles.modalInnehold}>
          <FritekstEditor
            handleSubmit={handleLagre}
            lukkEditor={lukkEditor}
            handleForhåndsvis={handleForhåndsvis}
            oppdaterFormFelt={oppdaterFormFelt}
            readOnly={readOnly}
            redigerbartInnholdKlart={redigerbartInnholdKlart}
            redigerbartInnhold={redigerbartInnhold}
            brevStiler={brevStiler}
            prefiksInnhold={prefiksInnhold}
            suffiksInnhold={suffiksInnhold}
          />
        </div>
      </Modal>
    </>
  );
};

export default injectIntl(FritekstRedigering);
