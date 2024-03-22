import React from 'react'
import { TextField } from "@navikt/ds-react";
import css from "./TredjepartsmottakerInput.module.css"

export interface TredjepartsmottakerOrgnrInputProps {
  readonly show: boolean;
}

const TredjepartsmottakerInput = ({show}: TredjepartsmottakerOrgnrInputProps) => {
  const cls = css['container']
  if(show) {
    return <div className={cls}>
      <TextField label="Organisasjonsnr" inputMode="numeric" />
      <TextField label="Navn" inputMode="numeric" />
    </div>
  }
  return null
}

export default TredjepartsmottakerInput
