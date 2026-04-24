import { BodyShort, Label, Table } from '@navikt/ds-react';

import type {
  k9_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto,
  k9_sak_kontrakt_beregningsresultat_FeriepengegrunnlagAndelDto as FeriepengegrunnlagAndel,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types.js';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';

type ArbeidsgiverOpplysningerPerId = k9_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto['arbeidsgivere'];

interface Props {
  åretsAndeler: FeriepengegrunnlagAndel[];
  opptjeningsår: number;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
}

const FeriepengerPrÅr = ({ åretsAndeler, opptjeningsår, arbeidsgiverOpplysningerPerId }: Props) => {
  const { kodeverkNavnFraKode } = useKodeverkContext();

  if (åretsAndeler.length < 1) {
    return null;
  }

  const andelerPrId = lagAndelerPrIdMap(åretsAndeler, arbeidsgiverOpplysningerPerId, kodeverkNavnFraKode);

  return (
    <div>
      <Label size="small">Opptjeningsår {opptjeningsår}</Label>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">Arbeidsgiver / Aktivitet</Table.HeaderCell>
            <Table.HeaderCell scope="col">Refusjon</Table.HeaderCell>
            <Table.HeaderCell scope="col">Til søker</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {andelerPrId.map(andel => (
            <Table.Row key={andel.identifikator}>
              <Table.DataCell>
                <BodyShort size="small">{andel.visningsnavn}</BodyShort>
              </Table.DataCell>
              <Table.DataCell>
                <BodyShort size="small">{andel.utbetaltIRefusjon}</BodyShort>
              </Table.DataCell>
              <Table.DataCell>
                <BodyShort size="small">{andel.utbetaltTilSøker}</BodyShort>
              </Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default FeriepengerPrÅr;

const lagIdentifikator = (andel: FeriepengegrunnlagAndel): string => {
  const parts = [andel.aktivitetStatus, andel.arbeidsgiverId ?? 'INGEN_AG', andel.arbeidsforholdId ?? 'INGEN_ARB_ID'];
  return parts.join('_');
};

const lagVisningsnavn = (
  ferieAndel: FeriepengegrunnlagAndel,
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId,
  kodeverkNavnFraKode: (kode: string, kodeverkType: KodeverkType) => string,
): string => {
  const agOpplysning = ferieAndel.arbeidsgiverId
    ? arbeidsgiverOpplysningerPerId?.[ferieAndel.arbeidsgiverId]
    : undefined;
  if (agOpplysning?.navn) {
    return agOpplysning.navn;
  }
  return kodeverkNavnFraKode(ferieAndel.aktivitetStatus, KodeverkType.AKTIVITET_STATUS) ?? ferieAndel.aktivitetStatus;
};

type AndelPrId = {
  identifikator: string;
  visningsnavn: string;
  utbetaltTilSøker: number;
  utbetaltIRefusjon: number;
};

const lagAndelerPrIdMap = (
  andeler: FeriepengegrunnlagAndel[],
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId,
  kodeverkNavnFraKode: (kode: string, kodeverkType: KodeverkType) => string,
): AndelPrId[] => {
  const liste: AndelPrId[] = [];
  for (const ferieAndel of andeler) {
    const andelTilSøker = ferieAndel.erBrukerMottaker ? ferieAndel.årsbeløp : 0;
    const andelTilRefusjon = !ferieAndel.erBrukerMottaker ? ferieAndel.årsbeløp : 0;
    const id = lagIdentifikator(ferieAndel);
    const eksisterende = liste.find(a => a.identifikator === id);
    if (eksisterende) {
      eksisterende.utbetaltTilSøker += andelTilSøker;
      eksisterende.utbetaltIRefusjon += andelTilRefusjon;
    } else {
      liste.push({
        identifikator: id,
        visningsnavn: lagVisningsnavn(ferieAndel, arbeidsgiverOpplysningerPerId, kodeverkNavnFraKode),
        utbetaltTilSøker: andelTilSøker,
        utbetaltIRefusjon: andelTilRefusjon,
      });
    }
  }
  return liste;
};
