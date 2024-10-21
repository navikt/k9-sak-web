import React from 'react';
import styles from './opplysningerFraVedtak.module.css';
import styleLesemodus from '../lesemodus/lesemodusboks.module.css';
import { Vilkarperiode } from '@k9-sak-web/types';
import { AssessedBy } from '@navikt/ft-plattform-komponenter';

interface Props {
  tekstBegrunnelseLesemodus: string;
  begrunnelse: string;
  tekstVilkarOppfylt: string;
  erVilkarOppfylt: boolean;
  textVilkarOppfylt?: string;
  informasjonVilkarOppfylt?: string;
  textVilkarIkkeOppfylt?: string;
  årsakVilkarIkkeOppfylt?: string;
  vilkarperiode?: Vilkarperiode;
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
  vilkarperiode,
}) => (
  <div className={styles.opplysningerFraVedtak}>
    <h4>{tekstBegrunnelseLesemodus}</h4>
    <p className={styleLesemodus.fritekst}>{begrunnelse}</p>
    <AssessedBy ident={vilkarperiode?.vurdertAv} date={vilkarperiode?.vurdertTidspunkt} />

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
