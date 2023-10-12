import classNames from 'classnames';
import { Hovedknapp } from 'nav-frontend-knapper';
import React, { useEffect } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';

import { behandlingForm, behandlingFormValueSelector, SelectField, TextAreaField } from '@fpsak-frontend/form';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import {
  ariaCheck,
  getLanguageCodeFromSprakkode,
  hasValidText,
  maxLength,
  minLength,
  required,
  safeJSONParse,
} from '@fpsak-frontend/utils';
import { lagVisningsnavnForMottaker } from '@fpsak-frontend/utils/src/formidlingUtils';
import {
  ArbeidsgiverOpplysningerPerId,
  Brevmal,
  Brevmaler,
  Kodeverk,
  KodeverkMedNavn,
  Mottaker,
  Personopplysninger,
} from '@k9-sak-web/types';

import InputField from '@fpsak-frontend/form/src/InputField';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import { Fritekstbrev } from '@k9-sak-web/types/src/formidlingTsType';
import { MessagesApiKeys, requestMessagesApi, restApiMessagesHooks } from '../data/messagesApi';
import styles from './messages.module.css';

const maxLength4000 = maxLength(4000);
const maxLength100000 = maxLength(100000);
const maxLength200 = maxLength(200);
const minLength3 = minLength(3);

export type FormValues = {
  overstyrtMottaker: string;
  brevmalkode: string;
  fritekst: string;
  fritekstbrev: Fritekstbrev;
};

interface PureOwnProps {
  submitCallback: (values: FormValues) => void;
  behandlingId: number;
  behandlingVersjon: number;
  previewCallback: (
    overstyrtMottaker: Mottaker,
    brevmalkode: string,
    fritekst: string,
    fritekstbrev?: Fritekstbrev,
  ) => void;
  templates?: Brevmaler;
  sprakKode?: Kodeverk;
  revurderingVarslingArsak: KodeverkMedNavn[];
  isKontrollerRevurderingApOpen?: boolean;
  personopplysninger?: Personopplysninger;
  arbeidsgiverOpplysningerPerId?: ArbeidsgiverOpplysningerPerId;
}

interface MappedOwnProps {
  overstyrtMottaker?: string;
  brevmalkode?: string;
  fritekst?: string;
  fritekstbrev?: Fritekstbrev;
  fritekstforslag?: string;
}

const formName = 'Messages';
const RECIPIENT = { id: 'Bruker', type: '' };

const createValidateRecipient = recipients => value =>
  value === JSON.stringify(RECIPIENT) ||
  (Array.isArray(recipients) && recipients.some(recipient => JSON.stringify(recipient) === value))
    ? undefined
    : [{ id: 'ValidationMessage.InvalidRecipient' }];

/**
 * Messages
 *
 * Presentasjonskomponent. Gir mulighet for å forhåndsvise og sende brev. Mottaker og brevtype velges fra predefinerte lister,
 * og fritekst som skal flettes inn i brevet skrives inn i et eget felt.
 */
