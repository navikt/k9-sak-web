import { useEffect, useState, type FC } from 'react';
import { useFormContext, type FieldArrayWithId, type UseFieldArrayReplace } from 'react-hook-form';
import dayjs from 'dayjs';
import { formatPeriod } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { ScissorsIcon, TrashIcon } from '@navikt/aksel-icons';
import {
  Button,
  RadioGroup,
  Radio,
  HStack,
  TextField,
  BodyShort,
  HelpText,
  Modal,
  DatePicker,
  VStack,
} from '@navikt/ds-react';
import { PeriodeMedOverlappValg } from '@k9-sak-web/backend/k9sak/generated';
import { type VurderOverlappendeSakFormData } from './VurderOverlappendeSak';
import { useOverlappendeSakUtils } from './utils/useOverlappendeSakUtils';
import styles from './VurderOverlappendeSak.module.css';

interface Props {
  index: number;
  originaleOverlappendePerioder: { fom: string; tom: string }[];
  readOnly: boolean;
  fields: FieldArrayWithId<VurderOverlappendeSakFormData, 'perioder', 'id'>[];
  replace: UseFieldArrayReplace<VurderOverlappendeSakFormData, 'perioder'>;
}

const VurderOverlappendePeriodeForm: FC<Props> = ({
  index,
  originaleOverlappendePerioder,
  readOnly,
  fields,
  replace,
}) => {
  const {
    watch,
    formState: { errors },
    register,
    setValue,
    getValues,
  } = useFormContext<VurderOverlappendeSakFormData>();
  const fom = getValues(`perioder.${index}.periode.fom`);
  const tom = getValues(`perioder.${index}.periode.tom`);
  const { splittPeriode, slettPeriode } = useOverlappendeSakUtils(fields, replace);
  const [visDatoVelger, setVisDatovelger] = useState<boolean>(false);
  const [skalViseSkjema, setSkalViseSkjema] = useState<boolean>(false);

  const harSplittedePerioder = !originaleOverlappendePerioder.some(originalPeriode => {
    return dayjs(originalPeriode.fom).isSame(fom) && dayjs(originalPeriode.tom).isSame(tom);
  });
  const kanSlettes = harSplittedePerioder && !readOnly;
  const kanSplittes = !dayjs(fom).isSame(tom) && !readOnly;
  const watchValg = watch(`perioder.${index}.valg`);
  const erEndretAutomatisk = getValues(`perioder.${index}.endretAutomatisk`);
  const [velgDato, setVelgDato] = useState<number>(0);

  useEffect(() => {}, []);

  useEffect(() => {
    if (watchValg === PeriodeMedOverlappValg.JUSTERT_GRAD) setSkalViseSkjema(true);
    else setSkalViseSkjema(false);
  }, [watchValg]);

  return (
    <div>
      <VStack gap={'space-16'}>
        <RadioGroup
          size="small"
          legend={
            <HStack as={'span'} align={'center'} gap={'space-8'}>
              <BodyShort size="small" as="span" weight="semibold">
                Vurder uttak for perioden{' '}
                <BodyShort
                  size="small"
                  as="span"
                  weight="semibold"
                  className={erEndretAutomatisk ? styles['uttaksPeriodeEndret'] : ''}
                >{`${formatPeriod(fom || '', tom || '')}`}</BodyShort>
              </BodyShort>
              {kanSplittes && (
                <Button
                  onClick={() => setVisDatovelger(true)}
                  variant="tertiary"
                  size="small"
                  type="button"
                  icon={<ScissorsIcon title="Splitt periode" />}
                />
              )}
              {kanSlettes && (
                <Button
                  type="button"
                  onClick={() => slettPeriode(index)}
                  variant="tertiary"
                  size="small"
                  icon={<TrashIcon title="Slett periode" />}
                />
              )}
              {erEndretAutomatisk && (
                <HelpText title="Hvor kommer dette fra?">
                  Denne perioden ble justert automatisk for å fylle den overlappende perioden.
                </HelpText>
              )}
            </HStack>
          }
          onChange={value => {
            setValue(`perioder.${index}.valg`, value);
          }}
          error={errors?.perioder?.[index]?.valg?.message}
          value={watchValg}
          readOnly={readOnly}
        >
          <Radio value={PeriodeMedOverlappValg.INGEN_UTTAK_I_PERIODEN}>Ingen uttak i perioden</Radio>
          <Radio value={PeriodeMedOverlappValg.INGEN_JUSTERING}>Vanlig uttak i perioden</Radio>
          <Radio value={PeriodeMedOverlappValg.JUSTERT_GRAD}>Tilpass uttaksgrad</Radio>
        </RadioGroup>

        {skalViseSkjema && (
          <div>
            <TextField
              label={`Sett uttaksgrad for perioden (i prosent)`}
              inputMode="numeric"
              size="small"
              className={styles['uttaksgradField']}
              readOnly={readOnly}
              {...register(`perioder.${index}.søkersUttaksgrad`)}
              error={errors.perioder?.[index]?.søkersUttaksgrad?.message}
            />
          </div>
        )}
      </VStack>

      {kanSplittes && (
        <div>
          <Modal
            title="Spesifiser periode"
            onClose={() => {
              setVelgDato(0);
              setVisDatovelger(false);
            }}
            open={visDatoVelger}
            aria-label="Spesifiser periode"
          >
            <Modal.Header closeButton>Spesifiser periode</Modal.Header>
            <Modal.Body>
              <DatePicker.Standalone
                dropdownCaption
                defaultMonth={new Date(fom)}
                mode="range"
                disabled={[{ before: new Date(fom) }, { after: new Date(tom) }]}
                onSelect={(val: undefined | { from: Date | undefined; to?: Date | undefined }) => {
                  if (velgDato === 0) setVelgDato(1);
                  if (velgDato === 1) {
                    if (val?.from && val.to) {
                      setVisDatovelger(false);
                      splittPeriode(val.from, val.to, index);
                      setVelgDato(0);
                    }
                  }
                }}
              />
            </Modal.Body>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default VurderOverlappendePeriodeForm;
