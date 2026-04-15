import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import {
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto,
  k9_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto,
  k9_sak_kontrakt_beregningsresultat_BeregningsresultatMedUtbetaltePeriodeDto as BeregningsresultatMedUtbetaltePeriodeDto,
  k9_sak_kontrakt_beregningsresultat_BeregningsresultatPeriodeDto as BeregningsresultatPeriodeDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { DDMMYYYY_DATE_FORMAT } from '@k9-sak-web/lib/dateUtils/formats.js';
import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
import { Box, Heading } from '@navikt/ds-react';
import TilkjentYtelse, { PeriodeMedId } from './TilkjentYtelse';
import TilkjentYtelseForm from './manuellePerioder/TilkjentYtelseForm';
import Tilbaketrekkpanel from './tilbaketrekk/Tilbaketrekkpanel';
import type { FeriepengerPrÅr } from '../api/tilkjentYtelseApi';
import FeriepengerPanel from './feriepenger/FeriepengerPanel';
import { useContext } from 'react';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';

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

const hasAksjonspunkt = (aksjonspunktCode: string, aksjonspunkter: AksjonspunktDto[]): boolean =>
  aksjonspunkter.some(ap => ap.definisjon === aksjonspunktCode);

interface PureOwnProps {
  beregningsresultat: BeregningsresultatMedUtbetaltePeriodeDto;
  aksjonspunkter: AksjonspunktDto[];
  readOnly: boolean;
  submitCallback: (data: any) => Promise<any>;
  readOnlySubmitButton: boolean;
  arbeidsgiverOpplysningerPerId: k9_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto['arbeidsgivere'];
  isUngdomsytelseFagsak: boolean;
  feriepengerPrÅr?: FeriepengerPrÅr;
}

const TilkjentYtelsePanelImpl = ({
  beregningsresultat,
  submitCallback,
  readOnlySubmitButton,
  aksjonspunkter,
  readOnly,
  arbeidsgiverOpplysningerPerId,
  isUngdomsytelseFagsak,
  feriepengerPrÅr,
}: Partial<PureOwnProps>) => {
  const { getKodeverkNavnFraKodeFn } = useKodeverkContext();
  const kodeverkNavnFraKode = getKodeverkNavnFraKodeFn();
  const vurderTilbaketrekkAP = finnTilbaketrekkAksjonspunkt(aksjonspunkter);
  const opphoersdato = beregningsresultat?.opphoersdato;
  const featureToggles = useContext(FeatureTogglesContext);
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

      {featureToggles?.['VIS_FERIEPENGER_PANEL'] && feriepengerPrÅr && feriepengerPrÅr.size > 0 && (
        <Box marginBlock="space-16 space-0">
          <FeriepengerPanel
            feriepengerPrÅr={feriepengerPrÅr}
            arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId ?? {}}
          />
        </Box>
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
