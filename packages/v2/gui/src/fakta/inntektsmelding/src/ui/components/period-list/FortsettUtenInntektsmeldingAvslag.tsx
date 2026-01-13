import { LabelledContent } from '@k9-sak-web/gui/shared/labelled-content/LabelledContent.js';
import { VurdertAv } from '@k9-sak-web/gui/shared/vurdert-av/VurdertAv.js';
import { Edit } from '@navikt/ds-icons';
import { Alert, BodyShort, Button } from '@navikt/ds-react';
import type { JSX } from 'react';
import { useInntektsmeldingContext } from '../../../context/InntektsmeldingContext';
import { InntektsmeldingKode } from '../../../types/KompletthetData';
import type { Tilstand } from '../../../types/KompletthetData';

interface FortsettUtenInntektsmeldingAvslagProps {
  tilstand: Tilstand;
  redigeringsmodus: boolean;
  setRedigeringsmodus: (state: boolean) => void;
}

const FortsettUtenInntektsmeldingAvslag = ({
  tilstand,
  redigeringsmodus,
  setRedigeringsmodus,
}: FortsettUtenInntektsmeldingAvslagProps): JSX.Element | null => {
  const { readOnly } = useInntektsmeldingContext();

  const kode = tilstand?.vurdering;
  const harAvslagskode =
    kode === InntektsmeldingKode.MANGLENDE_GRUNNLAG || kode === InntektsmeldingKode.IKKE_INNTEKTSTAP;

  if (harAvslagskode && !redigeringsmodus && tilstand.tilVurdering) {
    return (
      <>
        <Alert variant="error" size="medium" className="mt-2">
          <div className="flex flex-col gap-4">
            {kode === InntektsmeldingKode.MANGLENDE_GRUNNLAG && (
              <BodyShort>Søknaden avslås på grunn av manglende opplysninger om inntekt</BodyShort>
            )}
            {kode === InntektsmeldingKode.IKKE_INNTEKTSTAP && (
              <BodyShort>Søknaden avslås fordi søker ikke har dokumentert tapt arbeidsinntekt</BodyShort>
            )}
            {!readOnly && (
              <div>
                <Button variant="tertiary" size="small" onClick={() => setRedigeringsmodus(true)} icon={<Edit />}>
                  Rediger vurdering
                </Button>
              </div>
            )}
          </div>
        </Alert>
        <LabelledContent
          label="Begrunnelse"
          content={<span className="whitespace-pre-wrap">{tilstand.begrunnelse}</span>}
          indentContent
        />
        <VurdertAv ident={tilstand.vurdertAv} date={tilstand.vurdertTidspunkt} />
      </>
    );
  }
  return null;
};

export default FortsettUtenInntektsmeldingAvslag;
