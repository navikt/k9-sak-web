import { Button } from '@navikt/ds-react';
import React, { useMemo, useState } from 'react';
// eslint-disable-next-line import/no-duplicates
import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { AksjonspunktHelpText, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Form } from '@navikt/ft-form-hooks';
import { FormattedMessage, IntlShape, injectIntl } from 'react-intl';
// eslint-disable-next-line import/no-duplicates
import { guid } from '@fpsak-frontend/utils';

import { Aksjonspunkt, FagsakPerson, KodeverkMedNavn } from '@k9-sak-web/types';
import { useForm, useWatch } from 'react-hook-form';
import { OppholdInntektOgPeriodeFormState, OppholdInntektOgPerioderFormState } from './FormState';
import { Medlemskap } from './Medlemskap';
import MedlemskapEndringerTabell from './MedlemskapEndringerTabell';
import { MerknaderFraBeslutter } from './MerknaderFraBeslutter';
import OppholdInntektOgPeriodeForm from './OppholdInntektOgPeriodeForm';
import { Periode } from './Periode';
import { Soknad } from './Soknad';

const {
  AVKLAR_OM_BRUKER_ER_BOSATT,
  AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE,
  AVKLAR_OPPHOLDSRETT,
  AVKLAR_LOVLIG_OPPHOLD,
  AVKLAR_FORTSATT_MEDLEMSKAP,
} = aksjonspunktCodes;

export enum FieldName {
  PERIODER = 'perioder',
  SOKNAD = 'soknad',
  PERSON = 'person',
  GJELDENDE_FOM = 'gjeldendeFom',
  MEDLEMSKAP_PERIODER = 'medlemskapPerioder',
}

const getHelpTexts = (aksjonspunkter: Aksjonspunkt[]) => {
  const helpTexts = [];
  if (hasAksjonspunkt(AVKLAR_FORTSATT_MEDLEMSKAP, aksjonspunkter)) {
    helpTexts.push(<FormattedMessage key="HarFortsattMedlemskap" id="MedlemskapInfoPanel.HarFortsattMedlemskap" />);
  }
  if (hasAksjonspunkt(AVKLAR_OM_BRUKER_ER_BOSATT, aksjonspunkter)) {
    helpTexts.push(<FormattedMessage key="ErSokerBosattINorge" id="MedlemskapInfoPanel.ErSokerBosattINorge" />);
  }
  if (hasAksjonspunkt(AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE, aksjonspunkter)) {
    helpTexts.push(
      <FormattedMessage key="GyldigMedlemFolketrygden" id="MedlemskapInfoPanel.GyldigMedlemFolketrygden" />,
    );
  }
  if (hasAksjonspunkt(AVKLAR_OPPHOLDSRETT, aksjonspunkter)) {
    helpTexts.push(
      <FormattedMessage key="EOSBorgerMedOppholdsrett1" id="MedlemskapInfoPanel.EOSBorgerMedOppholdsrett" />,
    );
  }
  if (hasAksjonspunkt(AVKLAR_LOVLIG_OPPHOLD, aksjonspunkter)) {
    helpTexts.push(
      <FormattedMessage key="IkkeEOSBorgerMedLovligOpphold" id="MedlemskapInfoPanel.IkkeEOSBorgerMedLovligOpphold" />,
    );
  }
  return helpTexts;
};

const createNewPerioder = (perioder: Periode[], id: string, values): Periode[] => {
  const updatedIndex = perioder.findIndex(p => p.id === id);
  const updatedPeriode = perioder.find(p => p.id === id);

  return [
    ...perioder.slice(0, updatedIndex),
    {
      ...updatedPeriode,
      ...values,
    },
    ...perioder.slice(updatedIndex + 1),
  ];
};

const medlemAksjonspunkter = [
  AVKLAR_OM_BRUKER_ER_BOSATT,
  AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE,
  AVKLAR_OPPHOLDSRETT,
  AVKLAR_LOVLIG_OPPHOLD,
  AVKLAR_FORTSATT_MEDLEMSKAP,
];

