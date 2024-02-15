import { DetailView, DetailViewProps, LinkButton } from '@navikt/ft-plattform-komponenter';
import React from 'react';
import { Period } from '@fpsak-frontend/utils';
import PeriodList from '../period-list/PeriodList';
import styles from './detailViewVurdering.module.css';
import WriteAccessBoundContent from '../write-access-bound-content/WriteAccessBoundContent';
import ContainerContext from '../../context/ContainerContext';
import BehandlingType from '../../../constants/BehandlingType';
import FagsakYtelseType from '../../../constants/FagsakYtelseType';

type DetailViewVurderingProps = DetailViewProps & {
  perioder: Period[];
  redigerVurdering?: () => void;
};

const DetailViewVurdering = (props: DetailViewVurderingProps): JSX.Element => {
  const { children, perioder, redigerVurdering, title } = props;
  const { fagsakYtelseType, behandlingType } = React.useContext(ContainerContext);
  const harPerioder = perioder.length > 0 && perioder[0].isValid();

  const skalViseRedigerVurderingKnapp =
    fagsakYtelseType === FagsakYtelseType.PLEIEPENGER_SLUTTFASE ? behandlingType !== BehandlingType.REVURDERING : true;

  return (
    <DetailView
      title={title}
      className={styles.detailViewVurdering}
      contentAfterTitleRenderer={() =>
        redigerVurdering && (
          <WriteAccessBoundContent
            contentRenderer={() =>
              skalViseRedigerVurderingKnapp && (
                <LinkButton className={styles.detailViewVurdering__endreLink} onClick={redigerVurdering}>
                  Rediger vurdering
                </LinkButton>
              )
            }
          />
        )
      }
    >
      {harPerioder && <PeriodList periods={perioder} className={styles.detailViewVurdering__periodList} />}
      <hr className={styles.detailViewVurdering__hr} />
      {children}
    </DetailView>
  );
};

export default DetailViewVurdering;
