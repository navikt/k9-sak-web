import { DateLabel } from '@fpsak-frontend/shared-components';
import { KodeverkMedNavn } from '@k9-sak-web/types';
import { Table } from '@navikt/ds-react';
import { PersonopplysningDto } from '@navikt/k9-sak-typescript-client';
import { useState } from 'react';
import OppholdINorgeOgAdresser from './OppholdINorgeOgAdresser';
import { Soknad } from './Soknad';

const createParent = (isApplicant: boolean, personopplysning?: PersonopplysningDto) => ({
  isApplicant,
  personopplysning,
});

interface GrunnlagForAutomatiskVurderingProps {
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  soknad: Soknad;
  personopplysninger: {
    [key: string]: PersonopplysningDto;
  };
}

const GrunnlagForAutomatiskVurdering = ({
  alleKodeverk,
  soknad,
  personopplysninger,
}: GrunnlagForAutomatiskVurderingProps) => {
  const personopplysningerKeys = Object.keys(personopplysninger);
  const [valgtPeriode, setValgtPeriode] = useState<string>(personopplysningerKeys[0]);
  let opphold = {};

  if (soknad && soknad.oppgittTilknytning) {
    const { oppgittTilknytning } = soknad;
    opphold = {
      utlandsopphold: oppgittTilknytning.utlandsopphold,
    };
  }

  const foreldre = [createParent(true, personopplysninger[valgtPeriode])];
  if (personopplysninger?.annenPart) {
    foreldre.push(createParent(false, personopplysninger.annenPart));
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
        alleKodeverk={alleKodeverk}
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
