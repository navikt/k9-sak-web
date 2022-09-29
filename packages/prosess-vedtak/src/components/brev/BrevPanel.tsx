import SelectFieldFormik from '@fpsak-frontend/form/src/SelectFieldFormik';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import vedtaksbrevtype from '@fpsak-frontend/kodeverk/src/vedtaksbrevtype';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { required, safeJSONParse, decodeHtmlEntity } from '@fpsak-frontend/utils';
import {
  finnesTilgjengeligeVedtaksbrev,
  kanHaAutomatiskVedtaksbrev,
  kanHaFritekstbrev,
  kanKunVelge,
  kanOverstyreMottakere,
  lagVisningsnavnForMottaker,
  TilgjengeligeVedtaksbrev,
} from '@fpsak-frontend/utils/src/formidlingUtils';
import { DokumentDataType } from '@k9-sak-web/types/src/dokumentdata';
import { ArbeidsgiverOpplysningerPerId, Behandlingsresultat, Kodeverk, Personopplysninger } from '@k9-sak-web/types';
import { Alert } from '@navikt/ds-react';
import { FormikProps } from 'formik';
import { Column, Row } from 'nav-frontend-grid';
import React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import { fieldnames } from '../../konstanter';
import FritekstBrevPanel from '../FritekstBrevPanel';
import { VedtakPreviewLink } from '../PreviewLink';
import styles from './BrevPanel.less';
import InformasjonsbehovAutomatiskVedtaksbrev, {
  InformasjonsbehovVedtaksbrev,
} from './InformasjonsbehovAutomatiskVedtaksbrev';

const kanResultatForhåndsvises = behandlingResultat => {
  if (!behandlingResultat) {
    return true;
  }
  const { type } = behandlingResultat;
  if (!type) {
    return true;
  }
  return type.kode !== 'ENDRING_I_FORDELING_AV_YTELSEN' && type.kode !== 'INGEN_ENDRING';
};

const getManuellBrevCallback =
  ({
    brødtekst,
    overskrift,
    overstyrtMottaker,
    formProps,
    previewCallback,
    tilgjengeligeVedtaksbrev,
  }: {
    brødtekst: string;
    overskrift: string;
    overstyrtMottaker: boolean;
    formProps: FormikProps<any>;
    previewCallback: (dokument: any) => void;
    tilgjengeligeVedtaksbrev: TilgjengeligeVedtaksbrev;
  }) =>
  e => {
    if (formProps.isValid) {
      if (formProps.values[fieldnames.REDIGERT_HTML].length > 0) {
        previewCallback({
          dokumentdata: {
            REDIGERTBREV: {
              redigertMal: formProps.values[fieldnames.REDIGERT_MAL],
              originalHtml: formProps.values[fieldnames.ORIGINAL_HTML],
              redigertHtml: decodeHtmlEntity(formProps.values[fieldnames.REDIGERT_HTML]),
              inkluderKalender: formProps.values[fieldnames.INKLUDER_KALENDER_VED_OVERSTYRING] || false,
            },
          },
          dokumentMal: tilgjengeligeVedtaksbrev?.vedtaksbrevmaler?.[vedtaksbrevtype.MANUELL] ?? dokumentMalType.MANUELL,
          ...(overstyrtMottaker ? { overstyrtMottaker: safeJSONParse(overstyrtMottaker) } : {}),
        });
      } else {
        previewCallback({
          dokumentdata: {
            fritekstbrev: {
              brødtekst: brødtekst || ' ',
              overskrift: overskrift || ' ',
              inkluderKalender: formProps.values[fieldnames.INKLUDER_KALENDER_VED_OVERSTYRING] || false,
            },
          },
          // Bruker FRITKS som fallback til lenken ikke vises for avsluttede behandlinger
          dokumentMal: tilgjengeligeVedtaksbrev?.vedtaksbrevmaler?.[vedtaksbrevtype.FRITEKST] ?? dokumentMalType.FRITKS,
          ...(overstyrtMottaker ? { overstyrtMottaker: safeJSONParse(overstyrtMottaker) } : {}),
        });
      }
    } else {
      formProps.submitForm();
    }
    e.preventDefault();
  };

