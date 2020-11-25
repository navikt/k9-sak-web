import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { change as reduxFormChange, FieldArray, getFormInitialValues, reset as reduxFormReset } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { bindActionCreators } from 'redux';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { KodeverkMedNavn, Arbeidsforhold, Vilkar } from '@k9-sak-web/types';
import { getBehandlingFormPrefix, behandlingFormValueSelector } from '@fpsak-frontend/form';
import uttakPeriodeVurdering from '@fpsak-frontend/kodeverk/src/uttakPeriodeVurdering';
import { ariaCheck } from '@fpsak-frontend/utils';
import {
  // AksjonspunktHelpText,
  FlexColumn,
  FlexContainer,
  FlexRow,
  VerticalSpacer,
} from '@fpsak-frontend/shared-components';

import PeriodeRad from './PeriodeRad';
import SlettPeriodeModal from './SlettPeriodeModal';
import NyPeriode from './NyPeriode';

const createNewPerioder = (perioder, id: string, values: any) => {
  const updatedIndex = perioder.findIndex(p => p.id === id);
  const updatedPeriode = perioder.find(p => p.id === id);

  return [
    ...perioder.slice(0, updatedIndex),
    {
      ...updatedPeriode,
      ...values,
    },
    ...perioder.slice(updatedIndex + 1),
  ];
};

interface OwnProps {
  readOnly: boolean;
  behandlingFormPrefix: string;
  perioder?: any[];
  openForms: boolean;
  reduxFormChange: (...args: any[]) => any;
  reduxFormReset: (...args: any[]) => any;
  submitting: boolean;
  initialValues: {
    perioder?: any[];
  };
  behandlingId: number;
  behandlingVersjon: number;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  slettedePerioder?: any[];
  arbeidsforhold?: Arbeidsforhold[];
  vilkar: Vilkar[];
}

interface OwnState {
  isNyPeriodeFormOpen: boolean;
  showModalSlettPeriode: boolean;
  periodeSlett: any;
}

export class PeriodeTabell extends PureComponent<OwnProps, OwnState> {
  nyPeriodeFormRef: any;

  constructor(props: OwnProps) {
    super(props);

    this.state = {
      isNyPeriodeFormOpen: false,
      showModalSlettPeriode: false,
      periodeSlett: undefined,
    };

    this.newPeriodeCallback = this.newPeriodeCallback.bind(this);
    this.newArbeidsforholdCallback = this.newArbeidsforholdCallback.bind(this);
    this.addNewPeriod = this.addNewPeriod.bind(this);
    this.openSlettPeriodeModalCallback = this.openSlettPeriodeModalCallback.bind(this);
    this.newPeriodeResetCallback = this.newPeriodeResetCallback.bind(this);
    this.removePeriode = this.removePeriode.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.cleaningUpForm = this.cleaningUpForm.bind(this);
    this.updatePeriode = this.updatePeriode.bind(this);
    this.editPeriode = this.editPeriode.bind(this);
    this.cancelEditPeriode = this.cancelEditPeriode.bind(this);
    this.isAnyFormOpen = this.isAnyFormOpen.bind(this);
  }

  overrideResultat = (resultat: any) => {
    if (
      [uttakPeriodeVurdering.PERIODE_KAN_IKKE_AVKLARES, uttakPeriodeVurdering.PERIODE_OK].some(
        type => type === resultat,
      )
    ) {
      return resultat;
    }
    return uttakPeriodeVurdering.PERIODE_IKKE_VURDERT;
  };

  newPeriodeResetCallback() {
    const { behandlingFormPrefix, reduxFormReset: formReset } = this.props;
    const { isNyPeriodeFormOpen } = this.state;
    formReset(`${behandlingFormPrefix}.nyPeriodeForm`);
    this.setState({ isNyPeriodeFormOpen: !isNyPeriodeFormOpen });
  }

  newPeriodeCallback(nyPeriode: any) {
    const { behandlingFormPrefix, perioder, reduxFormChange: formChange } = this.props;
    const { isNyPeriodeFormOpen } = this.state;

    const newPerioder = perioder.concat(nyPeriode).sort((a: any, b: any) => a.fom.localeCompare(b.fom));

    formChange(`${behandlingFormPrefix}.TilkjentYtelseForm`, 'perioder', newPerioder);

    this.setState({
      isNyPeriodeFormOpen: !isNyPeriodeFormOpen,
    });
  }

