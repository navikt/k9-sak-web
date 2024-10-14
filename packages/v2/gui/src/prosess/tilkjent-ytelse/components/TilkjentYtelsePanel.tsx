import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { DDMMYYYY_DATE_FORMAT } from '@k9-sak-web/lib/dateUtils/formats.js';
import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
import AksjonspunktCodes from '@k9-sak-web/lib/kodeverk/types/AksjonspunktCodes.js';
import type { FeatureToggles } from '@k9-sak-web/lib/kodeverk/types/FeatureTogglesType.js';
import { Heading } from '@navikt/ds-react';
import type { AksjonspunktDto, PersonopplysningDto } from '@navikt/k9-sak-typescript-client';
import type { BeregningsresultatMedUtbetaltePeriodeDto } from '../types/BeregningsresultatMedUtbetaltePeriode';
import type { BeregningsresultatPeriodeDto } from '../types/BeregningsresultatPeriodeDto';
import type { ArbeidsgiverOpplysningerPerId } from '../types/arbeidsgiverOpplysningerType';
import TilkjentYtelse, { type PeriodeMedId } from './TilkjentYtelse';
import TilkjentYtelseForm from './manuellePerioder/TilkjentYtelseForm';
import Tilbaketrekkpanel from './tilbaketrekk/Tilbaketrekkpanel';

const perioderMedClassName: PeriodeMedId[] = [];

const formatPerioder = (perioder?: BeregningsresultatPeriodeDto[]): PeriodeMedId[] => {
  perioderMedClassName.length = 0;
  perioder?.forEach(item => {
    if (item.andeler?.[0] && item.dagsats !== null && item.dagsats >= 0) {
      perioderMedClassName.push({ ...item, id: perioderMedClassName.length });
    }
  });
  return perioderMedClassName;
};

const { MANUELL_TILKJENT_YTELSE } = AksjonspunktCodes;

const finnTilbaketrekkAksjonspunkt = (alleAksjonspunkter?: AksjonspunktDto[]): AksjonspunktDto | undefined =>
  alleAksjonspunkter
    ? alleAksjonspunkter.find(ap => ap.definisjon === AksjonspunktCodes.VURDER_TILBAKETREKK)
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
  featureToggles?: FeatureToggles;
  personopplysninger: PersonopplysningDto;
}

const TilkjentYtelsePanelImpl = ({
  beregningsresultat,
  submitCallback,
  readOnlySubmitButton,
  aksjonspunkter,
  readOnly,
  arbeidsgiverOpplysningerPerId,
  featureToggles,
  personopplysninger,
}: PureOwnProps) => {
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
          arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
          kodeverkNavnFraKode={kodeverkNavnFraKode}
          personopplysninger={personopplysninger}
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
          featureToggles={featureToggles}
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
