import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { Undertittel } from 'nav-frontend-typografi';
import { TextAreaField, SelectField } from '@fpsak-frontend/form';
import FritekstBrevPanel from './FritekstBrevPanel';
import shallowWithIntl from '../../i18n';
import PreviewLink from './PreviewLink';

describe('<FritekstBrevPanel>', () => {
  const eventCallback = sinon.spy();
  const sprakkode = {
    kode: 'EN',
  };
  it('skal vise alle felter i readonly modus, men ikke autobrev link', () => {
    const wrapper = shallowWithIntl(
      <FritekstBrevPanel.WrappedComponent
        intl={intlMock}
        previewBrev={eventCallback}
        readOnly
        sprakkode={sprakkode}
        harAlternativeMottakere={false}
        harAutomatiskVedtaksbrev
        tilgjengeligeVedtaksbrev={[]}
      />,
    );

    const overskrift = wrapper.find('TextAreaField');
    expect(overskrift).to.have.length(2);
    expect(overskrift.at(0).prop('readOnly')).to.equal(true);
    expect(overskrift.at(1).prop('readOnly')).to.equal(true);
    expect(wrapper.find(PreviewLink)).to.have.length(0);
  });

  it('skal vise alle felter eksklusive valg av mottaker, hvis alternative mottakere ikke er definert i vanlig modus', () => {
    const wrapper = shallowWithIntl(
      <FritekstBrevPanel.WrappedComponent
        intl={intlMock}
        previewBrev={eventCallback}
        readOnly={false}
        sprakkode={sprakkode}
        harAlternativeMottakere={false}
        harAutomatiskVedtaksbrev
        tilgjengeligeVedtaksbrev={[]}
      />,
    );

    expect(wrapper.find(SelectField)).to.have.length(0);
    expect(wrapper.find(PreviewLink)).to.have.length(1);
    expect(wrapper.find(TextAreaField)).to.have.length(2);
    expect(wrapper.find(Undertittel)).to.have.length(1);
  });

  it('skal vise alle felter inkl valg av mottaker hvis alternative mottakere er definert', () => {
    const wrapper = shallowWithIntl(
      <FritekstBrevPanel.WrappedComponent
        intl={intlMock}
        previewBrev={eventCallback}
        readOnly={false}
        sprakkode={sprakkode}
        harAlternativeMottakere
        tilgjengeligeVedtaksbrev={{
          vedtaksbrev: ['AUTOMATISK', 'FRITEKST'],
          begrunnelse: null,
          alternativeMottakere: [
            {
              id: '00000000000',
              idType: 'AKTØRID',
            },
            {
              id: '979312059',
              idType: 'ORGNR',
            },
          ],
        }}
        harAutomatiskVedtaksbrev
      />,
    );

    expect(wrapper.find(SelectField)).to.have.length(1);
    expect(wrapper.find(PreviewLink)).to.have.length(1);
    expect(wrapper.find(TextAreaField)).to.have.length(2);
    expect(wrapper.find(Undertittel)).to.have.length(1);
  });
});
