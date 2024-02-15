import { messages } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import { reducer as formReducer, reduxForm } from 'redux-form';
import TextAreaField from './TextAreaField';

const MockForm = reduxForm({ form: 'mock', onSubmit: vi.fn() })(({ handleSubmit, children }) => (
  <form onSubmit={handleSubmit}>{children}</form>
));
const mountFieldInForm = (field, initialValues) =>
  mount(
    <Provider store={createStore(combineReducers({ form: formReducer }))}>
      <IntlProvider locale="nb-NO" messages={messages}>
        <MockForm initialValues={initialValues}>{field}</MockForm>
      </IntlProvider>
    </Provider>,
  );

describe('<TextAreaField>', () => {
  it('Skal rendre TextAreaField', () => {
    const wrapper = mountFieldInForm(<TextAreaField name="text" label="name" />);
    expect(wrapper.find('textarea')).to.have.length(1);
  });
  it('Skal rendre TextAreaField som ren tekst hvis readonly', () => {
    const wrapper = mountFieldInForm(<TextAreaField name="text" label="name" readOnly value="text" />, {
      text: 'tekst',
    });
    expect(wrapper.find('textarea')).to.have.length(0);
    expect(wrapper.find('div')).to.have.length(2);
    expect(wrapper.find('Label')).to.have.length(1);
    expect(wrapper.find('Label').prop('input')).to.eql('name');
    expect(wrapper.find('Normaltekst')).to.have.length(1);
    expect(wrapper.find('Normaltekst').text()).to.eql('tekst');
  });
});
