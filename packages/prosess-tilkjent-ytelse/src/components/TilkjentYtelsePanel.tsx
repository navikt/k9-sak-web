import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import {
  Aksjonspunkt,
  ArbeidsgiverOpplysningerPerId,
  BeregningsresultatPeriode,
  BeregningsresultatUtbetalt,
  FamilieHendelse,
  KodeverkMedNavn,
  Personopplysninger,
  Soknad,
} from '@k9-sak-web/types';
import moment from 'moment';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { Heading } from '@navikt/ds-react';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import TilkjentYtelse, { PeriodeMedId } from './TilkjentYtelse';
import TilkjentYtelseForm from './manuellePerioder/TilkjentYtelseForm';
import Tilbaketrekkpanel from './tilbaketrekk/Tilbaketrekkpanel';

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
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
}

interface MappedOwnProps {
  vurderTilbaketrekkAP?: Aksjonspunkt;
}

export const TilkjentYtelsePanelImpl = ({
  beregningresultat,
  vurderTilbaketrekkAP,
  submitCallback,
  readOnlySubmitButton,
  behandlingId,
  behandlingVersjon,
  aksjonspunkter,
  readOnly,
  arbeidsgiverOpplysningerPerId,
}: Partial<PureOwnProps> & MappedOwnProps) => {
  const { getKodeverkNavnFraKodeFn } = useKodeverkContext();
  const kodeverkNavnFraKode = getKodeverkNavnFraKodeFn();
  const opphoersdato = beregningresultat?.opphoersdato;
  return (
    <>
      <Heading size="small" level="2">
        <FormattedMessage id="TilkjentYtelse.Title" />
      </Heading>
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
          arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
          kodeverkNavnFraKode={kodeverkNavnFraKode}
        />
      )}

      {hasAksjonspunkt(MANUELL_TILKJENT_YTELSE, aksjonspunkter) && (
        <TilkjentYtelseForm
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          beregningsresultat={beregningresultat}
          arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
          aksjonspunkter={aksjonspunkter}
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
          kodeverkNavnfraKode={kodeverkNavnFraKode}
        />
      )}
    </>
  );
};

const finnTilbaketrekkAksjonspunkt = (alleAksjonspunkter: Aksjonspunkt[]): Aksjonspunkt | undefined =>
  alleAksjonspunkter
    ? alleAksjonspunkter.find(ap => ap.definisjon === aksjonspunktCodes.VURDER_TILBAKETREKK)
    : undefined;

const mapStateToProps = (state, ownProps) => ({
  beregningresultat: ownProps.beregningsresultat,

  vurderTilbaketrekkAP: finnTilbaketrekkAksjonspunkt(ownProps.aksjonspunkter),
});

export default connect(mapStateToProps)(TilkjentYtelsePanelImpl);
