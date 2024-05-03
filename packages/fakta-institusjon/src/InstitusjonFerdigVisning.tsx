import { useSaksbehandlerOppslag } from '@k9-sak-web/shared-components';
import { InstitusjonVurderingMedPerioder, Vurderingsresultat } from '@k9-sak-web/types';
import { Calender } from '@navikt/ds-icons';
import { AssessedBy, Box, DetailView, LabelledContent, LinkButton, Margin } from '@navikt/ft-plattform-komponenter';
import React from 'react';
import styles from './institusjonFerdigVisning.module.css';

interface OwnProps {
  vurdering: InstitusjonVurderingMedPerioder;
  readOnly: boolean;
  rediger: () => void;
}

const InstitusjonFerdigVisning = ({ vurdering, readOnly, rediger }: OwnProps) => {
  const { hentSaksbehandlerNavn } = useSaksbehandlerOppslag();

  return (
    <DetailView
      title="Vurdering av institusjon"
      // eslint-disable-next-line react/jsx-no-useless-fragment
      contentAfterTitleRenderer={() =>
        !readOnly ? (
          <LinkButton onClick={rediger} className={styles.endreLink}>
            Endre vurdering
          </LinkButton>
        ) : null
      }
    >
      {vurdering.perioder.map(periode => (
        <div>
          <Calender /> <span>{periode.prettifyPeriod()}</span>
        </div>
      ))}
      <Box marginTop={Margin.xLarge}>
        <LabelledContent
          label="På hvilken helseinstitusjon eller kompetansesenter foregår opplæringen?"
          content={vurdering.institusjon}
        />
      </Box>
      <Box marginTop={Margin.xLarge}>
        <LabelledContent
          // eslint-disable-next-line max-len
          label="Gjør en vurdering av om opplæringen gjennomgås ved en godkjent helseinstitusjon eller et offentlig spesialpedagogisk kompetansesenter etter § 9-14, første ledd."
          content={vurdering.begrunnelse}
          indentContent
        />
        <AssessedBy name={hentSaksbehandlerNavn(vurdering?.vurdertAv)} date={vurdering?.vurdertTidspunkt} />
      </Box>
      <Box marginTop={Margin.xLarge}>
        <LabelledContent
          label="Er opplæringen ved godkjent helseinstitusjon eller kompetansesenter?"
          content={
            [Vurderingsresultat.GODKJENT_AUTOMATISK, Vurderingsresultat.GODKJENT_MANUELT].includes(vurdering.resultat)
              ? 'Ja'
              : 'Nei'
          }
        />
      </Box>
    </DetailView>
  );
};

export default InstitusjonFerdigVisning;
