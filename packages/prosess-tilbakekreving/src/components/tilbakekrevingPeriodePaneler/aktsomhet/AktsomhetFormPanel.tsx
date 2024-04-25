import { RadioGroupField } from '@fpsak-frontend/form';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { decodeHtmlEntity, removeSpacesFromNumber, required } from '@fpsak-frontend/utils';
import { Detail, Radio } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { FormSection } from 'redux-form';

import { KodeverkMedNavn } from '@k9-sak-web/types';
import KodeverkMedNavnTsType from '@k9-sak-web/types/src/kodeverkMedNavnTsType';

import Aktsomhet from '../../../kodeverk/aktsomhet';
import { AktsomhetInfo } from '../../../types/vilkarsVurdertePerioderTsType';
import AktsomhetGradFormPanel from './AktsomhetGradFormPanel';
import { ANDELER, EGENDEFINERT } from './AktsomhetReduksjonAvBelopFormPanel';

const uaktsomhetCodes = [Aktsomhet.GROVT_UAKTSOM, Aktsomhet.SIMPEL_UAKTSOM, Aktsomhet.FORSETT];

const forstoBurdeForstattTekster = {
  [Aktsomhet.FORSETT]: 'AktsomhetFormPanel.AktsomhetTyperLabel.Forsett',
  [Aktsomhet.GROVT_UAKTSOM]: 'AktsomhetFormPanel.AktsomhetTyperLabel.GrovtUaktsomt',
  [Aktsomhet.SIMPEL_UAKTSOM]: 'AktsomhetFormPanel.AktsomhetTyperLabel.SimpelUaktsom',
};

interface AktsomhetData {
  andelSomTilbakekreves: number | string;
  andelSomTilbakekrevesManuell: number;
  harGrunnerTilReduksjon: boolean;
  skalDetTilleggesRenter: boolean;
  belopSomSkalTilbakekreves: number;
  annetBegrunnelse: string;
  sarligGrunnerBegrunnelse: string;
  tilbakekrevSelvOmBeloepErUnder4Rettsgebyr: boolean;
}

export interface InitialValuesAktsomhetForm {
  handletUaktsomhetGrad: Aktsomhet;
  [Aktsomhet.FORSETT]?: AktsomhetData;
  [Aktsomhet.GROVT_UAKTSOM]?: AktsomhetData;
  [Aktsomhet.SIMPEL_UAKTSOM]?: AktsomhetData;
}

interface TransformedValuesAktsomhetForm {
  '@type': string;
  aktsomhet: any;
  begrunnelse: string;
  aktsomhetInfo: any;
}

interface OwnProps {
  readOnly: boolean;
  resetFields: (...args: any[]) => any;
  harGrunnerTilReduksjon?: boolean;
  erSerligGrunnAnnetValgt?: boolean;
  erValgtResultatTypeForstoBurdeForstaatt?: boolean;
  handletUaktsomhetGrad?: Aktsomhet;
  antallYtelser: number;
  feilutbetalingBelop: number;
  erTotalBelopUnder4Rettsgebyr: boolean;
  aktsomhetTyper?: KodeverkMedNavn[];
  sarligGrunnTyper?: KodeverkMedNavn[];
  andelSomTilbakekreves?: string;
}

const AktsomhetFormPanel = ({
  readOnly,
  resetFields,
  handletUaktsomhetGrad,
  harGrunnerTilReduksjon,
  erSerligGrunnAnnetValgt,
  erValgtResultatTypeForstoBurdeForstaatt,
  aktsomhetTyper,
  sarligGrunnTyper,
  antallYtelser,
  feilutbetalingBelop,
  erTotalBelopUnder4Rettsgebyr,
  andelSomTilbakekreves,
}: OwnProps) => (
  <>
    <Detail>
      <FormattedMessage id="AktsomhetFormPanel.HandletUaktsomhetGrad" />
    </Detail>
    <VerticalSpacer eightPx />
    <RadioGroupField
      validate={[required]}
      name="handletUaktsomhetGrad"
      readOnly={readOnly}
      // @ts-ignore tror denne trengs fordi fpsak-frontend/form ikkje er fullstendig konvertert til typescript
      onChange={resetFields}
    >
      {aktsomhetTyper.map((vrt: KodeverkMedNavn) => (
        <Radio key={vrt.kode} value={vrt.kode}>
          {erValgtResultatTypeForstoBurdeForstaatt ? (
            <FormattedMessage id={forstoBurdeForstattTekster[vrt.kode]} />
          ) : (
            vrt.navn
          )}
        </Radio>
      ))}
    </RadioGroupField>
    {uaktsomhetCodes.includes(handletUaktsomhetGrad) && (
      <FormSection name={handletUaktsomhetGrad} key={handletUaktsomhetGrad}>
        <AktsomhetGradFormPanel
          harGrunnerTilReduksjon={harGrunnerTilReduksjon}
          readOnly={readOnly}
          handletUaktsomhetGrad={handletUaktsomhetGrad}
          erSerligGrunnAnnetValgt={erSerligGrunnAnnetValgt}
          erValgtResultatTypeForstoBurdeForstaatt={erValgtResultatTypeForstoBurdeForstaatt}
          sarligGrunnTyper={sarligGrunnTyper}
          harMerEnnEnYtelse={antallYtelser > 1}
          feilutbetalingBelop={feilutbetalingBelop}
          erTotalBelopUnder4Rettsgebyr={erTotalBelopUnder4Rettsgebyr}
          andelSomTilbakekreves={andelSomTilbakekreves}
        />
      </FormSection>
    )}
  </>
);

