import React from 'react';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import { createSelector } from 'reselect';
import moment from 'moment';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';

import { ProsessStegBegrunnelseTextField, ProsessPanelTemplate } from '@k9-sak-web/prosess-felles';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { Table, TableColumn, TableRow, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { DDMMYYYY_DATE_FORMAT, isObject, required, getKodeverknavnFn } from '@fpsak-frontend/utils';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { RadioGroupField, RadioOption, behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/form';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import dokumentTypeId from '@fpsak-frontend/kodeverk/src/dokumentTypeId';
import { Aksjonspunkt, Behandling, Kodeverk, KodeverkMedNavn, ManglendeVedleggSoknad, Soknad } from '@k9-sak-web/types';

const formName = 'SokersOpplysningspliktForm';

const orgPrefix = 'org_';
const aktørPrefix = 'aktør_';

const findRadioButtonTextCode = (erVilkarOk: boolean): string =>
  erVilkarOk ? 'SokersOpplysningspliktForm.VilkarOppfylt' : 'SokersOpplysningspliktForm.VilkarIkkeOppfylt';
const getLabel = intl => (
  <div>
    <div>
      <FormattedMessage
        id={findRadioButtonTextCode(false)}
        values={{
          b: chunks => <b>{chunks}</b>,
        }}
      />
    </div>
    <div>{intl.formatMessage({ id: 'SokersOpplysningspliktForm.VilkarIkkeOppfyltMerInfo' })}</div>
  </div>
);
const capitalizeFirstLetters = (navn: string): string =>
  navn
    .toLowerCase()
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.substr(1))
    .join(' ');

const lagArbeidsgiverNavnOgFødselsdatoTekst = arbeidsgiver =>
  `${capitalizeFirstLetters(arbeidsgiver.navn)} (${moment(arbeidsgiver.fødselsdato).format(DDMMYYYY_DATE_FORMAT)})`;

const lagArbeidsgiverNavnOgOrgnrTekst = arbeidsgiver =>
  `${capitalizeFirstLetters(arbeidsgiver.navn)} (${arbeidsgiver.organisasjonsnummer || ''})`;

const formatArbeidsgiver = arbeidsgiver => {
  if (!arbeidsgiver) {
    return '';
  }
  if (arbeidsgiver.fødselsdato) {
    return lagArbeidsgiverNavnOgFødselsdatoTekst(arbeidsgiver);
  }
  return lagArbeidsgiverNavnOgOrgnrTekst(arbeidsgiver);
};

const isVilkarOppfyltDisabled = (hasSoknad, inntektsmeldingerSomIkkeKommer) =>
  !hasSoknad || Object.values(inntektsmeldingerSomIkkeKommer).some(vd => !vd);

type FormValues = {
  erVilkarOk?: boolean;
  begrunnelse?: string;
  aksjonspunktKode?: string;
  inntektsmeldingerSomIkkeKommer?: { [key: string]: boolean };
  hasAksjonspunkt?: boolean;
};

interface PureOwnProps {
  behandlingId: number;
  behandlingVersjon: number;
  behandlingsresultat?: Behandling['behandlingsresultat'];
  soknad: Soknad;
  aksjonspunkter: Aksjonspunkt[];
  status: string;
  submitCallback: (aksjonspunktData: { kode: string }[]) => Promise<any>;
  readOnly: boolean;
  readOnlySubmitButton: boolean;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
}

interface MappedOwnProps {
  getKodeverknavn: (kodeverk: Kodeverk, undertype?: string) => string;
  hasSoknad: boolean;
  originalErVilkarOk: boolean;
  dokumentTypeIds: KodeverkMedNavn[];
  manglendeVedlegg: ManglendeVedleggSoknad[];
  erVilkarOk?: boolean;
  hasAksjonspunkt: boolean;
  initialValues: FormValues;
  inntektsmeldingerSomIkkeKommer: Record<string, boolean>;
}

/**
 * SokersOpplysningspliktForm
 *
 * Presentasjonskomponent. Informasjon om søkers informasjonsplikt er godkjent eller avvist.
 */
export const SokersOpplysningspliktFormImpl = ({
  intl,
  readOnly,
  readOnlySubmitButton,
  behandlingsresultat,
  hasSoknad,
  erVilkarOk,
  originalErVilkarOk,
  hasAksjonspunkt,
  manglendeVedlegg,
  dokumentTypeIds,
  inntektsmeldingerSomIkkeKommer,
  getKodeverknavn,
  behandlingId,
  behandlingVersjon,
  ...formProps
}: PureOwnProps & MappedOwnProps & WrappedComponentProps & InjectedFormProps) => (
  <ProsessPanelTemplate
    title={intl.formatMessage({ id: 'SokersOpplysningspliktForm.SokersOpplysningsplikt' })}
    isAksjonspunktOpen={!readOnlySubmitButton}
    formName={formProps.form}
    handleSubmit={formProps.handleSubmit}
    isDirty={hasAksjonspunkt ? formProps.dirty : erVilkarOk !== formProps.initialValues.erVilkarOk}
    readOnlySubmitButton={hasSoknad ? readOnlySubmitButton : !formProps.dirty || readOnlySubmitButton}
    readOnly={readOnly}
    behandlingId={behandlingId}
    behandlingVersjon={behandlingVersjon}
    originalErVilkarOk={originalErVilkarOk}
  >
    {manglendeVedlegg.length > 0 && (
      <>
        <VerticalSpacer twentyPx />
        <Normaltekst>
          <FormattedMessage id="SokersOpplysningspliktForm.ManglendeDokumentasjon" />
        </Normaltekst>
        <VerticalSpacer eightPx />
        <Row>
          <Column xs="11">
            <Table noHover>
              {manglendeVedlegg.map(vedlegg => (
                <TableRow
                  key={
                    vedlegg.dokumentType.kode + (vedlegg.arbeidsgiver ? vedlegg.arbeidsgiver.organisasjonsnummer : '')
                  }
                >
                  <TableColumn>{dokumentTypeIds.find(dti => dti.kode === vedlegg.dokumentType.kode).navn}</TableColumn>
                  <TableColumn>
                    {vedlegg.dokumentType.kode === dokumentTypeId.INNTEKTSMELDING &&
                      formatArbeidsgiver(vedlegg.arbeidsgiver)}
                  </TableColumn>
                </TableRow>
              ))}
            </Table>
          </Column>
        </Row>
      </>
    )}
    <ProsessStegBegrunnelseTextField readOnly={readOnly} />
    {!readOnly && (
      <>
        <VerticalSpacer sixteenPx />
        <Row>
          <Column xs="6">
            <RadioGroupField name="erVilkarOk" validate={[required]}>
              <RadioOption
                label={<FormattedMessage id={findRadioButtonTextCode(true)} />}
                value
                disabled={isVilkarOppfyltDisabled(hasSoknad, inntektsmeldingerSomIkkeKommer)}
              />
              <RadioOption label={getLabel(intl)} value={false} />
            </RadioGroupField>
          </Column>
        </Row>
      </>
    )}
    {readOnly && (
      <div>
        {originalErVilkarOk === false && behandlingsresultat?.avslagsarsak && (
          <>
            <VerticalSpacer sixteenPx />
            <Normaltekst>
              {getKodeverknavn(behandlingsresultat.avslagsarsak, vilkarType.SOKERSOPPLYSNINGSPLIKT)}
            </Normaltekst>
          </>
        )}
      </div>
    )}
  </ProsessPanelTemplate>
);

export const getSortedManglendeVedlegg = createSelector([(ownProps: PureOwnProps) => ownProps.soknad], soknad =>
  soknad && soknad.manglendeVedlegg
    ? soknad.manglendeVedlegg
        .slice()
        .sort(mv1 => (mv1.dokumentType.kode === dokumentTypeId.DOKUMENTASJON_AV_TERMIN_ELLER_FØDSEL ? 1 : -1))
    : [],
);

const harSoknad = createSelector(
  [(ownProps: PureOwnProps) => ownProps.soknad],
  soknad => soknad !== null && isObject(soknad),
);

const lagArbeidsgiverKey = arbeidsgiver => {
  if (arbeidsgiver.aktørId) {
    return `${aktørPrefix}${arbeidsgiver.aktørId}`;
  }
  return `${orgPrefix}${arbeidsgiver.organisasjonsnummer}`;
};

export const buildInitialValues = createSelector(
  [
    getSortedManglendeVedlegg,
    harSoknad,
    (ownProps: PureOwnProps) => ownProps.status,
    (ownProps: PureOwnProps) => ownProps.aksjonspunkter,
  ],
  (manglendeVedlegg, soknadExists, status, aksjonspunkter): FormValues => {
    const aksjonspunkt = aksjonspunkter.length > 0 ? aksjonspunkter[0] : undefined;
    const isOpenAksjonspunkt = aksjonspunkt && isAksjonspunktOpen(aksjonspunkt.status.kode);
    const isVilkarGodkjent = soknadExists && vilkarUtfallType.OPPFYLT === status;

    const inntektsmeldingerSomIkkeKommer = manglendeVedlegg
      .filter(mv => mv.dokumentType.kode === dokumentTypeId.INNTEKTSMELDING)
      .reduce(
        (acc, mv) => ({
          ...acc,
          [lagArbeidsgiverKey(mv.arbeidsgiver)]: mv.brukerHarSagtAtIkkeKommer,
        }),
        {},
      );

    return {
      inntektsmeldingerSomIkkeKommer,
      erVilkarOk: isOpenAksjonspunkt && soknadExists ? undefined : isVilkarGodkjent,
      aksjonspunktKode: aksjonspunkt ? aksjonspunkt.definisjon.kode : aksjonspunktCodes.SOKERS_OPPLYSNINGSPLIKT_OVST,
      hasAksjonspunkt: aksjonspunkt !== undefined,
      ...ProsessStegBegrunnelseTextField.buildInitialValues(aksjonspunkter),
    };
  },
);

const transformValues = (values: FormValues, manglendeVedlegg: ManglendeVedleggSoknad[]) => {
  const arbeidsgivere = manglendeVedlegg
    .filter(mv => mv.dokumentType.kode === dokumentTypeId.INNTEKTSMELDING)
    .map(mv => mv.arbeidsgiver);
  return {
    kode: values.aksjonspunktKode,
    erVilkarOk: values.erVilkarOk,
    inntektsmeldingerSomIkkeKommer: arbeidsgivere.map(
      ag => ({
        organisasjonsnummer: ag.aktørId ? null : ag.organisasjonsnummer, // backend sender fødselsdato i orgnummer feltet for privatpersoner... fiks dette
        aktørId: ag.aktørId,
        brukerHarSagtAtIkkeKommer: values.inntektsmeldingerSomIkkeKommer[lagArbeidsgiverKey(ag)],
      }),
      {},
    ),
    ...ProsessStegBegrunnelseTextField.transformValues(values),
  };
};

const submitSelector = createSelector(
  [getSortedManglendeVedlegg, (props: PureOwnProps) => props.submitCallback],
  (manglendeVedlegg, submitCallback) => values => submitCallback([transformValues(values, manglendeVedlegg)]),
);

const mapStateToPropsFactory = (_initialState, initialOwnProps: PureOwnProps) => {
  const getKodeverknavn = getKodeverknavnFn(initialOwnProps.alleKodeverk, kodeverkTyper);
  const isOpenAksjonspunkt = initialOwnProps.aksjonspunkter.some(ap => isAksjonspunktOpen(ap.status.kode));
  const erVilkarOk = isOpenAksjonspunkt ? undefined : vilkarUtfallType.OPPFYLT === initialOwnProps.status;

  return (state, ownProps: PureOwnProps): MappedOwnProps => {
    const { behandlingId, behandlingVersjon, alleKodeverk } = ownProps;
    return {
      getKodeverknavn,
      onSubmit: submitSelector(ownProps),
      hasSoknad: harSoknad(ownProps),
      originalErVilkarOk: erVilkarOk,
      dokumentTypeIds: alleKodeverk[kodeverkTyper.DOKUMENT_TYPE_ID],
      manglendeVedlegg: getSortedManglendeVedlegg(ownProps),
      initialValues: buildInitialValues(ownProps),
      ...behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(
        state,
        'hasAksjonspunkt',
        'erVilkarOk',
        'inntektsmeldingerSomIkkeKommer',
      ),
    };
  };
};

export default connect(mapStateToPropsFactory)(
  behandlingForm({
    form: formName,
  })(injectIntl(SokersOpplysningspliktFormImpl)),
);
