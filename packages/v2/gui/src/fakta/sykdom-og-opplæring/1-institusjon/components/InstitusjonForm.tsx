import { Controller, useForm } from 'react-hook-form';

import { Box, Button, Checkbox } from '@navikt/ds-react';
import { Form, TextAreaField, RadioGroupPanel } from '@navikt/ft-form-hooks';
import { maxLength, minLength, required } from '@navikt/ft-form-validators';

import type { InstitusjonVurderingDtoMedPerioder } from '../types/InstitusjonVurderingDtoMedPerioder.js';
import { useContext, useEffect } from 'react';
import { SykdomOgOpplæringContext } from '../../FaktaSykdomOgOpplæringIndex.js';
import { InstitusjonVurderingDtoResultat } from '@k9-sak-web/backend/k9sak/generated';

enum InstitusjonFormFields {
  BEGRUNNELSE = 'begrunnelse',
  GODKJENT_INSTITUSJON = 'godkjentInstitusjon',
  SKAL_LEGGE_TIL_VALGFRI_SKRIFTLIG_VURDERING = 'skalLeggeTilValgfriSkriftligVurdering',
}
interface InstitusjonFormValues {
  [InstitusjonFormFields.BEGRUNNELSE]: string;
  [InstitusjonFormFields.GODKJENT_INSTITUSJON]: string;
  [InstitusjonFormFields.SKAL_LEGGE_TIL_VALGFRI_SKRIFTLIG_VURDERING]: string;
}

export interface InstitusjonAksjonspunktPayload {
  godkjent: boolean;
  begrunnelse: string | null;
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

const InstitusjonForm = ({ vurdering, readOnly, erRedigering, avbrytRedigering }: OwnProps) => {
  const { løsAksjonspunkt9300 } = useContext(SykdomOgOpplæringContext);

  const formMethods = useForm<InstitusjonFormValues>({
    defaultValues: {
      [InstitusjonFormFields.BEGRUNNELSE]: vurdering.begrunnelse,
      [InstitusjonFormFields.GODKJENT_INSTITUSJON]: utledGodkjentInstitusjon(vurdering.resultat),
      [InstitusjonFormFields.SKAL_LEGGE_TIL_VALGFRI_SKRIFTLIG_VURDERING]: utledOmDetErValgfriSkriftligVurdering(
        vurdering.begrunnelse,
        vurdering.resultat,
      ),
    },
  });

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
