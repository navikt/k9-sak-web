import { PeriodpickerListRHF, RadioGroupPanelRHF, TextAreaRHF } from '@fpsak-frontend/form';
import { Period } from '@fpsak-frontend/utils';
import { Alert } from '@navikt/ds-react';
import { Box, DetailView, Form, LabelledContent, Margin } from '@navikt/ft-plattform-komponenter';
import React from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import Beskrivelse from '../../../../types/Beskrivelse';
import Vurderingsperiode from '../../../../types/Vurderingsperiode';
import Vurderingsresultat from '../../../../types/Vurderingsresultat';
import { finnResterendePerioder } from '../../../../util/periodUtils';
import ContainerContext from '../../../context/ContainerContext';
import AddButton from '../../add-button/AddButton';
import BeskrivelserForPerioden from '../../beskrivelser-for-perioden/BeskrivelserForPerioden';
import DeleteButton from '../../delete-button/DeleteButton';

export enum FieldName {
  BEGRUNNELSE = 'begrunnelse',
  HAR_BEHOV_FOR_NATTEVÅK = 'harBehovForNattevåk',
  PERIODER = 'perioder',
}

enum RadioOptions {
  JA = 'ja',
  JA_DELER = 'jaDeler',
  NEI = 'nei',
}

interface VurderingAvNattevåksperioderFormProps {
  nattevåksperiode: Vurderingsperiode;
  onCancelClick: () => void;
  beskrivelser: Beskrivelse[];
}

interface VurderingAvNattevåksperioderFormState {
  [FieldName.BEGRUNNELSE]: string;
  [FieldName.PERIODER]: Period[];
  [FieldName.HAR_BEHOV_FOR_NATTEVÅK]: RadioOptions;
}

