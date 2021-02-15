import React from 'react';
import sinon from 'sinon';

import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { KodeverkMedNavn } from '@k9-sak-web/types';

import { MessagesImpl as Messages } from './Messages';
import shallowWithIntl from '../../i18n/index';

const mockProps = {
  setRecipient: () => undefined,
  setTemplate: () => undefined,
  updateModel: () => undefined,
  previewCallback: () => undefined,
  submitCallback: () => undefined,
  validateModel: () => undefined,
  isSubmitting: false,
  intl: intlMock,
  ...reduxFormPropsMock,
};

describe('<Messages>', () => {
  const sprakkode = {
    kode: 'en',
    kodeverk: 'Engelsk',
  };

  const templates = [
    { kode: 'Mal1', navn: 'Mal 1', tilgjengelig: true },
    { kode: 'Mal2', navn: 'Mal 2', tilgjengelig: true },
    { kode: 'Mal3', navn: 'Mal 3', tilgjengelig: true },
  ];

  const causes = [{ kode: 'kode', navn: 'Årsak 1', kodeverk: 'kode' }];

  it('skal vise to select-bokser', () => {
    const wrapper = shallowWithIntl(
      <Messages
        {...mockProps}
        templates={templates}
        sprakKode={sprakkode}
        causes={causes}
        behandlingId={1}
        behandlingVersjon={2}
        revurderingVarslingArsak={[{} as KodeverkMedNavn]}
      />,
    );

    const form = wrapper.find('form');
    const selectFields = form.find('SelectField');
    expect(selectFields).toHaveLength(2);

    const templateSelect = selectFields.findWhere(selectField => selectField.prop('name') === 'brevmalkode');
    expect(templateSelect).toHaveLength(1);
    expect(templateSelect.prop('selectValues')).toHaveLength(3);

    const recipientSelect = selectFields.findWhere(selectField => selectField.prop('name') === 'mottaker');
    expect(recipientSelect).toHaveLength(1);
  });

  it('skal vise forhåndvisningslenke når fritekst er gyldig', () => {
    const previewEventCallback = sinon.spy();
    const wrapper = shallowWithIntl(
      <Messages
        {...mockProps}
        templates={templates}
        sprakKode={sprakkode}
        brevmalkode="REVURD"
        causes={causes}
        previewCallback={previewEventCallback}
        fritekst="Dokument"
        mottaker="Bruker"
        behandlingId={1}
        behandlingVersjon={2}
        revurderingVarslingArsak={[{} as KodeverkMedNavn]}
      />,
    );

    const previewLink = wrapper.find('a');
    expect(previewLink).toHaveLength(1);
    expect(previewLink.text()).toEqual('Forhåndsvis');

    expect(previewEventCallback.called).toBe(false);
    previewLink.simulate('click', { preventDefault: sinon.spy() });
    expect(previewEventCallback.called).toBe(true);
  });

  it('skal vise tre select-bokser når varsel om revurdering', () => {
    const previewEventCallback = sinon.spy();
    const wrapper = shallowWithIntl(
      <Messages
        {...mockProps}
        templates={templates}
        sprakKode={sprakkode}
        brevmalkode="REVURD"
        causes={causes}
        previewCallback={previewEventCallback}
        fritekst="Dokument"
        behandlingId={1}
        behandlingVersjon={2}
        revurderingVarslingArsak={[{} as KodeverkMedNavn]}
      />,
    );

    const form = wrapper.find('form');
    const selectFields = form.find('SelectField');
    expect(selectFields).toHaveLength(3);

    const templateSelect = selectFields.findWhere(selectField => selectField.prop('name') === 'brevmalkode');
    expect(templateSelect).toHaveLength(1);
    expect(templateSelect.prop('selectValues')).toHaveLength(3);

    const recipientSelect = selectFields.findWhere(selectField => selectField.prop('name') === 'mottaker');
    expect(recipientSelect).toHaveLength(1);
    expect(recipientSelect.prop('selectValues')).toHaveLength(1);
  });
});
