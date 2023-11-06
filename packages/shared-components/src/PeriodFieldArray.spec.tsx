import React from 'react';
import { FormattedMessage } from 'react-intl';
import { metaMock, MockFields } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';

import Image from './Image';
import PeriodFieldArray from './PeriodFieldArray';

import shallowWithIntl, { intlMock } from '../i18n/index';

const readOnly = false;

describe('<PeriodFieldArray>', () => {
  it('skal vise en rad og knapp for å legge til periode', () => {
    const fields = new MockFields('perioder', 1);
    const wrapper = shallowWithIntl(
      <PeriodFieldArray.WrappedComponent intl={intlMock} fields={fields} meta={metaMock} readOnly={readOnly}>
        {periodeElementFieldId => <span key={periodeElementFieldId}>test</span>}
      </PeriodFieldArray.WrappedComponent>,
    );

    const span = wrapper.find('span');
    expect(span).toHaveLength(1);

    const div = wrapper.find('div');
    expect(div).toHaveLength(1);
    expect(div.find(Image)).toHaveLength(1);
    expect(div.find(FormattedMessage)).toHaveLength(1);
  });

  it('skal vise to rader der kun rad nummer to har sletteknapp', () => {
    const fields = new MockFields('perioder', 2);

    const wrapper = shallowWithIntl(
      <PeriodFieldArray.WrappedComponent intl={intlMock} fields={fields} meta={metaMock} readOnly={readOnly}>
        {(_periodeElementFieldId, index, getRemoveButton: () => React.ReactNode) => (
          <div key={index} id={`id_${index}`}>
            test
            {getRemoveButton()}
          </div>
        )}
      </PeriodFieldArray.WrappedComponent>,
    );
    const row1 = wrapper.find('#id_0');
    expect(row1).toHaveLength(1);
    expect(row1.childAt(0).text()).toEqual('test');

    const row2 = wrapper.find('#id_1');
    expect(row2).toHaveLength(1);
    expect(row2.find('button')).toHaveLength(1);

    expect(wrapper.find('#id_2')).toHaveLength(0);
  });

  it('skal legge til periode ved klikk på legg til periode', () => {
    const fields = new MockFields('perioder', 1);

    const wrapper = shallowWithIntl(
      <PeriodFieldArray.WrappedComponent intl={intlMock} fields={fields} meta={metaMock} readOnly={readOnly}>
        {periodeElementFieldId => <span key={periodeElementFieldId}>test</span>}
      </PeriodFieldArray.WrappedComponent>,
    );

    const addDiv = wrapper.find('div');
    expect(addDiv).toHaveLength(1);

    addDiv.simulate('click');

    expect(fields).toHaveLength(2);
  });

  it('skal slette periode ved klikk på sletteknapp', () => {
    const fields = new MockFields('perioder', 2);

    const wrapper = shallowWithIntl(
      <PeriodFieldArray.WrappedComponent intl={intlMock} fields={fields} meta={metaMock} readOnly={readOnly}>
        {(_periodeElementFieldId, index, getRemoveButton: () => React.ReactNode) => (
          <div key={index} id={`id_${index}`}>
            test
            {getRemoveButton()}
          </div>
        )}
      </PeriodFieldArray.WrappedComponent>,
    );

    const btn = wrapper.find('button');
    expect(btn).toHaveLength(1);

    btn.simulate('click');

    expect(fields).toHaveLength(1);
  });

  it('skal ikke vise knapp for å legge til rad', () => {
    const fields = new MockFields('perioder', 1);

    const wrapper = shallowWithIntl(
      <PeriodFieldArray.WrappedComponent
        intl={intlMock}
        fields={fields}
        shouldShowAddButton={false}
        readOnly={readOnly}
      >
        {periodeElementFieldId => <span key={periodeElementFieldId}>test</span>}
      </PeriodFieldArray.WrappedComponent>,
    );

    expect(wrapper.find(Image)).toHaveLength(0);
    expect(wrapper.find('button')).toHaveLength(0);
  });

  it('skal vise knapp for å legge til i steden for bildelenke', () => {
    const fields = new MockFields('perioder', 1);

    const wrapper = shallowWithIntl(
      <PeriodFieldArray.WrappedComponent
        intl={intlMock}
        fields={fields}
        createAddButtonInsteadOfImageLink
        readOnly={readOnly}
      >
        {periodeElementFieldId => <span key={periodeElementFieldId}>test</span>}
      </PeriodFieldArray.WrappedComponent>,
    );

    expect(wrapper.find(Image)).toHaveLength(0);
    expect(wrapper.find('button')).toHaveLength(1);
  });
});