export const transformValues = (values: OppholdInntektOgPerioderFormState, aksjonspunkter: Aksjonspunkt[]) => {
  const aktiveMedlemAksjonspunkter = aksjonspunkter
    .filter(ap => medlemAksjonspunkter.includes(ap.definisjon.kode))
    .filter(ap => ap.erAktivt)
    .filter(ap => ap.definisjon.kode !== aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN);

  return aktiveMedlemAksjonspunkter.map(aksjonspunkt => ({
    kode: aksjonspunkt.definisjon.kode,
    bekreftedePerioder: values.perioder
      .map(periode => {
        const {
          vurderingsdato,
          aksjonspunkter: aksjonspunkterFraPeriode,
          oppholdsrettVurdering,
          erEosBorger,
          lovligOppholdVurdering,
          medlemskapManuellVurderingType,
          begrunnelse,
        } = periode;
        const bekreftetPeriode = {
          vurderingsdato,
          aksjonspunkter: aksjonspunkterFraPeriode,
          oppholdsrettVurdering,
          erEosBorger,
          lovligOppholdVurdering,
          medlemskapManuellVurderingType,
          begrunnelse,
        };
        return bekreftetPeriode;
      })
      .filter(
        periode =>
          periode.aksjonspunkter.includes(aksjonspunkt.definisjon.kode) ||
          (periode.aksjonspunkter.length > 0 &&
            aksjonspunkt.definisjon.kode === aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP),
      ),
  }));
};

const buildInitialValues = (
  soknad: Soknad,
  fagsakPerson: FagsakPerson,
  medlemskap: Medlemskap,
  perioder: Periode[],
  valgtPeriode: Periode,
  aksjonspunkter: Aksjonspunkt[],
  alleKodeverk: { [key: string]: KodeverkMedNavn[] },
) => ({
  soknad,
  fagsakPerson,
  [FieldName.GJELDENDE_FOM]: medlemskap.fom,
  [FieldName.MEDLEMSKAP_PERIODER]: medlemskap.medlemskapPerioder,
  perioder,
  oppholdInntektOgPeriodeForm: OppholdInntektOgPeriodeForm.buildInitialValues(
    valgtPeriode,
    aksjonspunkter,
    soknad,
    medlemskap.medlemskapPerioder,
    medlemskap.fom,
    alleKodeverk,
  ),
});

interface OppholdInntektOgPerioderFormProps {
  intl: IntlShape;
  submittable: boolean;
  aksjonspunkter: Aksjonspunkt[];
  readOnly: boolean;
  isRevurdering: boolean;
  alleMerknaderFraBeslutter: MerknaderFraBeslutter;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  behandlingId: number;
  behandlingVersjon: number;
  medlemskap: Medlemskap;
  soknad: Soknad;
  fagsakPerson: FagsakPerson;
  submitCallback: (aksjonspunktData: any) => Promise<void>;
}

