import { Controller, useForm } from 'react-hook-form';

import { BodyLong, Box, Button, Checkbox, Radio } from '@navikt/ds-react';
import { maxLength, minLength, required } from '@navikt/ft-form-validators';

import { Lovreferanse } from '@k9-sak-web/gui/shared/lovreferanse/Lovreferanse.js';
import { RhfForm, RhfRadioGroup, RhfTextarea } from '@navikt/ft-form-hooks';
import { useContext, useEffect } from 'react';
import { SykdomOgOpplæringContext } from '../../FaktaSykdomOgOpplæringIndex.js';
import { InstitusjonFormFields } from '../types/InstitusjonFormFields.js';
import type { InstitusjonVurderingDtoMedPerioder } from '../types/InstitusjonVurderingDtoMedPerioder.js';
import {
  utledGodkjentInstitusjon,
  utledOmDetErValgfriSkriftligVurdering,
  utledRedigertInstitusjonNavn,
} from '../utils.js';
import InstitusjonVelger from './InstitusjonVelger.js';

interface InstitusjonFormValues {
  [InstitusjonFormFields.BEGRUNNELSE]: string;
  [InstitusjonFormFields.GODKJENT_INSTITUSJON]: string;
  [InstitusjonFormFields.SKAL_LEGGE_TIL_VALGFRI_SKRIFTLIG_VURDERING]: string;
  [InstitusjonFormFields.INSTITUSJON_FRA_ORGANISASJONSNUMMER]: string;
  [InstitusjonFormFields.REDIGERT_INSTITUSJON_NAVN]: string;
  [InstitusjonFormFields.ANNEN_INSTITUSJON]: boolean;
  [InstitusjonFormFields.HAR_ORGANISASJONSNUMMER]: string;
  [InstitusjonFormFields.ORGANISASJONSNUMMER]: string;
  [InstitusjonFormFields.HELSEINSTITUSJON_ELLER_KOMPETANSESENTER_FRITEKST]: string;
}

export interface InstitusjonAksjonspunktPayload {
  godkjent: boolean;
  begrunnelse: string | null;
  redigertInstitusjonNavn?: string | null;
  organisasjonsnummer: string | null;
  journalpostId: {
    journalpostId: string | null;
  };
}

interface OwnProps {
  vurdering: InstitusjonVurderingDtoMedPerioder;
  readOnly: boolean;
  erRedigering: boolean;
  avbrytRedigering: () => void;
}

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
    [InstitusjonFormFields.HAR_ORGANISASJONSNUMMER]: vurdering.organisasjonsnummer ? 'ja' : 'nei',
    [InstitusjonFormFields.ORGANISASJONSNUMMER]: vurdering.organisasjonsnummer,
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

  const { watch, control } = formMethods;
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
    const skalSendeOrganisasjonsnummer = values[InstitusjonFormFields.HAR_ORGANISASJONSNUMMER] === 'ja' && (values[InstitusjonFormFields.ORGANISASJONSNUMMER] || '').length === 9;
    løsAksjonspunkt9300({
      godkjent: values[InstitusjonFormFields.GODKJENT_INSTITUSJON] === 'ja',
      begrunnelse: skalSendeBegrunnelse ? values[InstitusjonFormFields.BEGRUNNELSE] : null,
      journalpostId: vurdering.journalpostId,
      redigertInstitusjonNavn: utledRedigertInstitusjonNavn(
        values[InstitusjonFormFields.HELSEINSTITUSJON_ELLER_KOMPETANSESENTER_FRITEKST],
        values[InstitusjonFormFields.INSTITUSJON_FRA_ORGANISASJONSNUMMER],
        values[InstitusjonFormFields.REDIGERT_INSTITUSJON_NAVN],
        values[InstitusjonFormFields.ANNEN_INSTITUSJON],
        values[InstitusjonFormFields.HAR_ORGANISASJONSNUMMER] === 'ja',
      ),
      organisasjonsnummer: skalSendeOrganisasjonsnummer ? values[InstitusjonFormFields.ORGANISASJONSNUMMER] : null,
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
    <RhfForm<InstitusjonFormValues> formMethods={formMethods} onSubmit={handleSubmit}>
      <div className="flex flex-col gap-6 mt-6">
        <InstitusjonVelger
          institusjonFraSøknad={vurdering.institusjon}
          redigertInstitusjonNavn={vurdering.redigertInstitusjonNavn}
        />
        <RhfRadioGroup
          control={control}
          size="small"
          name={InstitusjonFormFields.GODKJENT_INSTITUSJON}
          label={
            <BodyLong size="small">
              Er institusjonen en godkjent helseinstitusjon eller kompetansesenter, jf{' '}
              <Lovreferanse>§ 9-14</Lovreferanse>?
            </BodyLong>
          }
          validate={[required]}
          isReadOnly={readOnly}
          data-testid="godkjent-institusjon"
        >
          <Radio value="ja">Ja</Radio>
          <Radio value="nei">Nei</Radio>
        </RhfRadioGroup>
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
          <RhfTextarea
            control={control}
            name={InstitusjonFormFields.BEGRUNNELSE}
            size="small"
            label={
              <BodyLong size="small">
                Skriv din vurdering av om institusjonen er en godkjent helseinstitusjon eller kompetansesenter etter
                reglene i <Lovreferanse>§ 9-14, første ledd</Lovreferanse>
              </BodyLong>
            }
            validate={[required, minLength(3), maxLength(10000)]}
            readOnly={readOnly}
            data-testid="begrunnelse"
          />
        )}
      </div>

      {!readOnly && (
        <Box.New className="flex mt-8">
          <Button size="small">Bekreft og fortsett</Button>

          {erRedigering && (
            <div className="ml-4">
              <Button size="small" variant="secondary" type="button" onClick={avbrytRedigering}>
                Avbryt redigering
              </Button>
            </div>
          )}
        </Box.New>
      )}
    </RhfForm>
  );
};

export default InstitusjonForm;
