import { FormattedMessage } from 'react-intl';

import { BodyShort, Label, Table } from '@navikt/ds-react';

import type { ArbeidsgiverOpplysningerPerId, FeriepengegrunnlagAndel } from '@k9-sak-web/types';

interface Props {
  alleAndeler: FeriepengegrunnlagAndel[];
  opptjeningsår: number;
  kodeverkNavnFraKode: (kode: string, kodeverk: string) => string;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
}

export const FeriepengerPrÅr = ({
  alleAndeler,
  opptjeningsår,
  kodeverkNavnFraKode,
  arbeidsgiverOpplysningerPerId,
}: Props) => {
  if (alleAndeler.length < 1) {
    return null;
  }

  const alleAndelerForÅret = finnAlleAndelerForOpptjeningsår(alleAndeler, opptjeningsår);
  const andelerPrId = lagAndelerPrIdMap(alleAndelerForÅret, arbeidsgiverOpplysningerPerId, kodeverkNavnFraKode);

  return (
    <div>
      <Label size="small">
        <FormattedMessage id="TilkjentYtelse.Feriepenger.Opptjeningsår" values={{ år: opptjeningsår }} />
      </Label>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">
              <FormattedMessage id="TilkjentYtelse.Feriepenger.AndelNavn" />
            </Table.HeaderCell>
            <Table.HeaderCell scope="col">
              <FormattedMessage id="TilkjentYtelse.Feriepenger.GrunnlagRefusjon" />
            </Table.HeaderCell>
            <Table.HeaderCell scope="col">
              <FormattedMessage id="TilkjentYtelse.Feriepenger.GrunnlagSøker" />
            </Table.HeaderCell>
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

const finnAlleAndelerForOpptjeningsår = (
  andeler: FeriepengegrunnlagAndel[],
  opptjeningsår: number,
): FeriepengegrunnlagAndel[] => andeler.filter(andel => andel.opptjeningsår === opptjeningsår);

const lagIdentifikator = (andel: FeriepengegrunnlagAndel): string => {
  const parts = [andel.aktivitetStatus, andel.arbeidsgiverId || 'INGEN_AG', andel.arbeidsforholdId || 'INGEN_ARB_ID'];
  return parts.join('_');
};

const lagVisningsnavn = (
  ferieAndel: FeriepengegrunnlagAndel,
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId,
  kodeverkNavnFraKode: (kode: string, kodeverk: string) => string,
) => {
  const agOpplysning = ferieAndel.arbeidsgiverId ? arbeidsgiverOpplysningerPerId[ferieAndel.arbeidsgiverId] : undefined;
  if (agOpplysning) {
    return agOpplysning.navn;
  }
  return kodeverkNavnFraKode(ferieAndel.aktivitetStatus, 'AktivitetStatus') || ferieAndel.aktivitetStatus;
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
  kodeverkNavnFraKode: (kode: string, kodeverk: string) => string,
): AndelerPrId => ({
  identifikator: lagIdentifikator(ferieAndel),
  visningsnavn: lagVisningsnavn(ferieAndel, arbeidsgiverOpplysningerPerId, kodeverkNavnFraKode),
  utbetaltTilSøker: ferieAndel.erBrukerMottaker ? ferieAndel.årsbeløp : 0,
  utbetaltIRefusjon: !ferieAndel.erBrukerMottaker ? ferieAndel.årsbeløp : 0,
});

const lagAndelerPrIdMap = (
  andeler: FeriepengegrunnlagAndel[],
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId,
  kodeverkNavnFraKode: (kode: string, kodeverk: string) => string,
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
      listeMedAndelerPrId.push(lagAndelPrId(ferieAndel, arbeidsgiverOpplysningerPerId, kodeverkNavnFraKode));
    }
  }
  return listeMedAndelerPrId;
};
