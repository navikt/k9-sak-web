import classNames from 'classnames';
import { Hovedknapp } from 'nav-frontend-knapper';
import React, { useEffect, useState } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';

import {
  behandlingForm,
  behandlingFormValueSelector,
  SelectField,
  TextAreaField,
  Label,
} from '@fpsak-frontend/form';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import {
  ariaCheck,
  getLanguageCodeFromSprakkode,
  hasValidText,
  maxLength,
  minLength,
  required,
} from '@fpsak-frontend/utils';
import { lagVisningsnavnForMottaker } from '@fpsak-frontend/utils/src/formidlingUtils';
import {
  ArbeidsgiverOpplysningerPerId,
  Brevmal,
  Brevmaler, EregOrganizationLookupResponse,
  Kodeverk,
  KodeverkMedNavn,
  Mottaker,
  Personopplysninger,
} from '@k9-sak-web/types';

import InputField from '@fpsak-frontend/form/src/InputField';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import { Fritekstbrev } from '@k9-sak-web/types/src/formidlingTsType';
import { Checkbox } from "nav-frontend-skjema";
import { Normaltekst } from "nav-frontend-typografi";
import { MessagesApiKeys, requestMessagesApi, restApiMessagesHooks } from '../data/messagesApi';
import styles from './messages.module.css';
import OrgnrInputField from "./OrgnrInputField";

const maxLength4000 = maxLength(4000);
const maxLength100000 = maxLength(100000);
const maxLength200 = maxLength(200);
const minLength3 = minLength(3);

export type FormValues = {
  overstyrtMottaker: string;
  tredjepartsmottakerOrgnr?: string;
  brevmalkode: string;
  fritekst: string;
  fritekstbrev: Fritekstbrev;
};

export interface BackendApi {
  getBrevMottakerinfoEreg(orgnr: string): Promise<EregOrganizationLookupResponse>;
}

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
  readonly backendApi: BackendApi;
}

interface MappedOwnProps {
  overstyrtMottaker?: string;
  tredjepartsmottakerOrgnr?: string;
  brevmalkode?: string;
  fritekst?: string;
  fritekstbrev?: Fritekstbrev;
  fritekstforslag?: string;
}

const formName = 'Messages';
const RECIPIENT: Mottaker = { id: 'Bruker', type: '' };

const createValidateRecipient = recipients => value =>
  value === JSON.stringify(RECIPIENT) ||
  (Array.isArray(recipients) && recipients.some(recipient => JSON.stringify(recipient) === value))
    ? undefined
    : [{ id: 'ValidationMessage.InvalidRecipient' }];

const createTredjepartsmottaker = (orgnr: string): Mottaker => ({
  id: orgnr,
  type: "ORGNR",
})

