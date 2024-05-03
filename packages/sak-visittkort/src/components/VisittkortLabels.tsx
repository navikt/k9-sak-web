import diskresjonskodeType from '@k9-sak-web/kodeverk/src/diskresjonskodeType';
import { Tooltip } from '@k9-sak-web/shared-components';
import { Personopplysninger } from '@k9-sak-web/types';
import { dateFormat } from '@k9-sak-web/utils';
import { Tag } from '@navikt/ds-react';
import moment from 'moment';
import React, { useMemo } from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import styles from './visittkortLabels.module.css';

interface OwnProps {
  personopplysninger: Personopplysninger;
  harTilbakekrevingVerge?: boolean;
}

const VisittkortLabels = ({
  intl,
  personopplysninger,
  harTilbakekrevingVerge = false,
}: OwnProps & WrappedComponentProps) => {
  const erSokerUnder18 = useMemo(
    () => personopplysninger && moment().diff(personopplysninger.fodselsdato, 'years') < 18,
    [personopplysninger],
  );
  const harVerge = personopplysninger
    ? personopplysninger.harVerge && !personopplysninger.dodsdato
    : harTilbakekrevingVerge;
  return (
    <>
      {personopplysninger && personopplysninger.dodsdato && (
        <Tooltip content={intl.formatMessage({ id: 'VisittkortLabels.DodTittel' })} alignBottom>
          <Tag variant="info" className={styles.etikett}>
            <FormattedMessage id="VisittkortLabels.Dod" values={{ dato: dateFormat(personopplysninger.dodsdato) }} />
          </Tag>
        </Tooltip>
      )}
      {personopplysninger &&
        personopplysninger.diskresjonskode?.kode === diskresjonskodeType.KODE6 &&
        !personopplysninger.dodsdato && (
          <Tooltip content={intl.formatMessage({ id: 'VisittkortLabels.Diskresjon6Tittel' })} alignBottom>
            <Tag variant="error" className={styles.etikett}>
              <FormattedMessage id="VisittkortLabels.Diskresjon6" />
            </Tag>
          </Tooltip>
        )}
      {personopplysninger &&
        personopplysninger.diskresjonskode?.kode === diskresjonskodeType.KODE7 &&
        !personopplysninger.dodsdato && (
          <Tooltip content={intl.formatMessage({ id: 'VisittkortLabels.Diskresjon7Tittel' })} alignBottom>
            <Tag variant="warning" className={styles.etikett}>
              <FormattedMessage id="VisittkortLabels.Diskresjon7" />
            </Tag>
          </Tooltip>
        )}
      {harVerge && (
        <Tooltip content={intl.formatMessage({ id: 'VisittkortLabels.VergeTittel' })} alignBottom>
          <Tag variant="info" className={styles.etikett}>
            <FormattedMessage id="VisittkortLabels.Verge" />
          </Tag>
        </Tooltip>
      )}
      {personopplysninger && erSokerUnder18 && (
        <Tooltip content={intl.formatMessage({ id: 'VisittkortLabels.Under18Tittel' })} alignBottom>
          <Tag variant="info" className={styles.etikett}>
            <FormattedMessage id="VisittkortLabels.Under18" />
          </Tag>
        </Tooltip>
      )}
    </>
  );
};

export default injectIntl(VisittkortLabels);
