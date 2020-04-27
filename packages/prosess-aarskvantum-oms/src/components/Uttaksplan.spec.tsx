import React from 'react';
import { Table, TableColumn } from '@fpsak-frontend/shared-components/index';
import { expect } from 'chai';
import { FormattedMessage } from 'react-intl';
import { shallowWithIntl } from '../../i18n/intl-enzyme-test-helper-uttaksplan';
import Uttaksplan from './Uttaksplan';
import Aktivitet from '../dto/Aktivitet';
import { UtfallEnum } from '../dto/Utfall';
import { ÅrsakEnum } from '../dto/Årsak';

describe('Uttaksplan', () => {
  const aktivitet: Aktivitet = {
    arbeidsforhold: {
      arbeidsforholdId: '888',
      organisasjonsnummer: '999',
      type: 'selvstendig næringsdrivende',
    },
    uttaksperioder: [
      {
        utfall: UtfallEnum.AVSLÅTT,
        årsak: ÅrsakEnum.AVSLÅTT_IKKE_FLERE_DAGER,
        periode: '2020-03-01/2020-03-31',
        utbetalingsgrad: 0,
      },
    ],
  };
  it('rendrer en tabell per aktivitet', () => {
    const aktiviteter: Aktivitet[] = [aktivitet, aktivitet, aktivitet];
    const wrapper = shallowWithIntl(<Uttaksplan aktiviteter={aktiviteter} aktivitetsstatuser={[]} />);

    const tabell = wrapper.find(Table);

    expect(tabell).to.have.length(aktiviteter.length);
  });

  it('rendrer tabellrad med rett info', () => {
    const wrapper = shallowWithIntl(<Uttaksplan aktiviteter={[aktivitet]} aktivitetsstatuser={[]} />);
    const kolonner = wrapper.find(TableColumn);

    expect(kolonner).to.have.length(5);

    const kolonnerMedTekst = tekst => kolonner.findWhere(kolonne => kolonne.text() === tekst);
    const kolonnerMedFormatterTekstId = tekstId =>
      kolonner.find(FormattedMessage).findWhere(formatert => formatert.prop('id') === tekstId);

    expect(kolonnerMedTekst('01.03.2020 - 31.03.2020')).to.have.length(1);
    expect(kolonnerMedFormatterTekstId('Uttaksplan.Utfall.AVSLÅTT')).to.have.length(1);
    expect(kolonnerMedTekst(ÅrsakEnum.AVSLÅTT_IKKE_FLERE_DAGER)).to.have.length(1);
    expect(kolonnerMedTekst('0%')).to.have.length(1);
    expect(kolonnerMedFormatterTekstId('Uttaksplan.IngenFravær')).to.have.length(1);
  });
});
