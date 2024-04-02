import { behandlingFormValueSelector } from '@fpsak-frontend/form';
import { DateLabel } from '@fpsak-frontend/shared-components';
import { Table } from '@navikt/ds-react';
import React from 'react';
import { connect } from 'react-redux';

const headerTextCodes = ['MedlemskapEndringerTabell.GjeldeneFom', 'MedlemskapEndringerTabell.Opplysning'];

interface MedlemskapEndringerTabellProps {
  velgPeriodeCallback: () => void;
  selectedId?: string;
  perioder?: { id: string; vurderingsdato: string; årsaker: string[]; aksjonspunkter: string[]; begrunnelse: string }[];
}

const MedlemskapEndringerTabellImpl = ({
  perioder,
  velgPeriodeCallback,
  selectedId,
}: MedlemskapEndringerTabellProps) => (
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
      {perioder.map(periode => (
        <Table.Row
          key={periode.id}
          id={periode.id}
          onMouseDown={velgPeriodeCallback}
          onKeyDown={velgPeriodeCallback}
          selected={periode.id === selectedId}
          className={
            periode.begrunnelse === null && periode.aksjonspunkter.length > 0
              ? 'border-solid border-l-5 border-[#fa3]'
              : ''
          }
        >
          <Table.DataCell>
            <DateLabel dateString={periode.vurderingsdato} />
          </Table.DataCell>
          <Table.DataCell>{periode.årsaker.join()}</Table.DataCell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
);

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const { behandlingId, behandlingVersjon } = initialOwnProps;
  const perioder = (
    behandlingFormValueSelector(
      'OppholdInntektOgPerioderForm',
      behandlingId,
      behandlingVersjon,
    )(initialState, 'perioder') || []
  ).sort((a, b) => a.vurderingsdato.localeCompare(b.vurderingsdato));
  return () => ({
    perioder,
  });
};

const MedlemskapEndringerTabell = connect(mapStateToPropsFactory)(MedlemskapEndringerTabellImpl);

MedlemskapEndringerTabellImpl.defaultProps = {
  perioder: [],
  selectedId: undefined,
};

export default MedlemskapEndringerTabell;
