import { inntektskategorier, type Inntektskategori } from '@k9-sak-web/backend/k9sak/kodeverk/Inntektskategori.js';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { KodeverkType, type KodeverkObject } from '@k9-sak-web/lib/kodeverk/types.js';
import type { FeatureToggles } from '@k9-sak-web/gui/featuretoggles/FeatureToggles.js';
import { PlusCircleIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, Fieldset, HGrid, HStack, VStack } from '@navikt/ds-react';
import { InputField, SelectField } from '@navikt/ft-form-hooks';
import { hasValidDecimal, maxValue, minValue, required } from '@navikt/ft-form-validators';
import { useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import type { ArbeidsgiverOpplysningerPerId } from '../../types/arbeidsgiverOpplysningerType';
import type { NyArbeidsgiverFormState, NyPeriodeFormAndeler, TilkjentYtelseFormState } from './FormState';
import NyArbeidsgiverModal from './NyArbeidsgiverModal';

const minValue0 = minValue(0);
const maxValue100 = maxValue(100);
const maxValue3999 = maxValue(3999);
const isEmpty = (text?: string | null) => text === null || text === undefined || text.toString().trim().length === 0;
const atLeastOneRequired = (value: string, otherValue?: string | null) =>
  isEmpty(value) && isEmpty(otherValue) ? 'Feltet må fylles ut' : undefined;

const mapArbeidsgivere = (arbeidsgivere: ArbeidsgiverOpplysningerPerId) =>
  arbeidsgivere
    ? Object.values(arbeidsgivere).map(({ navn, identifikator }) => (
        <option value={identifikator} key={identifikator}>
          {navn} ({identifikator})
        </option>
      ))
    : [];

const mapArbeidsgivereOrg = (arbeidsgivere: ArbeidsgiverOpplysningerPerId) =>
  arbeidsgivere
    ? Object.values(arbeidsgivere)
        .filter(arbeidsgiver => arbeidsgiver.personIdentifikator == null) // erPrivatPerson returneres ikke fra backend
        .map(({ navn, identifikator }) => (
          <option value={identifikator} key={identifikator}>
            {navn} ({identifikator})
          </option>
        ))
    : [];

const mapArbeidsgiverePrivatperson = (arbeidsgivere: ArbeidsgiverOpplysningerPerId) =>
  arbeidsgivere
    ? Object.values(arbeidsgivere)
        .filter(arbeidsgiver => arbeidsgiver.personIdentifikator != null) // erPrivatPerson returneres ikke fra backend
        .map(({ navn, personIdentifikator }) => (
          <option value={personIdentifikator} key={personIdentifikator}>
            {navn} ({personIdentifikator})
          </option>
        ))
    : [];

const getInntektskategori = (inntektskategorier: KodeverkObject[]) =>
  inntektskategorier.map(ik => (
    <option value={ik.kode} key={ik.kode}>
      {ik.navn}
    </option>
  ));

const erSelvstendigNæringsdrivende = (inntektskategori: Inntektskategori) =>
  [
    inntektskategorier.DAGMAMMA,
    inntektskategorier.JORDBRUKER,
    inntektskategorier.FISKER,
    inntektskategorier.SELVSTENDIG_NÆRINGSDRIVENDE,
  ].includes(inntektskategori);

const erFrilans = (inntektskategori: string) => inntektskategori === inntektskategorier.FRILANSER;

const defaultAndel: NyPeriodeFormAndeler = {
  arbeidsgiverOrgnr: '',
  arbeidsgiverPersonIdent: undefined,
  eksternArbeidsforholdId: '',
  inntektskategori: inntektskategorier['-'],
  refusjon: 0,
  tilSoker: 0,
  utbetalingsgrad: 0,
};

interface OwnProps {
  readOnly: boolean;
  arbeidsgivere: ArbeidsgiverOpplysningerPerId;
  newArbeidsgiverCallback: (values: NyArbeidsgiverFormState) => void;
  featureToggles?: FeatureToggles;
}

export const NyAndel = ({ newArbeidsgiverCallback, readOnly, arbeidsgivere, featureToggles }: OwnProps) => {
  const [isOpen, setOpen] = useState(false);
  const { control } = useFormContext<TilkjentYtelseFormState>();
  const { hentKodeverkForKode } = useKodeverkContext();
  const inntektskategorier = hentKodeverkForKode(KodeverkType.INNTEKTSKATEGORI) as KodeverkObject[];
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'nyPeriodeForm.andeler',
    keyName: 'fieldId',
  });
  const skillUtPrivatperson = featureToggles?.['SKILL_UT_PRIVATPERSON'];

  useEffect(() => {
    if (fields.length === 0) {
      append(defaultAndel);
    }
  }, []);

  return (
    <>
      <Fieldset legend="Ny andel" hideLegend>
        <VStack gap="5">
          {fields.map((field, index) => {
            const erSN = erSelvstendigNæringsdrivende(field.inntektskategori);
            const erFL = erFrilans(field.inntektskategori);
            return (
              <HStack gap="2" key={field.fieldId}>
                <SelectField
                  label="Inntektskategori"
                  name={`nyPeriodeForm.andeler.${index}.inntektskategori`}
                  selectValues={getInntektskategori(inntektskategorier)}
                />

                {!erSN && !erFL && (
                  <div>
                    <div className="flex items-end">
                      <SelectField
                        label="Arbeidsgiver"
                        name={`nyPeriodeForm.andeler.${index}.arbeidsgiverOrgnr`}
                        validate={
                          skillUtPrivatperson
                            ? [value => atLeastOneRequired(value, field.arbeidsgiverPersonIdent)]
                            : [required]
                        }
                        selectValues={
                          skillUtPrivatperson ? mapArbeidsgivereOrg(arbeidsgivere) : mapArbeidsgivere(arbeidsgivere)
                        }
                      />
                      <Button
                        variant="secondary"
                        size="small"
                        icon={
                          <PlusCircleIcon
                            title="Ny arbeidsgiver"
                            fontSize="1.5rem"
                            className="text-[var(--a-blue-500)]"
                          />
                        }
                        onClick={() => setOpen(true)}
                        type="button"
                      />
                    </div>
                    {skillUtPrivatperson && (
                      <div className="flex items-end">
                        <SelectField
                          label="Arbeidsgiver (privatperson)"
                          name={`nyPeriodeForm.andeler.${index}.arbeidsgiverPersonIdent`}
                          validate={[value => atLeastOneRequired(value, field.arbeidsgiverOrgnr)]}
                          selectValues={mapArbeidsgiverePrivatperson(arbeidsgivere)}
                        />
                      </div>
                    )}
                  </div>
                )}

                <InputField
                  label="Til søker"
                  name={`nyPeriodeForm.andeler.${index}.tilSoker`}
                  validate={[required, minValue0, maxValue3999, hasValidDecimal]}
                  format={value => value}
                />
                {!erSN && !erFL && (
                  <InputField
                    label="Refusjon"
                    name={`nyPeriodeForm.andeler.${index}.refusjon`}
                    validate={[required, minValue0, maxValue3999, hasValidDecimal]}
                    format={value => value}
                  />
                )}
                {!erSN && (
                  <InputField
                    label="Uttaksgrad"
                    name={`nyPeriodeForm.andeler.${index}.utbetalingsgrad`}
                    validate={[required, minValue0, maxValue100, hasValidDecimal]}
                    format={value => value}
                  />
                )}

                {index > 0 && (
                  <Button
                    variant="tertiary"
                    size="small"
                    type="button"
                    onClick={() => {
                      remove(index);
                    }}
                    data-testid="removeButton"
                    icon={<XMarkIcon title="Slett Perioden" fontSize="1.5rem" className="text-[var(--a-nav-red)]" />}
                  />
                )}
              </HStack>
            );
          })}
        </VStack>

        <HGrid gap="1" columns={{ xs: '1fr 11fr' }}>
          {!readOnly && (
            <Button
              size="xsmall"
              variant="secondary-neutral"
              type="button"
              onClick={() => append(defaultAndel)}
              icon={<PlusCircleIcon fontSize="1.5rem" className="text-[var(--a-blue-500)]" />}
              iconPosition="left"
            >
              Ny andel
            </Button>
          )}
          <div className="mt-4" />
        </HGrid>
      </Fieldset>
      {isOpen && (
        <NyArbeidsgiverModal
          showModal={isOpen}
          closeEvent={(values: NyArbeidsgiverFormState) => {
            newArbeidsgiverCallback(values);
            setOpen(false);
          }}
          cancelEvent={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default NyAndel;
