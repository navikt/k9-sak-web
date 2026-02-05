import { useMemo, useState } from 'react';
import { type FormState, Sub } from './Sub.tsx';
import { CrossMountStore } from './useFormCrossMount.tsx';
import { HStack } from '@navikt/ds-react';

export const Parent = () => {
  const [sub1Mounted, setSub1Mounted] = useState(true);
  const sub1State = useMemo(() => new CrossMountStore<FormState>(), []);

  const [sub2Mounted, setSub2Mounted] = useState(true);
  const sub2State = useMemo(() => new CrossMountStore<FormState>(), []);
  return (
    <div style={{ padding: '24px' }}>
      <h1>Proof of Concept Form state preserved</h1>
      <button onClick={() => setSub1Mounted(prev => !prev)}>Toggle Sub1</button>
      <button onClick={() => setSub2Mounted(prev => !prev)}>Toggle Sub2</button>
      <HStack gap="2" justify="start">
        {sub1Mounted ? (
          <div>
            <h2>Sub1</h2>
            <Sub crossMountStore={sub1State}></Sub>
          </div>
        ) : null}
        <div style={{ width: '100px' }}></div>
        {sub2Mounted ? (
          <div>
            <h2>Sub2</h2>
            <Sub crossMountStore={sub2State}></Sub>
          </div>
        ) : null}
      </HStack>
    </div>
  );
};
