import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import { DateLabel, Image, BorderBox } from '@fpsak-frontend/shared-components';
import chevronUp from '@fpsak-frontend/assets/images/pil_opp.svg';
import chevronDown from '@fpsak-frontend/assets/images/pil_ned.svg';

import styles from './behandlingPickerItemContent.less';

const renderChevron = (chevron, messageId) => (
  <FormattedMessage id={messageId}>
    {altText => <Image className={styles.image} src={chevron} alt={altText} />}
  </FormattedMessage>
);

// TODO hente de forksjellige kodeverkene man trenger
const getÅrsak = (årsak) => {
  /* if (årsak.manueltOpprettet) {
    return 'Manuell behandling';
  } */
  switch (årsak.behandlingArsakType.kode) {
  case 'RE-MF':
  case 'RE-MFIP':
    return 'Behandlingspunkt.Årsak.ManglerFødselsdato';
  case 'RE-AVAB':
    return 'Behandlingspunkt.Årsak.AvvikAntallBarn';
  case 'RE-LOV':
  case 'RE-RGLF':
    return 'Behandlingspunkt.Årsak.FeilLovanvendelse';
  case 'RE-FEFAKTA':
    return 'Behandlingspunkt.Årsak.EndredeOpplysninger';
  case 'RE-PRSSL':
  case 'RE-ANNET':
    return 'Behandlingspunkt.Årsak.Annet';
  case 'RE-END-FRA-BRUKER':
    return 'Behandlingspunkt.Årsak.Søknad';
  case 'RE-END-INNTEKTSMELD':
    return 'Behandlingspunkt.Årsak.Inntektsmelding';
  case 'BERØRT-BEHANDLING':
    return 'Behandlingspunkt.Årsak.BerørtBehandling';
  case 'KØET-BEHANDLING':
    return 'Behandlingspunkt.Årsak.KøetBehandling';
  case 'RE-KLAG-U-INNTK':
  case 'RE-KLAG-M-INNTK':
  case 'ETTER_KLAGE':
    return 'Behandlingspunkt.Årsak.Klage';
  case 'RE-MDL':
    return 'Behandlingspunkt.Årsak.OpplysningerMedlemskap';
  case 'RE-OPTJ':
    return 'Behandlingspunkt.Årsak.OpplysningerOpptjening';
  case 'RE-FRDLING':
    return 'Behandlingspunkt.Årsak.OpplysningerFordeling';
  case 'RE-INNTK':
    return 'Behandlingspunkt.Årsak.OpplysningerInntekt';
  case 'RE-DØD':
    return 'Behandlingspunkt.Årsak.OpplysningerDød';
  case 'RE-SRTB':
    return 'Behandlingspunkt.Årsak.OpplysningerRelasjon';
  case 'RE-FRIST':
    return 'Behandlingspunkt.Årsak.OpplysningerSøknadsfrist';
  case 'RE-BER-GRUN':
  case 'RE-ENDR-BER-GRUN':
    return 'Behandlingspunkt.Årsak.OpplysningerBeregning';
  case 'RE-YTELSE':
  case 'RE-TILST-YT-INNVIL':
  case 'RE-TILST-YT-OPPH':
    return 'Opplysninger annen ytelse';
  case 'RE-HENDELSE-FØDSEL':
    return 'Behandlingspunkt.Årsak.Fødsel';
  case 'RE-HENDELSE-DØD-F':
    return 'Behandlingspunkt.Årsak.SøkerDød';
  case 'RE-HENDELSE-DØD-B':
    return 'Behandlingspunkt.Årsak.BarnDød';
  case 'RE-HENDELSE-DØDFØD':
    return 'Behandlingspunkt.Årsak.Dødfødsel';
  case 'RE-REGISTEROPPL':
    return 'Behandlingspunkt.Årsak.NyeRegisteropplysninger';
  default:
    return '';
  }
};

/**
 * BehandlingPickerItemContent
 *
 * Presentasjonskomponent. Håndterer formatering av innholdet i den enkelte behandling i behandlingsvelgeren.
 */
const BehandlingPickerItemContent = ({
  withChevronDown,
  withChevronUp,
  behandlendeEnhetId,
  behandlendeEnhetNavn,
  behandlingId,
  opprettetDato,
  avsluttetDato,
  behandlingsstatus,
  behandlingTypeNavn,
  behandlingTypeKode,
  førsteÅrsak,
}) => (
  <BorderBox className={styles.boxPadding}>
    <div>
      {withChevronDown && renderChevron(chevronDown, 'BehandlingListItem.Open')}
      {withChevronUp && renderChevron(chevronUp, 'BehandlingListItem.Close')}
      <div>
        <Element className={styles.smallMarginBottom}>
          {behandlingTypeNavn}
        </Element>
        <Normaltekst className={styles.paddingBottom}>
          {behandlendeEnhetId}
          {' '}
          {behandlendeEnhetNavn}
        </Normaltekst>
      </div>
    </div>
    <div>
      <Row value={behandlingId}>
        <Column xs="3">
          <Undertekst className={styles.undertekstPaddingBottom}><FormattedMessage id="BehandlingListItem.Opprettet" /></Undertekst>
          <Normaltekst><DateLabel dateString={opprettetDato} /></Normaltekst>
        </Column>
        <Column xs="3">
          <Undertekst className={styles.undertekstPaddingBottom}><FormattedMessage id="BehandlingListItem.Avsluttet" /></Undertekst>
          {avsluttetDato && <Normaltekst><DateLabel dateString={avsluttetDato} /></Normaltekst>}
        </Column>
        <Column xs="3">
          {behandlingTypeKode === behandlingType.REVURDERING && (
          <>
            <Undertekst className={styles.undertekstPaddingBottom}><FormattedMessage id="BehandlingListItem.Årsak" /></Undertekst>
            <Normaltekst>
              <FormattedMessage id={getÅrsak(førsteÅrsak)} />
            </Normaltekst>
          </>
          )}
        </Column>
        <Column xs="3">
          <Undertekst className={styles.undertekstPaddingBottom}><FormattedMessage id="BehandlingListItem.Behandlingsstatus" /></Undertekst>
          <Normaltekst>{behandlingsstatus}</Normaltekst>
        </Column>
      </Row>
    </div>
  </BorderBox>
);

BehandlingPickerItemContent.propTypes = {
  withChevronDown: PropTypes.bool,
  withChevronUp: PropTypes.bool,
  behandlendeEnhetId: PropTypes.string,
  behandlendeEnhetNavn: PropTypes.string,
  behandlingId: PropTypes.number.isRequired,
  opprettetDato: PropTypes.string.isRequired,
  avsluttetDato: PropTypes.string,
  behandlingsstatus: PropTypes.string.isRequired,
  behandlingTypeNavn: PropTypes.string.isRequired,
  behandlingTypeKode: PropTypes.string.isRequired,
  førsteÅrsak: PropTypes.shape({
    behandlingArsakType: kodeverkObjektPropType.isRequired,
    erAutomatiskRevurdering: PropTypes.bool.isRequired,
    manueltOpprettet: PropTypes.bool.isRequired,
  }).isRequired,
};

BehandlingPickerItemContent.defaultProps = {
  withChevronDown: false,
  withChevronUp: false,
  avsluttetDato: null,
  behandlendeEnhetId: null,
  behandlendeEnhetNavn: null,
};

export default BehandlingPickerItemContent;