export const OppholdInntektOgPerioderForm = (props: OppholdInntektOgPerioderFormProps) => {
  const {
    readOnly,
    submittable,
    aksjonspunkter,
    alleKodeverk,
    alleMerknaderFraBeslutter,
    soknad,
    fagsakPerson,
    medlemskap,
    submitCallback,
  } = props;
  const initialPerioder = useMemo(
    () =>
      (medlemskap.perioder || []).map(periode => ({
        ...periode,
        id: guid(),
      })),
    [medlemskap],
  );
  const [valgtPeriode, setValgtPeriode] = useState(initialPerioder?.length > 0 ? initialPerioder[0] : undefined);

  const getInitialValues = (oppdatertePerioder?: Periode[], nyValgtPeriode?: Periode) =>
    buildInitialValues(
      soknad,
      fagsakPerson,
      medlemskap,
      oppdatertePerioder || initialPerioder,
      nyValgtPeriode || valgtPeriode,
      aksjonspunkter,
      alleKodeverk,
    );

  const formMethods = useForm<OppholdInntektOgPerioderFormState>({
    defaultValues: getInitialValues(),
  });

  const hasOpenAksjonspunkter = aksjonspunkter.some(ap => isAksjonspunktOpen(ap.status.kode));

  const handleSubmit = (formState: OppholdInntektOgPerioderFormState) => {
    submitCallback(transformValues(formState, aksjonspunkter));
  };

  const perioder = useWatch({ control: formMethods.control, name: FieldName.PERIODER });

  const periodeResetCallback = () => {
    console.log('periodeResetCallback', valgtPeriode);
    // if (valgtPeriode) {
    //   formMethods.reset(getInitialValues(), { keepDefaultValues: true });
    //   // formMethods.resetField('perioder')
    //   // formReset(`${behandlingFormPrefix}.OppholdInntektOgPeriodeForm-${valgtPeriode.id}`);
    console.log('labba', {
      ...formMethods.getValues(),
      oppholdInntektOgPeriodeForm: getInitialValues().oppholdInntektOgPeriodeForm,
    });
    formMethods.reset({
      ...formMethods.getValues(),
      oppholdInntektOgPeriodeForm: getInitialValues().oppholdInntektOgPeriodeForm,
    });
    // }
  };

  const velgPeriodeCallback = (id: string, periode: Periode) => {
    const nyValgtPeriode = {
      id,
      ...periode,
    };

    formMethods.reset({
      ...formMethods.getValues(),
      oppholdInntektOgPeriodeForm: getInitialValues(perioder, nyValgtPeriode).oppholdInntektOgPeriodeForm,
    });
    setValgtPeriode(nyValgtPeriode);
  };

  const updateOppholdInntektPeriode = (values: OppholdInntektOgPeriodeFormState) => {
    console.log('values', values);
    const updatedPeriode = perioder.find(p => p.id === values.id);
    const newPeriodeObject = {
      ...updatedPeriode,
      ...values,
    };
    console.log('perioder', perioder);
    const newPerioder = createNewPerioder(perioder, values.id, newPeriodeObject);
    console.log('newPerioder', newPerioder);
    formMethods.setValue(FieldName.PERIODER, newPerioder);
  };

  const isConfirmButtonDisabled = () => {
    if (!formMethods.formState.isDirty) {
      return true;
    }

    if (perioder && perioder.length > 0) {
      const ubekreftPerioder = perioder.filter(
        periode => periode.aksjonspunkter.length > 0 && periode.begrunnelse === null,
      );

      if (ubekreftPerioder.length > 0) {
        return true;
      }
    }
    return formMethods.formState.isSubmitting || readOnly;
  };

  const isApOpen = hasOpenAksjonspunkter || !submittable;

  return (
    <Form formMethods={formMethods} onSubmit={handleSubmit} data-testid="OppholdInntektOgPerioderForm">
      <AksjonspunktHelpText isAksjonspunktOpen={isApOpen}>{getHelpTexts(aksjonspunkter)}</AksjonspunktHelpText>
      {hasAksjonspunkt(AVKLAR_FORTSATT_MEDLEMSKAP, aksjonspunkter) && (
        <MedlemskapEndringerTabell
          selectedId={valgtPeriode ? valgtPeriode.id : undefined}
          velgPeriodeCallback={velgPeriodeCallback}
        />
      )}

      {valgtPeriode && (
        <OppholdInntektOgPeriodeForm
          key={valgtPeriode.id}
          readOnly={readOnly}
          valgtPeriode={valgtPeriode}
          submittable={submittable}
          updateOppholdInntektPeriode={updateOppholdInntektPeriode}
          periodeResetCallback={periodeResetCallback}
          alleKodeverk={alleKodeverk}
          alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
        />
      )}

      <VerticalSpacer twentyPx />
      <Button
        variant="primary"
        size="small"
        disabled={isConfirmButtonDisabled()}
        loading={formMethods.formState.isSubmitting}
      >
        <FormattedMessage id="OppholdInntektOgPerioder.Bekreft" />
      </Button>
    </Form>
  );
};

// const buildInitalValues = createSelector(
//   [ownProps => ownProps.soknad, ownProps => ownProps.fagsakPerson, ownProps => ownProps.medlemskap],
//   (soknad, person, medlem = {}) => ({
//     soknad,
//     person,
//     gjeldendeFom: medlem.fom,
//     medlemskapPerioder: medlem.medlemskapPerioder || [],
//     perioder: (medlem.perioder || []).map(periode => ({
//       ...periode,
//       id: guid(),
//     })),
//   }),
// );

// export const isBehandlingRevurderingFortsattMedlemskap = createSelector(
//   [ownProps => ownProps.behandlingType, ownProps => ownProps.medlemskap],
//   (type, medlem = {}) => type.kode === behandlingType.REVURDERING && !!medlem.fom,
// );

// const mapStateToPropsFactory = (initialState, initialOwnProps) => {
//   const onSubmit = values => initialOwnProps.submitCallback(transformValues(values, initialOwnProps.aksjonspunkter));
//   const hasOpenAksjonspunkter = initialOwnProps.aksjonspunkter.some(ap => isAksjonspunktOpen(ap.status.kode));
//   const perioder = [];

//   return (state, ownProps) => {
//     const { behandlingId, behandlingVersjon } = ownProps;
//     const behandlingFormPrefix = getBehandlingFormPrefix(behandlingId, behandlingVersjon);
//     return {
//       behandlingFormPrefix,
//       onSubmit,
//       hasOpenAksjonspunkter,
//       initialValues: buildInitalValues(ownProps),
//       perioder:
//         behandlingFormValueSelector(
//           'OppholdInntektOgPerioderForm',
//           behandlingId,
//           behandlingVersjon,
//         )(state, 'perioder') || perioder,
//       isRevurdering: isBehandlingRevurderingFortsattMedlemskap(ownProps),
//     };
//   };
// };

export default injectIntl(OppholdInntektOgPerioderForm);
