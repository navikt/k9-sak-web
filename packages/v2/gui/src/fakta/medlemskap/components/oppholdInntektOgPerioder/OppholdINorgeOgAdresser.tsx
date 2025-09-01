import { aksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import FaktaGruppe from '@k9-sak-web/gui/shared/FaktaGruppe.js';
import PeriodLabel from '@k9-sak-web/gui/shared/periodLabel/PeriodLabel.js';
import { BodyShort, Detail, HGrid } from '@navikt/ds-react';
import { RhfRadioGroup } from '@navikt/ft-form-hooks';
import { required } from '@navikt/ft-form-validators';
import countries from 'i18n-iso-countries';
import norwegianLocale from 'i18n-iso-countries/langs/no.json';
import { useFormContext } from 'react-hook-form';
import type { Foreldre } from '../../types/FormState';
import type { MerknaderFraBeslutter } from '../../types/MerknaderFraBeslutter';
import type { Opphold } from '../../types/Opphold';
import BostedSokerView from '../bostedSøker/components/BostedSokerView';
import styles from './oppholdINorgeOgAdresser.module.css';

countries.registerLocale(norwegianLocale);

const capitalizeFirstLetter = (landNavn: string) => {
  const string = landNavn.toLowerCase();
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const formatLandNavn = (landNavn: string) => {
  if (landNavn.length === 2 || landNavn.length === 3) {
    if (landNavn === 'XXK') {
      return 'Kosovo';
    }
    return countries.getName(landNavn, 'no') ?? '';
  }
  return landNavn;
};

const lagOppholdIUtland = (utlandsOpphold: Opphold['utlandsopphold']) =>
  Array.isArray(utlandsOpphold) && utlandsOpphold.length > 0 ? (
    utlandsOpphold.map(u => (
      <div key={`${u.landNavn}${u.fom}${u.tom}`}>
        <HGrid gap="space-4" columns={{ xs: '4fr 8fr' }}>
          <BodyShort size="small">{capitalizeFirstLetter(formatLandNavn(u.landNavn))}</BodyShort>
          <BodyShort size="small">
            <PeriodLabel showTodayString dateStringFom={u.fom} dateStringTom={u.tom} />
          </BodyShort>
        </HGrid>
      </div>
    ))
  ) : (
    <BodyShort size="small">-</BodyShort>
  );

interface OppholdINorgeOgAdresserProps {
  readOnly: boolean;
  alleMerknaderFraBeslutter?: MerknaderFraBeslutter;
  opphold: {
    utlandsopphold?: any[];
  };
  hasBosattAksjonspunkt: boolean;
  isBosattAksjonspunktClosed: boolean;
  foreldre: Foreldre[];
}

const OppholdINorgeOgAdresser = ({
  alleMerknaderFraBeslutter,
  opphold,
  hasBosattAksjonspunkt,
  readOnly,
  isBosattAksjonspunktClosed,
  foreldre,
}: OppholdINorgeOgAdresserProps) => {
  const { control } = useFormContext();
  return (
    <FaktaGruppe merknaderFraBeslutter={alleMerknaderFraBeslutter?.[aksjonspunktCodes.AVKLAR_OM_ER_BOSATT]}>
      <HGrid gap="space-4" columns={{ xs: '6fr 6fr' }}>
        <div>
          <FaktaGruppe withoutBorder title="Opplysninger oppgitt i søknaden">
            <Detail>Opphold utenfor Norge</Detail>
            <div className="mt-2" />
            {!!opphold && lagOppholdIUtland(opphold.utlandsopphold)}
          </FaktaGruppe>
        </div>
        <div>
          <FaktaGruppe withoutBorder title="Bostedsadresse fra folkeregisteret">
            {foreldre.map(f => (
              <div key={f.personopplysning.navn}>
                {f.isApplicant && <BostedSokerView personopplysninger={f.personopplysning} />}
                {!f.isApplicant && (
                  <BostedSokerView sokerTypeText="Den andre forelderen" personopplysninger={f.personopplysning} />
                )}
              </div>
            ))}
          </FaktaGruppe>
          {hasBosattAksjonspunkt && (
            <div className={styles.ieFlex}>
              <RhfRadioGroup
                control={control}
                name="oppholdInntektOgPeriodeForm.bosattVurdering"
                validate={[required]}
                isReadOnly={readOnly}
                isEdited={isBosattAksjonspunktClosed}
                isHorizontal
                isTrueOrFalseSelection
                radios={[
                  {
                    value: 'true',
                    label: 'Søker er bosatt i Norge',
                  },
                  {
                    value: 'false',
                    label: (
                      <>
                        Søker er <b>ikke</b> bosatt i Norge
                      </>
                    ),
                  },
                ]}
              />
            </div>
          )}
        </div>
      </HGrid>
    </FaktaGruppe>
  );
};

export default OppholdINorgeOgAdresser;
