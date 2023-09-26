import React from 'react';
import sinon from 'sinon';

import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { KodeverkMedNavn } from '@k9-sak-web/types';

import { MessagesTilbakekrevingImpl as MessagesTilbakekreving } from './MessagesTilbakekreving';
import shallowWithIntl, { intlMock } from '../../i18n/index';

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

describe('<MessagesTilbakekreving>', () => {
  const sprakkode = {
    kode: 'en',
    kodeverk: 'Engelsk',
  };

  const templates = {
    INNHEN: {
      navn: 'Innhent dokumentasjon',
      mottakere: [
        {
          id: '00000000',
          type: 'AKTØRID',
        },
        {
          id: '123456789',
          type: 'ORGNR',
        },
      ],
    },
    REVURD: {
      navn: 'Innhent dokumentasjon',
      mottakere: [
        {
          id: '00000000',
          type: 'AKTØRID',
        },
        {
          id: '123456789',
          type: 'ORGNR',
        },
      ],
    },
    ETTERLYS_INNTEKTSMELDING_DOK: {
      navn: 'Etterlys inntektsmelding',
      mottakere: [
        {
          id: '123456789',
          type: 'ORGNR',
        },
      ],
    },
  };

  const causes = [{ kode: 'kode', navn: 'Årsak 1', kodeverk: 'kode' }];

  it('skal støtte brevmaler som array', () => {
    const wrapper = shallowWithIntl(
      <MessagesTilbakekreving
        {...mockProps}
        templates={[
          { kode: 'INNHEN', navn: 'Innhent dokumentasjon', tilgjengelig: true },
          { kode: 'VARS', navn: 'Varsel om tilbakekreving', tilgjengelig: true },
        ]}
        sprakKode={sprakkode}
        brevmalkode="INNHEN"
        causes={causes}
        behandlingId={1}
        behandlingVersjon={2}
        revurderingVarslingArsak={[{} as KodeverkMedNavn]}
      />,
    );

    const form = wrapper.find('form');
    const selectFields = form.find('SelectField');
    expect(selectFields).toHaveLength(1);

    const templateSelect = selectFields.findWhere(selectField => selectField.prop('name') === 'brevmalkode');
    expect(templateSelect).toHaveLength(1);
    expect(templateSelect.prop('selectValues')).toHaveLength(2);
  });

  it('skal vise to select-bokser', () => {
    const wrapper = shallowWithIntl(
      <MessagesTilbakekreving
        {...mockProps}
        templates={templates}
        sprakKode={sprakkode}
        brevmalkode="INNHEN"
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

    const recipientSelect = selectFields.findWhere(selectField => selectField.prop('name') === 'overstyrtMottaker');
    expect(recipientSelect).toHaveLength(1);
    expect(recipientSelect.prop('selectValues')).toHaveLength(2);
  });

  it('skal vise forhåndvisningslenke når fritekst er gyldig', () => {
    const previewEventCallback = sinon.spy();
    const wrapper = shallowWithIntl(
      <MessagesTilbakekreving
        {...mockProps}
        templates={templates}
        sprakKode={sprakkode}
        brevmalkode="INNHEN"
        causes={causes}
        previewCallback={previewEventCallback}
        fritekst="Dokument"
        overstyrtMottaker="Bruker"
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
      <MessagesTilbakekreving
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

    const recipientSelect = selectFields.findWhere(selectField => selectField.prop('name') === 'overstyrtMottaker');
    expect(recipientSelect).toHaveLength(1);
    expect(recipientSelect.prop('selectValues')).toHaveLength(2);

    const causesSelect = selectFields.findWhere(selectField => selectField.prop('name') === 'arsakskode');
    expect(causesSelect).toHaveLength(1);
    expect(causesSelect.prop('selectValues')).toHaveLength(1);
  });
});
