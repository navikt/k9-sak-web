import bem from './bemUtils';

const testCls = bem('block');

test('Element gets block class', () => {
  expect(testCls.block).toBe('block');
});

test('Element gets block and element class', () => {
  expect(testCls.element('element')).toBe('block__element');
});

test('Element gets block, element and modifier class', () => {
  expect(testCls.elementWithModifier('element', 'modifier')).toBe('block__element block__element--modifier');
  expect(testCls.modifier('modifier')).toBe('block--modifier');
});

test('Element gets block and modifier class', () => {
  expect(`${testCls.block} ${testCls.modifier('modifier')}`).toBe('block block--modifier');
});