export const MessagesImpl = ({
  intl,
  templates,
  previewCallback,
  handleSubmit,
  sprakKode,
  overstyrtMottaker,
  brevmalkode,
  fritekst,
  fritekstforslag,
  personopplysninger,
  arbeidsgiverOpplysningerPerId,
  fritekstbrev,
  ...formProps
}: PureOwnProps & MappedOwnProps & WrappedComponentProps & InjectedFormProps) => {
  if (!sprakKode) {
    return null;
  }
  if (!templates) {
    return null;
  }

  const { addErrorMessage } = useRestApiErrorDispatcher();
  requestMessagesApi.setAddErrorMessageHandler(addErrorMessage);

  const previewMessage = e => {
    e.preventDefault();

    previewCallback(
      overstyrtMottaker && overstyrtMottaker !== JSON.stringify(RECIPIENT)
        ? safeJSONParse(overstyrtMottaker)
        : undefined,
      brevmalkode,
      fritekst,
      fritekstbrev,
    );
  };

  const languageCode = getLanguageCodeFromSprakkode(sprakKode);

  const valgtBrevmal = templates[brevmalkode];

  const recipients: Mottaker[] = templates[brevmalkode]?.mottakere ?? [];

  const tmpls: Brevmal[] = Object.keys(templates).map(key => ({ ...templates[key], kode: key }));

  const { startRequest: hentPreutfylteMaler, data: fritekstforslagTyper } = restApiMessagesHooks.useRestApiRunner<
    { tittel: string; fritekst: string }[]
  >(MessagesApiKeys.HENT_PREUTFYLTE_FRITEKSTMALER);

  useEffect(() => {
    if (brevmalkode) {
      // Resetter fritekst hver gang bruker endrer brevmalskode
      formProps.change('fritekst', null);
      formProps.change('fritekstbrev.overskrift', null);
      formProps.change('fritekstbrev.brødtekst', null);

      // Tilbakestill valgt mottaker hvis brukeren skifter mal og valgt mottakere ikke er tilgjengelig på ny mal.
      formProps.change(
        'overstyrtMottaker',
        recipients.some(recipient => JSON.stringify(recipient) === overstyrtMottaker)
          ? overstyrtMottaker
          : JSON.stringify(recipients[0]),
      );

      if (valgtBrevmal.linker.length > 0) {
        requestMessagesApi.setLinks(valgtBrevmal.linker);
        hentPreutfylteMaler()
          .then(_fritekstForslagTyper => {
            const felter = _fritekstForslagTyper.find(alt => fritekstforslag === alt.tittel);

            if (felter) {
              formProps.change('fritekst', felter.fritekst);
            }
            // Catch er tom fordi error message skal håndteres av requestMessagesApi.
          })
          .catch(() => {});
      }
    }
  }, [brevmalkode, fritekstforslag]);

  return (
    <form onSubmit={handleSubmit} data-testid="MessagesForm">
      {tmpls.length ? (
        <>
          <SelectField
            name="brevmalkode"
            readOnly={tmpls.length === 1 && brevmalkode && brevmalkode === tmpls[0].kode}
            label={intl.formatMessage({ id: 'Messages.Template' })}
            validate={[required]}
            placeholder={intl.formatMessage({ id: 'Messages.ChooseTemplate' })}
            selectValues={tmpls.map(template => (
              <option key={template.kode} value={template.kode} disabled={template.tilgjengelig === false}>
                {template.navn}
              </option>
            ))}
            bredde="xxl"
          />
          {valgtBrevmal?.linker.length > 0 && fritekstforslagTyper && (
            <>
              <VerticalSpacer eightPx />
              <SelectField
                name="fritekstforslag"
                label={intl.formatMessage({ id: 'Messages.TypeAvDokumentasjon' })}
                validate={[]}
                placeholder={intl.formatMessage({ id: 'Messages.VelgTypeAvDokumentasjon' })}
                selectValues={fritekstforslagTyper.map(alternativ => (
                  <option key={alternativ.tittel} value={alternativ.tittel}>
                    {alternativ.tittel}
                  </option>
                ))}
                bredde="xxl"
              />
            </>
          )}
          {recipients.length > 0 && (
            <>
              <VerticalSpacer eightPx />
              <SelectField
                key={brevmalkode}
                name="overstyrtMottaker"
                readOnly={
                  recipients.length === 1 && overstyrtMottaker && overstyrtMottaker === JSON.stringify(recipients[0])
                }
                label={intl.formatMessage({ id: 'Messages.Recipient' })}
                validate={[/* required, */ createValidateRecipient(recipients)]}
                placeholder={intl.formatMessage({ id: 'Messages.ChooseRecipient' })}
                selectValues={recipients.map(recipient => (
                  <option key={recipient.id} value={JSON.stringify(recipient)}>
                    {lagVisningsnavnForMottaker(recipient.id, personopplysninger, arbeidsgiverOpplysningerPerId)}
                  </option>
                ))}
                bredde="xxl"
              />
            </>
          )}
          {valgtBrevmal?.støtterFritekst && (
            <>
              <VerticalSpacer eightPx />
              <div className="input--xxl">
                <TextAreaField
                  name="fritekst"
                  label={intl.formatMessage({ id: 'Messages.Fritekst' })}
                  validate={[required, maxLength4000, minLength3, hasValidText]}
                  maxLength={4000}
                  badges={[{ type: 'fokus', textId: languageCode, title: 'Messages.Beskrivelse' }]}
                />
              </div>
            </>
          )}
          {valgtBrevmal?.støtterTittelOgFritekst && (
            <div className="input--xxl">
              <VerticalSpacer eightPx />
              <InputField
                name="fritekstbrev.overskrift"
                label={intl.formatMessage({ id: 'Messages.FritekstTittel' })}
                validate={[required, minLength3, maxLength200, hasValidText]}
                maxLength={200}
              />

              <VerticalSpacer eightPx />
              <TextAreaField
                name="fritekstbrev.brødtekst"
                label={intl.formatMessage({ id: 'Messages.Fritekst' })}
                validate={[required, minLength3, maxLength100000, hasValidText]}
                maxLength={100000}
                badges={[{ type: 'fokus', textId: languageCode, title: 'Messages.Beskrivelse' }]}
              />
            </div>
          )}
          <VerticalSpacer eightPx />
          <div className={styles.buttonRow}>
            <Hovedknapp mini spinner={formProps.submitting} disabled={formProps.submitting} onClick={ariaCheck}>
              {intl.formatMessage({ id: 'Messages.Submit' })}
            </Hovedknapp>
            {brevmalkode && (
              <a
                href=""
                onClick={previewMessage}
                onKeyDown={e => (e.keyCode === 13 ? previewMessage(e) : null)}
                className={classNames(styles.previewLink, 'lenke lenke--frittstaende')}
              >
                {intl.formatMessage({ id: 'Messages.Preview' })}
              </a>
            )}
          </div>
        </>
      ) : (
        <p>{intl.formatMessage({ id: 'Messages.SavnerMaler' })}</p>
      )}
    </form>
  );
};

