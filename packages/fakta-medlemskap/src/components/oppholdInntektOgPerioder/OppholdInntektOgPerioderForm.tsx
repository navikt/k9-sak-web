import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { AksjonspunktHelpText, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { guid } from '@fpsak-frontend/utils';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import { Aksjonspunkt, FagsakPerson, KodeverkMedNavn } from '@k9-sak-web/types';
import { Button } from '@navikt/ds-react';
import { Form } from '@navikt/ft-form-hooks';
import React, { useContext, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { OppholdInntektOgPeriodeFormState, OppholdInntektOgPerioderFormState } from './FormState';
import GrunnlagForAutomatiskVurdering from './GrunnlagForAutomatiskVurdering';
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

const getHelpTexts = (aksjonspunkter: Aksjonspunkt[]) => {
  const helpTexts = [];
  if (hasAksjonspunkt(AVKLAR_FORTSATT_MEDLEMSKAP, aksjonspunkter)) {
    helpTexts.push('Vurder om søker fortsatt har gyldig medlemskap i perioden');
  }
  if (hasAksjonspunkt(AVKLAR_OM_BRUKER_ER_BOSATT, aksjonspunkter)) {
    helpTexts.push('Vurder om søker er bosatt i Norge');
  }
  if (hasAksjonspunkt(AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE, aksjonspunkter)) {
    helpTexts.push('Vurder om søker har gyldig medlemskap i perioden');
  }
  if (hasAksjonspunkt(AVKLAR_OPPHOLDSRETT, aksjonspunkter)) {
    helpTexts.push('Vurder om søker er EØS-borger med oppholdsrett');
  }
  if (hasAksjonspunkt(AVKLAR_LOVLIG_OPPHOLD, aksjonspunkter)) {
    helpTexts.push('Avklar om søker har lovlig opphold');
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
          bosattVurdering,
        } = periode;
        const bekreftetPeriode = {
          bosattVurdering,
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
  aksjonspunkter: Aksjonspunkt[],
  alleKodeverk: { [key: string]: KodeverkMedNavn[] },
  valgtPeriode?: Periode,
): OppholdInntektOgPerioderFormState => ({
  soknad,
  person: fagsakPerson,
  gjeldendeFom: medlemskap.fom,
  perioder,
  oppholdInntektOgPeriodeForm: OppholdInntektOgPeriodeForm.buildInitialValues(
    aksjonspunkter,
    soknad,
    medlemskap.medlemskapPerioder,
    medlemskap.fom,
    alleKodeverk,
    valgtPeriode,
  ),
});

interface OppholdInntektOgPerioderFormProps {
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

export const OppholdInntektOgPerioderForm = ({
  readOnly,
  submittable,
  aksjonspunkter,
  alleKodeverk,
  alleMerknaderFraBeslutter,
  soknad,
  fagsakPerson,
  medlemskap,
  submitCallback,
}: OppholdInntektOgPerioderFormProps) => {
  const featureToggles = useContext(FeatureTogglesContext);
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
      aksjonspunkter,
      alleKodeverk,
      nyValgtPeriode || valgtPeriode,
    );

  const formMethods = useForm<OppholdInntektOgPerioderFormState>({
    defaultValues: getInitialValues(),
  });

  const hasOpenAksjonspunkter = aksjonspunkter.some(ap => isAksjonspunktOpen(ap.status.kode));

  const handleSubmit = async (formState: OppholdInntektOgPerioderFormState) => {
    await submitCallback(transformValues(formState, aksjonspunkter));
  };

  const perioder = useWatch({ control: formMethods.control, name: 'perioder' });

  const periodeResetCallback = () => {
    formMethods.reset({
      ...formMethods.getValues(),
      oppholdInntektOgPeriodeForm: getInitialValues().oppholdInntektOgPeriodeForm,
    });
  };

  const velgPeriodeCallback = (id: string, periode: Periode) => {
    const nyValgtPeriode = {
      id,
      ...periode,
    };

    formMethods.reset(
      {
        ...formMethods.getValues(),
        oppholdInntektOgPeriodeForm: getInitialValues(perioder, nyValgtPeriode).oppholdInntektOgPeriodeForm,
      },
      { keepDirty: true },
    );
    setValgtPeriode(nyValgtPeriode);
  };

  const updateOppholdInntektPeriode = (values: OppholdInntektOgPeriodeFormState) => {
    const updatedPeriode = perioder.find(p => p.id === values.id);
    const newPeriodeObject = {
      ...updatedPeriode,
      ...values,
    };
    const newPerioder = createNewPerioder(perioder, values.id, newPeriodeObject);
    formMethods.setValue('perioder', newPerioder);
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

  const erAutomatiskVurdert =
    medlemskap?.medlemskapPerioder?.length === 0 &&
    medlemskap?.perioder?.length === 0 &&
    Object.keys(medlemskap?.personopplysninger).length > 0;

  return (
    <Form formMethods={formMethods} onSubmit={handleSubmit} data-testid="OppholdInntektOgPerioderForm">
      <AksjonspunktHelpText isAksjonspunktOpen={isApOpen}>
        {getHelpTexts(aksjonspunkter).map(helpText => (
          <React.Fragment key={helpText}>{helpText}</React.Fragment>
        ))}
      </AksjonspunktHelpText>
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
      {featureToggles?.AUTOMATISK_VURDERT_MEDLEMSKAP && erAutomatiskVurdert && (
        <GrunnlagForAutomatiskVurdering
          alleKodeverk={alleKodeverk}
          personopplysninger={medlemskap.personopplysninger}
          soknad={soknad}
        />
      )}

      <VerticalSpacer twentyPx />
      {!erAutomatiskVurdert && (
        <Button
          variant="primary"
          size="small"
          disabled={isConfirmButtonDisabled()}
          loading={formMethods.formState.isSubmitting}
        >
          Bekreft og fortsett
        </Button>
      )}
    </Form>
  );
};

export default OppholdInntektOgPerioderForm;
