import { behandlingFormValueSelector } from '@k9-sak-web/form';
import { DateLabel } from '@k9-sak-web/shared-components';
import { Table } from '@navikt/ds-react';
import React from 'react';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';

const headerTextCodes = ['MedlemskapEndringerTabell.GjeldeneFom', 'MedlemskapEndringerTabell.Opplysning'];

interface Periode {
  id: string;
  vurderingsdato: string;
  årsaker: string[];
  aksjonspunkter: string[];
  begrunnelse: string;
}

interface MedlemskapEndringerTabellProps {
  velgPeriodeCallback: (event: React.MouseEvent<HTMLTableRowElement, MouseEvent>, id: string, periode: Periode) => void;
  selectedId?: string;
  perioder?: Periode[];
}

const MedlemskapEndringerTabellImpl = ({
  perioder,
  velgPeriodeCallback,
  selectedId,
}: MedlemskapEndringerTabellProps) => {
  const intl = useIntl();
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          {headerTextCodes.map(textCode => (
            <Table.HeaderCell scope="col" key={textCode}>
              {intl.formatMessage({ id: textCode })}
            </Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {perioder.map(periode => (
          <Table.Row
            key={periode.id}
            id={periode.id}
            onClick={(event: React.MouseEvent<HTMLTableRowElement, MouseEvent>) =>
              velgPeriodeCallback(event, periode.id, periode)
            }
            selected={periode.id === selectedId}
            className={
              periode.begrunnelse === null && periode.aksjonspunkter.length > 0
                ? 'border-solid border-0 border-l-[5px] border-[#fa3]'
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
};

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