const VurderingAvNattevåksperioderForm = ({
  nattevåksperiode,
  onCancelClick,
  beskrivelser,
}: VurderingAvNattevåksperioderFormProps): JSX.Element => {
  const { lagreNattevåkvurdering, readOnly } = React.useContext(ContainerContext);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const defaultBehovForNattevåk = () => {
    if (nattevåksperiode.resultat === Vurderingsresultat.OPPFYLT) {
      return RadioOptions.JA;
    }
    if (nattevåksperiode.resultat === Vurderingsresultat.IKKE_OPPFYLT) {
      return RadioOptions.NEI;
    }
    return null;
  };
  const formMethods = useForm({
    defaultValues: {
      [FieldName.PERIODER]: nattevåksperiode?.periode
        ? [new Period(nattevåksperiode.periode.fom, nattevåksperiode.periode.tom)]
        : [new Period('', '')],
      [FieldName.BEGRUNNELSE]: nattevåksperiode.begrunnelse || '',
      [FieldName.HAR_BEHOV_FOR_NATTEVÅK]: defaultBehovForNattevåk(),
    },
  });

  const erDetBehovForNattevåk = useWatch({ control: formMethods.control, name: FieldName.HAR_BEHOV_FOR_NATTEVÅK });

  const handleSubmit = (formState: VurderingAvNattevåksperioderFormState) => {
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 2500);
    const { begrunnelse, perioder, harBehovForNattevåk } = formState;
    const { kilde } = nattevåksperiode;

    let perioderMedEllerUtenNattevåk;
    let perioderUtenNattevåk = [];
    if (harBehovForNattevåk === RadioOptions.JA_DELER) {
      perioderMedEllerUtenNattevåk = perioder
        .map((periode: any) => (periode.period ? periode.period : periode))
        .map(periode => ({
          periode,
          resultat: Vurderingsresultat.OPPFYLT,
          begrunnelse,
          kilde,
        }));

      const resterendePerioder = finnResterendePerioder(perioder, nattevåksperiode.periode);
      perioderUtenNattevåk = resterendePerioder.map(periode => ({
        periode,
        resultat: Vurderingsresultat.IKKE_OPPFYLT,
        begrunnelse,
        kilde,
      }));
    } else {
      perioderMedEllerUtenNattevåk = [
        {
          periode: nattevåksperiode.periode,
          resultat:
            harBehovForNattevåk === RadioOptions.JA ? Vurderingsresultat.OPPFYLT : Vurderingsresultat.IKKE_OPPFYLT,
          begrunnelse,
          kilde,
        },
      ];
    }

    const kombinertePerioder = perioderMedEllerUtenNattevåk.concat(perioderUtenNattevåk);
    lagreNattevåkvurdering({ vurderinger: kombinertePerioder });
  };

  const valgtePerioder = useWatch({ control: formMethods.control, name: FieldName.PERIODER });
  const perioderUtenBehovForNattevåk = finnResterendePerioder((valgtePerioder || []) as any, nattevåksperiode.periode);

  return (
    <DetailView title="Vurdering av nattevåk">
      <FormProvider {...formMethods}>
        <Form
          onSubmit={formMethods.handleSubmit(handleSubmit)}
          buttonLabel="Bekreft og fortsett"
          onAvbryt={onCancelClick}
          cancelButtonDisabled={isSubmitting}
          submitButtonDisabled={isSubmitting}
          shouldShowSubmitButton={!readOnly}
        >
          <Box marginTop={Margin.large}>
            <BeskrivelserForPerioden periodebeskrivelser={beskrivelser} />
          </Box>
          <Box marginTop={Margin.xLarge}>
            <TextAreaRHF
              label="Gjør en vurdering av om det er behov for nattevåk etter § 9-11, tredje ledd."
              name={FieldName.BEGRUNNELSE}
              disabled={readOnly}
            />
          </Box>
          <Box marginTop={Margin.xLarge}>
            <RadioGroupPanelRHF
              question="Er det behov for nattevåk?"
              radios={[
                { value: RadioOptions.JA, label: 'Ja' },
                { value: RadioOptions.JA_DELER, label: 'Ja, i deler av perioden' },
                { value: RadioOptions.NEI, label: 'Nei' },
              ]}
              name={FieldName.HAR_BEHOV_FOR_NATTEVÅK}
              disabled={readOnly}
            />
          </Box>
          {erDetBehovForNattevåk === RadioOptions.JA_DELER && (
            <Box marginTop={Margin.xLarge}>
              <PeriodpickerListRHF
                name={FieldName.PERIODER}
                legend="I hvilke perioder er det behov for nattevåk?"
                fromDatepickerProps={{ label: 'Fra', ariaLabel: 'Fra' }}
                toDatepickerProps={{ label: 'Til', ariaLabel: 'Til' }}
                defaultValues={[new Period(nattevåksperiode.periode.fom, nattevåksperiode.periode.tom)]}
                disabled={readOnly}
                renderContentAfterElement={(index, numberOfItems, fieldArrayMethods) =>
                  numberOfItems > 1 && (
                    <DeleteButton
                      onClick={() => {
                        fieldArrayMethods.remove(index);
                      }}
                    />
                  )
                }
                renderAfterFieldArray={fieldArrayMethods => (
                  <Box marginTop={Margin.large}>
                    <AddButton
                      label="Legg til periode"
                      onClick={() => fieldArrayMethods.append({ fom: '', tom: '' })}
                      id="leggTilPeriodeKnapp"
                    />
                  </Box>
                )}
              />
            </Box>
          )}
          {perioderUtenBehovForNattevåk.length > 0 && (
            <Box marginTop={Margin.xLarge}>
              <Alert size="small" variant="info">
                <LabelledContent
                  label="Resterende perioder har søkeren ikke behov for nattevåk:"
                  content={perioderUtenBehovForNattevåk.map(periode => (
                    <p key={`${periode.fom}-${periode.tom}`} style={{ margin: 0 }}>
                      {periode.prettifyPeriod()}
                    </p>
                  ))}
                />
              </Alert>
            </Box>
          )}
        </Form>
      </FormProvider>
    </DetailView>
  );
};

export default VurderingAvNattevåksperioderForm;