  newArbeidsforholdCallback(nyArbeidsforhold: any) {
    const { behandlingFormPrefix, arbeidsforhold, reduxFormChange: formChange, reduxFormReset: formReset } = this.props;

    const newArbeidsforhold = arbeidsforhold.concat(nyArbeidsforhold);

    formChange(`${behandlingFormPrefix}.TilkjentYtelseForm`, 'arbeidsforhold', newArbeidsforhold);
    formReset(`${behandlingFormPrefix}.nyttArbeidsforholdForm`);
  }

  openSlettPeriodeModalCallback(id: string) {
    const { showModalSlettPeriode } = this.state;
    const { perioder } = this.props;
    const periodeSlett = perioder.filter((periode: any) => periode.id === id);

    this.setState({
      showModalSlettPeriode: !showModalSlettPeriode,
      periodeSlett: periodeSlett[0],
    });
  }

  removePeriode(values: any) {
    const { behandlingFormPrefix, perioder, slettedePerioder, initialValues, reduxFormChange: formChange } = this.props;
    const { periodeSlett } = this.state;

    const hasOriginalPeriode = initialValues.perioder.find((p: any) => p.id === periodeSlett.id);

    if (hasOriginalPeriode) {
      formChange(
        `${behandlingFormPrefix}.TilkjentYtelseForm`,
        'slettedePerioder',
        slettedePerioder.concat([
          {
            ...periodeSlett,
            begrunnelse: values.begrunnelse,
          },
        ]),
      );
    }

    const newPerioder = perioder.filter((periode: any) => periode.id !== periodeSlett.id);

    formChange(`${behandlingFormPrefix}.TilkjentYtelseForm`, 'perioder', newPerioder);

    this.hideModal();
  }

  hideModal() {
    this.setState({
      showModalSlettPeriode: false,
    });
  }

  cleaningUpForm(id: string) {
    const { behandlingFormPrefix, perioder, reduxFormChange: formChange } = this.props;

    formChange(
      `${behandlingFormPrefix}.TilkjentYtelseForm`,
      'perioder',
      perioder
        .map((periode: any) => {
          if (periode.id === id) {
            return {
              ...periode,
              begrunnelse: undefined,
              resultat: undefined,
            };
          }
          return { ...periode };
        })
        .sort((a: any, b: any) => a.fom.localeCompare(b.fom)),
    );
  }

  editPeriode(id: string) {
    const { perioder, behandlingFormPrefix, reduxFormChange: formChange } = this.props;

    const newPerioder = createNewPerioder(perioder, id, { openForm: true });

    formChange(`${behandlingFormPrefix}.TilkjentYtelseForm`, 'perioder', newPerioder);
  }

  cancelEditPeriode(id: string) {
    const { perioder, behandlingFormPrefix, reduxFormChange: formChange } = this.props;

    const newPerioder = createNewPerioder(perioder, id, { openForm: false });

    formChange(`${behandlingFormPrefix}.TilkjentYtelseForm`, 'perioder', newPerioder);
  }

  async updatePeriode(values: any) {
    const { behandlingFormPrefix, perioder, reduxFormChange: formChange } = this.props;
    const { id, nyFom, nyTom } = values;
    const updatedPeriode = perioder.find((p: any) => p.id === id);
    const tom = nyTom || updatedPeriode.tom;
    const fom = nyFom || updatedPeriode.fom;
    const newPeriodeObject = {
      id,
      tom,
      fom,
      begrunnelse: values.begrunnelse,
      openForm: !updatedPeriode.openForm,
      isFromSøknad: updatedPeriode.isFromSøknad,
      updated: true,
    };

    const newPerioder = await createNewPerioder(perioder, id, newPeriodeObject);

    await formChange(
      `${behandlingFormPrefix}.TilkjentYtelseForm`,
      'perioder',
      newPerioder.sort((a, b) => a.fom.localeCompare(b.fom)),
    );
  }

  isAnyFormOpen() {
    const { perioder } = this.props;

    return perioder.some((p: any) => p.openForm);
  }

  addNewPeriod() {
    this.newPeriodeResetCallback();
  }

  disableButtons() {
    const { readOnly, openForms, submitting } = this.props;
    const { isNyPeriodeFormOpen } = this.state;
    return submitting || openForms || isNyPeriodeFormOpen || readOnly;
  }

