import { Table } from '@navikt/ds-react';
import { type PersonopplysningDto } from '@navikt/k9-sak-typescript-client';
import { useState } from 'react';
import DateLabel from '../../../../shared/dateLabel/DateLabel';
import type { Soknad } from '../../types/Soknad';
import OppholdINorgeOgAdresser from './OppholdINorgeOgAdresser';

const createParent = (isApplicant: boolean, personopplysning: PersonopplysningDto) => ({
  isApplicant,
  personopplysning,
});

interface GrunnlagForAutomatiskVurderingProps {
  soknad: Soknad;
  personopplysninger: {
    [key: string]: PersonopplysningDto;
  };
}

const GrunnlagForAutomatiskVurdering = ({ soknad, personopplysninger }: GrunnlagForAutomatiskVurderingProps) => {
  const personopplysningerKeys = Object.keys(personopplysninger);
  const [valgtPeriode, setValgtPeriode] = useState<string>(personopplysningerKeys[0] ?? '');
  let opphold = {};

  if (soknad && soknad.oppgittTilknytning) {
    const { oppgittTilknytning } = soknad;
    opphold = {
      utlandsopphold: oppgittTilknytning.utlandsopphold,
    };
  }

  const foreldre =
    valgtPeriode && personopplysninger[valgtPeriode] ? [createParent(true, personopplysninger[valgtPeriode])] : [];
  if (personopplysninger?.[valgtPeriode]?.annenPart) {
    foreldre.push(createParent(false, personopplysninger?.[valgtPeriode]?.annenPart));
  }

  return (
    <>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Gjeldende f.o.m</Table.HeaderCell>
            <Table.HeaderCell>Opplysning</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {personopplysningerKeys.map(key => (
            <Table.Row
              key={key}
              onClick={() => setValgtPeriode(key)}
              selected={key === valgtPeriode}
              className="cursor-pointer"
            >
              <Table.DataCell>
                <DateLabel dateString={key} />
              </Table.DataCell>
              <Table.DataCell>SKJÆRINGSTIDSPUNKT</Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <OppholdINorgeOgAdresser
        foreldre={foreldre}
        hasBosattAksjonspunkt={false}
        isBosattAksjonspunktClosed={false}
        opphold={opphold}
        readOnly
      />
    </>
  );
};

export default GrunnlagForAutomatiskVurdering;
