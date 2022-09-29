/* eslint-disable react/no-danger */
import React, { useEffect } from 'react';
import { Modal, Button, Alert } from '@navikt/ds-react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';

import EditorJSWrapper from './EditorJSWrapper';

import styles from './RedigerFritekstbrev.less';

interface ownProps {
  handleSubmit: (value: string) => void;
  lukkEditor: () => void;
  readOnly: boolean;
  redigerbartInnholdKlart: boolean;
  redigerbartInnhold: string;
  prefiksInnhold: string;
  suffiksInnhold: string;
  brevStiler: string;
}

const FritekstEditor = ({
  handleSubmit,
  lukkEditor,
  readOnly,
  redigerbartInnholdKlart,
  redigerbartInnhold,
  prefiksInnhold,
  suffiksInnhold,
  brevStiler,
}: ownProps & WrappedComponentProps) => {
  useEffect(() => {
    Modal.setAppElement(document.body);
  }, []);
  const editor = new EditorJSWrapper();

  const lastEditor = async () => {
    await editor.init({ holder: 'rediger-brev' });
    await editor.importer(redigerbartInnhold);
  };

  useEffect(() => {
    if (redigerbartInnholdKlart && !editor.harEditor()) {
      lastEditor();
    }
  }, [redigerbartInnholdKlart]);

  const handleLagre = async () => {
    const html = await editor.lagre();
    handleSubmit(html);
  };

  return (
    <>
      <header className={styles.modalHeader}>
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
        <div className={styles.knapper}>
          <Button variant="tertiary" onClick={lukkEditor}>
            <FormattedMessage id="RedigeringAvFritekstBrev.Avbryt" />
          </Button>
          <Button variant="primary" onClick={handleLagre} disabled={!redigerbartInnholdKlart || readOnly}>
            <FormattedMessage id="RedigeringAvFritekstBrev.Lagre" />
          </Button>
        </div>
      </footer>
    </>
  );
};

export default injectIntl(FritekstEditor);