const resolveOverstyrtMottaker = (
  overstyrtMottaker: string,
  recipients: Mottaker[],
  visTredjepartsmottaker: boolean,
  tredjepartsmottakerOrgnr: string | undefined
): Mottaker | undefined => {
  // Viss sending til tredjepartsmottaker er valgt skal tredjepartsmottakerOrgnr brukast (viss gyldig)
  if (visTredjepartsmottaker && typeof tredjepartsmottakerOrgnr === "string" && tredjepartsmottakerOrgnr.length === 9) {
    return createTredjepartsmottaker(tredjepartsmottakerOrgnr);
  }
  if (recipients.some(recipient => JSON.stringify(recipient) === overstyrtMottaker)) {
      return JSON.parse(overstyrtMottaker)
  }
  return recipients?.[0]
}

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
  tredjepartsmottakerOrgnr,
  brevmalkode,
  fritekst,
  fritekstforslag,
  personopplysninger,
  arbeidsgiverOpplysningerPerId,
  fritekstbrev,
  backendApi,
  ...formProps
}: PureOwnProps & MappedOwnProps & WrappedComponentProps & InjectedFormProps) => {
  const [visTredjepartsmottakerInput, setVisTredjepartsmottakerInput] = useState(false)
  const [tredjepartsmottakerInfo, setTredjepartsmottakerInfo] = useState<EregOrganizationLookupResponse>({})
  if (!sprakKode) {
    return null;
  }
  if (!templates) {
    return null;
  }

  const { addErrorMessage } = useRestApiErrorDispatcher();
  requestMessagesApi.setAddErrorMessageHandler(addErrorMessage);

  const languageCode = getLanguageCodeFromSprakkode(sprakKode);

  const valgtBrevmal = templates[brevmalkode];

  const recipients: Mottaker[] = templates[brevmalkode]?.mottakere ?? [];

  const tmpls: Brevmal[] = Object.keys(templates).map(key => ({ ...templates[key], kode: key }));

  const previewMessage = e => {
    e?.preventDefault();

    previewCallback(
      resolveOverstyrtMottaker(overstyrtMottaker, recipients, visTredjepartsmottakerInput, tredjepartsmottakerOrgnr),
      brevmalkode,
      fritekst,
      fritekstbrev,
    );
  };


  useEffect(() => {
    if(!valgtBrevmal?.støtterTredjepartsmottaker) {
      setVisTredjepartsmottakerInput(false)
    }
  }, [valgtBrevmal])

  // Tilbakestill valgt mottaker hvis brukeren skifter mal og valgt mottakere ikke er tilgjengelig på ny mal, eller
  // viss tredjepartsmottaker input er aktivert og orgnr blir endra.
  useEffect(() => {
    formProps.change(
      'overstyrtMottaker',
      JSON.stringify(resolveOverstyrtMottaker(overstyrtMottaker, recipients, visTredjepartsmottakerInput, tredjepartsmottakerOrgnr))
    );
  }, [overstyrtMottaker, recipients, visTredjepartsmottakerInput, tredjepartsmottakerOrgnr])

  useEffect(() => {
    if (tredjepartsmottakerOrgnr?.length >= 9) {
      const loadTredjepartsmottakerNavn = async () => {
        const tredjepartsmottakerInfoRes = await backendApi.getBrevMottakerinfoEreg(tredjepartsmottakerOrgnr)
        if(tredjepartsmottakerInfoRes) {
          setTredjepartsmottakerInfo(tredjepartsmottakerInfoRes)
        }
      }
      loadTredjepartsmottakerNavn()
    } else {
      setTredjepartsmottakerInfo({})
    }
  }, [tredjepartsmottakerOrgnr])

  const { startRequest: hentPreutfylteMaler, data: fritekstforslagTyper } = restApiMessagesHooks.useRestApiRunner<
    { tittel: string; fritekst: string }[]
  >(MessagesApiKeys.HENT_PREUTFYLTE_FRITEKSTMALER);

  useEffect(() => {
    if (brevmalkode) {
      // Resetter fritekst hver gang bruker endrer brevmalskode
      formProps.change('fritekst', null);
      formProps.change('fritekstbrev.overskrift', null);
      formProps.change('fritekstbrev.brødtekst', null);


      if (valgtBrevmal?.linker?.length > 0) {
        requestMessagesApi.setLinks(valgtBrevmal.linker);
        hentPreutfylteMaler()
          .then(_fritekstForslagTyper => {
            const felter = _fritekstForslagTyper.find(alt => fritekstforslag === alt.tittel);

            if (felter) {
              formProps.change('fritekst', felter.fritekst);
            }
            // TODO Kommentar under her gjev ikkje meining for meg. Fjerne kommentar og catch?
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
          {valgtBrevmal?.linker?.length > 0 && fritekstforslagTyper && (
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
                disabled={visTredjepartsmottakerInput}
                hideValueOnDisable
                label={intl.formatMessage({ id: 'Messages.Recipient' })}
                validate={visTredjepartsmottakerInput ? [] : [createValidateRecipient(recipients)]}
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
          {
            valgtBrevmal?.støtterTredjepartsmottaker ? <>
              <VerticalSpacer eightPx />
              <Checkbox
                checked={visTredjepartsmottakerInput}
                onChange={() => setVisTredjepartsmottakerInput(!visTredjepartsmottakerInput)} label={intl.formatMessage({id: 'Messages.SendToThirdparty'})}
              />
            </> : null
          }
          {
            visTredjepartsmottakerInput ? <>
              <VerticalSpacer eightPx />
              <div className={styles.tredjepartsmottakerInp}>
                <div className={styles.orgnumField}>
                  <OrgnrInputField
                    name="tredjepartsmottakerOrgnr"
                    label={intl.formatMessage({id: 'Messages.OrgNum'})}
                    error={
                      tredjepartsmottakerInfo?.invalidOrgnum ?
                        intl.formatMessage({id: 'Messages.InvalidOrgNum'}) :
                        tredjepartsmottakerInfo?.notFound ?
                          intl.formatMessage({id: 'Messages.OrgNumNotFound'}) :
                          undefined
                  }
                  />
                </div>
                <div className={styles.orgnameField}>
                  <Label input={intl.formatMessage({id: 'Messages.Name'})} readOnly />
                  <Normaltekst>
                    {tredjepartsmottakerInfo.name || ""}
                  </Normaltekst>
                </div>
              </div>
            </> : null
          }

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
      ? JSON.parse(newValues.overstyrtMottaker)
      : undefined;
  return { ...newValues, overstyrtMottaker };
};

const mapStateToPropsFactory = (_initialState, initialOwnProps: PureOwnProps) => {
  const onSubmit = (values: FormValues) => initialOwnProps.submitCallback(transformValues(values));
  return (state, ownProps: PureOwnProps): MappedOwnProps => ({
    ...behandlingFormValueSelector(formName, ownProps.behandlingId, ownProps.behandlingVersjon)(
      state,
      'overstyrtMottaker',
      'tredjepartsmottakerOrgnr',
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
