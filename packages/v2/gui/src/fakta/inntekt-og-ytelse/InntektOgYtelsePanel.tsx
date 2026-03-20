import type { InntektDto } from '@k9-sak-web/backend/k9sak/kontrakt/opptjening/InntektDto.js';
import { BodyShort, Box, Table } from '@navikt/ds-react';
import PeriodLabel from '../../shared/periodLabel/PeriodLabel.js';
import { formatCurrencyWithKr } from '../../utils/formatters.js';

const kolonneoverskrifter = ['Arbeidsgiver/ytelse', 'Periode', 'Beløp'];

const sorterInntekter = (a: InntektDto, b: InntektDto) => b.fom.localeCompare(a.fom);

interface InntektOgYtelsePanelProps {
  inntekter?: InntektDto[];
}

const InntektOgYtelsePanel = ({ inntekter }: InntektOgYtelsePanelProps) => {
  if (!inntekter || inntekter.length === 0) {
    return (
      <Box padding="space-16" borderWidth="1" borderRadius="4">
        <BodyShort size="small">Ingen inntekt i Norge de siste tre månedene</BodyShort>
      </Box>
    );
  }

  return (
    <Box padding="space-16" borderWidth="1" borderRadius="4">
      <Table>
        <Table.Header>
          <Table.Row>
            {kolonneoverskrifter.map(tekst => (
              <Table.HeaderCell scope="col" key={tekst}>
                {tekst}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {[...inntekter].sort(sorterInntekter).map(inntekt => {
            const key = `${inntekt.navn ?? ''}${inntekt.utbetaler ?? ''}${inntekt.fom}${inntekt.tom}${inntekt.belop ?? 0}`;
            return (
              <Table.Row key={key} id={key}>
                <Table.DataCell>{inntekt.utbetaler}</Table.DataCell>
                <Table.DataCell>
                  <PeriodLabel showTodayString dateStringFom={inntekt.fom} dateStringTom={inntekt.tom} />
                </Table.DataCell>
                <Table.DataCell>{inntekt.belop != null ? formatCurrencyWithKr(inntekt.belop) : ''}</Table.DataCell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </Box>
  );
};

export default InntektOgYtelsePanel;
