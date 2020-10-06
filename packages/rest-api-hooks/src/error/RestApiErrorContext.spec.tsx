import React, { useEffect } from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import { RestApiErrorProvider } from './RestApiErrorContext';
import useRestApiErrorDispatcher from './useRestApiErrorDispatcher';
import useRestApiError from './useRestApiError';

const TestErrorMessage = ({ skalFjerne = false }) => {
  const { addErrorMessage, removeErrorMessages } = useRestApiErrorDispatcher();
  useEffect(() => {
    addErrorMessage('Feilmeldingstest 1');
    addErrorMessage('Feilmeldingstest 2');

    if (skalFjerne) {
      removeErrorMessages();
    }
  }, []);

  const feilmeldinger = useRestApiError();
  return (
    <>
      {feilmeldinger.map(feil => (
        <span key={feil}>{feil}</span>
      ))}
    </>
  );
};

describe('<RestApiErrorContext>', () => {
  it('skal legge til feilmelding og så hente alle i kontekst', () => {
    const wrapper = mount(
      <RestApiErrorProvider>
        <TestErrorMessage />
      </RestApiErrorProvider>,
    );

    const spans = wrapper.find('span');
    expect(spans).to.have.length(2);
    expect(spans.first().text()).to.eql('Feilmeldingstest 1');
    expect(spans.last().text()).to.eql('Feilmeldingstest 2');
  });

  it('skal legge til feilmelding og så fjerne alle i kontekst', () => {
    const wrapper = mount(
      <RestApiErrorProvider>
        <TestErrorMessage skalFjerne />
      </RestApiErrorProvider>,
    );

    const spans = wrapper.find('span');
    expect(spans).to.have.length(0);
  });
});
