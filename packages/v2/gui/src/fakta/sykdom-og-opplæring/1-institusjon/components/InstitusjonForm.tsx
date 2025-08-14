import { Controller, useForm } from 'react-hook-form';

import { Box, Button, Checkbox } from '@navikt/ds-react';
import { Form, TextAreaField, RadioGroupPanel } from '@navikt/ft-form-hooks';
import { maxLength, minLength, required } from '@navikt/ft-form-validators';

import type { InstitusjonVurderingDtoMedPerioder } from '../types/InstitusjonVurderingDtoMedPerioder.js';
import { useContext, useEffect } from 'react';
import { SykdomOgOpplæringContext } from '../../FaktaSykdomOgOpplæringIndex.js';
import { k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_institusjon_InstitusjonResultat as InstitusjonVurderingDtoResultat } from '@k9-sak-web/backend/k9sak/generated';
import InstitusjonVelger from './InstitusjonVelger.js';
import { InstitusjonFormFields } from '../types/InstitusjonFormFields.js';

interface InstitusjonFormValues {
  [InstitusjonFormFields.BEGRUNNELSE]: string;
  [InstitusjonFormFields.GODKJENT_INSTITUSJON]: string;
  [InstitusjonFormFields.SKAL_LEGGE_TIL_VALGFRI_SKRIFTLIG_VURDERING]: string;
  [InstitusjonFormFields.INSTITUSJON_FRA_ORGANISASJONSNUMMER]: string;
  [InstitusjonFormFields.REDIGERT_INSTITUSJON_NAVN]: string;
  [InstitusjonFormFields.ANNEN_INSTITUSJON]: boolean;
  [InstitusjonFormFields.ORGANISASJONSNUMMER]: string;
  [InstitusjonFormFields.HELSEINSTITUSJON_ELLER_KOMPETANSESENTER_FRITEKST]: string;
}

export interface InstitusjonAksjonspunktPayload {
  godkjent: boolean;
  begrunnelse: string | null;
  redigertInstitusjonNavn?: string;
  journalpostId: {
    journalpostId: string;
  };
}

interface OwnProps {
  vurdering: InstitusjonVurderingDtoMedPerioder;
  readOnly: boolean;
  erRedigering: boolean;
  avbrytRedigering: () => void;
}

const utledGodkjentInstitusjon = (resultat: InstitusjonVurderingDtoResultat) => {
  if (resultat === InstitusjonVurderingDtoResultat.GODKJENT_MANUELT) {
    return 'ja';
  }
  if (resultat === InstitusjonVurderingDtoResultat.IKKE_GODKJENT_MANUELT) {
    return 'nei';
  }
  return '';
};

const utledOmDetErValgfriSkriftligVurdering = (begrunnelse: string, resultat: InstitusjonVurderingDtoResultat) => {
  if (begrunnelse && resultat === InstitusjonVurderingDtoResultat.GODKJENT_MANUELT) {
    return 'ja';
  }
  return 'nei';
};

const utledRedigertInstitusjonNavn = (
  helseinstitusjonEllerKompetansesenterFritekst: string,
  institusjonFraOrganisasjonsnummer: string,
  redigertInstitusjonNavn: string,
  annenInstitusjon: boolean,
) => {
  // Har søkt opp institusjon fra organisasjonsnummer
  if (institusjonFraOrganisasjonsnummer) {
    return institusjonFraOrganisasjonsnummer;
  }

  // Har skrevet inn navn på institusjonen/kompetansesenteret i fritekst
  if (annenInstitusjon && helseinstitusjonEllerKompetansesenterFritekst) {
    return helseinstitusjonEllerKompetansesenterFritekst;
  }

  // Har valgt institusjon fra listen, eller beholdt institusjon som er satt fra tidligere vurdering.
  return redigertInstitusjonNavn;
};

const defaultValues = (vurdering: InstitusjonVurderingDtoMedPerioder) => {
  return {
    [InstitusjonFormFields.BEGRUNNELSE]: vurdering.begrunnelse,
    [InstitusjonFormFields.GODKJENT_INSTITUSJON]: utledGodkjentInstitusjon(vurdering.resultat),
    [InstitusjonFormFields.SKAL_LEGGE_TIL_VALGFRI_SKRIFTLIG_VURDERING]: utledOmDetErValgfriSkriftligVurdering(
      vurdering.begrunnelse,
      vurdering.resultat,
    ),
    [InstitusjonFormFields.REDIGERT_INSTITUSJON_NAVN]: vurdering.redigertInstitusjonNavn,
    [InstitusjonFormFields.ANNEN_INSTITUSJON]: false,
    [InstitusjonFormFields.INSTITUSJON_FRA_ORGANISASJONSNUMMER]: '',
    [InstitusjonFormFields.ORGANISASJONSNUMMER]: '',
    [InstitusjonFormFields.HELSEINSTITUSJON_ELLER_KOMPETANSESENTER_FRITEKST]: '',
  };
};

