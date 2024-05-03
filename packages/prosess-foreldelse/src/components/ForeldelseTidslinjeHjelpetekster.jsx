import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';

import ikkeOppfyltUrl from '@k9-sak-web/assets/images/ikke_oppfylt.svg';
import oppfyltUrl from '@k9-sak-web/assets/images/oppfylt.svg';
import uavklartUrl from '@k9-sak-web/assets/images/uavklart.svg';
import { LegendBox } from '@k9-sak-web/tidslinje';

const ForeldelseTidslinjeHjelpetekster = ({ intl }) => {
  const legends = [
    {
      src: oppfyltUrl,
      text: intl.formatMessage({ id: 'Timeline.OppfyltPeriode' }),
    },
    {
      src: ikkeOppfyltUrl,
      text: intl.formatMessage({ id: 'Timeline.IkkeOppfyltPeriode' }),
    },
    {
      src: uavklartUrl,
      text: intl.formatMessage({ id: 'Timeline.IkkeAvklartPeriode' }),
    },
  ];
  return <LegendBox legends={legends} />;
};
ForeldelseTidslinjeHjelpetekster.propTypes = {
  intl: PropTypes.shape().isRequired,
};
export default injectIntl(ForeldelseTidslinjeHjelpetekster);
