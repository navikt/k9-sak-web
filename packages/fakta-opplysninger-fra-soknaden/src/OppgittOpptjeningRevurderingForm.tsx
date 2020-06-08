import { Behandling, SubmitCallback } from '@k9-sak-web/types';
import * as React from 'react';
import { useIntl } from 'react-intl';
import OpplysningerFraSøknaden from '@k9-sak-web/types/src/opplysningerFraSoknaden';
import { TabsPure } from 'nav-frontend-tabs';
import { FieldArray, InjectedFormProps } from 'redux-form';
import { Knapp } from 'nav-frontend-knapper';
import TextAreaField from '@fpsak-frontend/form/src/TextAreaField';
import { connect } from 'react-redux';
import { behandlingForm } from '@fpsak-frontend/form/src/behandlingForm';
import { hasValidText, maxLength, minLength, required, hasValidInteger, hasValidDate } from '@fpsak-frontend/utils';
import classNames from 'classnames';
import InputField from '@fpsak-frontend/form/src/InputField';
import { Label } from '@fpsak-frontend/form/src/Label';
import { DatepickerField } from '@fpsak-frontend/form';
import SøknadFormValue from './types/OpplysningerFraSoknadenTypes';
import styles from './opplysningerFraSoknadenForm.less';
import SøknadsperiodeFieldArrayComponent from './SøknadsperiodeFieldArrayComponent';

interface Props {
  readOnly: boolean;
  behandling: Behandling;
  submitCallback: (props: SubmitCallback[]) => void;
  submittable: boolean;
  harApneAksjonspunkter: boolean;
  kanEndrePåSøknadsopplysninger: boolean;
  oppgittOpptjening: OpplysningerFraSøknaden;
}

const OppgittOpptjeningRevurderingForm = (props: Props & InjectedFormProps) => {
  const [activeTab, setActiveTab] = React.useState(0);
  const [formIsEditable, setFormIsEditable] = React.useState(false);
  const intl = useIntl();

  const {
    behandling: { id: behandlingId, versjon: behandlingVersjon },
    harApneAksjonspunkter,
    kanEndrePåSøknadsopplysninger,
    oppgittOpptjening,
    submitCallback,
    submittable,
    handleSubmit,
  } = props;

  return (
    <form onSubmit={handleSubmit}>
      {kanEndrePåSøknadsopplysninger && (
        <Knapp
          className={styles.formUnlockButton}
          type="hoved"
          htmlType="button"
          onClick={() => setFormIsEditable(!formIsEditable)}
        >
          {formIsEditable ? 'Lås opp skjema' : 'Lås skjema'}
        </Knapp>
      )}
      <TabsPure
        tabs={data.søknader.map((currentOppgittOpptjening, currentOppgittOpptjeningIndex) => ({
          aktiv: activeTab === currentOppgittOpptjeningIndex,
          label: `Søknadsperiode ${currentOppgittOpptjeningIndex + 1}`,
        }))}
        onChange={(e, clickedIndex) => setActiveTab(clickedIndex)}
      />
      <FieldArray
        component={SøknadsperiodeFieldArrayComponent}
        props={{
          søknad: data.søknader[activeTab],
          formIsEditable,
          kanEndrePåSøknadsopplysninger,
          behandlingId,
          behandlingVersjon,
        }}
      />
      <div className={styles.fieldContainer}>
        <InputField
          name={SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2019}
          bredde="S"
          label={{ id: 'OpplysningerFraSoknaden.Inntekt2019' }}
          validate={[hasValidInteger]}
          readOnly={formIsEditable}
        />
      </div>
      <div className={styles.fieldContainer}>
        <InputField
          name={SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2020}
          bredde="S"
          label={{ id: 'OpplysningerFraSoknaden.Inntekt2020' }}
          validate={[hasValidInteger]}
          readOnly={formIsEditable}
        />
      </div>
      <div className={styles.nyoppstartetContainer}>
        <DatepickerField
          name={SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_NYOPPSTARTET_DATO}
          validate={[hasValidDate]}
          defaultValue={null}
          readOnly={formIsEditable}
          label={<Label input={{ id: 'OpplysningerFraSoknaden.NyoppstartetDato', args: {} }} intl={intl} />}
        />
      </div>
      {!formIsEditable && (
        <div className={classNames('begrunnelseContainer')}>
          <TextAreaField
            name={SøknadFormValue.BEGRUNNELSE}
            label={{ id: 'OpplysningerFraSoknaden.Begrunnelse' }}
            validate={[required, minLength(3), maxLength(2000), hasValidText]}
            readOnly={formIsEditable}
            aria-label={intl.formatMessage({
              id: 'OpplysningerFraSoknaden.Begrunnelse',
            })}
          />
        </div>
      )}
      {kanEndrePåSøknadsopplysninger && !formIsEditable && (
        <>
          <Knapp htmlType="submit" type="hoved">
            Bekreft og fortsett
          </Knapp>
          <Knapp
            onClick={() => {
              // eslint-disable-next-line no-self-assign
              window.location = window.location;
            }}
            htmlType="button"
            style={{ marginLeft: '8px', marginTop: '2px' }}
          >
            Tilbakestill skjema (OBS! Relaster siden)
          </Knapp>
        </>
      )}
    </form>
  );
};

export const oppgittOpptjeningRevurderingFormFormName = 'OpplysningerFraSoknadenForm';
const connectedComponent = connect(
  () => {},
  () => {},
)(
  behandlingForm({
    form: oppgittOpptjeningRevurderingFormFormName,
  })(OppgittOpptjeningRevurderingForm),
);

export default connectedComponent;