const InstitusjonForm = ({ vurdering, readOnly, erRedigering, avbrytRedigering }: OwnProps) => {
  const { løsAksjonspunkt9300 } = useContext(SykdomOgOpplæringContext);

  const formMethods = useForm<InstitusjonFormValues>({
    defaultValues: defaultValues(vurdering),
  });

  useEffect(() => {
    formMethods.reset({
      ...defaultValues(vurdering),
    });
  }, [vurdering.journalpostId]);

  const { watch } = formMethods;
  const skalLeggeTilValgfriSkriftligVurdering = watch(InstitusjonFormFields.SKAL_LEGGE_TIL_VALGFRI_SKRIFTLIG_VURDERING);
  const resultat = watch(InstitusjonFormFields.GODKJENT_INSTITUSJON);
  useEffect(() => {
    if (resultat === 'nei' && skalLeggeTilValgfriSkriftligVurdering === 'ja') {
      formMethods.unregister(InstitusjonFormFields.SKAL_LEGGE_TIL_VALGFRI_SKRIFTLIG_VURDERING);
    }
  }, [skalLeggeTilValgfriSkriftligVurdering, resultat, formMethods]);

  const handleSubmit = (values: InstitusjonFormValues) => {
    const skalSendeBegrunnelse =
      values[InstitusjonFormFields.GODKJENT_INSTITUSJON] === 'nei' ||
      values[InstitusjonFormFields.SKAL_LEGGE_TIL_VALGFRI_SKRIFTLIG_VURDERING] === 'ja';
    løsAksjonspunkt9300({
      godkjent: values[InstitusjonFormFields.GODKJENT_INSTITUSJON] === 'ja',
      begrunnelse: skalSendeBegrunnelse ? values[InstitusjonFormFields.BEGRUNNELSE] : null,
      journalpostId: vurdering.journalpostId,
      redigertInstitusjonNavn: utledRedigertInstitusjonNavn(
        values[InstitusjonFormFields.HELSEINSTITUSJON_ELLER_KOMPETANSESENTER_FRITEKST],
        values[InstitusjonFormFields.INSTITUSJON_FRA_ORGANISASJONSNUMMER],
        values[InstitusjonFormFields.REDIGERT_INSTITUSJON_NAVN],
        values[InstitusjonFormFields.ANNEN_INSTITUSJON],
      ),
    });
  };

  const visValgfriSkriftligVurderingCheckbox = () => {
    return watch(InstitusjonFormFields.GODKJENT_INSTITUSJON) === 'ja';
  };

  const visBegrunnelse = () => {
    return (
      watch(InstitusjonFormFields.GODKJENT_INSTITUSJON) === 'nei' ||
      watch(InstitusjonFormFields.SKAL_LEGGE_TIL_VALGFRI_SKRIFTLIG_VURDERING) === 'ja'
    );
  };

  return (
    <Form<InstitusjonFormValues> formMethods={formMethods} onSubmit={handleSubmit}>
      <div className="flex flex-col gap-6 mt-6">
        <InstitusjonVelger
          institusjonFraSøknad={vurdering.institusjon}
          redigertInstitusjonNavn={vurdering.redigertInstitusjonNavn}
        />
        <RadioGroupPanel
          size="small"
          name={InstitusjonFormFields.GODKJENT_INSTITUSJON}
          label="Er opplæringen ved en godkjent helseinstitusjon eller kompetansesenter?"
          radios={[
            { label: 'Ja', value: 'ja' },
            { label: 'Nei', value: 'nei' },
          ]}
          validate={[required]}
          isReadOnly={readOnly}
          data-testid="godkjent-institusjon"
        />

        {visValgfriSkriftligVurderingCheckbox() && (
          <Controller
            control={formMethods.control}
            name={InstitusjonFormFields.SKAL_LEGGE_TIL_VALGFRI_SKRIFTLIG_VURDERING}
            render={({ field }) => (
              <Checkbox
                size="small"
                checked={field.value === 'ja'}
                onChange={event => {
                  field.onChange(event.target.checked ? 'ja' : 'nei');
                }}
              >
                Legg til skriftlig vurdering
              </Checkbox>
            )}
          />
        )}

        {visBegrunnelse() && (
          <TextAreaField
            name={InstitusjonFormFields.BEGRUNNELSE}
            size="small"
            label="Gjør en vurdering av om opplæringen gjennomgås ved en godkjent helseinstitusjon eller et offentlig spesialpedagogisk kompetansesenter etter § 9-14, første ledd."
            validate={[required, minLength(3), maxLength(10000)]}
            readOnly={readOnly}
            data-testid="begrunnelse"
          />
        )}
      </div>

      {!readOnly && (
        <Box className="flex mt-8">
          <Button size="small">Bekreft og fortsett</Button>

          {erRedigering && (
            <div className="ml-4">
              <Button size="small" variant="secondary" type="button" onClick={avbrytRedigering}>
                Avbryt redigering
              </Button>
            </div>
          )}
        </Box>
      )}
    </Form>
  );
};

export default InstitusjonForm;
