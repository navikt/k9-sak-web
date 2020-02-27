import { getBehandlingFormPrefix } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { change as reduxFormChange, initialize as reduxFormInitialize } from 'redux-form';
import { getBehandlingIsRevurdering } from '../selectors/uttakSelectors';


/**
 * Uttak
 * Presentationskomponent. Masserer data og populerer felten samt formatterar tidslinjen for uttak
 */

export class UttakImpl extends Component {
  constructor(props) {
    super(props);
    this.isConfirmButtonDisabled = this.isConfirmButtonDisabled.bind(this);
    this.isReadOnly = this.isReadOnly.bind(this);
    // this.onToggleOverstyring = this.onToggleOverstyring.bind(this);
    this.skalViseCheckbox = this.skalViseCheckbox.bind(this);
    this.testForReadOnly = this.testForReadOnly.bind(this);

    this.state = {
      selectedItem: null,
    };
  }

  // onToggleOverstyring() {
  //   const { selectedItem } = this.state;
  //   const { uttakPerioder } = this.props;
  //   if (!selectedItem) {
  //     this.setState({
  //       selectedItem: uttakPerioder[0],
  //     });
  //   }
  // }


  testForReadOnly(aksjonspunkter, kanOverstyre) {
    const { manuellOverstyring } = this.props;
    const kunOverStyrAp = aksjonspunkter.length === 1
      && aksjonspunkter[0].definisjon.kode === aksjonspunktCodes.OVERSTYRING_AV_UTTAKPERIODER
      && aksjonspunkter[0].status.kode === 'OPPR';
    if (kunOverStyrAp && kanOverstyre) {
      return !kunOverStyrAp;
    }

    const activeUttakAp = aksjonspunkter.filter((ap) => ap.definisjon.kode !== aksjonspunktCodes.OVERSTYRING_AV_UTTAKPERIODER);
    return (activeUttakAp.length < 1 || (activeUttakAp[0].toTrinnsBehandlingGodkjent === true && activeUttakAp[0].status.kode === 'UTFO'))
      && !manuellOverstyring;
  }


  isConfirmButtonDisabled() {
    const {
    readOnly, submitting, isDirty,
    } = this.props;



    if (this.ikkeGyldigForbruk()) {
      return true;
    }


    if (!isDirty) {
      return true;
    }
    return submitting || readOnly;
  }

  isReadOnly() {
    const {
      readOnly, aksjonspunkter, endringsdato, isRevurdering, kanOverstyre,
    } = this.props;
    const { selectedItem } = this.state;
    const uttakIsReadOnly = this.testForReadOnly(aksjonspunkter, kanOverstyre) || (endringsdato && isRevurdering && selectedItem.tom < endringsdato);
    return readOnly || uttakIsReadOnly;
  }

  skalViseCheckbox() {
    const { aksjonspunkter } = this.props;
    const kunOverStyrAp = aksjonspunkter.length === 1
      && aksjonspunkter[0].definisjon.kode === aksjonspunktCodes.OVERSTYRING_AV_UTTAKPERIODER
      && aksjonspunkter[0].status.kode === 'OPPR';
    const apUtenOverstyre = aksjonspunkter.filter((a) => a.definisjon.kode !== aksjonspunktCodes.OVERSTYRING_AV_UTTAKPERIODER);
    return apUtenOverstyre.length > 0 || kunOverStyrAp;
  }

  render() {

    return (
      <div>
       <h2>Legg uttak her, Anders</h2>
      </div>
    );
  }
}

UttakImpl.propTypes = {
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()),
  // behandlingFormPrefix: PropTypes.string.isRequired,
  // behandlingId: PropTypes.number.isRequired,
  // behandlingVersjon: PropTypes.number.isRequired,
  endringsdato: PropTypes.string.isRequired,
  // formName: PropTypes.string.isRequired,
  // isApOpen: PropTypes.bool,
  isDirty: PropTypes.bool.isRequired,
  isRevurdering: PropTypes.bool,
  kanOverstyre: PropTypes.bool,
  manuellOverstyring: PropTypes.bool,
  // person: PropTypes.shape(),
  readOnly: PropTypes.bool.isRequired,
  // reduxFormChange: PropTypes.func.isRequired,
  // reduxFormInitialize: PropTypes.func.isRequired,
  // saksnummer: PropTypes.string.isRequired,
  submitting: PropTypes.bool.isRequired,
  // alleKodeverk: PropTypes.shape().isRequired,
  // behandlingsresultat: PropTypes.shape().isRequired,
};

UttakImpl.defaultProps = {
  aksjonspunkter: [],
  // isApOpen: false,
  isRevurdering: false,
  kanOverstyre: undefined,
  manuellOverstyring: false,
  // person: undefined,
};

const determineMottatDato = (soknadsDato, mottatDato) => {
  if (moment(mottatDato) < moment(soknadsDato)) {
    return mottatDato;
  }
  return soknadsDato;
};

const mapStateToProps = (state, props) => {
  const {
    person,
    mottattDato,
    behandlingId,
    behandlingVersjon,
    fagsak,
    employeeHasAccess,
  } = props;
  // hvis ukjent annenpart og annenpart uttak, vis ukjent ikon


  /*
  @TODO clean up interface
  const personer = [person];
  if (viseUttakMedsoker && person && person.annenPart) {
    personer.push(person.annenPart.navBrukerKjonn);
  }
  */
  return {
    behandlingFormPrefix: getBehandlingFormPrefix(behandlingId, behandlingVersjon),
    isRevurdering: getBehandlingIsRevurdering(props),
    kanOverstyre: employeeHasAccess,
    person,
    saksnummer: fagsak.saksnummer,
    // TODO: FIXME
    soknadDate: determineMottatDato(mottattDato),

  };
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    reduxFormChange,
    reduxFormInitialize,
  }, dispatch),
});

const Uttak = connect(mapStateToProps, mapDispatchToProps)(injectIntl(UttakImpl));
export default Uttak;
