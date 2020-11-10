import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import PropTypes from 'prop-types';
import { InjectedFormProps } from 'redux-form';
import { Aksjonspunkt, Kodeverk } from '@k9-sak-web/types';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { getKodeverknavnFn, guid } from '@fpsak-frontend/utils';
import { getBehandlingFormPrefix, behandlingForm } from '@fpsak-frontend/form';
import { AksjonspunktHelpTextTemp, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { FormattedMessage } from 'react-intl';
import PeriodeTabell from './PeriodeTabell';

interface OwnProps {
  readOnly: boolean;
  readOnlySubmitButton: boolean;
  behandlingFormPrefix: string;
  submitting: boolean;
  aksjonspunkter: Aksjonspunkt[];
  behandlingId: number;
  behandlingVersjon: number;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  behandlingStatus: Kodeverk;
  vilkarForSykdomExists: boolean;
}

const FORM_NAME = 'TilkjentYtelseForm';

export const TilkjentYtelseForm: React.FC<OwnProps & InjectedFormProps> = ({
  readOnly,
  readOnlySubmitButton,
  aksjonspunkter,
  behandlingId,
  behandlingVersjon,
  alleKodeverk,
  ...formProps
}) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
  return (
    <>
      {aksjonspunkter.length > 0 && (
        <>
          <AksjonspunktHelpTextTemp isAksjonspunktOpen={!readOnlySubmitButton}>
            {[
              <FormattedMessage
                id="TilkjentYtelse.AksjonspunktHelpText"
                key={aksjonspunktCodes.MANUELL_TILKJENT_YTELSE}
              />,
            ]}
          </AksjonspunktHelpTextTemp>
          <VerticalSpacer twentyPx />
        </>
      )}

      <form onSubmit={formProps.handleSubmit}>
        {formProps.warning && <span>{formProps.warning}</span>}
        <PeriodeTabell
          // readOnlySubmitButton={readOnlySubmitButton}
          readOnly={readOnly}
          aksjonspunkter={aksjonspunkter}
          submitting={formProps.submitting}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          alleKodeverk={alleKodeverk}
          getKodeverknavn={getKodeverknavn}
        />
        {formProps.error && <span>{formProps.error}</span>}
      </form>
    </>
  );
};

TilkjentYtelseForm.propTypes = {
  readOnly: PropTypes.bool,
};

TilkjentYtelseForm.defaultProps = {
  readOnly: true,
};

interface PureOwnProps {
  beregningsresultat: any[];
  aksjonspunkter: Aksjonspunkt[];
  behandlingId: number;
  behandlingVersjon: number;
  submitCallback: (...args: any[]) => any;
}

const buildInitialValues = createSelector([(props: PureOwnProps) => props.beregningsresultat?.perioder], perioder => {
  if (perioder) {
    return {
      perioder: perioder.map((periode: any) => ({
        ...periode,
        id: guid(),
        openForm: false,
        // updated: false,
      })),
    };
  }

  return {
    perioder: [],
  };
});

export const transformValues = () => {
  return [
    {
      kode: aksjonspunktCodes.MANUELL_TILKJENT_YTELSE,
      perioder: [
        {
          andeler: [
            {
              erBrukerMottaker: true,
              aktivitetStatus: {
                kode: 'AT',
                kodeverk: 'AKTIVITET_STATUS',
                navn: 'Arbeidstaker',
              },
              inntektskategori: {
                kode: 'ARBEIDSTAKER',
                kodeverk: 'INNTEKTSKATEGORI',
                navn: 'Arbeidstaker',
              },
              aktørId: null,
              arbeidsforholdId: null,
              arbeidsgiver: {
                identifikator: '910909088',
                identifikatorGUI: '910909088',
                navn: 'BEDRIFT AS',
              },
              arbeidsforholdType: {
                kode: 'AT',
                kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
                navn: 'Arbeidstaker',
              },
              arbeidsgiverNavn: 'BEDRIFT AS',
              arbeidsgiverOrgnr: '910909088',
              eksternArbeidsforholdId: null,
              refusjon: 231,
              sisteUtbetalingsdato: '2020-05-21',
              stillingsprosent: 0,
              tilSoker: 0,
              utbetalingsgrad: 100,
              uttak: [
                {
                  periode: {
                    fom: '2020-04-27',
                    tom: '2020-05-01',
                  },
                  utbetalingsgrad: 100,
                  utfall: {
                    navn: 'Innvilget',
                    kode: 'INNVILGET',
                    kodeverk: 'UTTAK_UTFALL_TYPE',
                  },
                },
              ],
            },
          ],
          // dagsats: 231,
          fom: '2020-04-27',
          tom: '2020-05-01',
        },
      ],
      begrunnelse: '2345',
    },
  ];
};

const lagSubmitFn = createSelector(
  [(ownProps: PureOwnProps) => ownProps.submitCallback, buildInitialValues],
  submitCallback => () => submitCallback(transformValues()),
);

const mapStateToPropsFactory = (_initialState: any, props: PureOwnProps) => {
  const initialValues = buildInitialValues(props);
  const { behandlingId, behandlingVersjon } = props;

  // const validate = (values: any) => validateUttakForm(values, props.aksjonspunkter);
  // const warn = (values: any) => warningsUttakForm(values);

  return (_state, ownProps) => {
    const behandlingFormPrefix = getBehandlingFormPrefix(behandlingId, behandlingVersjon);
    return {
      initialValues,
      behandlingFormPrefix,
      // validate,
      // warn,
      onSubmit: lagSubmitFn(ownProps),
    };
  };
};

export default connect(mapStateToPropsFactory)(
  behandlingForm({
    form: FORM_NAME,
    enableReinitialize: true,
  })(TilkjentYtelseForm),
);
