import React from 'react';
import { FieldArrayFieldsProps } from 'redux-form';
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

export class MockFields implements FieldArrayFieldsProps<any> {
  array: any[];

  push: () => void;

  pop: () => any;

  map: () => any[];

  forEach: () => undefined;

  getAll: () => undefined;

  removeAll: () => undefined;

  insert: () => undefined;

  name: string;

  shift: () => undefined;

  splice: () => undefined;

  swap: () => undefined;

  move: () => undefined;

  unshift: () => undefined;

  get: (index: any) => any;

  remove: (index: any) => any[];

  constructor(name?: string, len?: number) {
    const formatName = index => `${name}[${index}]`;
    // @ts-ignore Fiks
    const array = [...new Array(len).keys()].map(formatName); // NOSONAR

    this.array = array;
    this.push = () => array.push(formatName(array.length));
    this.pop = array.pop.bind(array);
    this.map = array.map.bind(array);

    this.forEach = vi.fn();
    this.getAll = vi.fn();
    this.removeAll = vi.fn();
    this.insert = vi.fn();
    this.name = '';
    this.shift = vi.fn();
    this.splice = vi.fn();
    this.swap = vi.fn();
    this.move = vi.fn();
    this.unshift = vi.fn();

    this.get = index => array[index];

    this.remove = index => array.splice(index, 1);
  }

  get length() {
    return this.array.length;
  }
}

export class MockFieldsWithContent implements FieldArrayFieldsProps<any> {
  fields: [];

  array: any[];

  push: () => void;

  pop: () => any;

  map: () => any[];

  forEach: () => undefined;

  getAll: () => undefined;

  removeAll: () => undefined;

  insert: () => undefined;

  name: string;

  shift: () => undefined;

  splice: () => undefined;

  swap: () => undefined;

  move: () => undefined;

  unshift: () => undefined;

  get: (index: any) => any;

  remove: (index: any) => any[];

  constructor(name, array) {
    const formatName = index => `${name}[${index}]`;
    this.fields = array;
    this.array = [array].map(formatName); // NOSONAR;
    this.push = () => array.push(formatName(array.length));

    this.forEach = vi.fn();
    this.getAll = vi.fn();
    this.removeAll = vi.fn();
    this.insert = vi.fn();
    this.name = '';
    this.shift = vi.fn();
    this.splice = vi.fn();
    this.swap = vi.fn();
    this.move = vi.fn();
    this.unshift = vi.fn();

    this.pop = array.pop.bind(array);
    this.map = array.map.bind(array);
    this.get = index => array[index];

    this.get = index => array[index];
    this.remove = index => {
      this.fields.splice(index, 1);
      this.array.splice(index, 1);
      return this.array;
    };

    this.forEach = array.forEach.bind(array);
  }

  get length() {
    return this.fields.length;
  }
}
