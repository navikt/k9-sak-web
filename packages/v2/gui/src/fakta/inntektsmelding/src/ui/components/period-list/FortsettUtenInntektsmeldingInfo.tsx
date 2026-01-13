import { LabelledContent } from '@k9-sak-web/gui/shared/labelled-content/LabelledContent.js';
import { VurdertAv } from '@k9-sak-web/gui/shared/vurdert-av/VurdertAv.js';
import { Edit } from '@navikt/ds-icons';
import { Alert, BodyShort, Button } from '@navikt/ds-react';
import type { JSX } from 'react';
import { useInntektsmeldingContext } from '../../../context/InntektsmeldingContext';
import { InntektsmeldingVurderingKode } from '../../../types/KompletthetData';
import type { Tilstand } from '../../../types/KompletthetData';

interface FortsettUtenInntektsmeldingInfoProps {
  tilstand: Tilstand;
  redigeringsmodus: boolean;
  setRedigeringsmodus: (state: boolean) => void;
}

const FortsettUtenInntektsmeldingInfo = ({
  tilstand,
  redigeringsmodus,
  setRedigeringsmodus,
}: FortsettUtenInntektsmeldingInfoProps): JSX.Element | null => {
  const { readOnly } = useInntektsmeldingContext();

  if (
    tilstand?.vurdering === InntektsmeldingVurderingKode.KAN_FORTSETTE &&
    !redigeringsmodus &&
    tilstand.tilVurdering
  ) {
    return (
      <>
        <Alert variant="info" size="medium" className="mt-2">
          <div className="flex flex-col gap-4">
            <BodyShort>Fortsett uten inntektsmelding.</BodyShort>
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

export default FortsettUtenInntektsmeldingInfo;
