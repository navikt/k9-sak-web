import avslagsarsakCodes from '@fpsak-frontend/kodeverk/src/avslagsarsakCodes';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { DDMMYYYY_DATE_FORMAT } from '@k9-sak-web/lib/dateUtils/formats.js';
import { KodeverkNavnFraKodeType } from '@k9-sak-web/lib/kodeverk/types.js';
import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types/KodeverkType.js';
import { BodyShort, Label } from '@navikt/ds-react';
import {
  folketrygdloven_kalkulus_response_v1_beregningsgrunnlag_gui_frisinn_AvslagsårsakPrPeriodeDto as AvslagsårsakPrPeriodeDto,
  sak_kontrakt_behandling_BehandlingsresultatDto as BehandlingsresultatDto,
  sak_kontrakt_økonomi_tilbakekreving_TilbakekrevingValgDto as TilbakekrevingValgDto,
} from '@navikt/k9-sak-typescript-client';
import moment from 'moment';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { BeregningResultat } from '../../types/BeregningResultat';
import VedtakSimuleringResultat from '../../types/VedtakSimuleringResultat';
import { findTilbakekrevingText } from '../VedtakHelper';

const mapFraAvslagskodeTilTekst = kode => {
  switch (kode) {
    case avslagsarsakCodes.AVKORTET_GRUNNET_ANNEN_INNTEKT:
      return 'Avkortet grunnet annen inntekt';
    case avslagsarsakCodes.FOR_LAVT_BG:
      return 'For lavt brutto beregningsgrunnlag';
    case avslagsarsakCodes.AVKORTET_GRUNNET_LØPENDE_INNTEKT:
      return 'Avkortet grunnet løpende inntekter';
    case avslagsarsakCodes.INGEN_FRILANS_I_PERIODE_UTEN_YTELSE:
      return 'Ingen frilansaktivitet i periode uten ytelse';
    default:
      return 'Avslag';
  }
};

/*
 * Denne bruker behandlingsresultat.type som i tidligere kodeverk hadde flere attributer bakt inn. Dette skal skrives bort
 * så type blir en string som andre kodeverk
 */
export const lagKonsekvensForYtelsenTekst = (konsekvenser, kodeverkNavnFraKode: KodeverkNavnFraKodeType) => {
  if (!konsekvenser || konsekvenser.length < 1) {
    return '';
  }
  return konsekvenser.map(k => kodeverkNavnFraKode(k.type, KodeverkType.BEHANDLING_RESULTAT_TYPE)).join(' og ');
};

const lagPeriodevisning = periodeMedÅrsak => {
  if (!periodeMedÅrsak) {
    return undefined;
  }
  const fom = moment(periodeMedÅrsak.fom).format(DDMMYYYY_DATE_FORMAT);
  const tom = moment(periodeMedÅrsak.tom).format(DDMMYYYY_DATE_FORMAT);
  const årsak = mapFraAvslagskodeTilTekst(periodeMedÅrsak.avslagsårsak);
  return <FormattedMessage id="VedtakForm.Avslagsgrunner.Beregning" values={{ fom, tom, årsak }} />;
};

interface VedtakInnvilgetRevurderingPanelProps {
  ytelseTypeKode: string;
  konsekvenserForYtelsen?: [BehandlingsresultatDto];
  tilbakekrevingText?: string;
  bgPeriodeMedAvslagsårsak?: AvslagsårsakPrPeriodeDto;
  simuleringResultat: VedtakSimuleringResultat;
  tilbakekrevingvalg: TilbakekrevingValgDto;
  kodeverkNavnFraKode: KodeverkNavnFraKodeType;
  behandlingsresultat: BeregningResultat;
  behandlingType: string | undefined;
}

export const VedtakInnvilgetRevurderingPanelImpl = ({
  intl,
  ytelseTypeKode,
  konsekvenserForYtelsen,
  tilbakekrevingText,
  bgPeriodeMedAvslagsårsak,
}: VedtakInnvilgetRevurderingPanelProps & WrappedComponentProps) => {
  const { kodeverkNavnFraKode } = useKodeverkContext();

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {(ytelseTypeKode === fagsakYtelsesType.OMSORGSPENGER ||
        ytelseTypeKode === fagsakYtelsesType.FRISINN ||
        ytelseTypeKode === fagsakYtelsesType.PLEIEPENGER_SYKT_BARN) && (
        <div data-testid="innvilgetRevurdering">
          <Label size="small" as="p">
            {intl.formatMessage({ id: 'VedtakForm.Resultat' })}
          </Label>
          <BodyShort size="small">
            {lagKonsekvensForYtelsenTekst(konsekvenserForYtelsen, kodeverkNavnFraKode)}
            {lagKonsekvensForYtelsenTekst(konsekvenserForYtelsen, kodeverkNavnFraKode) !== '' &&
              tilbakekrevingText &&
              '. '}
            {tilbakekrevingText &&
              intl.formatMessage({
                id: tilbakekrevingText,
              })}
            {bgPeriodeMedAvslagsårsak && (
              <BodyShort size="small">{lagPeriodevisning(bgPeriodeMedAvslagsårsak)}</BodyShort>
            )}
          </BodyShort>
          <VerticalSpacer sixteenPx />
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state, ownProps: VedtakInnvilgetRevurderingPanelProps) => ({
  konsekvenserForYtelsen: ownProps.behandlingsresultat !== undefined ? [ownProps.behandlingsresultat] : undefined,
  tilbakekrevingText: findTilbakekrevingText(ownProps),
});

export default connect(mapStateToProps)(injectIntl(VedtakInnvilgetRevurderingPanelImpl));
