import React from 'react';
import { Behandling } from '@k9-sak-web/types';
import { Rammevedtak } from '@k9-sak-web/types/src/omsorgspenger/Rammevedtak';
import messages from '../i18n/nb_NO.json';
import OverforingerFaktaForm from './components/OverforingerFaktaForm';

interface FaktaRammevedtakIndexProps {
  rammevedtak: Rammevedtak[];
  behandling: Behandling;
}

const FaktaRammevedtakIndex = ({ behandling, rammevedtak }: FaktaRammevedtakIndexProps) => (
      <OverforingerFaktaForm
      rammevedtak={rammevedtak}
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
    />);

export default FaktaRammevedtakIndex;
