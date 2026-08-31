import type {
  AktivitetDto,
  ArbeidOgInntektResponse,
  ARegisterOpplysningerDto,
  PermisjonDto,
} from '@k9-sak-web/backend/k9sak/kontrakt/arbeidoginntekt/ArbeidOgInntektResponse.js';
import { ArbeidsforholdAktivitetStatus } from '@k9-sak-web/backend/k9sak/kodeverk/arbeidsforhold/AktivitetStatus.js';
import type { K9Kodeverkoppslag } from '@k9-sak-web/gui/kodeverk/oppslag/useK9Kodeverkoppslag.js';
import { K9KodeverkoppslagContext } from '@k9-sak-web/gui/kodeverk/oppslag/K9KodeverkoppslagContext.js';
import { OrUndefined } from '@k9-sak-web/gui/kodeverk/oppslag/GeneriskKodeverkoppslag.js';
import { BodyShort, Detail, Heading, Label, Select, Table, Tag } from '@navikt/ds-react';
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
  <div>
    <Label size="small" spacing>
      Opplysninger fra A-registeret
    </Label>
    <div className={styles['expandedContent']}>
      <BodyShort size="small" className={styles['expandedLabel']}>
        Org. nr.
      </BodyShort>
      <BodyShort size="small">{aRegister.organisasjonsnummer ?? '-'}</BodyShort>

      <BodyShort size="small" className={styles['expandedLabel']}>
        Ansatt i periode
      </BodyShort>
      <BodyShort size="small">{formatPeriode(aRegister.ansettelsesperiode)}</BodyShort>

      <BodyShort size="small" className={styles['expandedLabel']}>
        Stillingsprosent
      </BodyShort>
      <BodyShort size="small">{aRegister.stillingsprosent != null ? `${aRegister.stillingsprosent} %` : '-'}</BodyShort>

      {aRegister.permisjoner && aRegister.permisjoner.length > 0 && (
        <>
          <BodyShort size="small" className={styles['expandedLabel']}>
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
        </>
      )}
    </div>
    {aRegister.sistEndret && (
      <Detail className={styles['sistEndret']}>
        Sist endret {formatDate(aRegister.sistEndret)} kl. {timeFormat(aRegister.sistEndret)}
      </Detail>
    )}
  </div>
);

const BeregningsgrunnlagKildeTag = ({ status }: { status?: string }) => {
  if (!status) return null;
  const config: Record<string, { label: string; color: 'warning' | 'neutral' | 'info' | 'meta-purple' }> = {
    [ArbeidsforholdAktivitetStatus.ARBEIDSTAKER]: { label: 'IM', color: 'warning' },
    [ArbeidsforholdAktivitetStatus.FRILANSER]: { label: 'AO', color: 'info' },
    [ArbeidsforholdAktivitetStatus.SELVSTENDIG_NÆRINGSDRIVENDE]: { label: 'SIG', color: 'meta-purple' },
  };
  const entry = config[status];
  if (!entry) return null;
  return (
    <Tag size="small" variant="outline" data-color={entry.color}>
      {entry.label}
    </Tag>
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

  return (
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
            <BodyShort size="small">Ansettelsesperiode</BodyShort>
          </Table.HeaderCell>
          <Table.HeaderCell scope="col" align="right">
            <Label size="small">Normalarbeidstid</Label>
            <BodyShort size="small">fra søknad, pr uke</BodyShort>
          </Table.HeaderCell>
          <Table.HeaderCell scope="col" align="right">
            <Label size="small">Beregningsgrunnlag</Label>
            <BodyShort size="small">beregnet årsinnntekt</BodyShort>
          </Table.HeaderCell>
          <Table.HeaderCell scope="col" align="right">
            <Label size="small">Fordeling</Label>
            <BodyShort size="small">over 6G</BodyShort>
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
              key={index}
              content={aktivitet.aRegister ? <ARegisterDetaljer aRegister={aktivitet.aRegister} /> : undefined}
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
                <BodyShort size="small">{formatPeriode(aktivitet.ansettelsesperiode)}</BodyShort>
              </Table.DataCell>
              <Table.DataCell align="right">
                <BodyShort size="small">{aktivitet.normalarbeidstidTimerPerUke ?? '-'}</BodyShort>
              </Table.DataCell>
              <Table.DataCell align="right">
                <BodyShort size="small">
                  {aktivitet.beregningsgrunnlagPrÅr != null
                    ? formatCurrencyWithoutKr(aktivitet.beregningsgrunnlagPrÅr)
                    : '-'}{' '}
                  <BeregningsgrunnlagKildeTag status={aktivitet.arbeidsstatus} />
                </BodyShort>
              </Table.DataCell>
              <Table.DataCell align="right">
                <BodyShort size="small">
                  {aktivitet.fordelingsprosent != null ? `${aktivitet.fordelingsprosent} %` : '-'}
                </BodyShort>
              </Table.DataCell>
              <Table.DataCell>
                <BodyShort size="small">
                  {aktivitet.harRefusjonskrav != null ? (aktivitet.harRefusjonskrav ? 'Ja' : 'Nei') : '-'}
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
  );
};

const SenereInnslagTabell = ({
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
      <Heading size="xsmall" level="3" className={styles['sectionHeading']}>
        Arbeid etter skjæringstidspunkt {formatDate(skjæringstidspunkt)}
      </Heading>
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
              : '-';

            return (
              <Table.ExpandableRow
                key={index}
                content={aktivitet.aRegister ? <ARegisterDetaljer aRegister={aktivitet.aRegister} /> : undefined}
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
                  <BodyShort size="small">{formatPeriode(aktivitet.ansettelsesperiode)}</BodyShort>
                </Table.DataCell>
                <Table.DataCell>
                  <BodyShort size="small">
                    {aktivitet.harRefusjonskrav != null ? (aktivitet.harRefusjonskrav ? 'Ja' : 'Nei') : '-'}
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
  const valgtSkjæringstidspunkt = arbeidOgInntektListe[valgtIndex] as ArbeidOgInntektResponse | undefined;

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

      <Label size="small" spacing>
        Skjæringstidspunkt
      </Label>
      {arbeidOgInntektListe.length > 1 ? (
        <Select
          label="Skjæringstidspunkt"
          hideLabel
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
      ) : (
        <BodyShort size="small">{formatDate(arbeidOgInntektListe[0]!.skjæringstidspunkt)}</BodyShort>
      )}

      {valgtSkjæringstidspunkt && (
        <>
          <AktivitetTabell aktiviteter={valgtSkjæringstidspunkt.aktiviteter} kodeverkoppslag={kodeverkoppslag} />
          <SenereInnslagTabell
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
