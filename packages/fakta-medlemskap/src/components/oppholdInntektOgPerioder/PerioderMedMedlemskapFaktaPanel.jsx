import { RadioGroupField, RadioOption, behandlingFormValueSelector } from '@fpsak-frontend/form';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import {
  DateLabel,
  FaktaGruppe,
  FlexColumn,
  FlexContainer,
  FlexRow,
  PeriodLabel,
  VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { DDMMYYYY_DATE_FORMAT, required } from '@fpsak-frontend/utils';
import { BodyShort, Table } from '@navikt/ds-react';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

const headerTextCodes = [
  'PerioderMedMedlemskapFaktaPanel.Period',
  'PerioderMedMedlemskapFaktaPanel.Coverage',
  'PerioderMedMedlemskapFaktaPanel.Status',
  'PerioderMedMedlemskapFaktaPanel.Date',
];

/**
 * PerioderMedMedlemskapFaktaPanel
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for avklaring av perioder (Medlemskapsvilkåret).
 */
export const PerioderMedMedlemskapFaktaPanel = ({
  readOnly,
  hasPeriodeAksjonspunkt,
  isPeriodAksjonspunktClosed,
  fixedMedlemskapPerioder,
  fodselsdato,
  vurderingTypes,
  alleMerknaderFraBeslutter,
}) => {
  if (!fixedMedlemskapPerioder || fixedMedlemskapPerioder.length === 0) {
    return (
      <FaktaGruppe titleCode="PerioderMedMedlemskapFaktaPanel.ApplicationInformation">
        <BodyShort size="small">
          <FormattedMessage id="PerioderMedMedlemskapFaktaPanel.NoInformation" />
        </BodyShort>
      </FaktaGruppe>
    );
  }

  return (
    <FaktaGruppe
      aksjonspunktCode={aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE}
      titleCode="PerioderMedMedlemskapFaktaPanel.ApplicationInformation"
      merknaderFraBeslutter={alleMerknaderFraBeslutter[aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE]}
    >
      <Table>
        <Table.Header>
          <Table.Row>
            {headerTextCodes.map(text => (
              <Table.HeaderCell scope="col" key={text}>
                {text}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {fixedMedlemskapPerioder.map(periode => {
            const key = periode.fom + periode.tom + periode.dekning + periode.status + periode.beslutningsdato;
            return (
              <Table.Row key={key} id={key}>
                <Table.DataCell>
                  <PeriodLabel showTodayString dateStringFom={periode.fom} dateStringTom={periode.tom} />
                </Table.DataCell>
                <Table.DataCell>{periode.dekning}</Table.DataCell>
                <Table.DataCell>{periode.status}</Table.DataCell>
                <Table.DataCell>
                  {periode.beslutningsdato ? <DateLabel dateString={periode.beslutningsdato} /> : null}
                </Table.DataCell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
      <FlexContainer>
        {hasPeriodeAksjonspunkt && (
          <FlexRow>
            <FlexColumn>
              <RadioGroupField
                name="medlemskapManuellVurderingType.kode"
                validate={[required]}
                readOnly={readOnly}
                isEdited={isPeriodAksjonspunktClosed}
              >
                {vurderingTypes.map(type => (
                  <RadioOption key={type.kode} value={type.kode} label={type.navn} />
                ))}
              </RadioGroupField>
            </FlexColumn>
          </FlexRow>
        )}
        <VerticalSpacer sixteenPx />
        <FlexRow className="justifyItemsToFlexEnd">
          <FlexColumn>
            {fodselsdato && (
              <FormattedMessage
                id="PerioderMedMedlemskapFaktaPanel.Fodselsdato"
                values={{ dato: moment(fodselsdato).format(DDMMYYYY_DATE_FORMAT) }}
              />
            )}
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
    </FaktaGruppe>
  );
};

PerioderMedMedlemskapFaktaPanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  fixedMedlemskapPerioder: PropTypes.arrayOf(PropTypes.shape()),
  fodselsdato: PropTypes.string,
  vurderingTypes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  hasPeriodeAksjonspunkt: PropTypes.bool.isRequired,
  isPeriodAksjonspunktClosed: PropTypes.bool.isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }).isRequired,
};

PerioderMedMedlemskapFaktaPanel.defaultProps = {
  fodselsdato: undefined,
  fixedMedlemskapPerioder: [],
};

export const getAksjonspunkter = createSelector([ownProps => ownProps.alleKodeverk], alleKodeverk => {
  const vurderingTypes = alleKodeverk[kodeverkTyper.MEDLEMSKAP_MANUELL_VURDERING_TYPE];
  return vurderingTypes.sort((a, b) => {
    const kodeA = a.kode;
    const kodeB = b.kode;
    if (kodeA < kodeB) {
      return -1;
    }
    if (kodeA > kodeB) {
      return 1;
    }

    return 0;
  });
});

const mapStateToProps = (state, ownProps) => ({
  ...behandlingFormValueSelector(
    `OppholdInntektOgPeriodeForm-${ownProps.id}`,
    ownProps.behandlingId,
    ownProps.behandlingVersjon,
  )(state, 'fixedMedlemskapPerioder', 'fodselsdato', 'hasPeriodeAksjonspunkt', 'isPeriodAksjonspunktClosed'),
  vurderingTypes: getAksjonspunkter(ownProps),
});

PerioderMedMedlemskapFaktaPanel.buildInitialValues = (
  periode,
  medlemskapPerioder,
  soknad,
  aksjonspunkter,
  getKodeverknavn,
) => {
  if (medlemskapPerioder === null) {
    return [];
  }

  const fixedMedlemskapPerioder = medlemskapPerioder
    .map(i => ({
      fom: i.fom,
      tom: i.tom,
      dekning: i.dekningType ? getKodeverknavn(i.dekningType) : '',
      status: getKodeverknavn(i.medlemskapType),
      beslutningsdato: i.beslutningsdato,
    }))
    .sort((p1, p2) => new Date(p1.fom).getTime() - new Date(p2.fom).getTime());
  const filteredAp = aksjonspunkter.filter(
    ap =>
      periode.aksjonspunkter.includes(ap.definisjon.kode) ||
      (periode.aksjonspunkter.length > 0 &&
        periode.aksjonspunkter.includes(aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE) &&
        ap.definisjon.kode === aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP),
  );

  return {
    fixedMedlemskapPerioder,
    medlemskapManuellVurderingType: periode.medlemskapManuellVurderingType,
    fodselsdato: soknad && soknad.fodselsdatoer ? Object.values(soknad.fodselsdatoer)[0] : undefined,
    hasPeriodeAksjonspunkt: filteredAp.length > 0,
    isPeriodAksjonspunktClosed: filteredAp.some(ap => !isAksjonspunktOpen(ap.status.kode)),
  };
};

PerioderMedMedlemskapFaktaPanel.transformValues = (values, manuellVurderingTyper) => ({
  kode: aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE,
  medlemskapManuellVurderingType: manuellVurderingTyper.find(
    m => m.kode === values.medlemskapManuellVurderingType.kode,
  ),
});

export default connect(mapStateToProps)(PerioderMedMedlemskapFaktaPanel);
