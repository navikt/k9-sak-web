import React from 'react';
import styles from './opplysningerFraVedtak.module.css';
import styleLesemodus from '../lesemodus/lesemodusboks.module.css';

interface Props {
  tekstBegrunnelseLesemodus: string;
  begrunnelse: string;
  tekstVilkarOppfylt: string;
  erVilkarOppfylt: boolean;
  textVilkarOppfylt?: string;
  informasjonVilkarOppfylt?: string;
  textVilkarIkkeOppfylt?: string;
  årsakVilkarIkkeOppfylt?: string;
}

const OpplysningerFraVedtak: React.FunctionComponent<Props> = ({
  tekstBegrunnelseLesemodus,
  begrunnelse,
  tekstVilkarOppfylt,
  erVilkarOppfylt,
  textVilkarOppfylt,
  informasjonVilkarOppfylt,
  textVilkarIkkeOppfylt,
  årsakVilkarIkkeOppfylt,
}) => (
  <div className={styles.opplysningerFraVedtak}>
    <h4>{tekstBegrunnelseLesemodus}</h4>
    <p className={styleLesemodus.fritekst}>{begrunnelse}</p>

    <h4>{tekstVilkarOppfylt}</h4>
    <p>{erVilkarOppfylt ? 'Ja' : 'Nei'}</p>

    {erVilkarOppfylt && textVilkarOppfylt !== undefined && (
      <>
        <h4>{textVilkarOppfylt}</h4>
        <p>{informasjonVilkarOppfylt}</p>
      </>
    )}

    {typeof årsakVilkarIkkeOppfylt !== 'undefined' && !erVilkarOppfylt && (
      <>
        <h4 className={styleLesemodus.label}>{textVilkarIkkeOppfylt}</h4>
        <p className={styleLesemodus.text}>{årsakVilkarIkkeOppfylt}</p>
      </>
    )}
  </div>
);

export default OpplysningerFraVedtak;
