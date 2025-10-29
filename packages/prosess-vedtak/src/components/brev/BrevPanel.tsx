import SelectFieldFormik from '@fpsak-frontend/form/src/SelectFieldFormik';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import vedtaksbrevtype from '@fpsak-frontend/kodeverk/src/vedtaksbrevtype';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { required, safeJSONParse } from '@fpsak-frontend/utils';
import {
  Brevmottaker,
  TilgjengeligeVedtaksbrev,
  finnesTilgjengeligeVedtaksbrev,
  kanHaAutomatiskVedtaksbrev,
  kanHaFritekstbrevV1,
  kanHaManueltFritekstbrev,
  kanKunVelge,
  kanOverstyreMottakere,
  lagVisningsnavnForMottaker,
} from '@fpsak-frontend/utils/src/formidlingUtils';
import { FagsakYtelsesType, fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { DokumentDataType } from '@k9-sak-web/types/src/dokumentdata';
import { Alert, ErrorMessage } from '@navikt/ds-react';

import { ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/gui/utils/formidling.js';
import {
  k9_sak_kontrakt_behandling_BehandlingsresultatDto as BehandlingsresultatDto,
  k9_sak_kontrakt_person_PersonopplysningDto as PersonopplysningDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { FormikValues, setNestedObjectValues, useField } from 'formik';
import React, { useState } from 'react';
import { fieldnames } from '../../konstanter';
import FritekstBrevPanel from '../FritekstBrevPanel';
import { VedtakPreviewLink } from '../PreviewLink';
import styles from './BrevPanel.module.css';
import { CustomFormikProps } from './CustomFormikProps';
import InformasjonsbehovAutomatiskVedtaksbrev, {
  InformasjonsbehovVedtaksbrev,
} from './InformasjonsbehovAutomatiskVedtaksbrev';

const kanResultatForhåndsvises = (behandlingResultat: BehandlingsresultatDto) => {
  if (!behandlingResultat) {
    return true;
  }
  const { type } = behandlingResultat;
  if (!type) {
    return true;
  }
  return type !== 'INGEN_ENDRING';
};

export const manuellBrevPreview = ({
  tilgjengeligeVedtaksbrev,
  previewCallback,
  values,
  redigertHtml,
  overstyrtMottaker,
  brødtekst,
  overskrift,
  aapneINyttVindu,
}: {
  tilgjengeligeVedtaksbrev: TilgjengeligeVedtaksbrev;
  previewCallback: (values, aapneINyttVindu) => Promise<any>;
  values: FormikValues;
  redigertHtml: any;
  overstyrtMottaker: Brevmottaker;
  brødtekst: string;
  overskrift: string;
  aapneINyttVindu: boolean;
}) => {
  if (kanHaManueltFritekstbrev(tilgjengeligeVedtaksbrev)) {
    return previewCallback(
      {
        dokumentdata: {
          REDIGERTBREV: {
            redigertMal: values[fieldnames.REDIGERT_MAL],
            originalHtml: values[fieldnames.ORIGINAL_HTML],
            redigertHtml: redigertHtml || values[fieldnames.REDIGERT_HTML],
            inkluderKalender: values[fieldnames.INKLUDER_KALENDER_VED_OVERSTYRING] || false,
          },
        },
        dokumentMal: tilgjengeligeVedtaksbrev?.vedtaksbrevmaler?.[vedtaksbrevtype.MANUELL] ?? dokumentMalType.MANUELL,
        ...(overstyrtMottaker ? { overstyrtMottaker: safeJSONParse(overstyrtMottaker) } : {}),
      },
      aapneINyttVindu,
    );
  }
  return previewCallback(
    {
      dokumentdata: {
        fritekstbrev: {
          brødtekst: brødtekst || ' ',
          overskrift: overskrift || ' ',
          inkluderKalender: values[fieldnames.INKLUDER_KALENDER_VED_OVERSTYRING] || false,
        },
      },
      // Bruker FRITKS som fallback til lenken ikke vises for avsluttede behandlinger
      dokumentMal: tilgjengeligeVedtaksbrev?.vedtaksbrevmaler?.[vedtaksbrevtype.FRITEKST] ?? dokumentMalType.FRITKS,
      ...(overstyrtMottaker ? { overstyrtMottaker: safeJSONParse(overstyrtMottaker) } : {}),
    },
    aapneINyttVindu,
  );
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
    overstyrtMottaker?: Brevmottaker;
    formProps: CustomFormikProps;
    previewCallback: (values, aapneINyttVindu) => Promise<any>;
    tilgjengeligeVedtaksbrev: TilgjengeligeVedtaksbrev;
  }) =>
  async (e, redigertHtml = undefined) => {
    e.preventDefault();
    const errors = await formProps.validateForm();
    if (Object.keys(errors).length === 0) {
      await manuellBrevPreview({
        tilgjengeligeVedtaksbrev,
        previewCallback,
        values: formProps.values,
        redigertHtml,
        overstyrtMottaker,
        brødtekst,
        overskrift,
        aapneINyttVindu: true,
      });
    } else {
      await formProps.setTouched(setNestedObjectValues(formProps.values, true));
    }
  };

const getHentHtmlMalCallback =
  ({ hentFritekstbrevHtmlCallback }) =>
  async request => {
    const response = await hentFritekstbrevHtmlCallback(request);
    return response;
  };

interface BrevPanelProps {
  aktiverteInformasjonsbehov: InformasjonsbehovVedtaksbrev['informasjonsbehov'];
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  begrunnelse: string;
  behandlingResultat: BehandlingsresultatDto;
  brødtekst: string;
  dokumentdata: DokumentDataType;
  formikProps: CustomFormikProps;
  getPreviewAutomatiskBrevCallback: (any) => (any) => (event: React.SyntheticEvent<Element, Event>) => void;
  hentFritekstbrevHtmlCallback: (parameters: any) => any;
  informasjonsbehovValues: any[];
  informasjonsbehovVedtaksbrev: InformasjonsbehovVedtaksbrev;
  intl: IntlShape;
  lagreDokumentdata: (any) => void;
  overskrift: string;
  overstyrtMottaker?: Brevmottaker;
  personopplysninger: PersonopplysningDto;
  previewCallback: (values, aapneINyttVindu) => Promise<any>;
  readOnly: boolean;
  skalBrukeOverstyrendeFritekstBrev: boolean;
  språkkode: string;
  tilgjengeligeVedtaksbrev: TilgjengeligeVedtaksbrev;
  ytelseTypeKode: FagsakYtelsesType;
}

export const BrevPanel: React.FC<BrevPanelProps> = props => {
  const {
    intl,
    readOnly,
    språkkode,
    personopplysninger,
    arbeidsgiverOpplysningerPerId,
    tilgjengeligeVedtaksbrev,
    informasjonsbehovVedtaksbrev,
    skalBrukeOverstyrendeFritekstBrev,
    ytelseTypeKode,
    begrunnelse,
    previewCallback,
    hentFritekstbrevHtmlCallback,
    brødtekst,
    overskrift,
    behandlingResultat,
    overstyrtMottaker,
    formikProps,
    dokumentdata,
    aktiverteInformasjonsbehov,
    lagreDokumentdata,
    getPreviewAutomatiskBrevCallback,
  } = props;
  const [forhaandsvisningKlart, setForhaandsvisningKlart] = useState(true);
  const [, meta] = useField({ name: 'overstyrtMottaker' });

  const automatiskBrevCallback = getPreviewAutomatiskBrevCallback(formikProps.values)({ aapneINyttVindu: true });

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
  const harFritekstbrev =
    kanHaFritekstbrevV1(tilgjengeligeVedtaksbrev) || kanHaManueltFritekstbrev(tilgjengeligeVedtaksbrev);

  const kanInkludereKalender =
    ytelseTypeKode === fagsakYtelsesType.PLEIEPENGER_SYKT_BARN ||
    ytelseTypeKode === fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE;

  const harAlternativeMottakere =
    kanOverstyreMottakere(tilgjengeligeVedtaksbrev) && !formikProps.values[fieldnames.SKAL_HINDRE_UTSENDING_AV_BREV];

  const dokumentdataInformasjonsbehov =
    aktiverteInformasjonsbehov?.reduce(
      (a, v) => ({
        ...a,
        [v.kode]: formikProps.values[v.kode],
      }),
      {},
    ) || [];

  const fritekstbrev = harFritekstbrev && (
    <>
      <div className={styles.brevContainer}>
        <FritekstBrevPanel
          readOnly={readOnly || formikProps.values[fieldnames.SKAL_HINDRE_UTSENDING_AV_BREV]}
          previewBrev={manuellBrevCallback}
          hentFritekstbrevHtmlCallback={hentHtmlMalCallback}
          harAutomatiskVedtaksbrev={harAutomatiskVedtaksbrev}
          tilgjengeligeVedtaksbrev={tilgjengeligeVedtaksbrev}
          kanInkludereKalender={kanInkludereKalender}
          formikProps={formikProps}
          dokumentdata={dokumentdata}
          lagreDokumentdata={lagreDokumentdata}
          dokumentdataInformasjonsbehov={dokumentdataInformasjonsbehov}
          overstyrtMottaker={overstyrtMottaker}
          setForhaandsvisningKlart={setForhaandsvisningKlart}
        />
      </div>
      {!formikProps.values[fieldnames.SKAL_HINDRE_UTSENDING_AV_BREV] && (
        <VedtakPreviewLink
          previewCallback={manuellBrevCallback}
          redigertHtml={formikProps.values?.[fieldnames.REDIGERT_HTML]}
          intl={intl}
          loading={!forhaandsvisningKlart}
        />
      )}
    </>
  );

  const automatiskbrev = harAutomatiskVedtaksbrev && (
    <>
      <div className={styles.brevContainer}>
        <InformasjonsbehovAutomatiskVedtaksbrev
          intl={intl}
          readOnly={readOnly || formikProps.values[fieldnames.SKAL_HINDRE_UTSENDING_AV_BREV]}
          språkkode={språkkode}
          begrunnelse={begrunnelse}
          informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
        />
      </div>
      {!formikProps.values[fieldnames.SKAL_HINDRE_UTSENDING_AV_BREV] &&
        kanResultatForhåndsvises(behandlingResultat) && (
          <VedtakPreviewLink
            previewCallback={automatiskBrevCallback}
            redigertHtml={false}
            intl={intl}
            loading={!forhaandsvisningKlart}
          />
        )}
    </>
  );

  const brevpanel =
    skalBrukeOverstyrendeFritekstBrev || kanKunVelge(tilgjengeligeVedtaksbrev, vedtaksbrevtype.FRITEKST)
      ? fritekstbrev
      : automatiskbrev;

  return (
    <div data-testid="brevpanel">
      {harAlternativeMottakere && (
        <div>
          <SelectFieldFormik
            readOnly={readOnly}
            name="overstyrtMottaker"
            selectValues={tilgjengeligeVedtaksbrev.alternativeMottakere.map(mottaker => (
              <option value={JSON.stringify(mottaker)} key={mottaker.id}>
                {lagVisningsnavnForMottaker(mottaker, personopplysninger, arbeidsgiverOpplysningerPerId)}
              </option>
            ))}
            className={readOnly ? styles.selectReadOnly : null}
            label={"Velg mottaker"}
            validate={[required]}
            bredde="xl"
          />

          {meta.error ? (
            <ErrorMessage>{intl.formatMessage(meta.error as unknown as { id: string })}</ErrorMessage>
          ) : null}
          <VerticalSpacer sixteenPx />
        </div>
      )}
      {finnesTilgjengeligeVedtaksbrev(tilgjengeligeVedtaksbrev) ? (
        brevpanel
      ) : (
        <Alert variant="info" size="medium" className={styles.infoIkkeVedtaksbrev}>
          {"I denne behandlingen er det ikke vedtaksbrev."}
        </Alert>
      )}
    </div>
  );
};

export default injectIntl(BrevPanel);
