import { isValidElement, type ReactNode } from 'react';
import { resolveErrorViewProps } from './resolveErrorViewProps.js';

// Hentar ut berre tekstinnhaldet i ein ReactNode, slik at to errorInfo-element kan samanliknast på tekst åleine.
// Styling, elementtypar og whitespace-struktur blir ignorert – berre den samla teksten avgjer om dei er like.
const serializeNode = (node: ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(serializeNode).join('');
  }
  if (isValidElement(node)) {
    return serializeNode((node.props as { children?: ReactNode }).children);
  }
  return '';
};

// Lagar ein nøkkel som identifiserer feil som «like» for visning: same feiltype, same tittel og same errorInfo.
const dedupKey = (error: Error): string => {
  const { title, errorInfo } = resolveErrorViewProps(error);
  const typeName = error.constructor?.name ?? 'Error';
  return `${typeName}::${title}::${serializeNode(errorInfo)}`;
};

// Fjernar påfølgjande feil som er like (same type, tittel og errorInfo). Berre den siste i kvar samanhengande
// gruppe blir verande, slik at brukar slepp å bla gjennom mange identiske feil.
export const deduplicateConsecutiveErrors = (errors: ReadonlyArray<Error>): Error[] => {
  if (errors.length <= 1) {
    return [...errors];
  }
  const keys = errors.map(dedupKey);
  const result: Error[] = [];
  for (let i = 0; i < errors.length; i += 1) {
    const error = errors[i];
    if (error == null) {
      continue;
    }
    const isDuplicateOfNext = i < errors.length - 1 && keys[i] === keys[i + 1];
    if (!isDuplicateOfNext) {
      result.push(error);
    }
  }
  return result;
};
