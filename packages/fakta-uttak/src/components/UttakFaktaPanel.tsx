import React, { FunctionComponent, useState } from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { useIntl } from 'react-intl';
import { FlexColumn, FlexRow } from '@fpsak-frontend/shared-components/index';
import Image from '@fpsak-frontend/shared-components/src/Image';
import Personopplysninger from '@k9-sak-web/types/src/personopplysningerTsType';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import urlMann from '@fpsak-frontend/assets/images/mann.svg';
import urlUkjent from '@fpsak-frontend/assets/images/ukjent.svg';
import urlKvinne from '@fpsak-frontend/assets/images/kvinne.svg';
import urlBuilding from '@fpsak-frontend/assets/images/building-2.svg';
import { Undertittel } from 'nav-frontend-typografi';
import UttakFaktaForm from './UttakFaktaForm';
import styles from './uttakFaktaPanel.less';
import Arbeidsgiver from './types/Arbeidsgiver';

interface UttakFaktaPanelProps {
  behandlingId: number;
  behandlingVersjon: number;
  arbeidsgivere: Arbeidsgiver[];
  submitCallback: (values: Arbeidsgiver[]) => void;
  personopplysninger: Personopplysninger;
}

const kjønnSrc = kode => {
  switch (kode) {
    case navBrukerKjonn.KVINNE:
      return urlKvinne;
    case navBrukerKjonn.MANN:
      return urlMann;
    default:
      return urlUkjent;
  }
};

const UttakFaktaPanel: FunctionComponent<UttakFaktaPanelProps> = ({ personopplysninger, arbeidsgivere, ...props }) => {
  const intl = useIntl();
  const [erÅpen, setErÅpen] = useState<boolean>(true);
  const åpneLukke = () => setErÅpen(prevErÅpen => !prevErÅpen);

  const paneltittel = (
    <FlexRow className={styles.tittelContent}>
      <Image src={kjønnSrc(personopplysninger.navBrukerKjonn.kode)} className={styles.tittelbilde} />
      <Undertittel tag="span">{personopplysninger.navn}</Undertittel>
      <FlexColumn>
        <FlexRow>
          <Image src={urlBuilding} className={styles.tittelbilde} style={{ marginRight: '1em' }} />
          <Undertittel tag="span">
            {intl.formatMessage(
              {
                id: arbeidsgivere.length === 1 ? 'UttakPanel.Arbeidsgiver' : 'UttakPanel.Arbeidsgivere',
              },
              {
                antall: arbeidsgivere.length,
              },
            )}
          </Undertittel>
        </FlexRow>
      </FlexColumn>
    </FlexRow>
  );

  return (
    <Ekspanderbartpanel apen={erÅpen} onClick={åpneLukke} tittel={paneltittel} border>
      <UttakFaktaForm arbeidsgivere={arbeidsgivere} {...props} />
    </Ekspanderbartpanel>
  );
};

export default UttakFaktaPanel;
