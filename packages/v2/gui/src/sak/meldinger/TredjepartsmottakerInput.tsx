import React, { useRef, useState } from 'react';
import { ErrorMessage, TextField } from '@navikt/ds-react';
import { requestIntentionallyAborted, type RequestIntentionallyAborted } from "@k9-sak-web/backend/shared/RequestIntentionallyAborted.ts";
import styles from './TredjepartsmottakerInput.module.css';
import type { EregOrganizationLookupResponse } from './EregOrganizationLookupResponse.js';

export interface BackendApi {
  getBrevMottakerinfoEreg(orgnr: string, abort?: AbortSignal): Promise<EregOrganizationLookupResponse | RequestIntentionallyAborted>;
}

export interface TredjepartsmottakerOrgnrInputProps {
  readonly defaultValue?: string;
  readonly show: boolean;
  readonly showValidation: boolean;
  readonly required: boolean;
  readonly onChange?: (value: TredjepartsmottakerValue | TredjepartsmottakerError | undefined) => void;
  readonly api: BackendApi;
}

export interface TredjepartsmottakerValue {
  readonly navn: string;
  readonly organisasjonsnr: string;
  readonly notFound?: never;
  readonly invalidOrgnum?: never;
  readonly required?: never;
}

type NotValue = {
  readonly navn?: never;
  readonly organisasjonsnr?: never;
};

export type TredjepartsmottakerError = NotValue & ({ notFound: true } | { invalidOrgnum: true } | { required: true });

const isEqual = (
  a: EregOrganizationLookupResponse | undefined,
  b: EregOrganizationLookupResponse | undefined,
): boolean =>
  a !== undefined &&
  b !== undefined &&
  a.invalidOrgnum === b.invalidOrgnum &&
  a.notFound === b.notFound &&
  a.name === b.name;

const TredjepartsmottakerInput = ({
  defaultValue,
  required,
  show,
  showValidation,
  onChange,
  api,
}: TredjepartsmottakerOrgnrInputProps) => {
  const [tredjepartsmottaker, setTredjepartsmottaker] = useState<EregOrganizationLookupResponse | undefined>(undefined);
  const lookupAborterRef = useRef<AbortController | undefined>(undefined);

  const handleInputOnChange = async (orgnr: string) => {
    const prevTredjepartsmottaker = tredjepartsmottaker;
    lookupAborterRef.current?.abort();
    lookupAborterRef.current = new AbortController();
    const newTredjepartsmottaker =
      orgnr.length > 0 ? await api.getBrevMottakerinfoEreg(orgnr, lookupAborterRef.current?.signal) : undefined;
    if(newTredjepartsmottaker !== requestIntentionallyAborted) {
      setTredjepartsmottaker(newTredjepartsmottaker);
      if (!isEqual(newTredjepartsmottaker, prevTredjepartsmottaker)) {
        if (newTredjepartsmottaker === undefined) {
          if (required) {
            onChange?.({ required: true });
          } else {
            onChange?.(undefined);
          }
        } else if (newTredjepartsmottaker.notFound) {
          onChange?.({ notFound: true });
        } else if (newTredjepartsmottaker.invalidOrgnum) {
          onChange?.({ invalidOrgnum: true });
        } else {
          onChange?.({ navn: newTredjepartsmottaker.name ?? '', organisasjonsnr: orgnr });
        }
      }
    }
  };

  const errorMessage =
    tredjepartsmottaker === undefined && required
      ? 'Gyldig organisasjonsnr påkrevd'
      : tredjepartsmottaker?.invalidOrgnum
        ? 'Ugyldig verdi. Må være 9 siffer.'
        : tredjepartsmottaker?.notFound
          ? 'Gitt organisasjonsnr ble ikke funnet i registeret'
          : null;

  if (show) {
    return (
      <div className={styles.container}>
        <TextField
          label="Organisasjonsnr"
          defaultValue={defaultValue}
          size="small"
          inputMode="numeric"
          className={styles.orgnumField}
          onChange={event => handleInputOnChange(event.target.value)}
        />
        <TextField
          label="Navn"
          readOnly
          value={tredjepartsmottaker?.name ?? ''}
          size="small"
          className={styles.orgnameField}
        />
        {showValidation && errorMessage && (
          <ErrorMessage size="small" className={styles.errorField}>
            {errorMessage}
          </ErrorMessage>
        )}
      </div>
    );
  }
  return null;
};

export default TredjepartsmottakerInput;
