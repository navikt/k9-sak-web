import React, { useEffect } from 'react';
import { mount } from 'enzyme';

import { RestApiErrorProvider } from './RestApiErrorContext';
import useRestApiErrorDispatcher from './useRestApiErrorDispatcher';
import useRestApiError from './useRestApiError';

function TestErrorMessage({ skalFjerne = false }) {
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
    expect(spans).toHaveLength(2);
    expect(spans.first().text()).toEqual('Feilmeldingstest 1');
    expect(spans.last().text()).toEqual('Feilmeldingstest 2');
  });

  it('skal legge til feilmelding og så fjerne alle i kontekst', () => {
    const wrapper = mount(
      <RestApiErrorProvider>
        <TestErrorMessage skalFjerne />
      </RestApiErrorProvider>,
    );

    const spans = wrapper.find('span');
    expect(spans).toHaveLength(0);
  });
});
