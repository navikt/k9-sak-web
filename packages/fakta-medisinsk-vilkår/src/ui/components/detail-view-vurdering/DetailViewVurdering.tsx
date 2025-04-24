import { Period } from '@fpsak-frontend/utils';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { DetailView, DetailViewProps } from '@k9-sak-web/gui/shared/detailView/DetailView.js';
import { Button } from '@navikt/ds-react';
import React, { type JSX } from 'react';
import BehandlingType from '../../../constants/BehandlingType';
import ContainerContext from '../../context/ContainerContext';
import PeriodList from '../period-list/PeriodList';
import WriteAccessBoundContent from '../write-access-bound-content/WriteAccessBoundContent';
import styles from './detailViewVurdering.module.css';

type DetailViewVurderingProps = DetailViewProps & {
  perioder: Period[];
  redigerVurdering?: () => void;
};

const DetailViewVurdering = (props: DetailViewVurderingProps): JSX.Element => {
  const { children, perioder, redigerVurdering, title } = props;
  const { fagsakYtelseType, behandlingType } = React.useContext(ContainerContext);
  const harPerioder = perioder.length > 0 && perioder[0].isValid();

  const skalViseRedigerVurderingKnapp =
    fagsakYtelseType === fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE
      ? behandlingType !== BehandlingType.REVURDERING
      : true;

  return (
    <DetailView
      title={title}
      className={styles.detailViewVurdering}
      contentAfterTitleRenderer={() =>
        redigerVurdering && (
          <WriteAccessBoundContent
            contentRenderer={() =>
              skalViseRedigerVurderingKnapp && (
                <Button
                  variant="tertiary"
                  size="xsmall"
                  className={styles.detailViewVurdering__endreLink}
                  onClick={redigerVurdering}
                >
                  Rediger vurdering
                </Button>
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
