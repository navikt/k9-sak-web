/* eslint-disable react/no-danger, @typescript-eslint/no-this-alias */
import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Button, Alert } from '@navikt/ds-react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';

import { Cancel } from '@navikt/ds-icons';
import EditorJSWrapper from './EditorJSWrapper';
import PreviewLink from '../PreviewLink';
import InkluderKalenderCheckbox from '../InkluderKalenderCheckbox';

import styles from './RedigerFritekstbrev.less';

interface ownProps {
  handleSubmit: (value: string) => void;
  lukkEditor: () => void;
  handleForhåndsvis: (event: React.SyntheticEvent, html: string) => void;
  oppdaterFormFelt: (html: string) => void;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  kanInkludereKalender: boolean;
  skalBrukeOverstyrendeFritekstBrev: boolean;
  readOnly: boolean;
  redigerbartInnholdKlart: boolean;
  redigerbartInnhold: string;
  originalHtml: string;
  prefiksInnhold: string;
  suffiksInnhold: string;
  brevStiler: string;
}

const editor = new EditorJSWrapper();

const FritekstEditor = ({
  handleSubmit,
  lukkEditor,
  handleForhåndsvis,
  oppdaterFormFelt,
  setFieldValue,
  kanInkludereKalender,
  skalBrukeOverstyrendeFritekstBrev,
  readOnly,
  redigerbartInnholdKlart,
  redigerbartInnhold,
  originalHtml,
  prefiksInnhold,
  suffiksInnhold,
  brevStiler,
  intl,
}: ownProps & WrappedComponentProps) => {
  const [visAdvarsel, setVisAdvarsel] = useState<boolean>(false);

  const handleLagre = async () => {
    const html = await editor.lagre();
    handleSubmit(html);
  };

  const debounce = funksjon => {
    let teller;
    return function lagre(...args) {
      const context = this;
      if (teller) clearTimeout(teller);
      teller = setTimeout(() => {
        teller = null;
        funksjon.apply(context, args);
      }, 1000);
    };
  };

  const debouncedLagre = useCallback(debounce(handleLagre), []);

  const onChange = () => debouncedLagre();

  const lastEditor = async () => {
    await editor.init({ holder: 'rediger-brev', onChange });
    await editor.importer(redigerbartInnhold);
    const html = await editor.lagre();
    oppdaterFormFelt(html);
  };

  useEffect(() => {
    Modal.setAppElement(document.body);
    lastEditor();
  }, []);

  useEffect(() => {
    if (redigerbartInnholdKlart && !editor.harEditor()) {
      lastEditor();
    }
  }, [redigerbartInnholdKlart]);

  const handleLagreOgLukk = () => {
    handleLagre();
    lukkEditor();
  };

  const onForhåndsvis = async e => {
    const html = await editor.lagre();
    handleForhåndsvis(e, html);
  };

  const handleTilbakestill = async () => {
    await editor.importer(originalHtml);
    setVisAdvarsel(false);
    handleLagre();
  };

  const handleSetFieldValue = (name, value) => {
    setFieldValue(name, value);
    handleLagre();
  };

  return (
    <>
      <Modal open={visAdvarsel} onClose={() => setVisAdvarsel(false)} shouldCloseOnOverlayClick={false}>
        <div className={styles.modalInnehold}>
          <header>
            <h3>
              <FormattedMessage id="RedigeringAvFritekstBrev.BekreftTilbakestillTittel" />
            </h3>
          </header>
          <Alert variant="warning">
            <FormattedMessage id="RedigeringAvFritekstBrev.BekreftTilbakestill" />
          </Alert>
          <div className={styles.knapper}>
            <Button type="button" variant="danger" onClick={handleTilbakestill}>
              <FormattedMessage id="RedigeringAvFritekstBrev.Tilbakestill" />
            </Button>
            <Button type="button" variant="tertiary" onClick={() => setVisAdvarsel(false)}>
              <FormattedMessage id="RedigeringAvFritekstBrev.IkkeTilbakestill" />
            </Button>
          </div>
        </div>
      </Modal>
      <header className={styles.modalHeader}>
        <h3>
          <FormattedMessage id="RedigeringAvFritekstBrev.Rediger" />
        </h3>
        <Alert variant="info">
          <FormattedMessage id="RedigeringAvFritekstBrev.Infotekst" />
        </Alert>
      </header>
      <div className={styles.papirWrapper}>
        <div className={styles.papir}>
          {redigerbartInnholdKlart && (
            <div className={styles.nullstillCss}>
              <div className="brev-wrapper">
                <style>{` ${brevStiler} `}</style>
                <div className={styles.ikkeRedigerbartInnhold} dangerouslySetInnerHTML={{ __html: prefiksInnhold }} />
                <div id="content">
                  <div id="rediger-brev" className={styles.redigerbartInnhold} style={{ width: '100%' }} />
                </div>
                <div className={styles.ikkeRedigerbartInnhold} dangerouslySetInnerHTML={{ __html: suffiksInnhold }} />
              </div>
            </div>
          )}
        </div>
      </div>
      <footer>
        {kanInkludereKalender && (
          <Row>
            <Column xs="12">
              <InkluderKalenderCheckbox
                intl={intl}
                setFieldValue={handleSetFieldValue}
                skalBrukeOverstyrendeFritekstBrev={skalBrukeOverstyrendeFritekstBrev}
                disabled={readOnly}
              />
            </Column>
          </Row>
        )}
        <div className={styles.knapper}>
          <PreviewLink previewCallback={onForhåndsvis}>
            <FormattedMessage id="VedtakForm.ForhandvisBrev" />
          </PreviewLink>
        </div>
        <div className={styles.knapper}>
          <Button variant="primary" onClick={handleLagreOgLukk} disabled={!redigerbartInnholdKlart || readOnly}>
            <FormattedMessage id="RedigeringAvFritekstBrev.Lagre" />
          </Button>
          <Button
            variant="tertiary"
            icon={<Cancel aria-hidden />}
            type="button"
            onClick={() => setVisAdvarsel(true)}
            disabled={readOnly}
            size="medium"
          >
            <FormattedMessage id="RedigeringAvFritekstBrev.Tilbakestill" />
          </Button>
        </div>
      </footer>
    </>
  );
};

export default injectIntl(FritekstEditor);
