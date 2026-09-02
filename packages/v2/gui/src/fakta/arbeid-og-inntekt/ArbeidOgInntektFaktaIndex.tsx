import type {
  AktivitetDto,
  ARegisterOpplysningerDto,
  PermisjonDto,
} from '@k9-sak-web/backend/k9sak/kontrakt/arbeidoginntekt/ArbeidOgInntektResponse.js';
import { ArbeidsforholdAktivitetStatus } from '@k9-sak-web/backend/k9sak/kodeverk/arbeidsforhold/AktivitetStatus.js';
import type { K9Kodeverkoppslag } from '@k9-sak-web/gui/kodeverk/oppslag/useK9Kodeverkoppslag.js';
import { K9KodeverkoppslagContext } from '@k9-sak-web/gui/kodeverk/oppslag/K9KodeverkoppslagContext.js';
import { OrUndefined } from '@k9-sak-web/gui/kodeverk/oppslag/GeneriskKodeverkoppslag.js';
import { TIDENES_ENDE } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { dateToday, initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
import { InformationSquareIcon } from '@navikt/aksel-icons';
import {
  BodyShort,
  Detail,
  Heading,
  HelpText,
  HStack,
  InfoCard,
  Label,
  Select,
  Table,
  Tag,
  Tooltip,
} from '@navikt/ds-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useContext, useState } from 'react';
import { formatCurrencyWithoutKr, formatDate, timeFormat } from '../../utils/formatters.js';
import { useArbeidOgInntektOptions } from './api/ArbeidOgInntektQueries.js';
import styles from './arbeidOgInntektFakta.module.css';

interface ArbeidOgInntektFaktaIndexProps {
  behandlingUuid: string;
}

const formatPeriode = (periode?: { fom: string; tom: string }) => {
  if (!periode) return '-';
  const fom = formatDate(periode.fom);
  const tom = periode.tom ? formatDate(periode.tom) : '';
  return tom ? `${fom} - ${tom}` : `${fom} -`;
};

const formatPermisjon = (perm: PermisjonDto) => {
  const periodeStr = perm.periode ? formatPeriode(perm.periode) : '';
  const typeStr = perm.type ?? '';
  return `${periodeStr}${typeStr ? ` (${typeStr})` : ''}`;
};

// Fiktiv sluttdato (TIDENES_ENDE) vises som åpen periode, og en fremtidig sluttdato vises i kursiv
const Periode = ({ periode }: { periode?: { fom: string; tom: string } }) => {
  if (!periode) return <>-</>;
  const fom = formatDate(periode.fom);
  if (!periode.tom || periode.tom === TIDENES_ENDE) {
    return <>{fom} -</>;
  }
  if (!initializeDate(periode.tom).isAfter(dateToday())) {
    return (
      <>
        {fom} - {formatDate(periode.tom)}
      </>
    );
  }
  return (
    <>
      {fom} -<br />
      <em>sluttdato {formatDate(periode.tom)}</em>
    </>
  );
};

const aktivitetStatusNavn = (status?: string): string => {
  if (!status) return '-';
  switch (status) {
    case ArbeidsforholdAktivitetStatus.ARBEIDSTAKER:
      return 'Arbeidstaker';
    case ArbeidsforholdAktivitetStatus.FRILANSER:
      return 'Frilans';
    case ArbeidsforholdAktivitetStatus.SELVSTENDIG_NÆRINGSDRIVENDE:
      return 'Selvstendig næringsdrivende';
    default:
      return status;
  }
};

const ARegisterDetaljer = ({ aRegister }: { aRegister: ARegisterOpplysningerDto }) => (
  <div className={styles['expandedCard']}>
    <BodyShort size="small" weight="semibold">
      Opplysninger fra Aa-registeret
    </BodyShort>
    <div className={styles['expandedRows']}>
      <div className={styles['expandedRow']}>
        <BodyShort size="small" weight="semibold" className={styles['expandedLabel']}>
          Org. nr.
        </BodyShort>
        <BodyShort size="small">{aRegister.organisasjonsnummer ?? null}</BodyShort>
      </div>

      <div className={styles['expandedRow']}>
        <BodyShort size="small" weight="semibold" className={styles['expandedLabel']}>
          Ansatt i periode
        </BodyShort>
        <BodyShort size="small">
          <Periode periode={aRegister.ansettelsesperiode} />
        </BodyShort>
      </div>

      <div className={styles['expandedRow']}>
        <BodyShort size="small" weight="semibold" className={styles['expandedLabel']}>
          Stillingsprosent
        </BodyShort>
        <BodyShort size="small">
          {aRegister.stillingsprosent != null ? `${aRegister.stillingsprosent} %` : '-'}
        </BodyShort>
      </div>

      {aRegister.permisjoner && aRegister.permisjoner.length > 0 && (
        <div className={styles['expandedRow']}>
          <BodyShort size="small" weight="semibold" className={styles['expandedLabel']}>
            Permisjoner
          </BodyShort>
          <BodyShort size="small">
            {aRegister.permisjoner.map((p, i) => (
              <span key={i}>
                {formatPermisjon(p)}
                {i < aRegister.permisjoner!.length - 1 && <br />}
              </span>
            ))}
          </BodyShort>
        </div>
      )}
    </div>
    {aRegister.sistEndret && (
      <div className={styles['sistEndret']}>
        <Detail>Sist endret</Detail>
        <Detail>
          {formatDate(aRegister.sistEndret)} kl. {timeFormat(aRegister.sistEndret)}
        </Detail>
      </div>
    )}
  </div>
);

const BeregningsgrunnlagKildeTag = ({ status }: { status?: string }) => {
  if (!status) return null;
  const config: Record<
    string,
    { label: string; color: 'warning' | 'neutral' | 'info' | 'meta-purple'; tooltip: string }
  > = {
    [ArbeidsforholdAktivitetStatus.ARBEIDSTAKER]: {
      label: 'IM',
      color: 'warning',
      tooltip: 'Hentet fra inntektsmeldingen',
    },
    [ArbeidsforholdAktivitetStatus.FRILANSER]: { label: 'AI', color: 'info', tooltip: 'Hentet fra A-Inntekt' },
    [ArbeidsforholdAktivitetStatus.SELVSTENDIG_NÆRINGSDRIVENDE]: {
      label: 'SI',
      color: 'meta-purple',
      tooltip: 'Hentet fra Sigrun',
    },
  };
  const entry = config[status];
  if (!entry) return null;
  return (
    <Tooltip content={entry.tooltip} placement="right">
      <Tag size="small" variant="outline" data-color={entry.color}>
        {entry.label}
      </Tag>
    </Tooltip>
  );
};

const AktivitetTabell = ({
  aktiviteter,
  kodeverkoppslag,
}: {
  aktiviteter: AktivitetDto[];
  kodeverkoppslag: K9Kodeverkoppslag;
}) => {
  const totaltBeregningsgrunnlag = aktiviteter.reduce((sum, a) => sum + (a.beregningsgrunnlagPrÅr ?? 0), 0);
  const totaltNormalarbeidstid = aktiviteter.reduce((sum, a) => sum + (a.normalarbeidstidTimerPerUke ?? 0), 0);
  const totaltFordeling = aktiviteter.reduce((sum, a) => sum + (a.fordelingsprosent ?? 0), 0);
  const beregningIkkeGjennomført = aktiviteter.every(a => a.beregningsgrunnlagPrÅr == null);

  return (
    <>
      {beregningIkkeGjennomført && (
        <InfoCard data-color="info" className={styles['infoCard']}>
          <InfoCard.Message icon={<InformationSquareIcon aria-hidden />}>
            Kan ikke vise beregnet årsinntekt og fordeling over 6G før beregning er gjennomført.
          </InfoCard.Message>
        </InfoCard>
      )}
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">
              <Label size="small">Arbeidskategori</Label>
            </Table.HeaderCell>
            <Table.HeaderCell scope="col">
              <Label size="small">Virksomhetsnavn</Label>
            </Table.HeaderCell>
            <Table.HeaderCell scope="col">
              <Label size="small">Ansettelsesperiode</Label>
            </Table.HeaderCell>
            <Table.HeaderCell scope="col" align="right">
              <Label size="small">Normalarbeidstid</Label>
              <BodyShort size="small">fra søknad, pr uke</BodyShort>
            </Table.HeaderCell>
            <Table.HeaderCell scope="col" align="right">
              <Label size="small">Beregningsgrunnlag</Label>
              <BodyShort size="small">beregnet årsinntekt</BodyShort>
            </Table.HeaderCell>
            <Table.HeaderCell scope="col" align="right">
              <HStack align="center" justify="end" gap="space-4" wrap={false}>
                <div>
                  <Label size="small">Fordeling</Label>
                  <BodyShort size="small">over 6G</BodyShort>
                </div>
                <HelpText placement="top">Viser kun fordeling hvis det er inntekt over 6G</HelpText>
              </HStack>
            </Table.HeaderCell>
            <Table.HeaderCell scope="col">
              <Label size="small">Refusjonskrav</Label>
            </Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {aktiviteter.map((aktivitet, index) => {
            const statusNavn = aktivitet.arbeidsstatus
              ? (kodeverkoppslag.k9sak.aktivitetStatuser(aktivitet.arbeidsstatus, OrUndefined)?.navn ??
                aktivitetStatusNavn(aktivitet.arbeidsstatus))
              : '-';

            return (
              <Table.ExpandableRow
                key={`${aktivitet.arbeidsstatus ?? 'ukjent'}-${aktivitet.arbeidsgiverNavn ?? 'ukjent'}-${aktivitet.ansettelsesperiode?.fom ?? ''}-${aktivitet.ansettelsesperiode?.tom ?? ''}`}
                content={aktivitet.aRegister ? <ARegisterDetaljer aRegister={aktivitet.aRegister} /> : undefined}
                expansionDisabled={!aktivitet.aRegister}
                expandOnRowClick
                togglePlacement="right"
              >
                <Table.DataCell>
                  <BodyShort size="small">{statusNavn}</BodyShort>
                </Table.DataCell>
                <Table.DataCell>
                  <BodyShort size="small">{aktivitet.arbeidsgiverNavn ?? '-'}</BodyShort>
                </Table.DataCell>
                <Table.DataCell>
                  <BodyShort size="small">
                    <Periode periode={aktivitet.ansettelsesperiode} />
                  </BodyShort>
                </Table.DataCell>
                <Table.DataCell align="right">
                  <BodyShort size="small">{aktivitet.normalarbeidstidTimerPerUke ?? '-'}</BodyShort>
                </Table.DataCell>
                <Table.DataCell align="right">
                  {aktivitet.beregningsgrunnlagPrÅr != null ? (
                    <HStack gap="space-8" justify="end" align="center">
                      <BodyShort size="small">{formatCurrencyWithoutKr(aktivitet.beregningsgrunnlagPrÅr)}</BodyShort>
                      <BeregningsgrunnlagKildeTag status={aktivitet.arbeidsstatus} />
                    </HStack>
                  ) : null}
                </Table.DataCell>
                <Table.DataCell align="right">
                  <BodyShort size="small">
                    {aktivitet.fordelingsprosent != null ? `${aktivitet.fordelingsprosent} %` : null}
                  </BodyShort>
                </Table.DataCell>
                <Table.DataCell>
                  <BodyShort size="small">
                    {aktivitet.harRefusjonskrav != null ? (aktivitet.harRefusjonskrav ? 'Ja' : 'Nei') : null}
                  </BodyShort>
                </Table.DataCell>
              </Table.ExpandableRow>
            );
          })}
          <Table.Row>
            <Table.DataCell colSpan={3}>
              <Label size="small">Totalt</Label>
            </Table.DataCell>
            <Table.DataCell align="right">
              <Label size="small">{totaltNormalarbeidstid || ''}</Label>
            </Table.DataCell>
            <Table.DataCell align="right">
              <Label size="small">{formatCurrencyWithoutKr(totaltBeregningsgrunnlag)}</Label>
            </Table.DataCell>
            <Table.DataCell align="right">
              <Label size="small">{totaltFordeling ? `${totaltFordeling} %` : ''}</Label>
            </Table.DataCell>
            <Table.DataCell colSpan={2} />
          </Table.Row>
        </Table.Body>
      </Table>
    </>
  );
};

const NyInntektTabell = ({
  senereInnslag,
  skjæringstidspunkt,
  kodeverkoppslag,
}: {
  senereInnslag: AktivitetDto[];
  skjæringstidspunkt: string;
  kodeverkoppslag: K9Kodeverkoppslag;
}) => {
  if (senereInnslag.length === 0) return null;

  return (
    <>
      <HStack align="center" gap="space-4" className={styles['sectionHeadingRow']}>
        <Heading size="xsmall" level="3">
          Arbeid etter skjæringstidspunkt {formatDate(skjæringstidspunkt)}
        </Heading>
        <HelpText placement="right">Viser aktiviteter som har startet etter valgt skjæringstidspunkt</HelpText>
      </HStack>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">
              <Label size="small">Arbeidskategori</Label>
            </Table.HeaderCell>
            <Table.HeaderCell scope="col">
              <Label size="small">Virksomhetsnavn</Label>
            </Table.HeaderCell>
            <Table.HeaderCell scope="col">
              <Label size="small">Ansettelsesperiode</Label>
            </Table.HeaderCell>
            <Table.HeaderCell scope="col">
              <Label size="small">Refusjonskrav</Label>
            </Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {senereInnslag.map((aktivitet, index) => {
            const statusNavn = aktivitet.arbeidsstatus
              ? (kodeverkoppslag.k9sak.aktivitetStatuser(aktivitet.arbeidsstatus, OrUndefined)?.navn ??
                aktivitetStatusNavn(aktivitet.arbeidsstatus))
              : null;

            return (
              <Table.ExpandableRow
                key={index}
                content={aktivitet.aRegister ? <ARegisterDetaljer aRegister={aktivitet.aRegister} /> : undefined}
                expansionDisabled={!aktivitet.aRegister}
                expandOnRowClick
                togglePlacement="right"
              >
                <Table.DataCell>
                  <BodyShort size="small">{statusNavn}</BodyShort>
                </Table.DataCell>
                <Table.DataCell>
                  <BodyShort size="small">{aktivitet.arbeidsgiverNavn ?? null}</BodyShort>
                </Table.DataCell>
                <Table.DataCell>
                  <BodyShort size="small">
                    <Periode periode={aktivitet.ansettelsesperiode} />
                  </BodyShort>
                </Table.DataCell>
                <Table.DataCell>
                  <BodyShort size="small">
                    {aktivitet.harRefusjonskrav != null ? (aktivitet.harRefusjonskrav ? 'Ja' : 'Nei') : null}
                  </BodyShort>
                </Table.DataCell>
              </Table.ExpandableRow>
            );
          })}
        </Table.Body>
      </Table>
    </>
  );
};

const ArbeidOgInntektFaktaIndex = ({ behandlingUuid }: ArbeidOgInntektFaktaIndexProps) => {
  const { data: arbeidOgInntektListe } = useSuspenseQuery(useArbeidOgInntektOptions(behandlingUuid));
  const kodeverkoppslag = useContext(K9KodeverkoppslagContext);

  const [valgtIndex, setValgtIndex] = useState(0);
  const valgtSkjæringstidspunkt = arbeidOgInntektListe[valgtIndex];

  if (!arbeidOgInntektListe.length) {
    return (
      <div className={styles['container']}>
        <Heading size="small" level="2" spacing>
          Arbeid og inntekt
        </Heading>
        <BodyShort>Ingen data tilgjengelig.</BodyShort>
      </div>
    );
  }

  return (
    <div className={styles['container']}>
      <Heading size="small" level="2" spacing>
        Arbeid og inntekt
      </Heading>

      {arbeidOgInntektListe.length > 1 ? (
        <HStack>
          <Select
            label="Skjæringstidspunkt"
            size="small"
            value={valgtIndex}
            onChange={e => setValgtIndex(Number(e.target.value))}
          >
            {arbeidOgInntektListe.map((stp, i) => (
              <option key={stp.skjæringstidspunkt} value={i}>
                {formatDate(stp.skjæringstidspunkt)}
              </option>
            ))}
          </Select>
        </HStack>
      ) : (
        <>
          <Label size="small" spacing>
            Skjæringstidspunkt
          </Label>
          <BodyShort size="small">{formatDate(arbeidOgInntektListe[0]!.skjæringstidspunkt)}</BodyShort>
        </>
      )}

      {valgtSkjæringstidspunkt && (
        <>
          <AktivitetTabell aktiviteter={valgtSkjæringstidspunkt.aktiviteter} kodeverkoppslag={kodeverkoppslag} />
          <NyInntektTabell
            senereInnslag={valgtSkjæringstidspunkt.senereInnslag}
            skjæringstidspunkt={valgtSkjæringstidspunkt.skjæringstidspunkt}
            kodeverkoppslag={kodeverkoppslag}
          />
        </>
      )}
    </div>
  );
};

export default ArbeidOgInntektFaktaIndex;
