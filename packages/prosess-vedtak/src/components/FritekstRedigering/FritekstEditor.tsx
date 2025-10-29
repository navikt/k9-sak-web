/* eslint-disable react/no-danger, @typescript-eslint/no-this-alias */
import { VerticalSpacer, ÅpneSakINyttVinduKnapp } from '@fpsak-frontend/shared-components';
import { Cancel } from '@navikt/ds-icons';
import { Alert, Button, HGrid, Heading, Modal } from '@navikt/ds-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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

const FritekstEditor = ({
  handleSubmit,
  lukkEditor,
  handleForhåndsvis,
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
  const editorRef = useRef<EditorJSWrapper | null>(null);
  const lastSubmitHtml = useRef(redigerbartInnhold);
  const initImportNotDone = useRef(true);

  // useCallback to avoid recreation of this on every re-render of component
  const handleLagre = useCallback(async () => {
    const editor = editorRef.current;
    if (editor !== null) {
      await editor.erKlar();
      const html = await editor.lagre();
      if (html !== lastSubmitHtml.current) {
        handleSubmit(html);
        lastSubmitHtml.current = html;
      }
    }
  }, [handleSubmit]);

  // useCallback to avoid recreation of this on every re-render of component
  const debouncedLagre = useCallback(debounce(handleLagre), [handleLagre]);

  // useCallback to avoid recreation of this on every re-render of component, since that would require recreating the editor on every re-render.
  const onChange = useCallback(() => {
    if (!readOnly) {
      debouncedLagre();
    }
  }, [readOnly, debouncedLagre]);

  // Create new instance of editor (wrapper) when neccessary
  useEffect(() => {
    if (!editorRef.current) editorRef.current = new EditorJSWrapper({ holder: 'rediger-brev', onChange });
  }, [onChange]);

  // Last innhold inn i editor ved første initialisering, eller viss redigerbartInnhold har blir endra utanfrå.
  useEffect(() => {
    const lastEditor = async (editor: EditorJSWrapper) => {
      if (initImportNotDone.current || lastSubmitHtml.current !== redigerbartInnhold) {
        await editor.importer(redigerbartInnhold);
        initImportNotDone.current = false;
      }
    };
    const editor = editorRef.current;
    if (editor !== null) {
      if (redigerbartInnholdKlart && !readOnly) {
        void lastEditor(editor);
      }
    } else {
      throw new Error(`Unexpectedly no editor instance available`);
    }
  }, [redigerbartInnhold, redigerbartInnholdKlart, readOnly]);

  const handleLagreOgLukk = async () => {
    await handleLagre();
    lukkEditor();
  };

  const onForhåndsvis = async e => {
    const editor = editorRef.current;
    if (editor !== null) {
      const html = await editor.lagre();
      const validert = await validerRedigertHtml.isValid(html);

      if (validert) {
        setVisValideringsFeil(false);
        handleForhåndsvis(e, html);
      } else {
        setVisValideringsFeil(true);
      }
    } else {
      throw new Error(`Fritekstredigering ikke initialisert. Kan ikke lage forhåndsvisning.`);
    }
  };

  const handleTilbakestill = async () => {
    const editor = editorRef.current;
    if (editor !== null) {
      await editor.importer(originalHtml);
      setVisAdvarsel(false);
      await handleLagre();
    } else {
      console.warn('Fritekstredigering ikke initialisert. Kan ikke tilbakestille.');
    }
  };

  return (
    <>
      {visAdvarsel ? (
        <Modal.Header>
          <Heading as="h3" size="medium">
            Tilbakestill brev
          </Heading>
        </Modal.Header>
      ) : (
        <Modal.Header>
          <Heading level="3" size="small">
            Rediger brev
          </Heading>
          <VerticalSpacer sixteenPx />
          <Alert variant="info" size="small">
            Gjør nødvendige endringer i brevet nedenfor. Redigering er begrenset til området markert i oransje. Vil du se saken samtidig som du redigerer kan du åpne en kopi av saken i ny fane:
            <ÅpneSakINyttVinduKnapp />
          </Alert>
          <FritekstFeilmeldinger />
        </Modal.Header>
      )}
      <Modal.Body>
        <div className={styles.modalInnehold}>
          {visAdvarsel && (
            <>
              <Alert variant="warning" inline>
                Alle endringer gjort i brevet vil nå bli slettet. Er du sikker på at du vil tilbakestille brevet?
              </Alert>

              <div className={styles.knapperHoyere}>
                <Button size="small" type="button" variant="tertiary" onClick={() => setVisAdvarsel(false)}>
                  Avbryt
                </Button>
                <Button size="small" type="button" variant="primary" onClick={handleTilbakestill}>
                  Tilbakestill
                </Button>
              </div>
            </>
          )}

          <div className={visAdvarsel ? styles.skjulEditor : ''}>
            <div className={styles.papir}>
              {redigerbartInnholdKlart && (
                <div className={styles.nullstillCss}>
                  <div className="brev-wrapper">
                    <style>{` ${brevStiler} `}</style>
                    <div
                      className={styles.ikkeRedigerbartInnhold}
                      dangerouslySetInnerHTML={{ __html: prefiksInnhold }}
                    />
                    <div id="content">
                      <div id="rediger-brev" className={styles.redigerbartInnhold} style={{ width: '100%' }} />
                    </div>
                    <div
                      className={styles.ikkeRedigerbartInnhold}
                      dangerouslySetInnerHTML={{ __html: suffiksInnhold }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <footer className={visAdvarsel ? styles.skjulEditor : ''}>
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
                <PreviewLink
                  previewCallback={onForhåndsvis}
                  size="small"
                  intl={intl}
                  loading={!redigerbartInnholdKlart}
                >
                  Forhåndsvis brev
                </PreviewLink>
              </div>
              <FritekstFeilmeldinger />
            </div>
            <VerticalSpacer thirtyTwoPx />
            <HGrid gap="space-4" columns={{ xs: '6fr 6fr' }}>
              <div>
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleLagreOgLukk}
                  disabled={!redigerbartInnholdKlart || readOnly}
                  size="small"
                >
                  Lagre og lukk
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
                  Tilbakestill
                </Button>
              </div>
            </HGrid>
          </footer>
        </div>
      </Modal.Body>
    </>
  );
};

export default injectIntl(FritekstEditor);
