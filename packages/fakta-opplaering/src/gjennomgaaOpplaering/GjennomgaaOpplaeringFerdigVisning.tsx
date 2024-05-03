import {
  FaktaOpplaeringContext,
  FaktaOpplaeringContextTypes,
} from '@k9-sak-web/behandling-opplaeringspenger/src/FaktaOpplaeringContext';
import { useSaksbehandlerOppslag } from '@k9-sak-web/shared-components';
import { GjennomgaaOpplaeringVurdering, Vurderingsresultat } from '@k9-sak-web/types';
import { Calender } from '@navikt/ds-icons';
import {
  AssessedBy,
  BasicList,
  Box,
  DetailView,
  LabelledContent,
  LinkButton,
  Margin,
} from '@navikt/ft-plattform-komponenter';
import React, { useContext } from 'react';
import { useIntl } from 'react-intl';
import DokumentLink from '../components/DokumentLink';
import styles from './GjennomgaaOpplaeringFerdigVisning.module.css';

interface OwnProps {
  vurdering: GjennomgaaOpplaeringVurdering;
  rediger: () => void;
}

const GjennomgaaOpplaeringFerdigVisning = ({ vurdering, rediger }: OwnProps) => {
  const { hentSaksbehandlerNavn } = useSaksbehandlerOppslag();

  const { readOnly, opplaeringDokumenter } = useContext<FaktaOpplaeringContextTypes>(FaktaOpplaeringContext);
  const intl = useIntl();

  return (
    <DetailView
      title="Vurdering av opplæring"
      // eslint-disable-next-line react/jsx-no-useless-fragment
      contentAfterTitleRenderer={() =>
        !readOnly ? (
          <LinkButton onClick={rediger} className={styles.endreLink}>
            Endre vurdering
          </LinkButton>
        ) : null
      }
    >
      <div>
        <Calender />
        <span>{vurdering.opplæring.prettifyPeriod()}</span>
      </div>
      <Box marginTop={Margin.medium}>
        <LabelledContent
          label="Hvilke dokumenter er brukt i vurderingen om gjennomført opplæring??"
          content={
            <Box marginTop={Margin.medium}>
              <BasicList
                elements={opplaeringDokumenter
                  .map(dokument => ({ ...dokument, benyttet: vurdering?.tilknyttedeDokumenter?.includes(dokument.id) }))
                  .filter(({ benyttet }) => benyttet)
                  .map(dokument => (
                    <DokumentLink dokument={dokument} visDokumentIkon />
                  ))}
              />
            </Box>
          }
        />
      </Box>
      <Box marginTop={Margin.xLarge}>
        <LabelledContent
          label={intl.formatMessage({ id: 'opplaering.vurdering.label' })}
          content={vurdering.begrunnelse}
          indentContent
        />
        <AssessedBy name={hentSaksbehandlerNavn(vurdering.vurdertAv)} date={vurdering?.vurdertTidspunkt} />
      </Box>
      <Box marginTop={Margin.xLarge}>
        <LabelledContent
          label={intl.formatMessage({ id: 'opplaering.gjennomfoertOpplaering.label' })}
          content={[Vurderingsresultat.GODKJENT].includes(vurdering.resultat) ? 'Ja' : 'Nei'}
        />
      </Box>
      <Box marginTop={Margin.xLarge}>
        <LabelledContent
          label={intl.formatMessage({ id: 'opplaering.perioder.label' })}
          content={vurdering.opplæring.prettifyPeriod()}
        />
      </Box>
    </DetailView>
  );
};

export default GjennomgaaOpplaeringFerdigVisning;
