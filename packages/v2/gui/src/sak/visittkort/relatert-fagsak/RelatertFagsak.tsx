import type { RelatertSakDto } from '@k9-sak-web/backend/k9sak/generated';
import { pathToFagsak } from '@k9-sak-web/sak-app/src/app/paths';
import { LockedFilled, UnlockedFilled } from '@navikt/ds-icons';
import { BodyShort, Link, Select } from '@navikt/ds-react';
import classNames from 'classnames';
import React from 'react';
import RelatertSøkerIcon from './RelatertSøkerIcon';
import styles from './relatertFagsak.module.css';

interface RelatertFagsakProps {
  relaterteFagsaker?: RelatertSakDto;
}

const RelatertFagsak = ({ relaterteFagsaker }: RelatertFagsakProps) => {
  if (!relaterteFagsaker || relaterteFagsaker.relaterteSøkere?.length === 0) {
    return null;
  }
  const { relaterteSøkere } = relaterteFagsaker;
  const [valgtSøkerIdent, setValgtSøkerIdent] = React.useState(relaterteSøkere ? relaterteSøkere[0]?.søkerIdent : '');
  const valgtSøker = relaterteSøkere?.find(søker => søker.søkerIdent === valgtSøkerIdent);
  const harMerEnnEnRelatertSøker = relaterteSøkere && relaterteSøkere.length > 1;
  const { saksnummer, søkerNavn, søkerIdent, åpenBehandling } = valgtSøker || {};

  const behandlingsstatus = (søker: NonNullable<RelatertSakDto['relaterteSøkere']>[number]) =>
    søker.åpenBehandling ? '(Åpen behandling)' : '(Lukket behandling)';

  const visRelaterteSøkere = () => {
    if (!harMerEnnEnRelatertSøker) {
      return (
        <Link
          className={classNames([styles.relatertFagsakSelector, styles.relatertFagsakMarginLeft])}
          href={`/k9/web${pathToFagsak(saksnummer ?? '')}`}
          target="_blank"
        >
          <BodyShort size="small" as="span" className={styles.relatertFagsakName}>
            {søkerNavn}
          </BodyShort>
        </Link>
      );
    }
    return (
      <Select
        label="Velg relatert søker"
        onChange={e => setValgtSøkerIdent(e.target.value)}
        className={styles.relatertFagsakSøkerSelect}
        size="small"
      >
        {relaterteSøkere.map(søker => (
          <option key={søker.søkerIdent} value={søker.søkerIdent}>
            {søker.søkerNavn} {behandlingsstatus(søker)}
          </option>
        ))}
      </Select>
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
      <div className={styles.relatertFagsakNameGenderContainer}>
        <RelatertSøkerIcon classname={styles.relatertFagsakIcon} />
        <BodyShort size="small" className={styles.relatertFagsakDescription}>
          {andreParterTekst()}
        </BodyShort>
        {visRelaterteSøkere()}
      </div>
      <BodyShort size="small" as="span">
        /
      </BodyShort>
      <div className={styles.relatertFagsakCenteredFlex}>
        <BodyShort size="small">{søkerIdent}</BodyShort>
        {!harMerEnnEnRelatertSøker && åpenBehandling ? (
          <UnlockedFilled className={styles.relatertFagsakLock} width="1.25em" height="1.25em" />
        ) : (
          <LockedFilled className={styles.relatertFagsakLock} width="1.25em" height="1.25em" />
        )}
        {harMerEnnEnRelatertSøker && (
          <Link
            className={`${styles.relatertFagsakSelector} ${styles['relatertFagsakSelectorPushLeft']}`}
            href={`/k9/web${pathToFagsak(saksnummer ?? '')}`}
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
