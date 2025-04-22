import TextAreaFormik from '@fpsak-frontend/form/src/TextAreaFormik';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { decodeHtmlEntity, getLanguageFromspråkkode, hasValidText, maxLength, minLength } from '@fpsak-frontend/utils';

import { IntlShape } from 'react-intl';
import styles from './vedtakFritekstPanel.module.css';

const maxLength100000 = maxLength(100000);
const minLength3 = minLength(3);

interface VedtakFritekstPanelProps {
  intl: IntlShape;
  begrunnelse?: string;
  begrunnelseFieldName?: string;
  språkkode: string;
  readOnly: boolean;
  label: string;
}

const VedtakFritekstPanelImpl = ({
  begrunnelse = null,
  begrunnelseFieldName = 'begrunnelse',
  språkkode,
  readOnly,
  label,
  intl,
}: VedtakFritekstPanelProps) => (
  <>
    {!readOnly && (
      <div>
        <VerticalSpacer sixteenPx />
        <TextAreaFormik
          name={begrunnelseFieldName}
          label={label}
          validate={[minLength3, maxLength100000, hasValidText]}
          maxLength={100000}
          readOnly={readOnly}
          badges={[
            {
              type: 'warning',
              text: getLanguageFromspråkkode(språkkode),
              title: intl.formatMessage({ id: 'Malform.Beskrivelse' }),
            },
          ]}
        />
      </div>
    )}
    {readOnly && begrunnelse !== null && (
      <span>
        <VerticalSpacer twentyPx />
        <VerticalSpacer eightPx />
        <div className={styles.fritekstItem}>{decodeHtmlEntity(begrunnelse)}</div>
      </span>
    )}
  </>
);

export default VedtakFritekstPanelImpl;
