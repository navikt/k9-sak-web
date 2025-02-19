import { useState } from 'react';
import { Box } from '@navikt/ds-react';
import { Calender } from '@navikt/ds-icons';
import { DetailView, LabelledContent } from '@navikt/ft-plattform-komponenter';
import { LinkButton } from '@navikt/ft-plattform-komponenter';

import InstitusjonFerdigVisning from './InstitusjonFerdigVisning';
import InstitusjonForm from './InstitusjonForm';
import type { InstitusjonVurderingMedPerioder } from '../../InstitusjonTypes';
import Vurderingsresultat from '../../Vurderingsresultat';

interface OwnProps {
  vurdering: InstitusjonVurderingMedPerioder;
  readOnly: boolean;
  løsAksjonspunkt: (payload: any) => void;
}

/**
 * Komponent for visning av institusjonsdetaljer.
 * Kan vises i to moduser:
 * 1. Redigeringsform (når resultatet er MÅ_VURDERES eller redigering er aktivert)
 * 2. Visning av ferdig vurdering (med mulighet for å aktivere redigering)
 *
 * @param vurdering - Vurderingsdata for institusjonen
 * @param readOnly - Angir om komponenten skal være skrivebeskyttet
 * @param løsAksjonspunkt - Funksjon for å lagre endringer
 */
const InstitusjonDetails = ({ vurdering, readOnly, løsAksjonspunkt }: OwnProps) => {
  const [redigering, setRedigering] = useState(false);
  const visEndreLink = !readOnly && vurdering.resultat !== Vurderingsresultat.GODKJENT_AUTOMATISK;

  return (
    <DetailView
      title="Vurdering av institusjon"
      contentAfterTitleRenderer={() =>
        visEndreLink && !redigering ? (
          <LinkButton onClick={() => setRedigering(true)} className="ml-4">
            Endre vurdering
          </LinkButton>
        ) : null
      }
    >
      {vurdering.perioder.map(periode => (
        <div key={periode.prettifyPeriod()}>
          <Calender /> <span>{periode.prettifyPeriod()}</span>
        </div>
      ))}

      <Box className="mt-8">
        <LabelledContent
          label="På hvilken helseinstitusjon eller kompetansesenter foregår opplæringen?"
          content={vurdering.institusjon}
        />
      </Box>

      {vurdering.resultat !== Vurderingsresultat.MÅ_VURDERES && !redigering ? (
        <InstitusjonFerdigVisning vurdering={vurdering} readOnly={readOnly} rediger={() => setRedigering(true)} />
      ) : (
        <InstitusjonForm
          vurdering={vurdering}
          readOnly={readOnly}
          løsAksjonspunkt={løsAksjonspunkt}
          avbrytRedigering={() => setRedigering(false)}
          erRedigering={redigering}
        />
      )}
    </DetailView>
  );
};

export default InstitusjonDetails;
