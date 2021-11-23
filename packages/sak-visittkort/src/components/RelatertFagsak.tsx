import { pathToFagsak } from '@k9-sak-web/sak-app/src/app/paths';
import { RelatertFagsak as RelatertFagsakType } from '@k9-sak-web/types';
import Lenke from 'nav-frontend-lenker';
import { Select as NavSelect } from 'nav-frontend-skjema';
import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import styles from './relatertFagsak.less';
import RelatertSøkerIcon from './RelatertSøkerIcon';

interface RelatertFagsakProps {
  relaterteFagsaker?: RelatertFagsakType;
}

const RelatertFagsak = ({ relaterteFagsaker }: RelatertFagsakProps) => {
  if (!relaterteFagsaker || relaterteFagsaker.relaterteSøkere?.length === 0) {
    return null;
  }
  const { relaterteSøkere } = relaterteFagsaker;
  const [valgtSøkerIdent, setValgtSøkerIdent] = React.useState(relaterteSøkere[0].søkerIdent);
  const valgtSøker = relaterteSøkere.find(søker => søker.søkerIdent === valgtSøkerIdent);
  const harMerEnnEnRelatertSøker = relaterteSøkere.length > 1;
  const { saksnummer, søkerNavn, søkerIdent, åpenBehandling } = valgtSøker;

  const behandlingsstatus = åpenBehandling ? '(Åpen behandling)' : '(Lukket behandling)';
  const visRelaterteSøkere = () => {
    if (!harMerEnnEnRelatertSøker) {
      return (
        <Lenke className={styles.relatertFagsak__selector} href={`/k9/web${pathToFagsak(saksnummer)}`} target="_blank">
          <Normaltekst tag="span" className={styles.relatertFagsak__name}>
            {søkerNavn}
          </Normaltekst>
          <Normaltekst>{behandlingsstatus}</Normaltekst>
        </Lenke>
      );
    }
    return (
      <>
        <NavSelect
          label="Velg relatert søker"
          onChange={e => setValgtSøkerIdent(e.target.value)}
          className={styles.relatertFagsak__søkerSelect}
        >
          {relaterteSøkere.map(søker => (
            <option key={søker.søkerIdent} value={søker.søkerIdent}>
              {søker.søkerNavn} {behandlingsstatus}
            </option>
          ))}
        </NavSelect>
      </>
    );
  };

  const andreParterTekst = () => {
    if (harMerEnnEnRelatertSøker) {
      return `Andre parter (${relaterteSøkere.length}):`;
    }
    return 'Annen part:';
  };

  return (
    <div className={styles.relatertFagsak}>
      <div className={styles.relatertFagsak__nameGenderContainer}>
        <RelatertSøkerIcon classname={styles.relatertFagsak__icon} />
        <Normaltekst className={styles.relatertFagsak__description}>{andreParterTekst()}</Normaltekst>
        {visRelaterteSøkere()}
      </div>
      <Normaltekst tag="span">/</Normaltekst>
      <div className={styles.relatertFagsak__centeredFlex}>
        <Normaltekst>{søkerIdent}</Normaltekst>
        {harMerEnnEnRelatertSøker && (
          <Lenke
            className={`${styles.relatertFagsak__selector} ${styles['relatertFagsak__selector--pushLeft']}`}
            href={`/k9/web${pathToFagsak(saksnummer)}`}
            target="_blank"
          >
            Åpne sak
          </Lenke>
        )}
      </div>
    </div>
  );
};

export default RelatertFagsak;
