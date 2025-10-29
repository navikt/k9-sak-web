import React from 'react';
import messages from '../i18n/nb_NO.json';
import InntektOgYtelserPanel from './components/InntektOgYtelserFaktaPanel';
import { Inntekt } from './InntektType';

interface InntektOgYtelserFaktaIndexProps {
  inntektOgYtelser?: { inntekt: Inntekt[] };
}

const InntektOgYtelserFaktaIndex: React.FC<InntektOgYtelserFaktaIndexProps> = ({ inntektOgYtelser }) => (
      <InntektOgYtelserPanel inntekter={inntektOgYtelser?.inntekt} />);

export default InntektOgYtelserFaktaIndex;
