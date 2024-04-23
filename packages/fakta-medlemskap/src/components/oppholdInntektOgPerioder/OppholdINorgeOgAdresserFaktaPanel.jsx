import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import countries from 'i18n-iso-countries';
import norwegianLocale from 'i18n-iso-countries/langs/no.json';
import BostedSokerFaktaIndex from '@fpsak-frontend/fakta-bosted-soker';
import { RadioGroupField, RadioOption, behandlingFormValueSelector } from '@fpsak-frontend/form';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { FaktaGruppe, PeriodLabel, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { required } from '@fpsak-frontend/utils';
import { BodyShort, Detail, HGrid } from '@navikt/ds-react';

import styles from './oppholdINorgeOgAdresserFaktaPanel.module.css';

countries.registerLocale(norwegianLocale);

const capitalizeFirstLetter = landNavn => {
  const string = landNavn.toLowerCase();
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const formatLandNavn = landNavn => {
  if (landNavn.length === 2 || landNavn.length === 3) {
    return countries.getName(landNavn, 'no');
  }
  return landNavn;
};

const lagOppholdIUtland = utlandsOpphold =>
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
/**
 * OppholdINorgeOgAdresserFaktaPanel
 *
 * Presentasjonskomponent. Er tilknyttet faktapanelet for medlemskap.
 * Viser opphold i innland og utland som er relevante for søker. ReadOnly.
 */
const OppholdINorgeOgAdresserFaktaPanel = ({
  readOnly,
  hasBosattAksjonspunkt,
  isBosattAksjonspunktClosed,
  opphold,
  foreldre,
  alleKodeverk,
  alleMerknaderFraBeslutter,
}) => (
  <FaktaGruppe merknaderFraBeslutter={alleMerknaderFraBeslutter[aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT]}>
    <HGrid gap="1" columns={{ xs: '6fr 6fr' }}>
      <div>
        <FaktaGruppe withoutBorder titleCode="OppholdINorgeOgAdresserFaktaPanel.OppholdINorge">
          <Detail>
            <FormattedMessage id="OppholdINorgeOgAdresserFaktaPanel.StayingOutsideOfNorway" />
          </Detail>
          <VerticalSpacer fourPx />
          {lagOppholdIUtland(opphold.utlandsopphold)}
        </FaktaGruppe>
      </div>
      <div>
        <FaktaGruppe withoutBorder titleCode="OppholdINorgeOgAdresserFaktaPanel.BosattAdresser">
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
            <RadioGroupField
              name="bosattVurdering"
              validate={[required]}
              bredde="XXL"
              readOnly={readOnly}
              isEdited={isBosattAksjonspunktClosed}
            >
              <RadioOption label={{ id: 'OppholdINorgeOgAdresserFaktaPanel.ResidingInNorway' }} value />
              <RadioOption
                label={
                  <FormattedMessage
                    id="OppholdINorgeOgAdresserFaktaPanel.NotResidingInNorway"
                    values={{
                      b: chunks => <b>{chunks}</b>,
                    }}
                  />
                }
                value={false}
              />
            </RadioGroupField>
          </div>
        )}
      </div>
    </HGrid>
  </FaktaGruppe>
);

OppholdINorgeOgAdresserFaktaPanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  hasBosattAksjonspunkt: PropTypes.bool.isRequired,
  isBosattAksjonspunktClosed: PropTypes.bool.isRequired,
  opphold: PropTypes.shape(),
  foreldre: PropTypes.arrayOf(PropTypes.shape()),
  alleKodeverk: PropTypes.shape().isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }).isRequired,
};

OppholdINorgeOgAdresserFaktaPanel.defaultProps = {
  opphold: {},
  foreldre: [],
};

const mapStateToProps = (state, ownProps) => {
  const { behandlingId, behandlingVersjon } = ownProps;
  const formName = `OppholdInntektOgPeriodeForm-${ownProps.id}`;
  return {
    opphold: behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'opphold'),
    foreldre: behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'foreldre'),
    hasBosattAksjonspunkt: behandlingFormValueSelector(
      formName,
      behandlingId,
      behandlingVersjon,
    )(state, 'hasBosattAksjonspunkt'),
    isBosattAksjonspunktClosed: behandlingFormValueSelector(
      formName,
      behandlingId,
      behandlingVersjon,
    )(state, 'isBosattAksjonspunktClosed'),
  };
};

const createParent = (isApplicant, personopplysning) => ({
  isApplicant,
  personopplysning,
});

OppholdINorgeOgAdresserFaktaPanel.buildInitialValues = (soknad, periode, aksjonspunkter) => {
  let opphold = {};

  if (soknad && soknad.oppgittTilknytning) {
    const { oppgittTilknytning } = soknad;
    opphold = {
      utlandsopphold: oppgittTilknytning.utlandsopphold,
    };
  }

  const { personopplysninger } = periode;
  const parents = [createParent(true, personopplysninger)];
  if (personopplysninger.annenPart) {
    parents.push(createParent(false, personopplysninger.annenPart));
  }

  const filteredAp = aksjonspunkter.filter(
    ap =>
      periode.aksjonspunkter.includes(aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT) ||
      (periode.aksjonspunkter.length > 0 &&
        periode.aksjonspunkter.includes(aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT) &&
        ap.definisjon === aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP),
  );

  return {
    opphold,
    hasBosattAksjonspunkt: filteredAp.length > 0,
    isBosattAksjonspunktClosed: filteredAp.some(ap => !isAksjonspunktOpen(ap.status)),
    foreldre: parents,
    bosattVurdering: periode.bosattVurdering || periode.bosattVurdering === false ? periode.bosattVurdering : undefined,
  };
};

OppholdINorgeOgAdresserFaktaPanel.transformValues = values => ({
  kode: aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT,
  bosattVurdering: values.bosattVurdering,
});

export default connect(mapStateToProps)(OppholdINorgeOgAdresserFaktaPanel);
