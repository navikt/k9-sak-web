import { LabelledContent } from '@k9-sak-web/gui/shared/labelledContent/LabelledContent.js';
import { InstitusjonVurderingMedPerioder, Vurderingsresultat } from '@k9-sak-web/types';
import { Calender } from '@navikt/ds-icons';
import { Box } from '@navikt/ds-react';
import { AssessedBy, DetailView, LinkButton } from '@navikt/ft-plattform-komponenter';
import styles from './institusjonFerdigVisning.module.css';

interface OwnProps {
  vurdering: InstitusjonVurderingMedPerioder;
  readOnly: boolean;
  rediger: () => void;
}

const InstitusjonFerdigVisning = ({ vurdering, readOnly, rediger }: OwnProps) => {
  const visEndreLink = !readOnly && vurdering.resultat !== Vurderingsresultat.GODKJENT_AUTOMATISK;

  return (
    <DetailView
      title="Vurdering av institusjon"
      // eslint-disable-next-line react/jsx-no-useless-fragment
      contentAfterTitleRenderer={() =>
        visEndreLink ? (
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
      <Box marginBlock="8 0">
        <LabelledContent
          label="På hvilken helseinstitusjon eller kompetansesenter foregår opplæringen?"
          content={vurdering.institusjon}
        />
      </Box>
      <Box marginBlock="8 0">
        <LabelledContent
          // eslint-disable-next-line max-len
          label="Gjør en vurdering av om opplæringen gjennomgås ved en godkjent helseinstitusjon eller et offentlig spesialpedagogisk kompetansesenter etter § 9-14, første ledd."
          content={<span className="whitespace-pre-wrap">{vurdering.begrunnelse}</span>}
          indentContent
        />
        <AssessedBy ident={vurdering?.vurdertAv} date={vurdering?.vurdertTidspunkt} />
      </Box>
      <Box marginBlock="8 0">
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
