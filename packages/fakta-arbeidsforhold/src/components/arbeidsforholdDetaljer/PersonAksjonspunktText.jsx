import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

import { AksjonspunktHelpText, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { DDMMYYYY_DATE_FORMAT, getKodeverknavnFn } from '@fpsak-frontend/utils';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';

import { arbeidsforholdPropType } from '@fpsak-frontend/prop-types';
import arbeidsforholdHandlingType from '@fpsak-frontend/kodeverk/src/arbeidsforholdHandlingType';
import arbeidsforholdKilder from '../../kodeverk/arbeidsforholdKilder';
import aksjonspunktÅrsaker from '../../kodeverk/aksjonspunktÅrsaker';

const utledPermisjonValues = (permisjon, getKodeverknavn) => {
  const kodeverknavn = getKodeverknavn(permisjon.type);
  const permisjonType = kodeverknavn !== undefined && kodeverknavn !== null ? kodeverknavn.toLowerCase() : '';
  return {
    permisjonFom: moment(permisjon.permisjonFom).format(DDMMYYYY_DATE_FORMAT),
    permisjonTom: permisjon.permisjonTom ? moment(permisjon.permisjonTom).format(DDMMYYYY_DATE_FORMAT) : '',
    permisjonsprosent: permisjon.permisjonsprosent,
    permisjonType,
  };
};

const harPermisjonOgIkkeMottattIM = arbeidsforhold =>
  arbeidsforhold.permisjoner && arbeidsforhold.permisjoner.length === 1 && !arbeidsforhold.inntektsmeldinger;

const harPermisjonOgMottattIM = arbeidsforhold =>
  arbeidsforhold.permisjoner && arbeidsforhold.permisjoner.length === 1 && arbeidsforhold.inntektsmeldinger;

const lagAksjonspunktMessage = (arbeidsforhold, getKodeverknavn) => {
  if (!arbeidsforhold || arbeidsforhold.aksjonspunktÅrsaker.length === 0) {
    return undefined;
  }
  if (harPermisjonOgIkkeMottattIM(arbeidsforhold)) {
    return (
      <FormattedMessage
        key="permisjonUtenMottattIM"
        id="PersonAksjonspunktText.SokerHarPermisjonOgIkkeMottattIM"
        values={utledPermisjonValues(arbeidsforhold.permisjoner[0], getKodeverknavn)}
      />
    );
  }
  if (harPermisjonOgMottattIM(arbeidsforhold)) {
    return (
      <FormattedMessage
        key="permisjonMedMottattIM"
        id="PersonAksjonspunktText.SokerHarPermisjonOgMottattIM"
        values={utledPermisjonValues(arbeidsforhold.permisjoner[0], getKodeverknavn)}
      />
    );
  }
  if (arbeidsforhold.permisjoner && arbeidsforhold.permisjoner.length > 1) {
    return <FormattedMessage key="permisjoner" id="PersonAksjonspunktText.SokerHarFlerePermisjoner" />;
  }
  if (arbeidsforhold.kilde.includes(arbeidsforholdKilder.INNTEKTSMELDING)) {
    return <FormattedMessage key="basertPaInntektsmelding" id="PersonAksjonspunktText.BasertPaInntektsmelding" />;
  }
  if (arbeidsforhold.handlingType === arbeidsforholdHandlingType.LAGT_TIL_AV_SAKSBEHANDLER) {
    return <FormattedMessage key="lagtTilAvSaksbehandler" id="PersonAksjonspunktText.LeggTilArbeidsforhold" />;
  }
  if (!arbeidsforhold.inntektsmeldinger) {
    return (
      <FormattedMessage
        key="mottattDatoInntektsmelding"
        id="PersonAksjonspunktText.AvklarManglendeInntektsmelding"
        values={{ br: <br /> }}
      />
    );
  }
  if (arbeidsforhold.aksjonspunktÅrsaker.includes(aksjonspunktÅrsaker.INNTEKTSMELDING_UTEN_ARBEIDSFORHOLD)) {
    return <FormattedMessage key="ikkeRegistrertIAaRegister" id="PersonAksjonspunktText.AvklarIkkeRegistrertIAa" />;
  }
  return undefined;
};

export const PersonAksjonspunktTextImpl = ({ arbeidsforhold, alleKodeverk }) => {
  const msg = lagAksjonspunktMessage(arbeidsforhold, getKodeverknavnFn(alleKodeverk, kodeverkTyper));
  if (msg === undefined) {
    return null;
  }
  return (
    <>
      <VerticalSpacer eightPx />
      <AksjonspunktHelpText isAksjonspunktOpen>{[msg]}</AksjonspunktHelpText>
    </>
  );
};

PersonAksjonspunktTextImpl.propTypes = {
  arbeidsforhold: arbeidsforholdPropType,
  alleKodeverk: PropTypes.shape().isRequired,
};

PersonAksjonspunktTextImpl.defaultProps = {
  arbeidsforhold: undefined,
};

export default PersonAksjonspunktTextImpl;
