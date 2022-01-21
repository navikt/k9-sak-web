import React from 'react';
import sinon from 'sinon';

import { Normaltekst } from 'nav-frontend-typografi';
import { Table, TableColumn, TableRow } from '@fpsak-frontend/shared-components';
import { FormattedMessage } from 'react-intl';
import { Label } from '@fpsak-frontend/form/src/Label';
import DocumentList from './DocumentList';
import shallowWithIntl, { intlMock } from '../../i18n/index';

describe('<DocumentList>', () => {
  it('skal vise to dokumenter i liste', () => {
    const document = {
      journalpostId: '1',
      dokumentId: '1',
      tittel: 'Terminbekreftelse',
      tidspunkt: '0405198632231',
      kommunikasjonsretning: 'INN',
    };

    const anotherDocument = {
      journalpostId: '2',
      dokumentId: '2',
      tittel: 'Førstegangssøknad',
      tidspunkt: '0405198632231',
      kommunikasjonsretning: 'UT',
    };

    const wrapper = shallowWithIntl(
      <DocumentList.WrappedComponent
        intl={intlMock}
        documents={[document, anotherDocument]}
        selectDocumentCallback={sinon.spy()}
        behandlingId={1}
      />,
    );

    const label = wrapper.find(Label);
    expect(label).toHaveLength(0);

    const table = wrapper.find(Table);
    expect(table).toHaveLength(1);
    const tableRows = table.find(TableRow);
    expect(tableRows).toHaveLength(2);

    const tableColumnsRow1 = tableRows.first().find(TableColumn);
    expect(tableColumnsRow1.children()).toHaveLength(3);
    expect(tableColumnsRow1.at(1).html()).toEqual(
      '<td class="columnStyle"><p class="typo-normal">Terminbekreftelse</p></td>',
    );

    const tableColumnsRow2 = tableRows.last().find(TableColumn);
    expect(tableColumnsRow2.children()).toHaveLength(3);
    expect(tableColumnsRow2.at(1).html()).toEqual(
      '<td class="columnStyle"><p class="typo-normal">Førstegangssøknad</p></td>',
    );
  });

  it('skal vise korrekt tekst om ikke tidspunkt finnes', () => {
    const document = {
      journalpostId: '1',
      dokumentId: '1',
      tittel: 'Terminbekreftelse',
      tidspunkt: null,
      kommunikasjonsretning: 'INN',
    };

    const wrapper = shallowWithIntl(
      <DocumentList.WrappedComponent
        intl={intlMock}
        documents={[document]}
        selectDocumentCallback={sinon.spy()}
        behandlingId={1}
      />,
    );

    const formattedMessage = wrapper.find(FormattedMessage).findWhere(n => n.prop('id') === 'DocumentList.IProduksjon');
    expect(formattedMessage).toHaveLength(1);
  });

  it('skal ikke vise tabell når det ikke finnes dokumenter', () => {
    const wrapper = shallowWithIntl(
      <DocumentList.WrappedComponent
        intl={intlMock}
        documents={[]}
        selectDocumentCallback={sinon.spy()}
        behandlingId={1}
      />,
    );

    const label = wrapper.find(Normaltekst);
    expect(label).toHaveLength(1);
    const table = wrapper.find(Table);
    expect(table).toHaveLength(0);
  });
});
