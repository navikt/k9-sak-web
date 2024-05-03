import { HGrid } from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';

import { RadioGroupField, RadioOption, SelectField } from '@k9-sak-web/form';
import klageVurderingType from '@k9-sak-web/kodeverk/src/klageVurdering';
import klageVurderingOmgjoerType from '@k9-sak-web/kodeverk/src/klageVurderingOmgjoer';
import { ProsessStegBegrunnelseTextField } from '@k9-sak-web/prosess-felles';
import { ArrowBox, VerticalSpacer } from '@k9-sak-web/shared-components';
import { required } from '@k9-sak-web/utils';

import styles from './klageVurderingRadioOptionsKa.module.css';

export const KlageVurderingRadioOptionsKa = ({ readOnly, medholdReasons, klageVurdering, intl }) => {
  const medholdOptions = medholdReasons.map(mo => (
    <option key={mo.kode} value={mo.kode}>
      {mo.navn}
    </option>
  ));
  return (
    <div>
      <ProsessStegBegrunnelseTextField
        readOnly={readOnly}
        maxLength={100000}
        text={intl.formatMessage({ id: 'KlageVurderingRadioOptionsKa.VurderingForKlage' })}
      />
      <VerticalSpacer sixteenPx />
      <HGrid gap="1" columns={{ xs: '4fr 4fr 4fr' }}>
        <RadioGroupField name="klageVurdering" validate={[required]} direction="vertical" readOnly={readOnly}>
          <RadioOption
            value={klageVurderingType.STADFESTE_YTELSESVEDTAK}
            label={{ id: 'Klage.ResolveKlage.KeepVedtakNk' }}
          />
          <RadioOption value={klageVurderingType.MEDHOLD_I_KLAGE} label={{ id: 'Klage.ResolveKlage.ChangeVedtak' }} />
        </RadioGroupField>
        <RadioGroupField
          name="klageVurdering"
          validate={[required]}
          readOnly={readOnly}
          className={readOnly ? styles.selectReadOnly : null}
          direction="vertical"
        >
          <RadioOption value={klageVurderingType.HJEMSENDE_UTEN_Å_OPPHEVE} label={{ id: 'Klage.Behandle.Hjemsendt' }} />
          <RadioOption
            value={klageVurderingType.OPPHEVE_YTELSESVEDTAK}
            label={{ id: 'Klage.ResolveKlage.NullifyVedtak' }}
          />
        </RadioGroupField>
      </HGrid>
      {klageVurdering === klageVurderingType.MEDHOLD_I_KLAGE && (
        <ArrowBox>
          <SelectField
            readOnly={readOnly}
            name="klageMedholdArsak"
            selectValues={medholdOptions}
            className={readOnly ? styles.selectReadOnly : null}
            label={intl.formatMessage({ id: 'Klage.ResolveKlage.Cause' })}
            validate={[required]}
            bredde="xl"
          />
          <VerticalSpacer sixPx />
          <RadioGroupField
            name="klageVurderingOmgjoer"
            validate={[required]}
            readOnly={readOnly}
            className={readOnly ? styles.selectReadOnly : null}
            direction="vertical"
          >
            <RadioOption
              value={klageVurderingOmgjoerType.GUNST_MEDHOLD_I_KLAGE}
              label={{ id: 'Klage.Behandle.Omgjort' }}
            />
            <RadioOption
              value={klageVurderingOmgjoerType.UGUNST_MEDHOLD_I_KLAGE}
              label={{ id: 'Klage.Behandle.Ugunst' }}
            />
            <RadioOption
              value={klageVurderingOmgjoerType.DELVIS_MEDHOLD_I_KLAGE}
              label={{ id: 'Klage.Behandle.DelvisOmgjort' }}
            />
          </RadioGroupField>
        </ArrowBox>
      )}
      {klageVurdering === klageVurderingType.OPPHEVE_YTELSESVEDTAK && (
        <ArrowBox marginLeft={380}>
          <SelectField
            readOnly={readOnly}
            name="klageMedholdArsak"
            className={readOnly ? styles.selectReadOnly : null}
            selectValues={medholdOptions}
            label={intl.formatMessage({ id: 'Klage.ResolveKlage.Cause' })}
            validate={[required]}
            bredde="xl"
          />
        </ArrowBox>
      )}
    </div>
  );
};
KlageVurderingRadioOptionsKa.propTypes = {
  readOnly: PropTypes.bool,
  medholdReasons: PropTypes.arrayOf(
    PropTypes.shape({
      kode: PropTypes.string,
      navn: PropTypes.string,
    }),
  ).isRequired,
  klageVurdering: PropTypes.string,
  intl: PropTypes.shape().isRequired,
};

KlageVurderingRadioOptionsKa.defaultProps = {
  readOnly: true,
  klageVurdering: null,
};

export default injectIntl(KlageVurderingRadioOptionsKa);
