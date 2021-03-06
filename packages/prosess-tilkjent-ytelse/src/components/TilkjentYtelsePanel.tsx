import React, { FC } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import moment from 'moment';
import {
  Aksjonspunkt,
  BeregningsresultatUtbetalt,
  BeregningsresultatPeriode,
  FamilieHendelse,
  KodeverkMedNavn,
  Personopplysninger,
  ArbeidsforholdV2,
  ArbeidsgiverOpplysningerPerId,
  Soknad,
} from '@k9-sak-web/types';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';

import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import TilkjentYtelseForm from './manuellePerioder/TilkjentYtelseForm';
import Tilbaketrekkpanel from './tilbaketrekk/Tilbaketrekkpanel';
import TilkjentYtelse, { PeriodeMedId } from './TilkjentYtelse';

const perioderMedClassName = [];

const formatPerioder = (perioder: BeregningsresultatPeriode[]): PeriodeMedId[] => {
  perioderMedClassName.length = 0;
  perioder.forEach(item => {
    if (item.andeler[0] && item.dagsats >= 0) {
      perioderMedClassName.push({ ...item, id: perioderMedClassName.length });
    }
  });
  return perioderMedClassName;
};

const groups = [
  { id: 1, content: '' },
  { id: 2, content: '' },
];

const { MANUELL_TILKJENT_YTELSE } = aksjonspunktCodes;

interface PureOwnProps {
  behandlingId: number;
  behandlingVersjon: number;
  beregningresultat: BeregningsresultatUtbetalt;
  gjeldendeFamiliehendelse: FamilieHendelse;
  personopplysninger: Personopplysninger;
  soknad: Soknad;
  fagsakYtelseTypeKode: string;
  aksjonspunkter: Aksjonspunkt[];
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  readOnly: boolean;
  submitCallback: (data: any) => Promise<any>;
  readOnlySubmitButton: boolean;
  arbeidsforhold: ArbeidsforholdV2[];
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
}

interface MappedOwnProps {
  vurderTilbaketrekkAP?: Aksjonspunkt;
}

export const TilkjentYtelsePanelImpl: FC<PureOwnProps & MappedOwnProps> = ({
  beregningresultat,
  vurderTilbaketrekkAP,
  submitCallback,
  readOnlySubmitButton,
  behandlingId,
  behandlingVersjon,
  aksjonspunkter,
  arbeidsforhold,
  readOnly,
  alleKodeverk,
  arbeidsgiverOpplysningerPerId,
}) => {
  const opphoersdato = beregningresultat?.opphoersdato;

  return (
    <>
      <Undertittel>
        <FormattedMessage id="TilkjentYtelse.Title" />
      </Undertittel>
      {opphoersdato && (
        <FormattedMessage
          id="TilkjentYtelse.Opphoersdato"
          values={{
            opphoersdato: moment(opphoersdato).format(DDMMYYYY_DATE_FORMAT).toString(),
          }}
        />
      )}
      {beregningresultat && (
        <TilkjentYtelse
          // @ts-ignore
          items={formatPerioder(beregningresultat.perioder)}
          groups={groups}
          alleKodeverk={alleKodeverk}
          arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        />
      )}

      {hasAksjonspunkt(MANUELL_TILKJENT_YTELSE, aksjonspunkter) && (
        <TilkjentYtelseForm
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          beregningsresultat={beregningresultat}
          arbeidsforhold={arbeidsforhold}
          arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
          aksjonspunkter={aksjonspunkter}
          alleKodeverk={alleKodeverk}
          readOnly={readOnly}
          submitCallback={submitCallback}
          readOnlySubmitButton={readOnlySubmitButton}
        />
      )}

      {vurderTilbaketrekkAP && (
        <Tilbaketrekkpanel
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          readOnly={readOnly}
          vurderTilbaketrekkAP={vurderTilbaketrekkAP}
          submitCallback={submitCallback}
          readOnlySubmitButton={readOnlySubmitButton}
          beregningsresultat={beregningresultat}
        />
      )}
    </>
  );
};

const finnTilbaketrekkAksjonspunkt = createSelector(
  [(state, ownProps) => ownProps.aksjonspunkter],
  alleAksjonspunkter => {
    if (alleAksjonspunkter) {
      return alleAksjonspunkter.find(
        ap => ap.definisjon && ap.definisjon.kode === aksjonspunktCodes.VURDER_TILBAKETREKK,
      );
    }
    return undefined;
  },
);

const mapStateToProps = (state, ownProps) => ({
  beregningresultat: ownProps.beregningsresultat,
  vurderTilbaketrekkAP: finnTilbaketrekkAksjonspunkt(state, ownProps),
});

export default connect(mapStateToProps)(TilkjentYtelsePanelImpl);