const automatiskVedtaksbrevParams = ({
  fritekst,
  redusertUtbetalingÅrsaker,
  overstyrtMottaker,
  tilgjengeligeVedtaksbrev,
  informasjonsbehovValues = [],
}) => ({
  dokumentdata: {
    fritekst: fritekst || ' ',
    redusertUtbetalingÅrsaker,
    ...Object.assign({}, ...informasjonsbehovValues),
  },

  // Bruker UTLED som fallback til lenken ikke vises for avsluttede behandlinger
  dokumentMal: tilgjengeligeVedtaksbrev?.vedtaksbrevmaler?.[vedtaksbrevtype.AUTOMATISK] ?? dokumentMalType.UTLED,
  ...(overstyrtMottaker ? { overstyrtMottaker: safeJSONParse(overstyrtMottaker) } : {}),
});

const getPreviewAutomatiskBrevCallbackUtenValidering =
  ({ fritekst, redusertUtbetalingÅrsaker, overstyrtMottaker, previewCallback, tilgjengeligeVedtaksbrev }) =>
  e => {
    previewCallback(
      automatiskVedtaksbrevParams({ fritekst, redusertUtbetalingÅrsaker, overstyrtMottaker, tilgjengeligeVedtaksbrev }),
    );
    e.preventDefault();
  };

const getPreviewAutomatiskBrevCallback =
  ({
    fritekst,
    redusertUtbetalingÅrsaker,
    overstyrtMottaker,
    formProps,
    previewCallback,
    tilgjengeligeVedtaksbrev,
    informasjonsbehovValues,
  }) =>
  e => {
    e.preventDefault();
    if (formProps.isValid) {
      previewCallback(
        automatiskVedtaksbrevParams({
          fritekst,
          redusertUtbetalingÅrsaker,
          overstyrtMottaker,
          tilgjengeligeVedtaksbrev,
          informasjonsbehovValues,
        }),
      );
    }
  };

const getHentHtmlMalCallback =
  ({ hentFritekstbrevHtmlCallback }) =>
  async request => {
    const response = await hentFritekstbrevHtmlCallback(request);
    return response;
  };

interface BrevPanelProps {
  intl: IntlShape;
  readOnly: boolean;
  sprakkode: Kodeverk;
  personopplysninger: Personopplysninger;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  tilgjengeligeVedtaksbrev: TilgjengeligeVedtaksbrev;
  informasjonsbehovVedtaksbrev: InformasjonsbehovVedtaksbrev;
  informasjonsbehovValues: any[];
  skalBrukeOverstyrendeFritekstBrev: boolean;
  begrunnelse: string;
  previewCallback: (event: React.SyntheticEvent<Element, Event>) => void;
  hentFritekstbrevHtmlCallback: (parameters: any) => any;
  redusertUtbetalingÅrsaker: string[];
  brødtekst: string;
  overskrift: string;
  behandlingResultat: Behandlingsresultat;
  overstyrtMottaker: boolean;
  formikProps: FormikProps<any>;
  ytelseTypeKode: string;
  dokumentdata: DokumentDataType;
  lagreDokumentdata: (any) => void;
}

