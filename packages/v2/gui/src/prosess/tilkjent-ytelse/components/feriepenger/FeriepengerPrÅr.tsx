import { BodyShort, Label, Table } from '@navikt/ds-react';

import type { k9_sak_kontrakt_beregningsresultat_FeriepengegrunnlagAndelDto as FeriepengegrunnlagAndel } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { use } from 'react';
import { K9KodeverkoppslagContext } from '../../../../kodeverk/oppslag/K9KodeverkoppslagContext.js';
import type { K9Kodeverkoppslag } from '../../../../kodeverk/oppslag/useK9Kodeverkoppslag.tsx';
import type { ArbeidsgiverOpplysningerPerId } from '../../types/arbeidsgiverOpplysningerType.js';

interface Props {
  åretsAndeler: FeriepengegrunnlagAndel[];
  opptjeningsår: number;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
}

export const FeriepengerPrÅr = ({ åretsAndeler, opptjeningsår, arbeidsgiverOpplysningerPerId }: Props) => {
  const kodeverkoppslag = use(K9KodeverkoppslagContext);
  if (åretsAndeler.length < 1) {
    return null;
  }

  const andelerPrId = lagAndelerPrIdMap(åretsAndeler, arbeidsgiverOpplysningerPerId, kodeverkoppslag);

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

const lagIdentifikator = (andel: FeriepengegrunnlagAndel): string => {
  const parts = [andel.aktivitetStatus, andel.arbeidsgiverId || 'INGEN_AG', andel.arbeidsforholdId || 'INGEN_ARB_ID'];
  return parts.join('_');
};

const lagVisningsnavn = (
  ferieAndel: FeriepengegrunnlagAndel,
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId,
  kodeverkoppslag: K9Kodeverkoppslag,
) => {
  const agOpplysning = ferieAndel.arbeidsgiverId ? arbeidsgiverOpplysningerPerId[ferieAndel.arbeidsgiverId] : undefined;
  if (agOpplysning?.navn) {
    return agOpplysning.navn;
  }
  return (
    kodeverkoppslag.k9sak.aktivitetStatuser(ferieAndel.aktivitetStatus, 'or undefined')?.navn ??
    ferieAndel.aktivitetStatus
  );
};

type AndelerPrId = {
  identifikator: string;
  visningsnavn: string;
  utbetaltTilSøker: number;
  utbetaltIRefusjon: number;
};

const lagAndelPrId = (
  ferieAndel: FeriepengegrunnlagAndel,
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId,
  kodeverkoppslag: K9Kodeverkoppslag,
): AndelerPrId => ({
  identifikator: lagIdentifikator(ferieAndel),
  visningsnavn: lagVisningsnavn(ferieAndel, arbeidsgiverOpplysningerPerId, kodeverkoppslag),
  utbetaltTilSøker: ferieAndel.erBrukerMottaker ? ferieAndel.årsbeløp : 0,
  utbetaltIRefusjon: !ferieAndel.erBrukerMottaker ? ferieAndel.årsbeløp : 0,
});

const lagAndelerPrIdMap = (
  andeler: FeriepengegrunnlagAndel[],
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId,
  kodeverkoppslag: K9Kodeverkoppslag,
): AndelerPrId[] => {
  const listeMedAndelerPrId = new Array<AndelerPrId>();
  for (const ferieAndel of andeler) {
    const andelTilSøker = ferieAndel.erBrukerMottaker ? ferieAndel.årsbeløp : 0;
    const andelTilRefusjon = !ferieAndel.erBrukerMottaker ? ferieAndel.årsbeløp : 0;
    const id = lagIdentifikator(ferieAndel);
    const eksisterendeAndelPrId = listeMedAndelerPrId.find(andel => andel.identifikator === id);
    if (eksisterendeAndelPrId) {
      eksisterendeAndelPrId.utbetaltTilSøker += andelTilSøker;
      eksisterendeAndelPrId.utbetaltIRefusjon += andelTilRefusjon;
    } else {
      listeMedAndelerPrId.push(lagAndelPrId(ferieAndel, arbeidsgiverOpplysningerPerId, kodeverkoppslag));
    }
  }
  return listeMedAndelerPrId;
};