const buildInitalValues = (templates?: Brevmaler, isKontrollerRevurderingApOpen?: boolean): FormValues => {
  const brevmalkode = templates ? Object.keys(templates)[0] : null;
  const overstyrtMottaker =
    templates && templates[brevmalkode] && templates[brevmalkode].mottakere
      ? JSON.stringify(templates[brevmalkode].mottakere[0])
      : null;

  const initialValues = {
    brevmalkode,
    overstyrtMottaker,
    fritekst: null,
    fritekstbrev: null,
  };

  return isKontrollerRevurderingApOpen
    ? { ...initialValues, brevmalkode: dokumentMalType.REVURDERING_DOK }
    : { ...initialValues };
};

const transformValues = (values: any) => {
  const newValues = values;

  if (values.brevmalkode !== dokumentMalType.GENERELT_FRITEKSTBREV && values.fritekstbrev) {
    newValues.fritekstbrev = undefined;
  }

  const overstyrtMottaker =
    newValues.overstyrtMottaker && newValues.overstyrtMottaker !== JSON.stringify(RECIPIENT)
      ? safeJSONParse(newValues.overstyrtMottaker)
      : undefined;
  return { ...newValues, overstyrtMottaker };
};

const mapStateToPropsFactory = (_initialState, initialOwnProps: PureOwnProps) => {
  const onSubmit = (values: FormValues) => initialOwnProps.submitCallback(transformValues(values));
  return (state, ownProps: PureOwnProps): MappedOwnProps => ({
    ...behandlingFormValueSelector(formName, ownProps.behandlingId, ownProps.behandlingVersjon)(
      state,
      'overstyrtMottaker',
      'fritekstforslag',
      'brevmalkode',
      'fritekst',
      'fritekstbrev.overskrift',
      'fritekstbrev.brødtekst',
    ),
    initialValues: buildInitalValues(ownProps.templates, ownProps.isKontrollerRevurderingApOpen),
    onSubmit,
  });
};

const Messages = connect(mapStateToPropsFactory)(
  behandlingForm({
    form: formName,
  })(injectIntl(MessagesImpl)),
);

export default Messages;
