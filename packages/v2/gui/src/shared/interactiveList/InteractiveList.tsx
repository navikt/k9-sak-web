import { ChevronRightIcon } from '@navikt/aksel-icons';
import type { ReactNode } from 'react';
import styles from './interactiveList.module.css';

interface InteractiveListElementProps {
  content: ReactNode;
  onClick: () => void;
  active: boolean;
}

interface InteractiveListProps {
  elements: Array<InteractiveListElementProps & { key?: string }>;
}

const InteractiveListElement = ({ content, active, onClick }: InteractiveListElementProps) => {
  const cls = `${styles.interactiveListElement} ${active ? styles.interactiveListElementActive : styles.interactiveListElementInactive}`;

  return (
    <li className={cls}>
      <button className={styles.button} type="button" onClick={onClick} aria-current={active ? 'true' : undefined}>
        <span className={styles.contentContainer}>
          {content}
          <span className={styles.chevron}>
            {active ? (
              <ChevronRightIcon aria-disabled fontSize="1.5rem" />
            ) : (
              <ChevronRightIcon aria-disabled fontSize="1.5rem" color="var(--ax-neutral-400)" />
            )}
          </span>
        </span>
      </button>
    </li>
  );
};

/**
 * @deprecated Kopiert fra ft-plattform-komponenter. Skal erstattes av Vurderingsnavigasjon
 * (shared/vurderingsperiode-navigasjon). Ikke bruk i ny kode.
 */
// TODO: Bytt ut med Vurderingsnavigasjon og slett denne komponenten
export const InteractiveList = ({ elements }: InteractiveListProps) => (
  <ul className={styles.interactiveList}>
    {elements.map((elementProps, index) => {
      const { key, ...rest } = elementProps;
      return <InteractiveListElement key={key ?? index} {...rest} />;
    })}
  </ul>
);
