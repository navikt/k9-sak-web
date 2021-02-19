import React, { FunctionComponent, useEffect } from 'react';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import classNames from 'classnames';
import { Hovedknapp } from 'nav-frontend-knapper';

import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import {
  KodeverkMedNavn,
  Kodeverk,
  Personopplysninger,
  ArbeidsgiverOpplysningerPerId,
  Brevmaler,
  Mottaker,
} from '@k9-sak-web/types';
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
import ugunstAarsakTyper from '@fpsak-frontend/kodeverk/src/ugunstAarsakTyper';
import { SelectField, TextAreaField, behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/form';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import styles from './messages.less';

const maxLength4000 = maxLength(4000);
const minLength3 = minLength(3);

export type FormValues = {
  overstyrtMottaker: string;
  brevmalkode: string;
  fritekst: string;
  arsakskode?: string;
};

export type Template = {
  kode: string;
  navn: string;
  tilgjengelig: boolean;
};

const getFritekstMessage = (brevmalkode?: string): string =>
  brevmalkode === dokumentMalType.INNHENT_DOK ? 'Messages.DocumentList' : 'Messages.Fritekst';

// TODO (TOR) Bør erstattast av ein markør fra backend
const showFritekst = (brevmalkode?: string, arsakskode?: string): boolean =>
  brevmalkode === dokumentMalType.INNHENT_DOK ||
  brevmalkode === dokumentMalType.KORRIGVARS ||
  brevmalkode === dokumentMalType.FRITKS ||
  brevmalkode === dokumentMalType.VARSEL_OM_TILBAKEKREVING ||
  (brevmalkode === dokumentMalType.REVURDERING_DOK && arsakskode === ugunstAarsakTyper.ANNET);

interface PureOwnProps {
  submitCallback: (values: FormValues) => void;
  behandlingId: number;
  behandlingVersjon: number;
  previewCallback: (overstyrtMottaker: Mottaker, brevmalkode: string, fritekst: string, arsakskode?: string) => void;
  templates: Template[] | Brevmaler;
  sprakKode?: Kodeverk;
  revurderingVarslingArsak: KodeverkMedNavn[];
  isKontrollerRevurderingApOpen?: boolean;
  personopplysninger?: Personopplysninger;
  arbeidsgiverOpplysningerPerId?: ArbeidsgiverOpplysningerPerId;
}

interface MappedOwnProps {
  causes: KodeverkMedNavn[];
  overstyrtMottaker?: string;
  brevmalkode?: string;
  fritekst?: string;
  arsakskode?: string;
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
export const MessagesImpl: FunctionComponent<
  PureOwnProps & MappedOwnProps & WrappedComponentProps & InjectedFormProps
> = ({
  intl,
  templates = [],
  causes = [],
  previewCallback,
  handleSubmit,
  sprakKode,
  overstyrtMottaker,
  brevmalkode,
  fritekst,
  arsakskode,
  personopplysninger,
  arbeidsgiverOpplysningerPerId,
  ...formProps
}) => {
  if (!sprakKode) {
    return null;
  }

  const previewMessage = e => {
    e.preventDefault();

    previewCallback(
      overstyrtMottaker && overstyrtMottaker !== JSON.stringify(RECIPIENT)
        ? safeJSONParse(overstyrtMottaker)
        : undefined,
      brevmalkode,
      fritekst,
    );
  };

  const languageCode = getLanguageCodeFromSprakkode(sprakKode);

  let recipients: Mottaker[] = [RECIPIENT];
  let tmpls: Template[] = Array.isArray(templates) ? templates : [];

  // TODO: Dette er bare en midlertidig løsning for å være kompatibel med ny/gammel struktur.
  // komponentene burde oppdateres for å bedre håndtere ny struktur når den er tatt i bruk overallt.
  if (templates && typeof templates === 'object' && !Array.isArray(templates)) {
    tmpls = Object.keys(templates).map(key => ({ navn: templates[key].navn, kode: key, tilgjengelig: true }));
    recipients =
      brevmalkode && templates[brevmalkode] && Array.isArray(templates[brevmalkode].mottakere)
        ? templates[brevmalkode].mottakere
        : [];
  }

  useEffect(() => {
    // Tilbakestill valgt mottaker hvis brukeren skifter mal og valgt mottakere ikke er tilgjengelig på ny mal.
    if (brevmalkode) {
      formProps.change(
        'overstyrtMottaker',
        Array.isArray(recipients) && recipients.some(recipient => JSON.stringify(recipient) === overstyrtMottaker)
          ? overstyrtMottaker
          : JSON.stringify(recipients[0]),
      );
    }
  }, [brevmalkode]);

  return (
    <form onSubmit={handleSubmit}>
      {Array.isArray(tmpls) && tmpls.length ? (
        <>
          <SelectField
            name="brevmalkode"
            readOnly={tmpls.length === 1 && brevmalkode && brevmalkode === tmpls[0].kode}
            label={intl.formatMessage({ id: 'Messages.Template' })}
            validate={[required]}
            placeholder={intl.formatMessage({ id: 'Messages.ChooseTemplate' })}
            selectValues={(tmpls || []).map(template => (
              <option key={template.kode} value={template.kode} disabled={!template.tilgjengelig}>
                {template.navn}
              </option>
            ))}
            bredde="xxl"
          />
          {Array.isArray(recipients) && recipients.length && (
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
          {brevmalkode === dokumentMalType.REVURDERING_DOK && (
            <>
              <VerticalSpacer eightPx />
              <SelectField
                name="arsakskode"
                label={intl.formatMessage({ id: 'Messages.Årsak' })}
                validate={[required]}
                placeholder={intl.formatMessage({ id: 'Messages.VelgÅrsak' })}
                selectValues={causes.map(cause => (
                  <option key={cause.kode} value={cause.kode}>
                    {cause.navn}
                  </option>
                ))}
                bredde="xxl"
              />
            </>
          )}
          {showFritekst(brevmalkode, arsakskode) && (
            <>
              <VerticalSpacer eightPx />
              <div className="input--xxl">
                <TextAreaField
                  name="fritekst"
                  label={intl.formatMessage({ id: getFritekstMessage(brevmalkode) })}
                  validate={[required, maxLength4000, minLength3, hasValidText]}
                  maxLength={4000}
                  badges={[{ type: 'fokus', textId: languageCode, title: 'Messages.Beskrivelse' }]}
                />
              </div>
            </>
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

const buildInitalValues = (templates: Template[] | Brevmaler, isKontrollerRevurderingApOpen?: boolean): FormValues => {
  let brevmal = Array.isArray(templates) && templates.length ? templates[0] : { kode: null };
  let overstyrtMottaker = JSON.stringify(RECIPIENT);

  // TODO: Dette er bare en midlertidig løsning for å være kompatibel med ny/gammel struktur.
  // komponentene burde oppdateres for å bedre håndtere ny struktur når den er tatt i bruk overallt.
  if (templates && typeof templates === 'object' && !Array.isArray(templates)) {
    brevmal = { kode: Object.keys(templates)[0] };
    overstyrtMottaker =
      templates[brevmal.kode].mottakere && templates[brevmal.kode].mottakere[0]
        ? JSON.stringify(templates[brevmal.kode].mottakere[0])
        : null;
  }

  const initialValues = {
    brevmalkode: brevmal && brevmal.kode ? brevmal.kode : null,
    overstyrtMottaker,
    // overstyrtMottaker: null,
    fritekst: '',
    // arsakskode: null,
  };

  return isKontrollerRevurderingApOpen
    ? { ...initialValues, brevmalkode: dokumentMalType.REVURDERING_DOK }
    : { ...initialValues };
};

const transformValues = values => {
  const newValues = values;
  if (values.brevmalkode === dokumentMalType.REVURDERING_DOK && newValues.arsakskode !== ugunstAarsakTyper.ANNET) {
    newValues.fritekst = ' ';
  }
  const overstyrtMottaker =
    newValues.overstyrtMottaker && newValues.overstyrtMottaker !== JSON.stringify(RECIPIENT)
      ? safeJSONParse(newValues.overstyrtMottaker)
      : undefined;
  return { ...newValues, overstyrtMottaker };
};
const getfilteredCauses = createSelector([(ownProps: PureOwnProps) => ownProps.revurderingVarslingArsak], causes =>
  causes.filter(cause => cause.kode !== ugunstAarsakTyper.BARN_IKKE_REGISTRERT_FOLKEREGISTER),
);

const mapStateToPropsFactory = (_initialState, initialOwnProps: PureOwnProps) => {
  const onSubmit = (values: FormValues) => initialOwnProps.submitCallback(transformValues(values));
  return (state, ownProps: PureOwnProps): MappedOwnProps => ({
    ...behandlingFormValueSelector(formName, ownProps.behandlingId, ownProps.behandlingVersjon)(
      state,
      'overstyrtMottaker',
      'brevmalkode',
      'fritekst',
      'arsakskode',
    ),
    causes: getfilteredCauses(ownProps),
    initialValues: buildInitalValues(ownProps.templates, ownProps.isKontrollerRevurderingApOpen),
    onSubmit,
  });
};

const Messages = connect(mapStateToPropsFactory)(
  injectIntl(
    behandlingForm({
      form: formName,
    })(MessagesImpl),
  ),
);

export default Messages;
