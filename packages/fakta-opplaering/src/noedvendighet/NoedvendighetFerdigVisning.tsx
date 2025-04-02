import { FaktaOpplaeringContext } from '@k9-sak-web/behandling-opplaeringspenger/src/FaktaOpplaeringContext';
import { NoedvendighetVurdering, Vurderingsresultat } from '@k9-sak-web/types';
import { Calender } from '@navikt/ds-icons';
import { AssessedBy, BasicList, DetailView, LinkButton } from '@navikt/ft-plattform-komponenter';
import { useContext } from 'react';

import { LabelledContent } from '@k9-sak-web/gui/shared/labelledContent/LabelledContent.js';
import { Box } from '@navikt/ds-react';
import { useIntl } from 'react-intl';
import DokumentLink from '../components/DokumentLink';
import styles from './noedvendighetFerdigVisning.module.css';

interface OwnProps {
  vurdering: NoedvendighetVurdering;
  rediger: () => void;
}

const NoedvendighetFerdigVisning = ({ vurdering, rediger }: OwnProps) => {
  const { readOnly, opplaeringDokumenter } = useContext(FaktaOpplaeringContext);
  const intl = useIntl();

  return (
    <DetailView
      title="Vurdering av nødvendighet"
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
        <div key={periode.prettifyPeriod()}>
          <Calender /> <span>{periode.prettifyPeriod()}</span>
        </div>
      ))}
      <Box marginBlock="4 0">
        <LabelledContent
          label="Hvilke dokumenter er brukt i vurderingen om gjennomført opplæring?"
          content={
            <Box marginBlock="4 0">
              <BasicList
                elements={opplaeringDokumenter
                  .map(dokument => ({ ...dokument, benyttet: vurdering.tilknyttedeDokumenter.includes(dokument.id) }))
                  .filter(({ benyttet }) => benyttet)
                  .map(dokument => (
                    <DokumentLink dokument={dokument} visDokumentIkon />
                  ))}
              />
            </Box>
          }
        />
      </Box>
      <Box marginBlock="8 0">
        <LabelledContent
          label={intl.formatMessage({ id: 'noedvendighet.vurdering.label' })}
          content={<span className="whitespace-pre-wrap">{vurdering.begrunnelse}</span>}
          indentContent
        />
        <AssessedBy ident={vurdering.vurdertAv} date={vurdering?.vurdertTidspunkt} />
      </Box>
      <Box marginBlock="8 0">
        <LabelledContent
          label={intl.formatMessage({ id: 'noedvendighet.noedvendigOpplaering.label' })}
          content={[Vurderingsresultat.GODKJENT].includes(vurdering.resultat) ? 'Ja' : 'Nei'}
        />
      </Box>
    </DetailView>
  );
};

export default NoedvendighetFerdigVisning;
