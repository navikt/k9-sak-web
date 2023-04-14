import React, { useEffect } from 'react';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import classNames from 'classnames';
import { Hovedknapp } from 'nav-frontend-knapper';

import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import {
  ArbeidsgiverOpplysningerPerId,
  Brevmal,
  Brevmaler,
  FeatureToggles,
  Kodeverk,
  KodeverkMedNavn,
  Mottaker,
  Personopplysninger,
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
import { behandlingForm, behandlingFormValueSelector, SelectField, TextAreaField } from '@fpsak-frontend/form';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import InputField from '@fpsak-frontend/form/src/InputField';
import { Fritekstbrev } from '@k9-sak-web/types/src/formidlingTsType';
import styles from './messages.less';

const maxLength4000 = maxLength(4000);
const maxLength100000 = maxLength(100000);
const maxLength200 = maxLength(200);
const minLength3 = minLength(3);

export type FormValues = {
  overstyrtMottaker: string;
  brevmalkode: string;
  fritekst: string;
  fritekstbrev: Fritekstbrev;
  arsakskode?: string;
};

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
  previewCallback: (
    overstyrtMottaker: Mottaker,
    brevmalkode: string,
    fritekst: string,
    fritekstbrev?: Fritekstbrev,
  ) => void;
  templates: Brevmaler | Brevmal[];
  sprakKode?: Kodeverk;
  revurderingVarslingArsak: KodeverkMedNavn[];
  isKontrollerRevurderingApOpen?: boolean;
  personopplysninger?: Personopplysninger;
  arbeidsgiverOpplysningerPerId?: ArbeidsgiverOpplysningerPerId;
  featureToggles?: FeatureToggles;
}

interface MappedOwnProps {
  causes: KodeverkMedNavn[];
  overstyrtMottaker?: string;
  brevmalkode?: string;
  fritekst?: string;
  arsakskode?: string;
  fritekstbrev?: Fritekstbrev;
}

const formName = 'Messages';
const RECIPIENT = { id: 'Bruker', type: '' };

const createValidateRecipient = recipients => value =>
  value === JSON.stringify(RECIPIENT) ||
  (Array.isArray(recipients) && recipients.some(recipient => JSON.stringify(recipient) === value))
    ? undefined
    : [{ id: 'ValidationMessage.InvalidRecipient' }];

const transformTemplates = templates =>
  templates && typeof templates === 'object' && !Array.isArray(templates)
    ? Object.keys(templates).map(key => ({ ...templates[key], kode: key }))
    : templates;

/**
 * Messages
 *
 * Presentasjonskomponent. Gir mulighet for å forhåndsvise og sende brev. Mottaker og brevtype velges fra predefinerte lister,
 * og fritekst som skal flettes inn i brevet skrives inn i et eget felt.
 */
export const MessagesImpl = ({
  intl,
  templates,
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
  fritekstbrev,
  featureToggles,
  ...formProps
}: PureOwnProps & MappedOwnProps & WrappedComponentProps & InjectedFormProps) => {
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
      fritekstbrev,
    );
  };

  const languageCode = getLanguageCodeFromSprakkode(sprakKode);

  const recipients: Mottaker[] =
    templates && brevmalkode && templates[brevmalkode] && Array.isArray(templates[brevmalkode].mottakere)
      ? templates[brevmalkode].mottakere.filter(mottaker =>
          featureToggles.SKJUL_AVSLUTTET_ARBEIDSGIVER ? !mottaker.harVarsel : true,
        )
      : [];

  const tmpls: Brevmal[] = transformTemplates(templates);

  useEffect(() => {
    // Tilbakestill valgt mottaker hvis brukeren skifter mal og valgt mottakere ikke er tilgjengelig på ny mal.
    if (brevmalkode) {
      formProps.change(
        'overstyrtMottaker',
        recipients.some(recipient => JSON.stringify(recipient) === overstyrtMottaker)
          ? overstyrtMottaker
          : JSON.stringify(recipients[0]),
      );
    }
  }, [brevmalkode]);

  return (
    <form onSubmit={handleSubmit} data-testid="MessagesForm">
      {Array.isArray(tmpls) && tmpls.length ? (
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
          {brevmalkode === dokumentMalType.REVURDERING_DOK && (
            <>
              <VerticalSpacer eightPx />
              <SelectField
                name="arsakskode"
                label={intl.formatMessage({ id: 'Messages.Årsak' })}
                validate={[required]}
                placeholder={intl.formatMessage({ id: 'Messages.VelgÅrsak' })}
                selectValues={(causes || []).map(cause => (
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
                  label={intl.formatMessage({ id: 'Messages.Fritekst' })}
                  validate={[required, maxLength4000, minLength3, hasValidText]}
                  maxLength={4000}
                  badges={[{ type: 'fokus', textId: languageCode, title: 'Messages.Beskrivelse' }]}
                />
              </div>
            </>
          )}
          {brevmalkode === dokumentMalType.GENERELT_FRITEKSTBREV && (
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

const buildInitalValues = (templates: Brevmaler | Brevmal[], isKontrollerRevurderingApOpen?: boolean): FormValues => {
  let brevmalkode = Array.isArray(templates) ? templates[0].kode : null;
  let overstyrtMottaker = JSON.stringify(RECIPIENT);

  if (templates && typeof templates === 'object' && !Array.isArray(templates)) {
    [brevmalkode] = Object.keys(templates);
    overstyrtMottaker =
      templates[brevmalkode] && templates[brevmalkode].mottakere && Array.isArray(templates[brevmalkode].mottakere)
        ? JSON.stringify(templates[brevmalkode].mottakere[0])
        : null;
  }

  const initialValues = {
    brevmalkode,
    overstyrtMottaker,
    // overstyrtMottaker: null,
    fritekst: null,
    fritekstbrev: null,
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
      'fritekstbrev.overskrift',
      'fritekstbrev.brødtekst',
    ),
    causes: getfilteredCauses(ownProps),
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
