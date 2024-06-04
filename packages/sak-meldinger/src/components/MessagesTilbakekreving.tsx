import classNames from 'classnames';
import React, { useEffect } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import { createSelector } from 'reselect';

import { behandlingForm, behandlingFormValueSelector, SelectField, TextAreaField } from '@fpsak-frontend/form';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import ugunstAarsakTyper from '@fpsak-frontend/kodeverk/src/ugunstAarsakTyper';
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
  Brevmaler,
  Kodeverk,
  KodeverkMedNavn,
  Personopplysninger,
} from '@k9-sak-web/types';

import InputField from '@fpsak-frontend/form/src/InputField';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import { Fritekstbrev } from '@k9-sak-web/types/src/formidlingTsType';
import { Button } from '@navikt/ds-react';
import type { MottakerDto } from '@navikt/k9-sak-typescript-client';
import type { Template } from '@k9-sak-web/backend/k9formidling/models/Template.js';
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
  arsakskode?: string;
};

// TODO (TOR) Bør erstattast av ein markør fra backend
const showFritekst = (brevmalkode?: string, arsakskode?: string): boolean =>
  brevmalkode === dokumentMalType.INNHENT_DOK ||
  brevmalkode === dokumentMalType.KORRIGVARS ||
  brevmalkode === dokumentMalType.FRITKS ||
  brevmalkode === dokumentMalType.VARSEL_OM_TILBAKEKREVING ||
  brevmalkode === dokumentMalType.INNHENT_MEDISINSKE_OPPLYSNINGER ||
  (brevmalkode === dokumentMalType.REVURDERING_DOK && arsakskode === ugunstAarsakTyper.ANNET);

interface PureOwnProps {
  submitCallback: (values: FormValues) => void;
  behandlingId: number;
  behandlingVersjon: number;
  previewCallback: (
    overstyrtMottaker: MottakerDto,
    brevmalkode: string,
    fritekst: string,
    fritekstbrev?: Fritekstbrev,
  ) => void;
  templates: Brevmaler | Template[];
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
  fritekstbrev?: Fritekstbrev;
  valgtMedisinType?: string;
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
export const MessagesTilbakekrevingImpl = ({
  intl,
  templates,
  causes = [],
  previewCallback,
  handleSubmit,
  sprakKode,
  overstyrtMottaker,
  brevmalkode,
  fritekst,
  valgtMedisinType,
  arsakskode,
  personopplysninger,
  arbeidsgiverOpplysningerPerId,
  fritekstbrev,
  ...formProps
}: PureOwnProps & MappedOwnProps & WrappedComponentProps & InjectedFormProps) => {
  if (!sprakKode) {
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

  const recipients: MottakerDto[] =
    templates && brevmalkode && templates[brevmalkode] && Array.isArray(templates[brevmalkode].mottakere)
      ? templates[brevmalkode].mottakere
      : [];

  const tmpls: Template[] = transformTemplates(templates);

  const { startRequest: hentFritekstMaler, data: fritekstMaler } = restApiMessagesHooks.useRestApiRunner<
    { tittel: string; fritekst: string }[]
  >(MessagesApiKeys.HENT_PREUTFYLTE_FRITEKSTMALER);

  const oppdaterAPILinkerForHentingAvMedisinskeTyper = () => {
    const urlsTilHentingAvMedisinskeTyper = tmpls.find(
      brevmal => brevmal.kode === dokumentMalType.INNHENT_MEDISINSKE_OPPLYSNINGER,
    )?.linker;

    if (urlsTilHentingAvMedisinskeTyper) {
      requestMessagesApi.setLinks(urlsTilHentingAvMedisinskeTyper);

      return true;
    }
    return false;
  };

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

      if (brevmalkode === dokumentMalType.INNHENT_MEDISINSKE_OPPLYSNINGER) {
        const erAPIOppdatertMedLinker = oppdaterAPILinkerForHentingAvMedisinskeTyper();

        if (!erAPIOppdatertMedLinker) return;

        hentFritekstMaler()
          .then(brevmalerForMedisinskeOpplysninger => {
            const fritekstBrevmal = brevmalerForMedisinskeOpplysninger.find(alt => valgtMedisinType === alt.tittel);

            if (fritekstBrevmal) {
              formProps.change('fritekst', fritekstBrevmal.fritekst);
            }
            // Catch er tom fordi error message skal håndteres av requestMessagesApi.
          })
          .catch(() => {});
      }
    }
  }, [brevmalkode, valgtMedisinType]);

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
              <option key={template.kode} value={template.kode}>
                {template.navn}
              </option>
            ))}
            bredde="xxl"
          />
          {brevmalkode === dokumentMalType.INNHENT_MEDISINSKE_OPPLYSNINGER &&
            fritekstMaler &&
            fritekstMaler.length > 0 && (
              <>
                <VerticalSpacer eightPx />
                <SelectField
                  name="valgtMedisinType"
                  label={intl.formatMessage({ id: 'Messages.TypeAvDokumentasjon' })}
                  validate={[]}
                  placeholder={intl.formatMessage({ id: 'Messages.VelgTypeAvDokumentasjon' })}
                  selectValues={fritekstMaler.map(alternativ => (
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
                  badges={[{ type: 'warning', textId: languageCode, title: 'Messages.Beskrivelse' }]}
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
                badges={[{ type: 'warning', textId: languageCode, title: 'Messages.Beskrivelse' }]}
              />
            </div>
          )}
          <VerticalSpacer eightPx />
          <div className={styles.buttonRow}>
            <Button
              variant="primary"
              size="small"
              loading={formProps.submitting}
              disabled={formProps.submitting}
              onClick={ariaCheck}
            >
              {intl.formatMessage({ id: 'Messages.Submit' })}
            </Button>
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

const buildInitalValues = (templates: Brevmaler | Template[], isKontrollerRevurderingApOpen?: boolean): FormValues => {
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

  if (values.brevmalkode !== dokumentMalType.GENERELT_FRITEKSTBREV && values.fritekstbrev) {
    newValues.fritekstbrev = undefined;
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
      'valgtMedisinType',
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

const MessagesTilbakekreving = connect(mapStateToPropsFactory)(
  behandlingForm({
    form: formName,
  })(injectIntl(MessagesTilbakekrevingImpl)),
);

export default MessagesTilbakekreving;
