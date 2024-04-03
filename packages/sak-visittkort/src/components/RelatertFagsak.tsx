import { pathToFagsak } from '@k9-sak-web/sak-app/src/app/paths';
import { RelatertFagsak as RelatertFagsakType } from '@k9-sak-web/types';
import { LockedFilled, UnlockedFilled } from '@navikt/ds-icons';
import { BodyShort, Link } from '@navikt/ds-react';
import classNames from 'classnames';
import { Select as NavSelect } from 'nav-frontend-skjema';
import React from 'react';
import RelatertSøkerIcon from './RelatertSøkerIcon';
import styles from './relatertFagsak.module.css';

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

  const behandlingsstatus = (søker: RelatertFagsakType['relaterteSøkere'][number]) =>
    søker.åpenBehandling ? '(Åpen behandling)' : '(Lukket behandling)';

  const visRelaterteSøkere = () => {
    if (!harMerEnnEnRelatertSøker) {
      return (
        <Link
          className={classNames([styles.relatertFagsak__selector, styles.relatertFagsak__marginLeft])}
          href={`/k9/web${pathToFagsak(saksnummer)}`}
          target="_blank"
        >
          <BodyShort size="small" as="span" className={styles.relatertFagsak__name}>
            {søkerNavn}
          </BodyShort>
        </Link>
      );
    }
    return (
      <NavSelect
        label="Velg relatert søker"
        onChange={e => setValgtSøkerIdent(e.target.value)}
        className={styles.relatertFagsak__søkerSelect}
      >
        {relaterteSøkere.map(søker => (
          <option key={søker.søkerIdent} value={søker.søkerIdent}>
            {søker.søkerNavn} {behandlingsstatus(søker)}
          </option>
        ))}
      </NavSelect>
    );
  };

  const andreParterTekst = () => {
    if (harMerEnnEnRelatertSøker) {
      return `Andre parter (${relaterteSøkere.length}):`;
    }
    return 'Annen part: ';
  };

  return (
    <div className={styles.relatertFagsak}>
      <div className={styles.relatertFagsak__nameGenderContainer}>
        <RelatertSøkerIcon classname={styles.relatertFagsak__icon} />
        <BodyShort size="small" className={styles.relatertFagsak__description}>
          {andreParterTekst()}
        </BodyShort>
        {visRelaterteSøkere()}
      </div>
      <BodyShort size="small" as="span">
        /
      </BodyShort>
      <div className={styles.relatertFagsak__centeredFlex}>
        <BodyShort size="small">{søkerIdent}</BodyShort>
        {!harMerEnnEnRelatertSøker && åpenBehandling ? (
          <UnlockedFilled className={styles.relatertFagsak__lock} width="1.25em" height="1.25em" />
        ) : (
          <LockedFilled className={styles.relatertFagsak__lock} width="1.25em" height="1.25em" />
        )}
        {harMerEnnEnRelatertSøker && (
          <Link
            className={`${styles.relatertFagsak__selector} ${styles['relatertFagsak__selector--pushLeft']}`}
            href={`/k9/web${pathToFagsak(saksnummer)}`}
            target="_blank"
          >
            Åpne sak
          </Link>
        )}
      </div>
    </div>
  );
};

export default RelatertFagsak;
