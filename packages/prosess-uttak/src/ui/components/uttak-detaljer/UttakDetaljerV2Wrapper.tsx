/*
 * En midlertidig wrapper for å omskrive variabler fra v1 til v2 frem til resten av
 * Uttak er omskrevet til v2.
 */
import type { JSX } from 'react';
import UttakDetaljer from '@k9-sak-web/gui/prosess/uttak/uttak-detaljer/UttakDetaljer.js';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import { UttaksperiodeMedInntektsgradering as UttaksperiodeMedInntektsgraderingV2 } from '@k9-sak-web/gui/prosess/uttak/types/UttaksperiodeMedInntektsgradering.js';
import { ArbeidsgiverOpplysninger, UttaksperiodeMedInntektsgradering } from '../../../types';
import { ArbeidsgiverOversiktDto } from '@k9-sak-web/backend/k9sak/generated';

interface UttakDetaljerV2WrapperProps {
  uttak: UttaksperiodeMedInntektsgradering;
  erFagytelsetypeLivetsSluttfase: boolean;
  arbeidsforhold: Record<string, ArbeidsgiverOpplysninger>;
  manueltOverstyrt: boolean;
}

const UttakDetaljerV2Wrapper = ({
  uttak,
  manueltOverstyrt,
  erFagytelsetypeLivetsSluttfase,
  arbeidsforhold,
}: UttakDetaljerV2WrapperProps): JSX.Element => {
  const deepCopyProps = JSON.parse(
    JSON.stringify({
      uttak: uttak,
      arbeidsforhold: arbeidsforhold,
    }),
  );
  konverterKodeverkTilKode(deepCopyProps, false);

  return (
    <>
      <UttakDetaljer
        uttak={deepCopyProps.uttak as UttaksperiodeMedInntektsgraderingV2}
        manueltOverstyrt={manueltOverstyrt}
        erFagytelsetypeLivetsSluttfase={erFagytelsetypeLivetsSluttfase}
        arbeidsforhold={deepCopyProps.arbeidsforhold as ArbeidsgiverOversiktDto['arbeidsgivere']}
      />
    </>
  );
};
export default UttakDetaljerV2Wrapper;
