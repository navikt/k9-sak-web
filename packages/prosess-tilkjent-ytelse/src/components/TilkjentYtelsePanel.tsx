import { DDMMYYYY_DATE_FORMAT, initializeDate } from '@fpsak-frontend/utils';
import {
  Aksjonspunkt,
  ArbeidsgiverOpplysningerPerId,
  BeregningsresultatPeriode,
  BeregningsresultatUtbetalt,
  KodeverkMedNavn,
} from '@k9-sak-web/types';

import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { Heading } from '@navikt/ds-react';
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

const finnTilbaketrekkAksjonspunkt = (alleAksjonspunkter: Aksjonspunkt[]): Aksjonspunkt | undefined =>
  alleAksjonspunkter
    ? alleAksjonspunkter.find(ap => ap.definisjon?.kode === aksjonspunktCodes.VURDER_TILBAKETREKK)
    : undefined;

interface PureOwnProps {
  beregningsresultat: BeregningsresultatUtbetalt;
  aksjonspunkter: Aksjonspunkt[];
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  readOnly: boolean;
  submitCallback: (data: any) => Promise<any>;
  readOnlySubmitButton: boolean;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
}

const TilkjentYtelsePanelImpl = ({
  beregningsresultat,
  submitCallback,
  readOnlySubmitButton,
  aksjonspunkter,
  readOnly,
  alleKodeverk,
  arbeidsgiverOpplysningerPerId,
}: Partial<PureOwnProps>) => {
  const vurderTilbaketrekkAP = finnTilbaketrekkAksjonspunkt(aksjonspunkter);
  const opphoersdato = beregningsresultat?.opphoersdato;
  return (
    <>
      <Heading size="small" level="2">
        Tilkjent ytelse
      </Heading>
      {opphoersdato && `Opphørsdato: ${initializeDate(opphoersdato).format(DDMMYYYY_DATE_FORMAT).toString()}`}
      {beregningsresultat && (
        <TilkjentYtelse
          items={formatPerioder(beregningsresultat.perioder)}
          groups={groups}
          alleKodeverk={alleKodeverk}
          arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        />
      )}

      {hasAksjonspunkt(MANUELL_TILKJENT_YTELSE, aksjonspunkter) && (
        <TilkjentYtelseForm
          beregningsresultat={beregningsresultat}
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
          readOnly={readOnly}
          vurderTilbaketrekkAP={vurderTilbaketrekkAP}
          submitCallback={submitCallback}
          readOnlySubmitButton={readOnlySubmitButton}
          beregningsresultat={beregningsresultat}
        />
      )}
    </>
  );
};

export default TilkjentYtelsePanelImpl;
