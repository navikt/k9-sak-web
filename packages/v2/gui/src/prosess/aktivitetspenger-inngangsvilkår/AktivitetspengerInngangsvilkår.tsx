import { ung_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus as AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { CheckmarkIcon, ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { Box, Tabs } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { Alder } from './Alder';
import { AndreLivsoppholdytelser } from './AndreLivsoppholdytelser';
import { BehovForBistand } from './BehovForBistand';
import { Beslutter } from './Beslutter';
import { BosattITrondheim } from './BosattITrondheim';
import { Søknadsfrist } from './Søknadsfrist';
import type { SubmitCallback } from './types';

const CustomCheckmarkIcon = () => <CheckmarkIcon style={{ color: 'var(--ax-text-accent-subtle)' }} />;
const CustomWarningIcon = () => (
  <ExclamationmarkTriangleFillIcon fontSize="1.5rem" color="var(--ax-text-warning-decoration)" />
);

const relevanteAksjonspunktDefinisjoner = [
  AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR,
  AksjonspunktDefinisjon.LOKALKONTOR_FORESLÅR_VILKÅR,
  AksjonspunktDefinisjon.LOKALKONTOR_BESLUTTER_VILKÅR,
];

interface Props {
  aksjonspunkter: AksjonspunktDto[];
  submitCallback: SubmitCallback;
}

export const AktivitetspengerInngangsvilkår = ({ aksjonspunkter, submitCallback }: Props) => {
  const relevanteAksjonspunkter = aksjonspunkter.filter(ap =>
    relevanteAksjonspunktDefinisjoner.some(def => def === ap.definisjon),
  );
  const vurderBistandsvilkårAp = relevanteAksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR,
  );
  const lokalkontorForeslårVilkårAp = relevanteAksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.LOKALKONTOR_FORESLÅR_VILKÅR,
  );
  const lokalkontorBeslutterAp = relevanteAksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.LOKALKONTOR_BESLUTTER_VILKÅR,
  );

  const utledAktivTab = () => {
    if (lokalkontorBeslutterAp && lokalkontorBeslutterAp.status !== AksjonspunktStatus.UTFØRT) {
      return 'beslutter';
    }
    return 'behov_for_bistand';
  };

  const [aktivTab, setAktivTab] = useState(utledAktivTab);

  useEffect(() => {
    setAktivTab(utledAktivTab());
  }, [aksjonspunkter]);

  return (
    <Tabs value={aktivTab} onChange={setAktivTab}>
      <Tabs.List>
        <Tabs.Tab value="søknadsfrist" label="Søknadsfrist" icon={<CustomCheckmarkIcon />} />
        <Tabs.Tab value="alder" label="Alder" icon={<CustomCheckmarkIcon />} />
        <Tabs.Tab value="bosatt_i_trondheim" label="Bosatt i Trondheim" icon={<CustomCheckmarkIcon />} />
        <Tabs.Tab value="andre_livsoppholdytelser" label="Andre livsoppholdytelser" icon={<CustomCheckmarkIcon />} />
        <Tabs.Tab
          value="behov_for_bistand"
          label="Behov for bistand"
          icon={
            vurderBistandsvilkårAp?.status === AksjonspunktStatus.UTFØRT ? (
              <CustomCheckmarkIcon />
            ) : (
              <CustomWarningIcon />
            )
          }
        />
        {lokalkontorBeslutterAp && (
          <Tabs.Tab
            value="beslutter"
            label="Beslutter"
            icon={
              lokalkontorBeslutterAp?.status === AksjonspunktStatus.UTFØRT ? (
                <CustomCheckmarkIcon />
              ) : (
                <CustomWarningIcon />
              )
            }
          />
        )}
      </Tabs.List>
      <Box marginBlock="space-20 space-0">
        <Tabs.Panel value="søknadsfrist">
          <Søknadsfrist />
        </Tabs.Panel>
        <Tabs.Panel value="alder">
          <Alder />
        </Tabs.Panel>
        <Tabs.Panel value="bosatt_i_trondheim">
          <BosattITrondheim />
        </Tabs.Panel>
        <Tabs.Panel value="andre_livsoppholdytelser">
          <AndreLivsoppholdytelser />
        </Tabs.Panel>
        <Tabs.Panel value="behov_for_bistand">
          <BehovForBistand
            vurderBistandsvilkårAp={vurderBistandsvilkårAp}
            lokalkontorForeslårVilkårAp={lokalkontorForeslårVilkårAp}
            submitCallback={submitCallback}
          />
        </Tabs.Panel>
        {lokalkontorBeslutterAp && (
          <Tabs.Panel value="beslutter">
            <Beslutter
              lokalkontorBeslutterAp={lokalkontorBeslutterAp}
              vurderBistandsvilkårAp={vurderBistandsvilkårAp}
              submitCallback={submitCallback}
            />
          </Tabs.Panel>
        )}
      </Box>
    </Tabs>
  );
};
