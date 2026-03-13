import { BesteBeregningResultatType } from '@k9-sak-web/backend/ungsak/kontrakt/aktivitetspenger/BesteBeregningResultatType.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { formatDate } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { CheckmarkHeavyIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Box, Heading, HStack, InlineMessage, Loader, Table, VStack } from '@navikt/ds-react';
import { useQuery } from '@tanstack/react-query';
import type { AktivitetspengerBeregningBackendApiType } from './AktivitetspengerBeregningBackendApiType.js';
import styles from './aktivitetspengerBeregning.module.css';

const formatter = new Intl.NumberFormat('nb-NO', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const SelectedCell = ({ children }: { children: string }) => (
  <HStack gap="space-4" className={styles.selectedCell}>
    <CheckmarkHeavyIcon title="Besteberegning" fontSize="1.5rem" />
    <BodyShort>{children}</BodyShort>
  </HStack>
);

interface Props {
  behandling: Pick<BehandlingDto, 'uuid'>;
  api: AktivitetspengerBeregningBackendApiType;
}

const AktivitetspengerBeregning = ({ api, behandling }: Props) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['aktivitetspenger-beregningsgrunnlag', behandling.uuid],
    queryFn: () => api.getBeregningsgrunnnlag(behandling.uuid),
  });

  if (isLoading) {
    return <Loader size="large" />;
  }
  if (isError) {
    return <Alert variant="error">Noe gikk galt, vennligst prøv igjen senere</Alert>;
  }

  if (!data) {
    return <Alert variant="error">Ingen data tilgjengelig</Alert>;
  }
  const årstallForSkjæringstidspunkt = new Date(data.skjæringstidspunkt).getFullYear();
  const isBesteberegningSnittSisteTreÅr =
    data.besteBeregningResultatType === BesteBeregningResultatType.SNITT_SISTE_TRE_ÅR;
  const isBesteberegningSisteÅr = data.besteBeregningResultatType === BesteBeregningResultatType.SISTE_ÅR;

  return (
    <VStack gap="space-8">
      <Heading size="medium" level="1" spacing>
        Grunnlag for beregning
      </Heading>
      <VStack gap="space-36">
        <Box padding="space-16" background="info-soft" width="fit-content">
          <InlineMessage size="small" status="info">
            Skjæringstidspunkt for beregning {formatDate(data?.skjæringstidspunkt)}
          </InlineMessage>
        </Box>
        <div>
          <Heading size="small" level="2" spacing>
            Pensjonsgivende inntekt siste 3 år
          </Heading>
          {data.pgiÅrsinntekter.length > 0 && (
            <Box marginBlock="space-8 space-0" borderRadius="8" borderWidth="1" width="800px">
              <Table>
                <Table.Header>
                  <Table.Row className={styles.rowWithSpacing}>
                    <Table.HeaderCell>År</Table.HeaderCell>
                    <Table.HeaderCell align="right">Arbeid/Frilans</Table.HeaderCell>
                    <Table.HeaderCell align="right">Næring</Table.HeaderCell>
                    <Table.HeaderCell align="right">Sum</Table.HeaderCell>
                    <Table.HeaderCell align="right">Sum avkortet 6G</Table.HeaderCell>
                    <Table.HeaderCell align="right">G-justert({årstallForSkjæringstidspunkt})</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {data.pgiÅrsinntekter.map(pgi => {
                    const isBesteberegning = isBesteberegningSisteÅr && pgi.årstall === årstallForSkjæringstidspunkt;
                    return (
                      <Table.Row key={pgi.årstall} className={styles.rowWithSpacing}>
                        <Table.DataCell>{pgi.årstall}</Table.DataCell>
                        <Table.DataCell align="right">{formatter.format(pgi.arbeidsinntekt)}</Table.DataCell>
                        <Table.DataCell align="right">{formatter.format(pgi.næring)}</Table.DataCell>
                        <Table.DataCell align="right">{formatter.format(pgi.sum)}</Table.DataCell>
                        <Table.DataCell align="right">{formatter.format(pgi.sumAvkortet)}</Table.DataCell>
                        <Table.DataCell align="right">
                          {isBesteberegning ? (
                            <SelectedCell>{formatter.format(pgi.sumAvkortetOgOppjustert)}</SelectedCell>
                          ) : (
                            formatter.format(pgi.sumAvkortetOgOppjustert)
                          )}
                        </Table.DataCell>
                      </Table.Row>
                    );
                  })}
                  <Table.Row className={`${styles.bottomCell} ${styles.rowWithSpacing}`}>
                    <Table.HeaderCell scope="row" colSpan={5}>
                      Gjennomsnittlig pensjonsgivende inntekt siste 3 år{' '}
                    </Table.HeaderCell>
                    <Table.DataCell align="right">
                      {isBesteberegningSnittSisteTreÅr ? (
                        <SelectedCell>{formatter.format(data.årsinntektSisteTreÅr)}</SelectedCell>
                      ) : (
                        formatter.format(data.årsinntektSisteTreÅr)
                      )}
                    </Table.DataCell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Box>
          )}
        </div>
        <div>
          <Heading size="small" level="2" spacing>
            Beregning av dagsats
          </Heading>
          <Box marginBlock="space-8 space-0" borderRadius="8" borderWidth="1" width="800px">
            <Table>
              <Table.Body>
                <Table.Row className={styles.rowWithSpacing}>
                  <Table.DataCell scope="row">Beregningsgrunnlag redusert til 66 %</Table.DataCell>
                  <Table.DataCell align="right">{formatter.format(data.beregningsgrunnlagRedusert)}</Table.DataCell>
                </Table.Row>
                <Table.Row className={`${styles.bottomCell} ${styles.rowWithSpacing}`}>
                  <Table.HeaderCell scope="row">Dagsats (beregningsgrunnlag/260 dager)</Table.HeaderCell>
                  <Table.DataCell align="right">{formatter.format(data.dagsats)}</Table.DataCell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Box>
        </div>
      </VStack>
    </VStack>
  );
};

export default AktivitetspengerBeregning;
