import BostedSokerFaktaIndex from '@fpsak-frontend/fakta-bosted-soker';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { FaktaGruppe, PeriodLabel, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { required } from '@fpsak-frontend/utils';
import { BodyShort, Detail, HGrid } from '@navikt/ds-react';
import { RadioGroupPanel } from '@navikt/ft-form-hooks';
import countries from 'i18n-iso-countries';
import norwegianLocale from 'i18n-iso-countries/langs/no.json';
import { FunctionComponent } from 'react';

import { Aksjonspunkt, KodeverkMedNavn, Personopplysninger } from '@k9-sak-web/types';
import { useFormContext, useWatch } from 'react-hook-form';
import { OppholdInntektOgPerioderFormState, OppholdINorgeOgAdresserFaktaPanelFormState } from './FormState';
import { MerknaderFraBeslutter } from './MerknaderFraBeslutter';
import { Opphold } from './Opphold';
import { Periode } from './Periode';
import { Soknad } from './Soknad';
import styles from './oppholdINorgeOgAdresserFaktaPanel.module.css';

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

interface OppholdINorgeOgAdresserFaktaPanelProps {
  readOnly: boolean;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  alleMerknaderFraBeslutter: MerknaderFraBeslutter;
}

interface TransformedValues {
  kode: string;
  bosattVurdering: boolean;
}

interface StaticFunctions {
  buildInitialValues: (
    soknad: Soknad,
    aksjonspunkter: Aksjonspunkt[],
    periode?: Periode,
  ) => OppholdINorgeOgAdresserFaktaPanelFormState;
}

/**
 * OppholdINorgeOgAdresserFaktaPanel
 *
 * Presentasjonskomponent. Er tilknyttet faktapanelet for medlemskap.
 * Viser opphold i innland og utland som er relevante for søker. ReadOnly.
 */
const OppholdINorgeOgAdresserFaktaPanel: FunctionComponent<OppholdINorgeOgAdresserFaktaPanelProps> &
  StaticFunctions = ({ readOnly, alleKodeverk, alleMerknaderFraBeslutter }) => {
  const { control } = useFormContext<OppholdInntektOgPerioderFormState>();
  const { foreldre, opphold, hasBosattAksjonspunkt, isBosattAksjonspunktClosed } = useWatch({
    control,
    name: 'oppholdInntektOgPeriodeForm',
  });
  return (
    <FaktaGruppe merknaderFraBeslutter={alleMerknaderFraBeslutter[aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT]}>
      <HGrid gap="1" columns={{ xs: '6fr 6fr' }}>
        <div>
          <FaktaGruppe withoutBorder titleCode="Opplysninger oppgitt i søknaden" useIntl={false}>
            <Detail>Opphold utenfor Norge</Detail>
            <VerticalSpacer fourPx />
            {!!opphold && lagOppholdIUtland(opphold.utlandsopphold)}
          </FaktaGruppe>
        </div>
        <div>
          <FaktaGruppe withoutBorder titleCode="Bostedsadresse fra folkeregisteret" useIntl={false}>
            {foreldre.map(f => (
              <div key={f.personopplysning.navn}>
                {f.isApplicant && (
                  <BostedSokerFaktaIndex personopplysninger={f.personopplysning} alleKodeverk={alleKodeverk} />
                )}
                {!f.isApplicant && (
                  <BostedSokerFaktaIndex
                    sokerTypeTextId="OppholdINorgeOgAdresserFaktaPanel.Parent"
                    personopplysninger={f.personopplysning}
                    alleKodeverk={alleKodeverk}
                  />
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
};
const createParent = (isApplicant: boolean, personopplysning?: Personopplysninger) => ({
  isApplicant,
  personopplysning,
});

OppholdINorgeOgAdresserFaktaPanel.buildInitialValues = (
  soknad: Soknad,
  aksjonspunkter: Aksjonspunkt[],
  periode?: Periode,
) => {
  let opphold = {};

  if (soknad && soknad.oppgittTilknytning) {
    const { oppgittTilknytning } = soknad;
    opphold = {
      utlandsopphold: oppgittTilknytning.utlandsopphold,
    };
  }

  const { personopplysninger } = periode || {};
  const parents = [createParent(true, personopplysninger)];
  if (personopplysninger?.annenPart) {
    parents.push(createParent(false, personopplysninger.annenPart));
  }

  const filteredAp = periode?.aksjonspunkter.includes(aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT)
    ? aksjonspunkter
    : aksjonspunkter.filter(ap => ap.definisjon.kode === aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP);

  return {
    opphold,
    hasBosattAksjonspunkt: filteredAp.length > 0,
    isBosattAksjonspunktClosed: filteredAp.some(ap => !isAksjonspunktOpen(ap.status.kode)),
    foreldre: parents,
    bosattVurdering:
      periode?.bosattVurdering || periode?.bosattVurdering === false ? periode.bosattVurdering : undefined,
  };
};

export default OppholdINorgeOgAdresserFaktaPanel;
