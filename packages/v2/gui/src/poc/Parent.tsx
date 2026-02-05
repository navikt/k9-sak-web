import { useMemo, useState } from 'react';
import { type FormState, Sub } from './Sub.js';
import { CrossMountStore } from './useFormCrossMount.js';
import { GlobalStateSub } from './GlobalStateSub.js';
import { HStack } from '@navikt/ds-react';

export const Parent = () => {
  const [sub1Mounted, setSub1Mounted] = useState(true);
  const sub1State = useMemo(() => new CrossMountStore<FormState>(), []);

  const [sub2Mounted, setSub2Mounted] = useState(true);
  const sub2State = useMemo(() => new CrossMountStore<FormState>(), []);

  const [globalSub1Mounted, setGlobalSub1Mounted] = useState(true);
  const [globalSub2Mounted, setGlobalSub2Mounted] = useState(true);
  return (
    <div style={{ padding: '24px' }}>
      <h1>Proof of Concept Form state preserved</h1>
      <HStack gap="1">
        <button onClick={() => setSub1Mounted(prev => !prev)}>Toggle Sub1</button>
        <button onClick={() => setSub2Mounted(prev => !prev)}>Toggle Sub2</button>
        <button onClick={() => setGlobalSub1Mounted(prev => !prev)}>Toggle GlobalSub1</button>
        <button onClick={() => setGlobalSub2Mounted(prev => !prev)}>Toggle GlobalSub2</button>
      </HStack>
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
        <div style={{ width: '100px' }}></div>
        {globalSub1Mounted ? (
          <div>
            <h2>GlobalSub1</h2>
            <GlobalStateSub></GlobalStateSub>
          </div>
        ) : null}
        <div style={{ width: '100px' }}></div>
        {globalSub2Mounted ? (
          <div>
            <h2>GlobalSub2</h2>
            <GlobalStateSub></GlobalStateSub>
          </div>
        ) : null}
      </HStack>
    </div>
  );
};