AktsomhetFormPanel.defaultProps = {
  erSerligGrunnAnnetValgt: false,
  erValgtResultatTypeForstoBurdeForstaatt: false,
};

const parseIntAndelSomTilbakekreves = (andelSomTilbakekreves: string, harGrunnerTilReduksjon: boolean) => {
  const parsedValue = parseInt(andelSomTilbakekreves, 10);
  return !harGrunnerTilReduksjon || Number.isNaN(parsedValue) ? {} : { andelTilbakekreves: parsedValue };
};

const parseFloatAndelSomTilbakekreves = (andelSomTilbakekreves: string, harGrunnerTilReduksjon: boolean) => {
  const parsedValue = parseFloat(andelSomTilbakekreves);
  return !harGrunnerTilReduksjon || Number.isNaN(parsedValue) ? {} : { andelTilbakekreves: parsedValue };
};

// TODO Fiks typen til aktsomhet
const formatAktsomhetData = (aktsomhet: any, sarligGrunnTyper: KodeverkMedNavn[]) => {
  const sarligeGrunner = sarligGrunnTyper.reduce(
    (acc: string[], type: KodeverkMedNavn) => (aktsomhet[type.kode] ? acc.concat(type.kode) : acc),
    [],
  );

  const { harGrunnerTilReduksjon } = aktsomhet;
  const andelSomTilbakekreves =
    aktsomhet.andelSomTilbakekreves === EGENDEFINERT
      ? parseFloatAndelSomTilbakekreves(aktsomhet.andelSomTilbakekrevesManuell, harGrunnerTilReduksjon)
      : parseIntAndelSomTilbakekreves(aktsomhet.andelSomTilbakekreves, harGrunnerTilReduksjon);

  return {
    harGrunnerTilReduksjon,
    ileggRenter: harGrunnerTilReduksjon ? undefined : aktsomhet.skalDetTilleggesRenter,
    sarligGrunner: sarligeGrunner.length > 0 ? sarligeGrunner : undefined,
    tilbakekrevesBelop: aktsomhet.harGrunnerTilReduksjon
      ? removeSpacesFromNumber(aktsomhet.belopSomSkalTilbakekreves)
      : undefined,
    annetBegrunnelse: aktsomhet.annetBegrunnelse,
    sarligGrunnerBegrunnelse: aktsomhet.sarligGrunnerBegrunnelse,
    tilbakekrevSelvOmBeloepErUnder4Rettsgebyr: aktsomhet.tilbakekrevSelvOmBeloepErUnder4Rettsgebyr,
    ...andelSomTilbakekreves,
  };
};

AktsomhetFormPanel.transformValues = (
  info: { handletUaktsomhetGrad: string },
  sarligGrunnTyper: KodeverkMedNavnTsType[],
  vurderingBegrunnelse: string,
): TransformedValuesAktsomhetForm => {
  const aktsomhet = info[info.handletUaktsomhetGrad];
  return {
    '@type': 'annet',
    aktsomhet: info.handletUaktsomhetGrad,
    begrunnelse: vurderingBegrunnelse,
    aktsomhetInfo: aktsomhet ? formatAktsomhetData(aktsomhet, sarligGrunnTyper) : null,
  };
};

AktsomhetFormPanel.buildInitalValues = (vilkarResultatInfo: {
  aktsomhet: KodeverkMedNavn | any;
  aktsomhetInfo?: AktsomhetInfo;
}): InitialValuesAktsomhetForm => {
  const { aktsomhet, aktsomhetInfo } = vilkarResultatInfo;
  const andelSomTilbakekreves =
    aktsomhetInfo && aktsomhetInfo.andelTilbakekreves !== undefined ? `${aktsomhetInfo.andelTilbakekreves}` : undefined;
  const aktsomhetData = aktsomhetInfo
    ? {
        [aktsomhet.kode && 'kode' in aktsomhet ? aktsomhet.kode : aktsomhet]: {
          andelSomTilbakekreves:
            andelSomTilbakekreves === undefined || ANDELER.includes(andelSomTilbakekreves)
              ? andelSomTilbakekreves
              : EGENDEFINERT,
          andelSomTilbakekrevesManuell: !ANDELER.includes(andelSomTilbakekreves)
            ? aktsomhetInfo.andelTilbakekreves
            : undefined,
          harGrunnerTilReduksjon: aktsomhetInfo.harGrunnerTilReduksjon,
          skalDetTilleggesRenter: aktsomhetInfo.ileggRenter,
          belopSomSkalTilbakekreves: aktsomhetInfo.tilbakekrevesBelop,
          annetBegrunnelse: aktsomhetInfo.annetBegrunnelse,
          sarligGrunnerBegrunnelse: decodeHtmlEntity(aktsomhetInfo.sarligGrunnerBegrunnelse),
          tilbakekrevSelvOmBeloepErUnder4Rettsgebyr: aktsomhetInfo.tilbakekrevSelvOmBeloepErUnder4Rettsgebyr,
          ...(aktsomhetInfo.sarligGrunner
            ? aktsomhetInfo.sarligGrunner.reduce(
                (acc: any, sg: any) => ({ ...acc, [sg.kode ? sg.kode : sg]: true }),
                {},
              )
            : {}),
        },
      }
    : {};

  return {
    handletUaktsomhetGrad: aktsomhet && aktsomhet.kode && 'kode' in aktsomhet ? aktsomhet.kode : aktsomhet,
    ...aktsomhetData,
  };
};

export default AktsomhetFormPanel;