export const BrevPanel: React.FC<BrevPanelProps> = props => {
  const {
    intl,
    readOnly,
    sprakkode,
    personopplysninger,
    arbeidsgiverOpplysningerPerId,
    tilgjengeligeVedtaksbrev,
    informasjonsbehovVedtaksbrev,
    informasjonsbehovValues,
    skalBrukeOverstyrendeFritekstBrev,
    begrunnelse,
    previewCallback,
    hentFritekstbrevHtmlCallback,
    redusertUtbetalingÅrsaker,
    brødtekst,
    overskrift,
    behandlingResultat,
    overstyrtMottaker,
    formikProps,
    dokumentdata,
    lagreDokumentdata,
  } = props;

  const automatiskBrevCallback = getPreviewAutomatiskBrevCallback({
    fritekst: begrunnelse,
    redusertUtbetalingÅrsaker,
    overstyrtMottaker,
    formProps: formikProps,
    previewCallback,
    tilgjengeligeVedtaksbrev,
    informasjonsbehovValues,
  });

  const automatiskBrevUtenValideringCallback = getPreviewAutomatiskBrevCallbackUtenValidering({
    fritekst: begrunnelse,
    redusertUtbetalingÅrsaker,
    overstyrtMottaker,
    previewCallback,
    tilgjengeligeVedtaksbrev,
  });

  const hentHtmlMalCallback = getHentHtmlMalCallback({
    hentFritekstbrevHtmlCallback,
  });

  const manuellBrevCallback = getManuellBrevCallback({
    brødtekst,
    overskrift,
    overstyrtMottaker,
    formProps: formikProps,
    previewCallback,
    tilgjengeligeVedtaksbrev,
  });

  const harAutomatiskVedtaksbrev = kanHaAutomatiskVedtaksbrev(tilgjengeligeVedtaksbrev);
  const harFritekstbrev = kanHaFritekstbrev(tilgjengeligeVedtaksbrev);

  const harAlternativeMottakere =
    kanOverstyreMottakere(tilgjengeligeVedtaksbrev) && !formikProps.values[fieldnames.SKAL_HINDRE_UTSENDING_AV_BREV];

  const fritekstbrev = harFritekstbrev && (
    <>
      <div className={styles.brevContainer}>
        <FritekstBrevPanel
          readOnly={readOnly || formikProps.values[fieldnames.SKAL_HINDRE_UTSENDING_AV_BREV]}
          previewBrev={manuellBrevCallback}
          hentFritekstbrevHtmlCallback={hentHtmlMalCallback}
          harAutomatiskVedtaksbrev={harAutomatiskVedtaksbrev}
          tilgjengeligeVedtaksbrev={tilgjengeligeVedtaksbrev}
          formikProps={formikProps}
          dokumentdata={dokumentdata}
          lagreDokumentdata={lagreDokumentdata}
        />
      </div>
      <VedtakPreviewLink previewCallback={manuellBrevCallback} />
    </>
  );

  const automatiskbrev = harAutomatiskVedtaksbrev && (
    <>
      <div className={styles.brevContainer}>
        <InformasjonsbehovAutomatiskVedtaksbrev
          intl={intl}
          readOnly={readOnly || formikProps.values[fieldnames.SKAL_HINDRE_UTSENDING_AV_BREV]}
          sprakkode={sprakkode}
          begrunnelse={begrunnelse}
          informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
        />
      </div>
      {kanResultatForhåndsvises(behandlingResultat) && <VedtakPreviewLink previewCallback={automatiskBrevCallback} />}
    </>
  );

  const brevpanel =
    skalBrukeOverstyrendeFritekstBrev || kanKunVelge(tilgjengeligeVedtaksbrev, vedtaksbrevtype.FRITEKST)
      ? fritekstbrev
      : automatiskbrev;
  return (
    <div data-testid="brevpanel">
      {harAlternativeMottakere && (
        <Row>
          <Column xs="12">
            <SelectFieldFormik
              readOnly={readOnly}
              name="overstyrtMottaker"
              selectValues={tilgjengeligeVedtaksbrev.alternativeMottakere.map(mottaker => (
                <option value={JSON.stringify(mottaker)} key={mottaker.id}>
                  {lagVisningsnavnForMottaker(mottaker.id, personopplysninger, arbeidsgiverOpplysningerPerId)}
                </option>
              ))}
              className={readOnly ? styles.selectReadOnly : null}
              label={intl.formatMessage({ id: 'VedtakForm.Fritekst.OverstyrtMottaker' })}
              validate={[required]}
              bredde="xl"
            />
            <VerticalSpacer sixteenPx />
          </Column>
        </Row>
      )}
      {finnesTilgjengeligeVedtaksbrev(tilgjengeligeVedtaksbrev) ? (
        brevpanel
      ) : (
        <Alert variant="info" size="medium" className={styles.infoIkkeVedtaksbrev}>
          {intl.formatMessage({ id: 'VedtakForm.IkkeVedtaksbrev' })}
        </Alert>
      )}
    </div>
  );
};

export default injectIntl(BrevPanel);
