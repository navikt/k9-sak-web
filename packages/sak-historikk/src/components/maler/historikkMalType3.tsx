import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { HistorikkInnslagAksjonspunkt } from '@k9-sak-web/types';
import { BodyShort, Label } from '@navikt/ds-react';
import React, { ReactNode } from 'react';
import { IntlShape, WrappedComponentProps, injectIntl } from 'react-intl';

import { decodeHtmlEntity } from '@fpsak-frontend/utils';
import HistorikkMal from '../HistorikkMalTsType';
import Skjermlenke from './felles/Skjermlenke';
import { findHendelseText } from './felles/historikkUtils';

const aksjonspunktCodesToTextCode = {
  [aksjonspunktCodes.VURDER_PERIODER_MED_OPPTJENING]: 'Historikk.Behandlingspunkt.Opptjeningsvilkaret',
  [aksjonspunktCodes.VARSEL_REVURDERING_ETTERKONTROLL]: 'VarselOmRevurderingInfoPanel.Etterkontroll',
  [aksjonspunktCodes.VARSEL_REVURDERING_MANUELL]: 'VarselOmRevurderingInfoPanel.Manuell',
  [aksjonspunktCodes.AVKLAR_VERGE]: 'Historikk.AvklarVerge',
  [aksjonspunktCodes.BEHANDLE_KLAGE_NFP]: 'Historikk.KlageNFP.Fastsett',
  [aksjonspunktCodes.BEHANDLE_KLAGE_NK]: 'Historikk.KlageKA.Fastsett',
  [aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_NFP]: 'Historikk.KlageNFP.Formkrav',
  [aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_KA]: 'Historikk.KlageKA.Formkrav',
  [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD]: 'Historikk.AvklarArbeidsforhold',
  [aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD]: 'Historikk.Lovlig',
  [aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT]: 'Historikk.Bosatt',
  [aksjonspunktCodes.AVKLAR_OPPHOLDSRETT]: 'Historikk.Rett',
  [aksjonspunktCodes.AVKLAR_PERSONSTATUS]: 'Historikk.CheckAvklarPersonstatus',
  [aksjonspunktCodes.OVERSTYR_OMSORGEN_FOR]: 'Historikk.fodselsvilkar',
  [aksjonspunktCodes.OVERSTYR_ADOPSJONSVILKAR]: 'Historikk.adopsjonsvilkar',
  [aksjonspunktCodes.OVERSTYRING_AV_OPPTJENINGSVILKARET]: 'Historikk.opptjeningsvilkår',
  [aksjonspunktCodes.OVERSTYR_MEDLEMSKAPSVILKAR]: 'Historikk.medlemskapsvilkar',
  [aksjonspunktCodes.OVERSTYR_SOKNADSFRISTVILKAR]: 'Historikk.soknadsfristvilkar',
  [aksjonspunktCodes.OVERSTYR_BEREGNING]: 'Historikk.beregning',
  [aksjonspunktCodes.OVERSTYRING_AV_UTTAKPERIODER]: 'Historikk.uttak',
  [aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_DØD]: 'Historikk.OpplysningerOmDod',
  [aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST]: 'Historikk.OpplysningerOmSoknadsfrist',
  [aksjonspunktCodes.KONTROLLER_TILSTØTENDE_YTELSER_INNVILGET]: 'Historikk.OpplysningerOmTilstotendeYtelser.Innvilget',
  [aksjonspunktCodes.KONTROLLER_TILSTØTENDE_YTELSER_OPPHØRT]: 'Historikk.OpplysningerOmTilstotendeYtelser.Opphort',
  [aksjonspunktCodes.TILKNYTTET_STORTINGET]: 'Historikk.TilknyttetStortinget',
  [aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS]: 'Historikk.BeregningsgrunnlagManueltATFL',
  [aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE]:
    'Historikk.VurderVarigEndring',
  [aksjonspunktCodes.FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE]:
    'Historikk.BeregningsgrunnlagManueltSN',
  [aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD]:
    'Historikk.BeregningsgrunnlagManueltTidsbegrenset',
  [aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET]:
    'Historikk.BeregningsgrunnlagManueltSNNYIArbeidslivet',
  [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: 'Historikk.VurderFaktaATFLSN',
  [aksjonspunktCodes.FORESLA_VEDTAK]: 'Historikk.Vedtak.Fritekstbrev',
};

const tilbakekrevingsAksjonspunktCodesToTextCode = {};

const formaterAksjonspunkt = (
  aksjonspunkt: HistorikkInnslagAksjonspunkt,
  intl: IntlShape,
  erTilbakekreving: boolean,
): ReactNode => {
  const aksjonspktText = erTilbakekreving
    ? tilbakekrevingsAksjonspunktCodesToTextCode[aksjonspunkt.aksjonspunktKode]
    : aksjonspunktCodesToTextCode[aksjonspunkt.aksjonspunktKode];
  const { formatMessage } = intl;

  if (aksjonspunkt.godkjent) {
    return (
      <BodyShort size="small">
        {aksjonspktText && `${formatMessage({ id: aksjonspktText })} ${formatMessage({ id: 'Historikk.godkjent' })}`}
        {!aksjonspktText && formatMessage({ id: 'Historikk.godkjentKomplett' })}
      </BodyShort>
    );
  }
  return (
    <span>
      <Label size="small" as="p">
        {aksjonspktText &&
          `${formatMessage({ id: aksjonspktText })} ${formatMessage({ id: 'Historikk.ikkeGodkjent' })}`}
        {!aksjonspktText && formatMessage({ id: 'Historikk.ikkeGodkjentKomplett' })}
      </Label>
      <BodyShort size="small">{decodeHtmlEntity(aksjonspunkt.aksjonspunktBegrunnelse)}</BodyShort>
    </span>
  );
};

const HistorikkMalType3 = ({
  intl,
  historikkinnslag,
  behandlingLocation,
  getKodeverknavn,
  createLocationForSkjermlenke,
  erTilbakekreving,
}: HistorikkMal & WrappedComponentProps) => (
  // eslint-disable-next-line react/jsx-no-useless-fragment
  <>
    {historikkinnslag.historikkinnslagDeler &&
      historikkinnslag.historikkinnslagDeler.map((historikkinnslagDel, index) => (
        <div key={`totrinnsvurdering${index + 1}`}>
          {historikkinnslagDel.hendelse && (
            <>
              <Label size="small" as="p">
                {findHendelseText(historikkinnslagDel.hendelse, getKodeverknavn)}
              </Label>
              <VerticalSpacer fourPx />
            </>
          )}
          {historikkinnslagDel.skjermlenke ? (
            <Skjermlenke
              skjermlenke={historikkinnslagDel.skjermlenke}
              behandlingLocation={behandlingLocation}
              getKodeverknavn={getKodeverknavn}
              scrollUpOnClick
              createLocationForSkjermlenke={createLocationForSkjermlenke}
            />
          ) : null}
          {historikkinnslagDel.aksjonspunkter &&
            historikkinnslagDel.aksjonspunkter.map(aksjonspunkt => (
              <div key={aksjonspunkt.aksjonspunktKode}>
                {formaterAksjonspunkt(aksjonspunkt, intl, erTilbakekreving)}
                <VerticalSpacer fourPx />
              </div>
            ))}
        </div>
      ))}
  </>
);

export default injectIntl(HistorikkMalType3);
