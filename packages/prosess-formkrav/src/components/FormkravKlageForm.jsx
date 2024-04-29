import {
  RadioGroupField,
  SelectField,
  hasBehandlingFormErrorsOfType,
  isBehandlingFormDirty,
  isBehandlingFormSubmitting,
} from '@fpsak-frontend/form';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { AksjonspunktHelpText, FadingPanel, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { DDMMYYYY_DATE_FORMAT, getKodeverknavnFn, required } from '@fpsak-frontend/utils';
import { ProsessStegBegrunnelseTextField, ProsessStegSubmitButton } from '@k9-sak-web/prosess-felles';
import { Detail, HGrid, Heading } from '@navikt/ds-react';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import lagVisningsnavnForKlagepart from '../utils/lagVisningsnavnForKlagepart';

import styles from './formkravKlageForm.module.css';

export const IKKE_PAKLAGD_VEDTAK = 'ikkePaklagdVedtak';

export const getPaklagdVedtak = (klageFormkravResultat, avsluttedeBehandlinger) => {
  const behandlingid =
    Array.isArray(avsluttedeBehandlinger) &&
    avsluttedeBehandlinger.find(b => b.uuid === klageFormkravResultat.påklagdBehandlingRef)?.uuid;
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
      <option key={behandling.uuid} value={`${behandling.uuid}`}>
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
      <Heading size="small" level="2">
        {intl.formatMessage({ id: 'Klage.Formkrav.Title' })}
      </Heading>
      <VerticalSpacer fourPx />
      <Detail>{intl.formatMessage({ id: getLovHjemmeler(aksjonspunktCode) })}</Detail>
      <VerticalSpacer fourPx />
      <AksjonspunktHelpText isAksjonspunktOpen={!readOnlySubmitButton}>
        {[<FormattedMessage id="Klage.Formkrav.HelpText" key={aksjonspunktCode} />]}
      </AksjonspunktHelpText>
      <VerticalSpacer sixteenPx />
      <HGrid gap="1" columns={{ xs: '6fr 6fr' }}>
        <div>
          {Array.isArray(parterMedKlagerett) && parterMedKlagerett.length ? (
            <>
              <SelectField
                readOnly={readOnly || !skalKunneVelgeKlagepart}
                name="valgtPartMedKlagerett"
                selectValues={parterMedKlagerett.map(part => (
                  <option value={JSON.stringify(part)} key={part.identifikasjon.id}>
                    {lagVisningsnavnForKlagepart(part.identifikasjon.id, fagsakPerson, arbeidsgiverOpplysningerPerId)}
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
        </div>
        <div>
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
          <HGrid gap="1" columns={{ xs: '4fr 8fr' }}>
            <div>
              <Detail>{intl.formatMessage({ id: 'Klage.Formkrav.ErKlagerPart' })}</Detail>
              <VerticalSpacer sixteenPx />
              <RadioGroupField
                name="erKlagerPart"
                validate={[required]}
                readOnly={readOnly}
                isTrueOrFalseSelection
                radios={[
                  {
                    value: 'true',
                    label: intl.formatMessage({ id: 'Klage.Formkrav.Ja' }),
                  },
                  {
                    value: 'false',
                    label: intl.formatMessage({ id: 'Klage.Formkrav.Nei' }),
                  },
                ]}
              />
            </div>
            <div>
              <Detail>{intl.formatMessage({ id: 'Klage.Formkrav.ErKonkret' })}</Detail>
              <VerticalSpacer sixteenPx />
              <RadioGroupField
                name="erKonkret"
                validate={[required]}
                readOnly={readOnly}
                isTrueOrFalseSelection
                radios={[
                  {
                    value: 'true',
                    label: intl.formatMessage({ id: 'Klage.Formkrav.Ja' }),
                  },
                  {
                    value: 'false',
                    label: intl.formatMessage({ id: 'Klage.Formkrav.Nei' }),
                  },
                ]}
              />
            </div>
          </HGrid>
          <HGrid gap="1" columns={{ xs: '4fr 8fr' }}>
            <div>
              <Detail>{intl.formatMessage({ id: 'Klage.Formkrav.ErFristOverholdt' })}</Detail>
              <VerticalSpacer sixteenPx />
              <RadioGroupField
                name="erFristOverholdt"
                validate={[required]}
                readOnly={readOnly}
                isTrueOrFalseSelection
                radios={[
                  {
                    value: 'true',
                    label: intl.formatMessage({ id: 'Klage.Formkrav.Ja' }),
                  },
                  {
                    value: 'false',
                    label: intl.formatMessage({ id: 'Klage.Formkrav.Nei' }),
                  },
                ]}
              />
            </div>
            <div>
              <Detail>{intl.formatMessage({ id: 'Klage.Formkrav.ErSignert' })}</Detail>
              <VerticalSpacer sixteenPx />
              <RadioGroupField
                name="erSignert"
                validate={[required]}
                readOnly={readOnly}
                isTrueOrFalseSelection
                radios={[
                  {
                    value: 'true',
                    label: intl.formatMessage({ id: 'Klage.Formkrav.Ja' }),
                  },
                  {
                    value: 'false',
                    label: intl.formatMessage({ id: 'Klage.Formkrav.Nei' }),
                  },
                ]}
              />
            </div>
          </HGrid>
        </div>
      </HGrid>
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
      uuid: PropTypes.string.isRequired,
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
