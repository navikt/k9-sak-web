/* eslint-disable react/no-danger, @typescript-eslint/no-this-alias */
import { Cancel } from '@navikt/ds-icons';
import { Alert, Box, Button, HGrid, Heading, Modal } from '@navikt/ds-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import EditorJSWrapper from './EditorJSWrapper';

import {
  ung_sak_kontrakt_formidling_vedtaksbrev_editor_VedtaksbrevSeksjonType as VedtaksbrevSeksjonType,
  type ung_sak_kontrakt_formidling_vedtaksbrev_editor_VedtaksbrevSeksjon,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import { FileSearchIcon } from '@navikt/aksel-icons';
import styles from './RedigerFritekstbrev.module.css';
import { utledStiler, validerRedigertHtml } from './RedigeringUtils';

interface OwnProps {
  handleSubmit: (value: string, nullstill?: boolean) => void;
  lukkEditor: () => void;
  readOnly: boolean;
  redigerbartInnholdKlart: boolean;
  redigerbartInnhold: string;
  originalHtml: string;
  handleForhåndsvis: () => void;
  htmlSeksjoner: ung_sak_kontrakt_formidling_vedtaksbrev_editor_VedtaksbrevSeksjon[];
}

interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void;
}

const debounce = <T extends (...args: any[]) => any>(funksjon: T): DebouncedFunction<T> => {
  let teller: ReturnType<typeof setTimeout> | null = null;
  return function lagre(this: ThisParameterType<T>, ...args: Parameters<T>): void {
    const context: ThisParameterType<T> = this;
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
  readOnly,
  redigerbartInnholdKlart,
  redigerbartInnhold,
  originalHtml,
  htmlSeksjoner,
}: OwnProps) => {
  const [visAdvarsel, setVisAdvarsel] = useState<boolean>(false);
  const [visValideringsFeil, setVisValideringsFeil] = useState<boolean>(false);
  const editorRef = useRef<EditorJSWrapper | null>(null);
  const lastSubmitHtml = useRef(redigerbartInnhold);
  const initImportNotDone = useRef(true);

  // useCallback to avoid recreation of this on every re-render of component
  const handleLagre = useCallback(
    async (nullstill?: boolean) => {
      const editor = editorRef.current;
      if (editor !== null) {
        await editor.erKlar();
        const html = await editor.lagre();
        if (html !== lastSubmitHtml.current) {
          handleSubmit(nullstill ? '' : html, nullstill);
          lastSubmitHtml.current = nullstill ? '' : html;
        }
      }
    },
    [handleSubmit],
  );

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

  // Last innhold inn i editor ved første initialisering, eller viss redigerbartInnhold har blitt endra utanfrå.
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

  const onForhåndsvis = async () => {
    const editor = editorRef.current;
    if (editor !== null) {
      const html = await editor.lagre();
      const validert = await validerRedigertHtml.isValid(html);

      if (validert) {
        setVisValideringsFeil(false);
        handleForhåndsvis();
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
      await handleLagre(true);
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
          <Box marginBlock="space-16 space-0">
            <Alert variant="info" size="small">
              Gjør nødvendige endringer i brevet nedenfor. Redigering er begrenset til området markert i oransje. Vil du
              se saken samtidig som du redigerer kan du åpne en kopi av saken i ny fane:
            </Alert>
          </Box>
        </Modal.Header>
      )}
      <Modal.Body>
        <div>
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
                    {htmlSeksjoner.map((seksjon, index) => {
                      if (seksjon.innhold) {
                        if (seksjon.type === VedtaksbrevSeksjonType.STYLE) {
                          return <style key={index}>{utledStiler(seksjon.innhold)}</style>;
                        }
                        if (seksjon.type === VedtaksbrevSeksjonType.STATISK) {
                          return (
                            <div
                              key={index}
                              className={styles.ikkeRedigerbartInnhold}
                              dangerouslySetInnerHTML={{ __html: seksjon.innhold }}
                            />
                          );
                        }
                        if (seksjon.type === VedtaksbrevSeksjonType.REDIGERBAR) {
                          return (
                            <div id="content" key={index}>
                              <div id="rediger-brev" className={styles.redigerbartInnhold} style={{ width: '100%' }} />
                            </div>
                          );
                        }
                      }
                      return <React.Fragment key={index} />;
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
          <footer className={visAdvarsel ? styles.skjulEditor : ''}>
            <Box marginBlock="space-32 space-0">
              <div>
                <div className={styles.knapper}>
                  {visValideringsFeil && (
                    <Box marginBlock="space-0 space-16">
                      <Alert variant="error">Brevet må redigeres før det kan forhåndsvises</Alert>
                    </Box>
                  )}
                  <Button
                    variant="tertiary"
                    size="small"
                    icon={<FileSearchIcon />}
                    onClick={onForhåndsvis}
                    type="button"
                    loading={!redigerbartInnholdKlart}
                  >
                    Forhåndsvis brev
                  </Button>
                </div>
              </div>
              <Box marginBlock="space-32 space-0">
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
              </Box>
            </Box>
          </footer>
        </div>
      </Modal.Body>
    </>
  );
};

export default FritekstEditor;
