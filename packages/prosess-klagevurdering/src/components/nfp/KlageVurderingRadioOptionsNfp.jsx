import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';

import { RadioGroupField, SelectField } from '@fpsak-frontend/form';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import klageVurderingType from '@fpsak-frontend/kodeverk/src/klageVurdering';
import klageVurderingOmgjoerType from '@fpsak-frontend/kodeverk/src/klageVurderingOmgjoer';
import { ArrowBox, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { required } from '@fpsak-frontend/utils';

import styles from './klageVurderingRadioOptionsNfp.module.css';

export const TILBAKEKREVING_HJEMMEL = '22-15';

const utledHjemler = fagsak => {
  switch (fagsak.sakstype.kode) {
    case fagsakYtelseType.PLEIEPENGER:
      return [
        { kode: '9-2', navn: '§ 9-2' },
        { kode: '9-3', navn: '§ 9-3' },
        { kode: '9-10', navn: '§ 9-10' },
        { kode: '9-11', navn: '§ 9-11' },
        { kode: '9-15', navn: '§ 9-15' },
        { kode: '9-16', navn: '§ 9-16' },
        { kode: '22-13', navn: '§ 22-13' },
      ];

    case fagsakYtelseType.OMSORGSPENGER:
    case fagsakYtelseType.OMSORGSPENGER_KRONISK_SYKT_BARN:
    case fagsakYtelseType.OMSORGSPENGER_MIDLERTIDIG_ALENE:
      return [
        { kode: '9-2', navn: '§ 9-2' },
        { kode: '9-3', navn: '§ 9-3' },
        { kode: '9-5', navn: '§ 9-5' },
        { kode: '9-6', navn: '§ 9-6' },
        { kode: '9-8', navn: '§ 9-8' },
        { kode: '9-9', navn: '§ 9-9' },
        { kode: '22-13', navn: '§ 22-13' },
      ];

    case fagsakYtelseType.PLEIEPENGER_SLUTTFASE:
      return [
        { kode: '9-2', navn: '§ 9-2' },
        { kode: '9-3', navn: '§ 9-3' },
        { kode: '9-13', navn: '§ 9-13' },
        { kode: '22-13', navn: '§ 22-13' },
      ];

    default:
      return [];
  }
};

export const KlageVurderingRadioOptionsNfp = ({
  fagsak,
  readOnly = true,
  medholdReasons,
  klageVurdering = null,
  erPåklagdBehandlingTilbakekreving,
  intl,
}) => {
  const hjemler = utledHjemler(fagsak);

  const skalViseHjemler =
    fagsak.sakstype.kode !== fagsakYtelseType.FRISINN &&
    klageVurdering === klageVurderingType.STADFESTE_YTELSESVEDTAK &&
    hjemler.length > 0;

  return (
    <div>
      <RadioGroupField
        name="klageVurdering"
        validate={[required]}
        readOnly={readOnly}
        className={readOnly ? styles.selectReadOnly : null}
        radios={[
          {
            value: klageVurderingType.MEDHOLD_I_KLAGE,
            label: intl.formatMessage({ id: 'Klage.ResolveKlage.ChangeVedtak' }),
          },
          {
            value: klageVurderingType.STADFESTE_YTELSESVEDTAK,
            label: intl.formatMessage({ id: 'Klage.ResolveKlage.KeepVedtakNfp' }),
          },
        ]}
      />
      {klageVurdering === klageVurderingType.MEDHOLD_I_KLAGE && (
        <ArrowBox className={readOnly ? styles.selectReadOnly : null}>
          <SelectField
            readOnly={readOnly}
            name="klageMedholdArsak"
            selectValues={medholdReasons.map(mo => (
              <option key={mo.kode} value={mo.kode}>
                {mo.navn}
              </option>
            ))}
            className={readOnly ? styles.selectReadOnly : null}
            label={intl.formatMessage({ id: 'Klage.ResolveKlage.Cause' })}
            validate={[required]}
            bredde="xl"
          />
          <VerticalSpacer sixteenPx />
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
      {skalViseHjemler && !erPåklagdBehandlingTilbakekreving && (
        <ArrowBox className={readOnly ? styles.selectReadOnly : null}>
          <SelectField
            readOnly={readOnly}
            name="klageHjemmel"
            selectValues={hjemler.map(h => (
              <option key={h.kode} value={h.kode}>
                {h.navn}
              </option>
            ))}
            className={readOnly ? styles.selectReadOnly : null}
            label={intl.formatMessage({ id: 'Klage.ResolveKlage.Hjemmel' })}
            validate={[required]}
            bredde="xl"
          />
        </ArrowBox>
      )}
    </div>
  );
};

KlageVurderingRadioOptionsNfp.propTypes = {
  fagsak: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool,
  erPåklagdBehandlingTilbakekreving: PropTypes.bool,
  medholdReasons: PropTypes.arrayOf(
    PropTypes.shape({
      kode: PropTypes.string,
      navn: PropTypes.string,
    }),
  ).isRequired,
  klageVurdering: PropTypes.string,
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(KlageVurderingRadioOptionsNfp);
