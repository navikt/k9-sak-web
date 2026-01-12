import { LabelledContent } from '@k9-sak-web/gui/shared/labelled-content/LabelledContent.js';
import { VurdertAv } from '@k9-sak-web/gui/shared/vurdert-av/VurdertAv.js';
import { Edit } from '@navikt/ds-icons';
import { Alert, Button } from '@navikt/ds-react';
import type { JSX } from 'react';
import useContainerContext from '../../../context/useContainerContext';
import { Kode, Tilstand } from '../../../types/KompletthetData';
import styles from './periodList.module.css';

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
  const { readOnly } = useContainerContext();

  const kode = tilstand?.vurdering?.kode;

  if ([Kode.MANGLENDE_GRUNNLAG, Kode.IKKE_INNTEKTSTAP].includes(kode) && !redigeringsmodus && tilstand.tilVurdering) {
    return (
      <>
        <Alert variant="error" size="medium" className={styles.periodList__alertstripe}>
          {kode === Kode.MANGLENDE_GRUNNLAG && (
            <span>Søknaden avslås på grunn av manglende opplysninger om inntekt</span>
          )}
          {kode === Kode.IKKE_INNTEKTSTAP && (
            <span>Søknaden avslås fordi søker ikke har dokumentert tapt arbeidsinntekt</span>
          )}
          {!readOnly && (
            <Button variant="secondary" size="small" onClick={() => setRedigeringsmodus(true)} icon={<Edit />}>
              <span>Rediger vurdering</span>
            </Button>
          )}
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
