import { DateLabel } from '@fpsak-frontend/shared-components';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { Table } from '@navikt/ds-react';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { K9AksjonspunktBorderColor } from '@k9-sak-web/gui/tokens/tokens.js';
import { OppholdInntektOgPerioderFormState } from './FormState';
import { Periode } from './Periode';

const headerTextCodes = ['Gjeldende f.o.m', 'Opplysning'];

interface MedlemskapEndringerTabellProps {
  velgPeriodeCallback: (id: string, periode: Periode) => void;
  selectedId?: string;
}

const MedlemskapEndringerTabellImpl = ({ velgPeriodeCallback, selectedId }: MedlemskapEndringerTabellProps) => {
  const { getValues } = useFormContext<OppholdInntektOgPerioderFormState>();
  const { perioder } = getValues();
  const sortertePerioder = perioder.sort((a, b) => a.vurderingsdato.localeCompare(b.vurderingsdato));
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          {headerTextCodes.map(textCode => (
            <Table.HeaderCell scope="col" key={textCode}>
              {textCode}
            </Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {sortertePerioder.map(periode => (
          <Table.Row
            key={periode.id}
            id={periode.id}
            onClick={() => {
              velgPeriodeCallback(periode.id, periode);
            }}
            selected={periode.id === selectedId}
            className={
              periode.begrunnelse === null && periode.aksjonspunkter.length > 0
                ? `border-solid border-0 border-l-[5px] border-[${K9AksjonspunktBorderColor}]`
                : ''
            }
          >
            <Table.DataCell>
              <div className="flex">
                {periode.begrunnelse === null && periode.aksjonspunkter.length > 0 && (
                  <ExclamationmarkTriangleFillIcon
                    fontSize="1.5rem"
                    className="text-[var(--ac-alert-icon-warning-color,var(--a-icon-warning))] text-2xl mr-2"
                  />
                )}
                <DateLabel dateString={periode.vurderingsdato} />
              </div>
            </Table.DataCell>
            <Table.DataCell>{periode.årsaker.join()}</Table.DataCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default MedlemskapEndringerTabellImpl;
