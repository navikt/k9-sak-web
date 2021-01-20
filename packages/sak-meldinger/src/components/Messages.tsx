import React, { FunctionComponent } from 'react';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import classNames from 'classnames';
import { Hovedknapp } from 'nav-frontend-knapper';

import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import { KodeverkMedNavn, Kodeverk, ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';
import {
  ariaCheck,
  getLanguageCodeFromSprakkode,
  hasValidText,
  maxLength,
  minLength,
  required,
} from '@fpsak-frontend/utils';
import ugunstAarsakTyper from '@fpsak-frontend/kodeverk/src/ugunstAarsakTyper';
import { SelectField, TextAreaField, behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/form';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import styles from './messages.less';

const maxLength4000 = maxLength(4000);
const minLength3 = minLength(3);

export type FormValues = {
  mottaker: string;
  brevmalkode: string;
  fritekst: string;
  arsakskode?: string;
};

export type Template = {
  kode: string;
  navn: string;
  tilgjengelig: boolean;
};

export type Mottaker = {
  id: string;
  type: string;
};

export interface Brevmaler {
  [index: string]: {
    navn: string;
    mottakere: Mottaker[];
  };
}

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
  previewCallback: (mottaker: string, brevmalkode: string, fritekst: string, arsakskode: string) => void;
  templates: Template[] | Brevmaler;
  sprakKode?: Kodeverk;
  revurderingVarslingArsak: KodeverkMedNavn[];
  isKontrollerRevurderingApOpen?: boolean;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
}

interface MappedOwnProps {
  causes: KodeverkMedNavn[];
  mottaker?: string;
  brevmalkode?: string;
  fritekst?: string;
  arsakskode?: string;
}

const RECIPIENTS = ['Bruker'];

function lagVisningsNavnForMottaker(mottaker, arbeidsgiverOpplysningerPerId) {
  if (
    arbeidsgiverOpplysningerPerId &&
    arbeidsgiverOpplysningerPerId[mottaker] &&
    arbeidsgiverOpplysningerPerId[mottaker].navn
  ) {
    return `${arbeidsgiverOpplysningerPerId[mottaker].navn} (${mottaker})`;
  }

  if (/^(\d).*$/.test(mottaker)) {
    return `Bruker (${mottaker})`;
  }

  return mottaker;
}

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
  mottaker,
  brevmalkode,
  fritekst,
  arsakskode,
  arbeidsgiverOpplysningerPerId,
  ...formProps
}) => {
  if (!sprakKode) {
    return null;
  }

  const previewMessage = e => {
    if (formProps.valid || formProps.pristine) {
      previewCallback(mottaker, brevmalkode, fritekst, arsakskode);
    } else {
      // TODO Fungerar dette? Typescript seier at submit ikkje ligg i formProps
      // @ts-ignore
      formProps.submit();
    }
    e.preventDefault();
  };

  const languageCode = getLanguageCodeFromSprakkode(sprakKode);

  let recipients: string[] = RECIPIENTS;
  let tmpls: Template[] = Array.isArray(templates) ? templates : [];

  // TODO: Dette er bare en midlertidig løsning for å være kompatibel med ny/gammel struktur.
  // komponentene burde oppdateres for å bedre håndtere ny struktur når den er tatt i bruk overallt.
  if (!Array.isArray(templates) && typeof templates === 'object') {
    tmpls = Object.keys(templates).map(key => ({ navn: templates[key].navn, kode: key, tilgjengelig: true }));
    recipients =
      brevmalkode && templates[brevmalkode] && templates[brevmalkode].mottakere
        ? templates[brevmalkode].mottakere.map(m => m.id)
        : [];
  }

  return (
    <form onSubmit={handleSubmit}>
      <SelectField
        name="brevmalkode"
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
      {brevmalkode && (
        <>
          <VerticalSpacer eightPx />
          <SelectField
            name="mottaker"
            label={intl.formatMessage({ id: 'Messages.Recipient' })}
            validate={[required]}
            placeholder={intl.formatMessage({ id: 'Messages.ChooseRecipient' })}
            selectValues={(recipients || []).map(recipient => (
              <option key={recipient} value={recipient}>
                {lagVisningsNavnForMottaker(recipient, arbeidsgiverOpplysningerPerId)}
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
        {(tmpls || []).length > 0 && (
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
    </form>
  );
};

const formName = 'Messages';

const buildInitalValues = (templates: Template[] | Brevmaler, isKontrollerRevurderingApOpen?: boolean): FormValues => {
  // let firstTemplate = templates && Array.isArray(templates) ? templates[0] : {};

  // if (!Array.isArray(templates) && typeof templates === 'object') {
  //   firstTemplate = Object.keys(templates).map(key => ({ navn: templates[key].navn, kode: key, tilgjengelig: true }))[0];
  // }

  const initialValues = {
    // brevmalkode: firstTemplate.kode || null,
    brevmalkode: null,
    mottaker: null,
    fritekst: '',
    aarsakskode: null,
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
  return newValues;
};
const getfilteredCauses = createSelector([(ownProps: PureOwnProps) => ownProps.revurderingVarslingArsak], causes =>
  causes.filter(cause => cause.kode !== ugunstAarsakTyper.BARN_IKKE_REGISTRERT_FOLKEREGISTER),
);

const mapStateToPropsFactory = (_initialState, initialOwnProps: PureOwnProps) => {
  const onSubmit = (values: FormValues) => initialOwnProps.submitCallback(transformValues(values));
  return (state, ownProps: PureOwnProps): MappedOwnProps => ({
    ...behandlingFormValueSelector(formName, ownProps.behandlingId, ownProps.behandlingVersjon)(
      state,
      'mottaker',
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
