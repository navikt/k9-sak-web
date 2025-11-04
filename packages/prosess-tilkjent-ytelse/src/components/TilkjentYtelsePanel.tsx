import { ArbeidsgiverOpplysningerPerId, Feriepengegrunnlag } from '@k9-sak-web/types';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { DDMMYYYY_DATE_FORMAT } from '@k9-sak-web/lib/dateUtils/formats.js';
import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
import { Heading } from '@navikt/ds-react';
import {
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto,
  k9_sak_kontrakt_beregningsresultat_BeregningsresultatMedUtbetaltePeriodeDto as BeregningsresultatMedUtbetaltePeriodeDto,
  k9_sak_kontrakt_beregningsresultat_BeregningsresultatPeriodeDto as BeregningsresultatPeriodeDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import TilkjentYtelse, { PeriodeMedId } from './TilkjentYtelse';
import TilkjentYtelseForm from './manuellePerioder/TilkjentYtelseForm';
import Tilbaketrekkpanel from './tilbaketrekk/Tilbaketrekkpanel';
import { FeriepengerPanel } from './feriepenger';

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
  feriepengegrunnlag?: Feriepengegrunnlag | null;
}

const TilkjentYtelsePanelImpl = ({
  beregningsresultat,
  submitCallback,
  readOnlySubmitButton,
  aksjonspunkter,
  readOnly,
  arbeidsgiverOpplysningerPerId,
  isUngdomsytelseFagsak,
  feriepengegrunnlag,
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

      {feriepengegrunnlag && feriepengegrunnlag.andeler && feriepengegrunnlag.andeler.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <FeriepengerPanel
            feriepengegrunnlag={feriepengegrunnlag}
            kodeverkNavnFraKode={kodeverkNavnFraKode}
            arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
          />
        </div>
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
