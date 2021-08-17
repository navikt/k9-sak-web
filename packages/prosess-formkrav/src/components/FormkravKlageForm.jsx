import React from 'react';
import moment from 'moment';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Undertekst, Undertittel } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { ProsessStegSubmitButton, ProsessStegBegrunnelseTextField } from '@k9-sak-web/prosess-felles';
import {
  RadioGroupField,
  RadioOption,
  SelectField,
  hasBehandlingFormErrorsOfType,
  isBehandlingFormDirty,
  isBehandlingFormSubmitting,
} from '@fpsak-frontend/form';
import { AksjonspunktHelpTextTemp, FadingPanel, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { DDMMYYYY_DATE_FORMAT, required, getKodeverknavnFn } from '@fpsak-frontend/utils';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import lagVisningsnavnForKlagepart from '../utils/lagVisningsnavnForKlagepart';

import styles from './formkravKlageForm.less';

export const IKKE_PAKLAGD_VEDTAK = 'ikkePaklagdVedtak';

export const getPaklagdVedtak = (klageFormkravResultat, avsluttedeBehandlinger) => {
  const behandlingid =
    Array.isArray(avsluttedeBehandlinger) &&
    avsluttedeBehandlinger.find(b => b.uuid === klageFormkravResultat.påklagdBehandlingRef)?.id;
  return behandlingid ? `${behandlingid}` : IKKE_PAKLAGD_VEDTAK;
};

const getKlagbareVedtak = (avsluttedeBehandlinger, intl, getKodeverknavn) => {
  const klagBareVedtak = [
    <option key="formkrav" value={IKKE_PAKLAGD_VEDTAK}>
      {intl.formatMessage({ id: 'Klage.Formkrav.IkkePåklagdVedtak' })}
    </option>,
  ];
  return klagBareVedtak.concat(
    avsluttedeBehandlinger.map(behandling => (
      <option key={behandling.id} value={`${behandling.id}`}>
        {`${getKodeverknavn(behandling.type)} ${moment(behandling.avsluttet).format(DDMMYYYY_DATE_FORMAT)}`}
      </option>
    )),
  );
};

const getLovHjemmeler = aksjonspunktCode =>
  aksjonspunktCode === aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_NFP ? 'Klage.LovhjemmelNFP' : 'Klage.LovhjemmelKA';

/**
 * FormkravKlageForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for formkrav klage (NFP og KA).
 */
export const FormkravKlageForm = ({
  behandlingId,
  behandlingVersjon,
  readOnly,
  readOnlySubmitButton,
  aksjonspunktCode,
  avsluttedeBehandlinger,
  intl,
  formProps,
  alleKodeverk,
  fagsakPerson,
  arbeidsgiverOpplysningerPerId,
  parterMedKlagerett,
  skalKunneVelgeKlagepart,
}) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
  const klagbareVedtakOptions = getKlagbareVedtak(avsluttedeBehandlinger, intl, getKodeverknavn);

  return (
    <FadingPanel>
      <Undertittel>{intl.formatMessage({ id: 'Klage.Formkrav.Title' })}</Undertittel>
      <VerticalSpacer fourPx />
      <Undertekst>{intl.formatMessage({ id: getLovHjemmeler(aksjonspunktCode) })}</Undertekst>
      <VerticalSpacer fourPx />
      <AksjonspunktHelpTextTemp isAksjonspunktOpen={!readOnlySubmitButton}>
        {[<FormattedMessage id="Klage.Formkrav.HelpText" key={aksjonspunktCode} />]}
      </AksjonspunktHelpTextTemp>
      <VerticalSpacer sixteenPx />
      <Row>
        <Column xs="6">
          {Array.isArray(parterMedKlagerett) && parterMedKlagerett.length ? (
            <>
              <SelectField
                readOnly={readOnly || !skalKunneVelgeKlagepart}
                name="valgtPartMedKlagerett"
                selectValues={parterMedKlagerett.map(part => (
                  <option value={JSON.stringify(part)} key={part.identifikasjon.id}>
                    {lagVisningsnavnForKlagepart(
                      part.identifikasjon.id,
                      fagsakPerson,
                      arbeidsgiverOpplysningerPerId,
                    )}
                  </option>
                ))}
                className={readOnly ? styles.selectReadOnly : null}
                label={intl.formatMessage(
                  skalKunneVelgeKlagepart
                    ? { id: 'Klage.Formkrav.velgPartMedKlagerett' }
                    : { id: 'Klage.Formkrav.valgtPartMedKlagerett' },
                )}
                validate={[required]}
                bredde="xl"
              />
              <VerticalSpacer sixteenPx />
            </>
          ) : null}
          <ProsessStegBegrunnelseTextField readOnly={readOnly} />
        </Column>
        <Column xs="6">
          <SelectField
            readOnly={readOnly}
            validate={[required]}
            name="vedtak"
            label={intl.formatMessage({ id: 'Klage.Formkrav.VelgVedtak' })}
            placeholder={intl.formatMessage({ id: 'Klage.Formkrav.SelectVedtakPlaceholder' })}
            selectValues={klagbareVedtakOptions}
            bredde="l"
          />
          <VerticalSpacer sixteenPx />
          <Row>
            <Column xs="4">
              <Undertekst>{intl.formatMessage({ id: 'Klage.Formkrav.ErKlagerPart' })}</Undertekst>
              <VerticalSpacer sixteenPx />
              <RadioGroupField name="erKlagerPart" validate={[required]} readOnly={readOnly}>
                <RadioOption value label={{ id: 'Klage.Formkrav.Ja' }} />
                <RadioOption value={false} label={{ id: 'Klage.Formkrav.Nei' }} />
              </RadioGroupField>
            </Column>
            <Column xs="8">
              <Undertekst>{intl.formatMessage({ id: 'Klage.Formkrav.ErKonkret' })}</Undertekst>
              <VerticalSpacer sixteenPx />
              <RadioGroupField name="erKonkret" validate={[required]} readOnly={readOnly}>
                <RadioOption value label={{ id: 'Klage.Formkrav.Ja' }} />
                <RadioOption value={false} label={{ id: 'Klage.Formkrav.Nei' }} />
              </RadioGroupField>
            </Column>
          </Row>
          <Row>
            <Column xs="4">
              <Undertekst>{intl.formatMessage({ id: 'Klage.Formkrav.ErFristOverholdt' })}</Undertekst>
              <VerticalSpacer sixteenPx />
              <RadioGroupField name="erFristOverholdt" validate={[required]} readOnly={readOnly}>
                <RadioOption value label={{ id: 'Klage.Formkrav.Ja' }} />
                <RadioOption value={false} label={{ id: 'Klage.Formkrav.Nei' }} />
              </RadioGroupField>
            </Column>
            <Column xs="8">
              <Undertekst>{intl.formatMessage({ id: 'Klage.Formkrav.ErSignert' })}</Undertekst>
              <VerticalSpacer sixteenPx />
              <RadioGroupField name="erSignert" validate={[required]} readOnly={readOnly}>
                <RadioOption value label={{ id: 'Klage.Formkrav.Ja' }} />
                <RadioOption value={false} label={{ id: 'Klage.Formkrav.Nei' }} />
              </RadioGroupField>
            </Column>
          </Row>
        </Column>
      </Row>
      <VerticalSpacer sixteenPx />
      <div className={styles.confirmVilkarForm}>
        <ProsessStegSubmitButton
          formName={formProps.form}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          isReadOnly={readOnly}
          isSubmittable={!readOnlySubmitButton}
          isBehandlingFormSubmitting={isBehandlingFormSubmitting}
          isBehandlingFormDirty={isBehandlingFormDirty}
          hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
        />
      </div>
    </FadingPanel>
  );
};

FormkravKlageForm.propTypes = {
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  avsluttedeBehandlinger: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.shape({
        kode: PropTypes.string.isRequired,
      }).isRequired,
      avsluttet: PropTypes.string,
      uuid: PropTypes.string,
    }),
  ).isRequired,
  formProps: PropTypes.shape().isRequired,
  aksjonspunktCode: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
  readOnlySubmitButton: PropTypes.bool,
  intl: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  fagsakPerson: PropTypes.shape(),
  arbeidsgiverOpplysningerPerId: PropTypes.shape(),
  parterMedKlagerett: PropTypes.arrayOf(PropTypes.shape()),
  skalKunneVelgeKlagepart: PropTypes.bool,
};

FormkravKlageForm.defaultProps = {
  readOnly: true,
  readOnlySubmitButton: true,
  skalKunneVelgeKlagepart: true,
};

export default injectIntl(FormkravKlageForm);
