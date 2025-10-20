import React from 'react';
import { intlMock } from './intl-test-helper';
import { renderWithIntl } from './test-utils';

function noop() {
  return undefined;
}

export const inputMock = {
  name: 'mockInput',
  onBlur: noop,
  onChange: noop,
  onDragStart: noop,
  onDrop: noop,
  onFocus: noop,
  value: '',
};

export const metaMock = {
  active: false,
  asyncValidating: false,
  autofilled: false,
  dirty: false,
  dispatch: noop,
  error: null,
  form: 'mockForm',
  initial: {},
  invalid: false,
  pristine: false,
  submitting: false,
  submitFailed: false,
  touched: false,
  valid: true,
  visited: false,
  warning: null,
};

export function renderFieldComponent(node, input = {}, meta = {}, label = 'field') {
  return renderWithIntl(
    React.cloneElement(node, {
      input: { ...inputMock, ...input },
      meta: { ...metaMock, ...meta },
      intl: intlMock,
      label,
    }),
  );
}

/* Lagt til for a hindre warnings i tester */
export const reduxFormPropsMock = Object.assign(metaMock, {
  anyTouched: false,
  initialized: false,
  pure: false,
  submitSucceeded: false,
  asyncValidate: vi.fn(),
  autofill: vi.fn(),
  blur: vi.fn(),
  change: vi.fn(),
  clearAsyncError: vi.fn(),
  destroy: vi.fn(),
  handleSubmit: vi.fn(),
  initialize: vi.fn(),
  reset: vi.fn(),
  touch: vi.fn(),
  submit: vi.fn(),
  untouch: vi.fn(),
  clearSubmit: vi.fn(),
  resetSection: vi.fn(),
  clearFields: vi.fn(),
  clearSubmitErrors: vi.fn(),
  submitAsSideEffect: false,
  array: {
    insert: vi.fn(),
    move: vi.fn(),
    pop: vi.fn(),
    push: vi.fn(),
    remove: vi.fn(),
    removeAll: vi.fn(),
    shift: vi.fn(),
    splice: vi.fn(),
    swap: vi.fn(),
    unshift: vi.fn(),
  },
  initialValues: {},
});
