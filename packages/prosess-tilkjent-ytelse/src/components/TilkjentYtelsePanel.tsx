import { DDMMYYYY_DATE_FORMAT, initializeDate } from '@fpsak-frontend/utils';
import { ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { Heading } from '@navikt/ds-react';
import {
  AksjonspunktDto,
  BeregningsresultatMedUtbetaltePeriodeDto,
  BeregningsresultatPeriodeDto,
} from '@navikt/k9-sak-typescript-client';
import TilkjentYtelse, { PeriodeMedId } from './TilkjentYtelse';
import TilkjentYtelseForm from './manuellePerioder/TilkjentYtelseForm';
import Tilbaketrekkpanel from './tilbaketrekk/Tilbaketrekkpanel';

const perioderMedClassName = [];

const formatPerioder = (perioder: BeregningsresultatPeriodeDto[]): PeriodeMedId[] => {
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

const finnTilbaketrekkAksjonspunkt = (alleAksjonspunkter: AksjonspunktDto[]): AksjonspunktDto | undefined =>
  alleAksjonspunkter
    ? alleAksjonspunkter.find(ap => ap.definisjon === aksjonspunktCodes.VURDER_TILBAKETREKK)
    : undefined;

export const hasAksjonspunkt = (aksjonspunktCode: string, aksjonspunkter: AksjonspunktDto[]): boolean =>
  aksjonspunkter.some(ap => ap.definisjon === aksjonspunktCode);

interface PureOwnProps {
  beregningsresultat: BeregningsresultatMedUtbetaltePeriodeDto;
  aksjonspunkter: AksjonspunktDto[];
  readOnly: boolean;
  submitCallback: (data: any) => Promise<any>;
  readOnlySubmitButton: boolean;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  isUngdomsytelseFagsak: boolean;
}

const TilkjentYtelsePanelImpl = ({
  beregningsresultat,
  submitCallback,
  readOnlySubmitButton,
  aksjonspunkter,
  readOnly,
  arbeidsgiverOpplysningerPerId,
  isUngdomsytelseFagsak,
}: Partial<PureOwnProps>) => {
  const { getKodeverkNavnFraKodeFn } = useKodeverkContext();
  const kodeverkNavnFraKode = getKodeverkNavnFraKodeFn();
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
          arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
          kodeverkNavnFraKode={kodeverkNavnFraKode}
          isUngdomsytelseFagsak={isUngdomsytelseFagsak}
        />
      )}

      {hasAksjonspunkt(MANUELL_TILKJENT_YTELSE, aksjonspunkter) && (
        <TilkjentYtelseForm
          beregningsresultat={beregningsresultat}
          arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
          aksjonspunkter={aksjonspunkter}
          readOnly={readOnly}
          submitCallback={submitCallback}
          readOnlySubmitButton={readOnlySubmitButton}
          kodeverkNavnFraKode={kodeverkNavnFraKode}
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
