import { CopyButton, Tooltip } from '@navikt/ds-react';
import css from './textsizedButton.module.css';

export const ErrorReference = ({ ref }: { readonly ref: string }) => {
  return (
    <>
      Feilreferanse: <b>{ref}</b>
      <Tooltip content="Kopier feilreferanse">
        <CopyButton className={css.textsizedButton} copyText={`Feilreferanse: ${ref}`} />
      </Tooltip>{' '}
    </>
  );
};
