import type {
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto,
  k9_sak_kontrakt_person_PersonDto as PersonDto,
} from '@k9-sak-web/backend/k9sak/generated';
import { aksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import AksjonspunktHelpText from '@k9-sak-web/gui/shared/aksjonspunktHelpText/AksjonspunktHelpText.js';
import { isAksjonspunktOpen } from '@k9-sak-web/gui/utils/aksjonspunktUtils.js';
import { Box, Button } from '@navikt/ds-react';
import { RhfForm } from '@navikt/ft-form-hooks';
import { guid } from '@navikt/ft-utils';
import React, { useContext, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import type { Aksjonspunkt } from '../../types/Aksjonspunkt';
import type { OppholdInntektOgPeriodeFormState, OppholdInntektOgPerioderFormState } from '../../types/FormState';
import type { Medlemskap } from '../../types/Medlemskap';
import type { MerknaderFraBeslutter } from '../../types/MerknaderFraBeslutter';
import type { Periode } from '../../types/Periode';
import type { Søknad } from '../../types/Søknad';
import GrunnlagForAutomatiskVurdering from './GrunnlagForAutomatiskVurdering';
import MedlemskapEndringerTabell from './MedlemskapEndringerTabell';
import OppholdInntektOgPeriodeForm, {
  buildInitialValuesOppholdInntektOgPeriodeForm,
} from './OppholdInntektOgPeriodeForm';

export const hasAksjonspunkt = (aksjonspunktCode: string, aksjonspunkter: AksjonspunktDto[]): boolean =>
  aksjonspunkter.some(ap => ap.definisjon === aksjonspunktCode);

const {
  AVKLAR_OM_ER_BOSATT,
  AVKLAR_GYLDIG_MEDLEMSKAPSPERIODE,
  AVKLAR_OPPHOLDSRETT,
  AVKLAR_LOVLIG_OPPHOLD,
  AVKLAR_FORTSATT_MEDLEMSKAP,
} = aksjonspunktCodes;

const getHelpTexts = (aksjonspunkter: AksjonspunktDto[]) => {
  const helpTexts: string[] = [];
  if (hasAksjonspunkt(AVKLAR_FORTSATT_MEDLEMSKAP, aksjonspunkter)) {
    helpTexts.push('Vurder om søker fortsatt har gyldig medlemskap i perioden');
  }
  if (hasAksjonspunkt(AVKLAR_OM_ER_BOSATT, aksjonspunkter)) {
    helpTexts.push('Vurder om søker er bosatt i Norge');
  }
  if (hasAksjonspunkt(AVKLAR_GYLDIG_MEDLEMSKAPSPERIODE, aksjonspunkter)) {
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

const createNewPerioder = (perioder: Periode[], id: string, values: Periode): Periode[] => {
  const updatedIndex = perioder.findIndex(p => p.id === id);
  const updatedPeriode = perioder.find(p => p.id === id);
  if (updatedIndex === -1 || !updatedPeriode) {
    throw new Error('Period not found');
  }
  return [
    ...perioder.slice(0, updatedIndex),
    {
      // Merge the existing period data with the new values to create an updated period
      ...updatedPeriode, // Existing period data
      ...values, // New values to update the period
    },
    ...perioder.slice(updatedIndex + 1),
  ];
};

const medlemAksjonspunkter = [
  AVKLAR_OM_ER_BOSATT,
  AVKLAR_GYLDIG_MEDLEMSKAPSPERIODE,
  AVKLAR_OPPHOLDSRETT,
  AVKLAR_LOVLIG_OPPHOLD,
  AVKLAR_FORTSATT_MEDLEMSKAP,
];

export const transformValues = (values: OppholdInntektOgPerioderFormState, aksjonspunkter: AksjonspunktDto[]) => {
  const aktiveMedlemAksjonspunkter = aksjonspunkter
    .filter(ap => medlemAksjonspunkter.some(mp => mp === ap.definisjon))
    .filter(ap => ap.erAktivt);

  return aktiveMedlemAksjonspunkter.map(aksjonspunkt => ({
    kode: aksjonspunkt.definisjon,
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
          periode.aksjonspunkter.some(ap => ap === aksjonspunkt.definisjon) ||
          (periode.aksjonspunkter.length > 0 &&
            aksjonspunkt.definisjon === aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP),
      ),
  }));
};

const buildInitialValues = (
  soknad: Søknad,
  fagsakPerson: PersonDto,
  medlemskap: Medlemskap,
  perioder: Periode[],
  aksjonspunkter: Aksjonspunkt[],
  valgtPeriode: Periode,
): OppholdInntektOgPerioderFormState => ({
  soknad,
  person: fagsakPerson,
  gjeldendeFom: medlemskap.fom,
  perioder,
  oppholdInntektOgPeriodeForm: buildInitialValuesOppholdInntektOgPeriodeForm(
    aksjonspunkter,
    soknad,
    medlemskap.medlemskapPerioder,
    medlemskap.fom,
    valgtPeriode,
  ),
});

interface OppholdInntektOgPerioderFormProps {
  submittable: boolean;
  aksjonspunkter: Aksjonspunkt[];
  readOnly: boolean;
  isRevurdering: boolean;
  alleMerknaderFraBeslutter: MerknaderFraBeslutter;
  behandlingId: number;
  behandlingVersjon: number;
  medlemskap: Medlemskap;
  soknad: Søknad;
  fagsakPerson: PersonDto;
  submitCallback: (aksjonspunktData: any) => Promise<void>;
}

export const OppholdInntektOgPerioderForm = ({
  readOnly,
  submittable,
  aksjonspunkter,
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
  const [valgtPeriode, setValgtPeriode] = useState(initialPerioder[0]);

  const getInitialValues = (oppdatertePerioder?: Periode[], nyValgtPeriode?: Periode) => {
    const periode = nyValgtPeriode || valgtPeriode;
    if (periode === undefined) {
      return undefined;
    }
    return buildInitialValues(
      soknad,
      fagsakPerson,
      medlemskap,
      oppdatertePerioder || initialPerioder,
      aksjonspunkter,
      periode,
    );
  };

  const formMethods = useForm<OppholdInntektOgPerioderFormState>({
    defaultValues: getInitialValues(),
  });

  const hasOpenAksjonspunkter = aksjonspunkter.some(ap => isAksjonspunktOpen(ap.status));

  const handleSubmit = async (formState: OppholdInntektOgPerioderFormState) => {
    await submitCallback(transformValues(formState, aksjonspunkter));
  };

  const perioder = useWatch({ control: formMethods.control, name: 'perioder' });

  const periodeResetCallback = () => {
    formMethods.reset({
      ...formMethods.getValues(),
      oppholdInntektOgPeriodeForm: getInitialValues()?.oppholdInntektOgPeriodeForm,
    });
  };

  const velgPeriodeCallback = (id: string, periode: Periode) => {
    const nyValgtPeriode = {
      ...periode,
      id,
    };

    formMethods.reset(
      {
        ...formMethods.getValues(),
        oppholdInntektOgPeriodeForm: getInitialValues(perioder, nyValgtPeriode)?.oppholdInntektOgPeriodeForm,
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
    medlemskap?.personopplysninger &&
    Object.keys(medlemskap.personopplysninger).length > 0;

  return (
    <RhfForm formMethods={formMethods} onSubmit={handleSubmit} data-testid="OppholdInntektOgPerioderForm">
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
          alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
        />
      )}
      {featureToggles?.['AUTOMATISK_VURDERT_MEDLEMSKAP'] && erAutomatiskVurdert && (
        <GrunnlagForAutomatiskVurdering personopplysninger={medlemskap.personopplysninger} soknad={soknad} />
      )}

      <Box marginBlock="5 0">
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
      </Box>
    </RhfForm>
  );
};

export default OppholdInntektOgPerioderForm;
