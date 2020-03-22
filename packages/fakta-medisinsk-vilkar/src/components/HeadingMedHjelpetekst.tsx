import { Element } from 'nav-frontend-typografi';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Image } from '@fpsak-frontend/shared-components';
import chevronIkonUrl from '@fpsak-frontend/assets/images/pil_ned.svg';
import styles from './headingMedHjelpetekst.less';

interface HeadingMedHjelpetekst {
  headingId: string | string[];
  helpTextId: string;
}

const HeadingMedHjelpetekst = ({ headingId, helpTextId }) => {
  const [showHelpText, toggleShowHelpText] = React.useState(false);
  const onClick = () => toggleShowHelpText(!showHelpText);

  const getHelpText = () => {
    if (Array.isArray(helpTextId)) {
      return helpTextId.map(id => (
        <span key={id}>
          <FormattedMessage id={id} />
        </span>
      ));
    }
    return <FormattedMessage id={helpTextId} />;
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.headingContainer}>
        <Element>
          <FormattedMessage id={headingId} />
        </Element>
        <button
          className={styles.toggleButton}
          type="button"
          onClick={onClick}
          aria-controls={headingId}
          aria-expanded={showHelpText}
        >
          <FormattedMessage
            id={showHelpText ? 'MedisinskVilkarForm.HjelpetekstSkjul' : 'MedisinskVilkarForm.HjelpetekstVis'}
          />
          <Image className={showHelpText ? styles.chevronOpp : styles.chevronNed} src={chevronIkonUrl} alt="" />
        </button>
      </div>
      <div id={headingId}>{showHelpText && <p className={styles.helpTextContainer}>{getHelpText()}</p>}</div>
    </div>
  );
};

export default HeadingMedHjelpetekst;
