import { Period } from '@navikt/k9-fe-period-utils';
import { Box, Margin, DetailView, LabelledContent, Form } from '@navikt/ft-plattform-komponenter';
import { PeriodpickerList, RadioGroupPanel, TextArea } from '@navikt/k9-fe-form-utils';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import React from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import Beskrivelse from '../../../../types/Beskrivelse';
import Vurderingsperiode from '../../../../types/Vurderingsperiode';
import Vurderingsresultat from '../../../../types/Vurderingsresultat';
import { finnResterendePerioder } from '../../../../util/periodUtils';
import ContainerContext from '../../../context/ContainerContext';
import { required } from '../../../form/validators/index';
import AddButton from '../../add-button/AddButton';
import BeskrivelserForPerioden from '../../beskrivelser-for-perioden/BeskrivelserForPerioden';
import DeleteButton from '../../delete-button/DeleteButton';

export enum FieldName {
  BEGRUNNELSE = 'begrunnelse',
  HAR_BEHOV_FOR_BEREDSKAP = 'harBehovForBeredskap',
  PERIODER = 'perioder',
}

enum RadioOptions {
  JA = 'ja',
  JA_DELER = 'jaDeler',
  NEI = 'nei',
}

interface VurderingAvBeredskapsperioderFormProps {
  beredskapsperiode: Vurderingsperiode;
  onCancelClick: () => void;
  beskrivelser: Beskrivelse[];
}

interface VurderingAvBeredskapsperioderFormState {
  [FieldName.BEGRUNNELSE]: string;
  [FieldName.PERIODER]: Period[];
  [FieldName.HAR_BEHOV_FOR_BEREDSKAP]: RadioOptions;
}

const VurderingAvBeredskapsperioderForm = ({
  beredskapsperiode,
  onCancelClick,
  beskrivelser,
}: VurderingAvBeredskapsperioderFormProps): JSX.Element => {
  const { lagreBeredskapvurdering, readOnly } = React.useContext(ContainerContext);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const defaultBehovForBeredeskap = () => {
    if (beredskapsperiode.resultat === Vurderingsresultat.OPPFYLT) {
      return RadioOptions.JA;
    }
    if (beredskapsperiode.resultat === Vurderingsresultat.IKKE_OPPFYLT) {
      return RadioOptions.NEI;
    }
    return null;
  };

  const formMethods = useForm({
    defaultValues: {
      [FieldName.PERIODER]: beredskapsperiode?.periode
        ? [new Period(beredskapsperiode.periode.fom, beredskapsperiode.periode.tom)]
        : [new Period('', '')],
      [FieldName.BEGRUNNELSE]: beredskapsperiode.begrunnelse || '',
      [FieldName.HAR_BEHOV_FOR_BEREDSKAP]: defaultBehovForBeredeskap(),
    },
  });

  const erDetBehovForBeredskap = useWatch({ control: formMethods.control, name: FieldName.HAR_BEHOV_FOR_BEREDSKAP });

  const handleSubmit = (formState: VurderingAvBeredskapsperioderFormState) => {
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 2500);
    const { begrunnelse, perioder, harBehovForBeredskap } = formState;
    const { kilde } = beredskapsperiode;

    let perioderMedEllerUtenBeredskap;
    let perioderUtenBeredskap = [];
    if (harBehovForBeredskap === RadioOptions.JA_DELER) {
      perioderMedEllerUtenBeredskap = perioder
        .map((periode: any) => (periode.period ? periode.period : periode))
        .map(periode => ({
          periode,
          resultat: Vurderingsresultat.OPPFYLT,
          begrunnelse,
          kilde,
        }));

      const resterendePerioder = finnResterendePerioder(perioder, beredskapsperiode.periode);
      perioderUtenBeredskap = resterendePerioder.map(periode => ({
        periode,
        resultat: Vurderingsresultat.IKKE_OPPFYLT,
        begrunnelse,
        kilde,
      }));
    } else {
      perioderMedEllerUtenBeredskap = [
        {
          periode: beredskapsperiode.periode,
          resultat:
            harBehovForBeredskap === RadioOptions.JA ? Vurderingsresultat.OPPFYLT : Vurderingsresultat.IKKE_OPPFYLT,
          begrunnelse,
          kilde,
        },
      ];
    }

    const kombinertePerioder = perioderMedEllerUtenBeredskap.concat(perioderUtenBeredskap);
    lagreBeredskapvurdering({ vurderinger: kombinertePerioder });
  };

  const valgtePerioder = useWatch({ control: formMethods.control, name: FieldName.PERIODER });

  const perioderUtenBehovForBeredskap = finnResterendePerioder(
    (valgtePerioder || []) as any,
    beredskapsperiode.periode,
  );

  return (
    <DetailView title="Vurdering av beredskap">
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
            <TextArea
              label="Gjør en vurdering av om det er behov for beredskap etter § 9-11, tredje ledd."
              name={FieldName.BEGRUNNELSE}
              validators={{ required }}
              disabled={readOnly}
            />
          </Box>
          <Box marginTop={Margin.xLarge}>
            <RadioGroupPanel
              question="Er det behov for beredskap?"
              radios={[
                { value: RadioOptions.JA, label: 'Ja' },
                { value: RadioOptions.JA_DELER, label: 'Ja, i deler av perioden' },
                { value: RadioOptions.NEI, label: 'Nei' },
              ]}
              name={FieldName.HAR_BEHOV_FOR_BEREDSKAP}
              validators={{ required }}
              disabled={readOnly}
            />
          </Box>
          {erDetBehovForBeredskap === RadioOptions.JA_DELER && (
            <Box marginTop={Margin.xLarge}>
              <PeriodpickerList
                name={FieldName.PERIODER}
                legend="I hvilke perioder er det behov for beredskap?"
                fromDatepickerProps={{ label: 'Fra', ariaLabel: 'Fra' }}
                toDatepickerProps={{ label: 'Til', ariaLabel: 'Til' }}
                disabled={readOnly}
                defaultValues={[new Period(beredskapsperiode.periode.fom, beredskapsperiode.periode.tom)]}
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
                validators={{
                  overlaps: (valgtPeriode: Period) => {
                    const andreValgtePerioder = formMethods
                      .getValues()
                      .perioder.filter((periodWrapper: any) => periodWrapper.period !== valgtPeriode)
                      .map(({ period }: any) => new Period(period.fom, period.tom));

                    // eslint-disable-next-line react/destructuring-assignment
                    const valgtPeriodePeriod = new Period(valgtPeriode.fom, valgtPeriode.tom);
                    if (valgtPeriodePeriod.overlapsWithSomePeriodInList(andreValgtePerioder)) {
                      return 'Beredskapsperiodene kan ikke overlappe';
                    }
                    return null;
                  },
                }}
              />
            </Box>
          )}
          {perioderUtenBehovForBeredskap.length > 0 && (
            <Box marginTop={Margin.xLarge}>
              <AlertStripeInfo>
                <LabelledContent
                  label="Resterende perioder har søkeren ikke behov for beredskap:"
                  content={perioderUtenBehovForBeredskap.map(periode => (
                    <p key={`${periode.fom}-${periode.tom}`} style={{ margin: 0 }}>
                      {periode.prettifyPeriod()}
                    </p>
                  ))}
                />
              </AlertStripeInfo>
            </Box>
          )}
        </Form>
      </FormProvider>
    </DetailView>
  );
};

export default VurderingAvBeredskapsperioderForm;
