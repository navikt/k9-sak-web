import classNames from 'classnames';
import React from 'react';
import Feilikon from '../../icons/Feilikon';
import SjekkIkon from '../../icons/SjekkIkon';
import Suksessikon from '../../icons/Suksessikon';
import styleLesemodus from '../lesemodus/lesemodusboks.css';
import styles from './vilkarStatus.css';

interface OwnProps {
  aksjonspunktNavn: string;
  begrunnelse: string;
  erVilkaretForOmsorgenFor: boolean;
  beskrivelseForOmsorgenFor?: string;
  vilkarOppfylt: boolean;
  vilkarReferanse: string;
  periode?: string;
}

const VilkarStatus: React.FunctionComponent<OwnProps> = ({
  aksjonspunktNavn,
  begrunnelse,
  erVilkaretForOmsorgenFor,
  beskrivelseForOmsorgenFor,
  vilkarOppfylt,
  vilkarReferanse,
  periode,
}) => (
  <>
    <div className={styles.vilkarStatusOverskrift}>
      {vilkarOppfylt ? <Suksessikon /> : <Feilikon />}
      <h2 className={styles.aksjonspunktNavn}>{aksjonspunktNavn}</h2>
      <p className={styles.vilkar}>{vilkarReferanse}</p>
    </div>
    <p className={styles.vilkarStatus}>{vilkarOppfylt ? 'Vilkåret er oppfylt' : 'Vilkåret er ikke oppfylt'}</p>

    {erVilkaretForOmsorgenFor && vilkarOppfylt && (
      <div className={styles.beskrivelseForOmsorgenForOppfyltVilkar}>
        <SjekkIkon /> <h4>{beskrivelseForOmsorgenFor}</h4>
      </div>
    )}

    {periode && (
      <>
        <p className={styles.begrunnelseOverskrift}>Periode</p>
        <p className={classNames(styleLesemodus.fritekst)}>{periode}</p>
      </>
    )}

    {begrunnelse && (
      <>
        <p className={styles.begrunnelseOverskrift}>Vurdering</p>
        <p className={classNames(styleLesemodus.fritekst, styles.begrunnelse)}>{begrunnelse}</p>
      </>
    )}
  </>
);
export default VilkarStatus;