  render() {
    const {
      readOnly,
      perioder,
      arbeidsforhold,
      submitting,
      behandlingId,
      behandlingVersjon,
      alleKodeverk,
      vilkar,
    } = this.props;
    const { periodeSlett, isNyPeriodeFormOpen, showModalSlettPeriode } = this.state;

    return (
      <>
        <VerticalSpacer twentyPx />
        <FieldArray
          name="perioder"
          // @ts-ignore
          component={PeriodeRad}
          openSlettPeriodeModalCallback={this.openSlettPeriodeModalCallback}
          updatePeriode={this.updatePeriode}
          editPeriode={this.editPeriode}
          cleaningUpForm={this.cleaningUpForm}
          cancelEditPeriode={this.cancelEditPeriode}
          isAnyFormOpen={this.isAnyFormOpen}
          isNyPeriodeFormOpen={isNyPeriodeFormOpen}
          perioder={perioder}
          readOnly={readOnly}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          alleKodeverk={alleKodeverk}
        />
        <VerticalSpacer twentyPx />
        <FlexContainer wrap>
          <FlexRow>
            <FlexColumn>
              <Hovedknapp mini disabled={this.disableButtons()} onClick={ariaCheck} spinner={submitting}>
                <FormattedMessage id="TilkjentYtelse.BekreftOgFortsett" />
              </Hovedknapp>
            </FlexColumn>
            <FlexColumn>
              <Knapp mini htmlType="button" onClick={this.addNewPeriod} disabled={this.disableButtons()}>
                <FormattedMessage id="TilkjentYtelse.LeggTilPeriode" />
              </Knapp>
            </FlexColumn>
          </FlexRow>
        </FlexContainer>
        <VerticalSpacer eightPx />

        {isNyPeriodeFormOpen && (
          <NyPeriode
            newPeriodeCallback={this.newPeriodeCallback}
            newArbeidsforholdCallback={this.newArbeidsforholdCallback}
            newPeriodeResetCallback={this.newPeriodeResetCallback}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            alleKodeverk={alleKodeverk}
            // @ts-ignore
            arbeidsforhold={arbeidsforhold}
            readOnly={readOnly}
            vilkar={vilkar}
          />
        )}

        {periodeSlett && (
          <SlettPeriodeModal
            // @ts-ignore
            showModal={showModalSlettPeriode}
            periode={periodeSlett}
            cancelEvent={this.hideModal}
            closeEvent={this.removePeriode}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
          />
        )}
      </>
    );
  }
}

const slettedePerioder = (state: any, behandlingId: number, behandlingVersjon: number) =>
  behandlingFormValueSelector('TilkjentYtelseForm', behandlingId, behandlingVersjon)(state, 'slettedePerioder');
const perioder = (state: any, behandlingId: number, behandlingVersjon: number) =>
  behandlingFormValueSelector('TilkjentYtelseForm', behandlingId, behandlingVersjon)(state, 'perioder');
const arbeidsforhold = (state: any, behandlingId: number, behandlingVersjon: number) =>
  behandlingFormValueSelector('TilkjentYtelseForm', behandlingId, behandlingVersjon)(state, 'arbeidsforhold');

interface PureOwnProps {
  behandlingId: number;
  behandlingVersjon: number;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
}

const EMPTY_ARRAY = [];

const mapStateToProps = (state: any, props: PureOwnProps) => {
  const { behandlingId, behandlingVersjon } = props;
  const behandlingFormPrefix = getBehandlingFormPrefix(behandlingId, behandlingVersjon);

  return {
    behandlingFormPrefix,
    openForms: !!perioder(state, behandlingId, behandlingVersjon).find(periode => periode.openForm === true),
    initialValues: getFormInitialValues(`${behandlingFormPrefix}.TilkjentYtelseForm`)(state),
    slettedePerioder: slettedePerioder(state, behandlingId, behandlingVersjon) || EMPTY_ARRAY,
    perioder: perioder(state, behandlingId, behandlingVersjon) || EMPTY_ARRAY,
    arbeidsforhold: arbeidsforhold(state, behandlingId, behandlingVersjon) || EMPTY_ARRAY,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  ...bindActionCreators(
    {
      reduxFormChange,
      reduxFormReset,
    },
    dispatch,
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(PeriodeTabell);
