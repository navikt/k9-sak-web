import { HGrid } from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';

import { RadioGroupField, SelectField } from '@fpsak-frontend/form';
import klageVurderingType from '@fpsak-frontend/kodeverk/src/klageVurdering';
import klageVurderingOmgjoerType from '@fpsak-frontend/kodeverk/src/klageVurderingOmgjoer';
import { ArrowBox, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { required } from '@fpsak-frontend/utils';
import { ProsessStegBegrunnelseTextField } from '@k9-sak-web/prosess-felles';

import styles from './klageVurderingRadioOptionsKa.module.css';

export const KlageVurderingRadioOptionsKa = ({ readOnly = true, medholdReasons, klageVurdering = null, intl }) => {
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
        <RadioGroupField
          name="klageVurdering"
          validate={[required]}
          isVertical
          readOnly={readOnly}
          radios={[
            {
              value: klageVurderingType.STADFESTE_YTELSESVEDTAK,
              label: intl.formatMessage({ id: 'Klage.ResolveKlage.KeepVedtakNk' }),
            },
            {
              value: klageVurderingType.MEDHOLD_I_KLAGE,
              label: intl.formatMessage({ id: 'Klage.ResolveKlage.ChangeVedtak' }),
            },
          ]}
        />
        <RadioGroupField
          name="klageVurdering"
          validate={[required]}
          readOnly={readOnly}
          className={readOnly ? styles.selectReadOnly : null}
          isVertical
          radios={[
            {
              value: klageVurderingType.HJEMSENDE_UTEN_Å_OPPHEVE,
              label: intl.formatMessage({ id: 'Klage.Behandle.Hjemsendt' }),
            },
            {
              value: klageVurderingType.OPPHEVE_YTELSESVEDTAK,
              label: intl.formatMessage({ id: 'Klage.ResolveKlage.NullifyVedtak' }),
            },
          ]}
        />
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
            isVertical
            radios={[
              {
                value: klageVurderingOmgjoerType.GUNST_MEDHOLD_I_KLAGE,
                label: intl.formatMessage({ id: 'Klage.Behandle.Omgjort' }),
              },
              {
                value: klageVurderingOmgjoerType.UGUNST_MEDHOLD_I_KLAGE,
                label: intl.formatMessage({ id: 'Klage.Behandle.Ugunst' }),
              },
              {
                value: klageVurderingOmgjoerType.DELVIS_MEDHOLD_I_KLAGE,
                label: intl.formatMessage({ id: 'Klage.Behandle.DelvisOmgjort' }),
              },
            ]}
          />
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

export default injectIntl(KlageVurderingRadioOptionsKa);
