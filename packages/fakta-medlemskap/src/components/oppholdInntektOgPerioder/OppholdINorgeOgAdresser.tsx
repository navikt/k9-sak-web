import BostedSokerFaktaIndex from '@fpsak-frontend/fakta-bosted-soker';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FaktaGruppe, PeriodLabel } from '@fpsak-frontend/shared-components';
import { required } from '@fpsak-frontend/utils';
import { BodyShort, Detail, HGrid } from '@navikt/ds-react';
import { RadioGroupPanel } from '@navikt/ft-form-hooks';
import countries from 'i18n-iso-countries';
import norwegianLocale from 'i18n-iso-countries/langs/no.json';
import { Foreldre } from './FormState';
import { MerknaderFraBeslutter } from './MerknaderFraBeslutter';
import { Opphold } from './Opphold';
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
    return countries.getName(landNavn, 'no');
  }
  return landNavn;
};

const lagOppholdIUtland = (utlandsOpphold: Opphold['utlandsopphold']) =>
  Array.isArray(utlandsOpphold) && utlandsOpphold.length > 0 ? (
    utlandsOpphold.map(u => (
      <div key={`${u.landNavn}${u.fom}${u.tom}`}>
        <HGrid gap="1" columns={{ xs: '4fr 8fr' }}>
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
}: OppholdINorgeOgAdresserProps) => (
  <FaktaGruppe merknaderFraBeslutter={alleMerknaderFraBeslutter?.[aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT]}>
    <HGrid gap="1" columns={{ xs: '6fr 6fr' }}>
      <div>
        <FaktaGruppe withoutBorder titleCode="Opplysninger oppgitt i søknaden" useIntl={false}>
          <Detail>Opphold utenfor Norge</Detail>
          <div className="mt-2" />
          {!!opphold && lagOppholdIUtland(opphold.utlandsopphold)}
        </FaktaGruppe>
      </div>
      <div>
        <FaktaGruppe withoutBorder titleCode="Bostedsadresse fra folkeregisteret" useIntl={false}>
          {foreldre.map(f => (
            <div key={f.personopplysning.navn}>
              {f.isApplicant && <BostedSokerFaktaIndex personopplysninger={f.personopplysning} />}
              {!f.isApplicant && (
                <BostedSokerFaktaIndex sokerTypeText="Den andre forelderen" personopplysninger={f.personopplysning} />
              )}
            </div>
          ))}
        </FaktaGruppe>
        {hasBosattAksjonspunkt && (
          <div className={styles.ieFlex}>
            <RadioGroupPanel
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

export default OppholdINorgeOgAdresser;
