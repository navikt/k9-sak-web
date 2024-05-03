import { Period } from '@k9-sak-web/utils';
import { Button } from '@navikt/ds-react';
import { Box, Margin } from '@navikt/ft-plattform-komponenter';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import ContainerContext from '../../../context/ContainerContext';
import AksjonspunktRequestPayload from '../../../types/AksjonspunktRequestPayload';
import FieldName from '../../../types/FieldName';
import { Kode, Kompletthet, Tilstand } from '../../../types/KompletthetData';
import {
  finnAktivtAksjonspunkt,
  finnTilstanderSomRedigeres,
  finnTilstanderSomVurderes,
  ingenTilstanderHarMangler,
} from '../../../util/utils';
import InntektsmeldingListeHeading from '../inntektsmelding-liste-heading/InntektsmeldingListeHeading';
import InntektsmeldingListe from '../inntektsmelding-liste/InntektsmeldingListe';
import PeriodList from '../period-list/PeriodList';
import InntektsmeldingManglerInfo from './InntektsmeldingManglerInfo';
import styles from './kompletthetsoversikt.module.css';

interface KompletthetsoversiktProps {
  kompletthetsoversikt: Kompletthet;
  onFormSubmit: (payload: AksjonspunktRequestPayload) => void;
}

const Kompletthetsoversikt = ({ kompletthetsoversikt, onFormSubmit }: KompletthetsoversiktProps): JSX.Element => {
  const { aksjonspunkter, readOnly } = React.useContext(ContainerContext);
  const { tilstand: tilstander } = kompletthetsoversikt;

  const periods = tilstander.map(({ periode }) => periode);
  const statuses = tilstander.map(({ status }) => status);
  const aktivtAksjonspunkt = finnAktivtAksjonspunkt(aksjonspunkter);
  const forrigeAksjonspunkt = aksjonspunkter.sort((a, b) => Number(b.definisjon.kode) - Number(a.definisjon.kode))[0];
  const aktivtAksjonspunktKode = aktivtAksjonspunkt?.definisjon?.kode;
  const forrigeAksjonspunktKode = forrigeAksjonspunkt?.definisjon?.kode;
  const aksjonspunktKode = aktivtAksjonspunktKode || forrigeAksjonspunktKode;

  const tilstanderBeriket = tilstander.map(tilstand => {
    const [redigeringsmodus, setRedigeringsmodus] = useState(false);

    return {
      ...tilstand,
      redigeringsmodus,
      setRedigeringsmodus,
      begrunnelseFieldName: `${FieldName.BEGRUNNELSE}${tilstand.periodeOpprinneligFormat}`,
      beslutningFieldName: `${FieldName.BESLUTNING}${tilstand.periodeOpprinneligFormat}`,
    };
  });

  const reducer = (defaultValues, tilstand: Tilstand) => ({
    ...defaultValues,
    [`${FieldName.BEGRUNNELSE}${tilstand.periodeOpprinneligFormat}`]: tilstand?.begrunnelse || '',
    [`${FieldName.BESLUTNING}${tilstand.periodeOpprinneligFormat}`]: null,
  });
  const formMethods = useForm({
    mode: 'onTouched',
    defaultValues: tilstanderBeriket.reduce(reducer, {}),
  });
  const { isDirty } = formMethods.formState;
  const { handleSubmit, watch } = formMethods;

  const tilstanderTilVurdering = [
    ...finnTilstanderSomVurderes(tilstanderBeriket),
    ...finnTilstanderSomRedigeres(tilstanderBeriket),
  ];

  const harFlereTilstanderTilVurdering = tilstanderTilVurdering.length > 1;
  const kanSendeInn = () => {
    if (harFlereTilstanderTilVurdering || ingenTilstanderHarMangler(tilstanderBeriket)) {
      if (!readOnly) {
        if (aktivtAksjonspunktKode || (forrigeAksjonspunktKode && isDirty)) return true;
      }
    }
    return false;
  };

  const listItemRenderer = (period: Period) => <InntektsmeldingListe status={statuses[periods.indexOf(period)]} />;
  const listHeadingRenderer = () => <InntektsmeldingListeHeading />;
  return (
    <div className={styles.kompletthet}>
      <h1 className={styles.kompletthet__mainHeading}>Inntektsmelding</h1>
      <h2 className={styles.kompletthet__subHeading}>Opplysninger til beregning</h2>
      <InntektsmeldingManglerInfo />
      <Box marginTop={Margin.large}>
        <PeriodList
          tilstander={tilstanderBeriket}
          listHeadingRenderer={listHeadingRenderer}
          listItemRenderer={listItemRenderer}
          onFormSubmit={onFormSubmit}
          aksjonspunkt={aktivtAksjonspunkt || forrigeAksjonspunkt}
          formMethods={formMethods}
          harFlereTilstanderTilVurdering={harFlereTilstanderTilVurdering}
        />
      </Box>
      {kanSendeInn() && (
        <Box marginTop={Margin.large}>
          <form
            onSubmit={handleSubmit((data: any) => {
              const perioder = tilstanderTilVurdering.map(tilstand => {
                const skalViseBegrunnelse = !(
                  aksjonspunktKode === '9069' && watch(tilstand.beslutningFieldName) !== Kode.FORTSETT
                );
                const begrunnelse = skalViseBegrunnelse ? data[tilstand.begrunnelseFieldName] : null;
                return {
                  begrunnelse,
                  periode: tilstand.periodeOpprinneligFormat,
                  fortsett: data[tilstand.beslutningFieldName] === Kode.FORTSETT,
                  kode: aksjonspunktKode,
                };
              });
              onFormSubmit({
                '@type': aksjonspunktKode,
                kode: aksjonspunktKode,
                perioder,
              });
            })}
          >
            <Button variant="primary" size="small">
              Send inn
            </Button>
          </form>
        </Box>
      )}
    </div>
  );
};

export default Kompletthetsoversikt;
