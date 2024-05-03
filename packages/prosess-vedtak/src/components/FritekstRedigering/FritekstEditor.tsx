/* eslint-disable react/no-danger, @typescript-eslint/no-this-alias */
import { VerticalSpacer } from '@k9-sak-web/shared-components';
import { Cancel } from '@navikt/ds-icons';
import { Alert, Button, HGrid, Heading, Modal } from '@navikt/ds-react';
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import InkluderKalenderCheckbox from '../InkluderKalenderCheckbox';
import PreviewLink from '../PreviewLink';
import EditorJSWrapper from './EditorJSWrapper';
import FritekstFeilmeldinger from './FritekstFeilmeldinger';
import { validerRedigertHtml } from './RedigeringUtils';

import styles from './RedigerFritekstbrev.module.css';

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
  const [visValideringsFeil, setVisValideringsFeil] = useState<boolean>(false);

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

  const onChange = () => {
    if (!readOnly) {
      debouncedLagre();
    }
  };

  const lastEditor = async () => {
    await editor.init({ holder: 'rediger-brev', onChange });
    await editor.importer(redigerbartInnhold);
    const html = await editor.lagre();
    oppdaterFormFelt(html);
  };

  useEffect(() => {
    if (redigerbartInnholdKlart && !readOnly) {
      lastEditor();
    }
  }, [redigerbartInnholdKlart, readOnly]);

  const handleLagreOgLukk = () => {
    handleLagre();
    lukkEditor();
  };

  const onForhåndsvis = async e => {
    const html = await editor.lagre();
    const validert = await validerRedigertHtml.isValid(html);

    if (validert) {
      setVisValideringsFeil(false);
      handleForhåndsvis(e, html);
    } else {
      setVisValideringsFeil(true);
    }
  };

  const handleTilbakestill = async () => {
    await editor.importer(originalHtml);
    setVisAdvarsel(false);
    handleLagre();
  };

  return (
    <>
      <Modal open={visAdvarsel} onClose={() => setVisAdvarsel(false)} aria-label="Tilbakestill brev">
        <Modal.Header>
          <Heading as="h3" size="medium">
            <FormattedMessage id="RedigeringAvFritekstBrev.BekreftTilbakestillTittel" />
          </Heading>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning" inline>
            <FormattedMessage id="RedigeringAvFritekstBrev.BekreftTilbakestill" />
          </Alert>

          <div className={styles.knapperHoyere}>
            <Button size="small" type="button" variant="tertiary" onClick={() => setVisAdvarsel(false)}>
              <FormattedMessage id="RedigeringAvFritekstBrev.IkkeTilbakestill" />
            </Button>
            <Button size="small" type="button" variant="primary" onClick={handleTilbakestill}>
              <FormattedMessage id="RedigeringAvFritekstBrev.Tilbakestill" />
            </Button>
          </div>
        </Modal.Body>
      </Modal>

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
        <VerticalSpacer thirtyTwoPx />
        {kanInkludereKalender && (
          <div>
            <InkluderKalenderCheckbox
              intl={intl}
              setFieldValue={setFieldValue}
              skalBrukeOverstyrendeFritekstBrev={skalBrukeOverstyrendeFritekstBrev}
              disabled={readOnly}
            />
            <VerticalSpacer sixteenPx />
          </div>
        )}
        <div>
          <div className={styles.knapper}>
            {visValideringsFeil && (
              <>
                <Alert variant="error">
                  {intl.formatMessage({
                    id: 'RedigeringAvFritekstBrev.ManueltBrevIkkeEndretForhåndsvis',
                  })}{' '}
                </Alert>
                <VerticalSpacer sixteenPx />
              </>
            )}
            <PreviewLink previewCallback={onForhåndsvis} size="small" intl={intl} loading={!redigerbartInnholdKlart}>
              <FormattedMessage id="VedtakForm.ForhandvisBrev" />
            </PreviewLink>
          </div>
          <FritekstFeilmeldinger />
        </div>
        <VerticalSpacer thirtyTwoPx />
        <HGrid gap="1" columns={{ xs: '6fr 6fr' }}>
          <div>
            <Button
              type="button"
              variant="primary"
              onClick={handleLagreOgLukk}
              disabled={!redigerbartInnholdKlart || readOnly}
              size="small"
            >
              <FormattedMessage id="RedigeringAvFritekstBrev.Lagre" />
            </Button>
          </div>
          <div className={styles.hoyere}>
            <Button
              variant="tertiary"
              icon={<Cancel aria-hidden />}
              type="button"
              onClick={() => setVisAdvarsel(true)}
              disabled={readOnly}
              size="small"
            >
              <FormattedMessage id="RedigeringAvFritekstBrev.Tilbakestill" />
            </Button>
          </div>
        </HGrid>
      </footer>
    </>
  );
};

export default injectIntl(FritekstEditor);
