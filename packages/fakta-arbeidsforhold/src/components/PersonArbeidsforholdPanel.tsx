import { behandlingFormValueSelector, getBehandlingFormPrefix } from '@fpsak-frontend/form';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import arbeidsforholdHandlingType from '@fpsak-frontend/kodeverk/src/arbeidsforholdHandlingType';
import { arbeidsforholdHarAksjonspunktÅrsak } from '@fpsak-frontend/utils/src/arbeidsforholdUtils';
import AksjonspunktIkon from '@k9-sak-web/gui/shared/aksjonspunkt-ikon/AksjonspunktIkon.js';
import FaktaGruppe from '@k9-sak-web/gui/shared/FaktaGruppe.js';
import { ArbeidsgiverOpplysningerPerId, KodeverkMedNavn } from '@k9-sak-web/types';
import ArbeidsforholdV2 from '@k9-sak-web/types/src/arbeidsforholdV2TsType';
import { BriefcaseIcon } from '@navikt/aksel-icons';
import { ExpansionCard, HStack, VStack } from '@navikt/ds-react';
import { Component } from 'react';
import { WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { change as reduxFormChange, initialize as reduxFormInitialize } from 'redux-form';
import { FormAction } from 'redux-form/lib/actions';
import arbeidsforholdKilder from '../kodeverk/arbeidsforholdKilder';
import { PERSON_ARBEIDSFORHOLD_DETAIL_FORM } from './arbeidsforholdDetaljer/PersonArbeidsforholdDetailForm';
import PersonArbeidsforholdTable from './arbeidsforholdTabell/PersonArbeidsforholdTable';
import styles from './personArbeidsforholdPanel.module.css';

// -------------------------------------------------------------------------------------------------------------
// Methods
// -------------------------------------------------------------------------------------------------------------

const cleanUpArbeidsforhold = (newValues, originalValues) => {
  if (newValues.handlingType.kode !== arbeidsforholdHandlingType.BRUK) {
    return {
      ...newValues,
      tomDato: originalValues.tomDato,
    };
  }
  return newValues;
};

interface PureOwnProps {
  behandlingId: number;
  behandlingVersjon: number;
  readOnly: boolean;
  harAksjonspunktAvklarArbeidsforhold: boolean;
  alleMerknaderFraBeslutter: { [key: string]: { notAccepted?: boolean } };
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
}

interface MappedOwnProps {
  arbeidsforhold: ArbeidsforholdV2[];
  behandlingFormPrefix: string;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
}

interface DispatchProps {
  reduxFormChange: (
    form: string,
    field: string,
    value: any,
    touch?: boolean,
    persistentSubmitErrors?: boolean,
  ) => FormAction;
  reduxFormInitialize: (form: string, data: any) => FormAction;
}

interface OwnState {
  selectedArbeidsforhold?: ArbeidsforholdV2;
  selectedArbeidsgiver?: string;
}

interface StaticFunctions {
  buildInitialValues?: (
    arbeidsforhold: ArbeidsforholdV2[],
    arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId,
  ) => {
    arbeidsforhold: ArbeidsforholdV2[];
  };
  isReadOnly?: (state: any, behandlingId: number, behandlingVersjon: number) => boolean;
}

type Props = PureOwnProps & MappedOwnProps & DispatchProps & StaticFunctions & WrappedComponentProps;

/**
 * PersonArbeidsforholdPanelImpl:
 * - Håndterer staten for children-components.
 * - Bygger initialValues til children-components ved hjelp av arbeidsforhold PropType. Verdiene
 * som har samme navn i GUI og PropTypen blir fylt inn 'automatisk', mens andre variabler som
 * ikke er med i PropTypen må håndteres f.eks. i UpdateArbeidsforhold metoden.
 */
export class PersonArbeidsforholdPanelImpl extends Component<Props, OwnState> {
  static buildInitialValues = (arbeidsforhold: ArbeidsforholdV2[]) => ({
    arbeidsforhold,
  });

  static isReadOnly = (state: any, behandlingId: number, behandlingVersjon: number): boolean => {
    const arbeidsforhold = behandlingFormValueSelector(
      'ArbeidsforholdInfoPanel',
      behandlingId,
      behandlingVersjon,
    )(state, 'arbeidsforhold');
    return !arbeidsforhold;
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      selectedArbeidsforhold: undefined,
      selectedArbeidsgiver: undefined,
    };
    this.setSelectedArbeidsforhold = this.setSelectedArbeidsforhold.bind(this);
    this.setSelectedArbeidsgiver = this.setSelectedArbeidsgiver.bind(this);
    this.updateArbeidsforhold = this.updateArbeidsforhold.bind(this);
    this.cancelArbeidsforhold = this.cancelArbeidsforhold.bind(this);
    this.initializeActivityForm = this.initializeActivityForm.bind(this);
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    const { arbeidsforhold } = this.props;
    const selected = arbeidsforhold || undefined;
    this.setSelectedArbeidsforhold(undefined, undefined, selected);
  }

  setSelectedArbeidsforhold(p, id, selectedArbeidsforhold) {
    this.setState({ selectedArbeidsforhold });
    this.initializeActivityForm(selectedArbeidsforhold);
  }

  setSelectedArbeidsgiver(selected?: string) {
    const { selectedArbeidsgiver } = this.state;

    if (selectedArbeidsgiver && selectedArbeidsgiver === selected) {
      this.setState({ selectedArbeidsgiver: undefined });
      return;
    }

    this.setState({ selectedArbeidsgiver: selected });
  }

  setFormField(fieldName, fieldValue) {
    const { behandlingFormPrefix, reduxFormChange: formChange } = this.props;
    formChange(`${behandlingFormPrefix}.${'ArbeidsforholdInfoPanel'}`, fieldName, fieldValue);
  }

  utledNøkkel = (a, arbeidsgiverOpplysningerPerId) =>
    arbeidsgiverOpplysningerPerId[a]
      ? arbeidsgiverOpplysningerPerId[a].navn + arbeidsgiverOpplysningerPerId[a].identifikator
      : a;

  initializeActivityForm(arbeidsforhold) {
    const { selectedArbeidsforhold } = this.state;
    if (selectedArbeidsforhold !== arbeidsforhold) {
      const { behandlingFormPrefix, reduxFormInitialize: formInitialize } = this.props;
      formInitialize(`${behandlingFormPrefix}.${PERSON_ARBEIDSFORHOLD_DETAIL_FORM}`, arbeidsforhold);
    }
  }

  updateArbeidsforhold(values) {
    const { selectedArbeidsforhold } = this.state;
    const { arbeidsforhold } = this.props;

    const handlingType = values.arbeidsforholdHandlingField;
    const lagtTilAvSaksbehandler = handlingType === arbeidsforholdHandlingType.BASERT_PÅ_INNTEKTSMELDING;

    if (lagtTilAvSaksbehandler) {
      if (!values.kilde.map(k => k.kode).includes(arbeidsforholdKilder.SAKSBEHANDLER)) {
        values.kilde.push({ kode: arbeidsforholdKilder.SAKSBEHANDLER });
      }
    }

    const arbeidsgiverNavn = values.navn;
    let stillingsprosent = 0;
    const perioder = [
      {
        fom: values.fomDato,
        tom: values.tomDato,
      },
    ];

    let newValues = {
      ...values,
      handlingType,
      stillingsprosent,
    };

    if (lagtTilAvSaksbehandler) {
      stillingsprosent = values.stillingsprosent;
      newValues = {
        ...values,
        handlingType,
        arbeidsgiverNavn,
        stillingsprosent,
        perioder,
      };
    }

    const cleanedValues = cleanUpArbeidsforhold(newValues, selectedArbeidsforhold);

    const other = arbeidsforhold.filter(o => o.id !== cleanedValues.id);
    this.setFormField(
      'arbeidsforhold',
      other.concat({
        ...cleanedValues,
      }),
    );

    this.setSelectedArbeidsforhold(undefined, undefined, selectedArbeidsforhold);
  }

  cancelArbeidsforhold() {
    this.setState({ selectedArbeidsforhold: undefined });
    this.initializeActivityForm({});
  }

  render() {
    const {
      intl,
      arbeidsgiverOpplysningerPerId,
      arbeidsforhold,
      alleMerknaderFraBeslutter,
      alleKodeverk,
      behandlingId,
      behandlingVersjon,
      harAksjonspunktAvklarArbeidsforhold,
    } = this.props;

    const { selectedArbeidsforhold, selectedArbeidsgiver } = this.state;
    const unikeArbeidsgivere = [...new Set(arbeidsforhold.map(af => af.arbeidsgiver.arbeidsgiverOrgnr))];

    return (
      <FaktaGruppe
        className={styles.container}
        merknaderFraBeslutter={alleMerknaderFraBeslutter[aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD]}
        withoutBorder
      >
        <VStack gap="space-20">
          {unikeArbeidsgivere.map(a => {
            const arbeidsforholdPerArbeidsgiver = arbeidsforhold.filter(af => af.arbeidsgiver.arbeidsgiverOrgnr === a);

            const arbeidsgiverNavn =
              arbeidsgiverOpplysningerPerId && arbeidsgiverOpplysningerPerId[a]
                ? arbeidsgiverOpplysningerPerId[a].navn
                : `Ukjent arbeidsgivernavn(${a})`;
            const navn = `${arbeidsgiverNavn} (${arbeidsforholdPerArbeidsgiver.length} arbeidsforhold)`;
            const erValgt = selectedArbeidsgiver === a;

            const harAksjonspunktForArbeidsgiver =
              harAksjonspunktAvklarArbeidsforhold &&
              arbeidsforholdPerArbeidsgiver.some(arbeidsforholdHarAksjonspunktÅrsak);
            return (
              <ExpansionCard
                size="small"
                aria-label={navn}
                key={this.utledNøkkel(a, arbeidsgiverOpplysningerPerId)}
                open={erValgt}
                onToggle={() => this.setSelectedArbeidsgiver(a)}
              >
                <ExpansionCard.Header>
                  <HStack wrap={false} gap="space-16" align="center">
                    <BriefcaseIcon aria-hidden fontSize="2rem" />
                    <ExpansionCard.Title size="small">{navn}</ExpansionCard.Title>
                    {harAksjonspunktForArbeidsgiver && <AksjonspunktIkon size="large" />}
                  </HStack>
                </ExpansionCard.Header>
                <ExpansionCard.Content>
                  <PersonArbeidsforholdTable
                    intl={intl}
                    harAksjonspunktAvklarArbeidsforhold={harAksjonspunktAvklarArbeidsforhold}
                    selectedId={selectedArbeidsforhold ? selectedArbeidsforhold.id : undefined}
                    alleArbeidsforhold={arbeidsforholdPerArbeidsgiver}
                    alleKodeverk={alleKodeverk}
                    behandlingId={behandlingId}
                    behandlingVersjon={behandlingVersjon}
                    updateArbeidsforhold={this.updateArbeidsforhold}
                  />
                </ExpansionCard.Content>
              </ExpansionCard>
            );
          })}
        </VStack>
      </FaktaGruppe>
    );
  }
}

const FORM_NAVN = 'ArbeidsforholdInfoPanel';

const mapStateToProps = (state: any, ownProps: PureOwnProps): MappedOwnProps => {
  const arbeidsforhold = behandlingFormValueSelector(
    FORM_NAVN,
    ownProps.behandlingId,
    ownProps.behandlingVersjon,
  )(state, 'arbeidsforhold');
  return {
    arbeidsforhold,
    arbeidsgiverOpplysningerPerId: ownProps.arbeidsgiverOpplysningerPerId,
    behandlingFormPrefix: getBehandlingFormPrefix(ownProps.behandlingId, ownProps.behandlingVersjon),
  };
};
const mapDispatchToProps = (dispatch: Dispatch) => ({
  ...bindActionCreators(
    {
      reduxFormChange,
      reduxFormInitialize,
    },
    dispatch,
  ),
});
const PersonArbeidsforholdPanel = connect(mapStateToProps, mapDispatchToProps)(PersonArbeidsforholdPanelImpl);

export default PersonArbeidsforholdPanel;
