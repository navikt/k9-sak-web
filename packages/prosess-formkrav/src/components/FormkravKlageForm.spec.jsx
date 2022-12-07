import React from 'react';
import { expect } from 'chai';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { FormkravKlageForm } from './FormkravKlageForm';
import shallowWithIntl, { intlMock } from '../../i18n';

describe('<FormkravKlageForm>', () => {
  const behandlinger = [
    {
      id: 1,
      uuid: '1uuid',
      type: behandlingType.FORSTEGANGSSOKNAD,
      avsluttet: '2018-10-25T14:14:15',
    },
    {
      id: 2,
      uuid: '2uuid',
      type: behandlingType.REVURDERING,
      avsluttet: '2018-10-25T14:14:15',
    },
    {
      id: 3,
      uuid: '3uuid',
      type: behandlingType.TILBAKEKREVING,
      avsluttet: '2020-02-06T14:14:15',
    },
  ];

  it('skal vise tre options når to mulige klagbare vedtak', () => {
    const wrapper = shallowWithIntl(
      <FormkravKlageForm
        behandlingId={1}
        behandlingVersjon={1}
        readOnly={false}
        readOnlySubmitButton
        aksjonspunktCode={aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_NFP}
        avsluttedeBehandlinger={behandlinger}
        intl={intlMock}
        formProps={{}}
        alleKodeverk={{
          [kodeverkTyper.BEHANDLING_TYPE]: [
            {
              kode: behandlingType.FORSTEGANGSSOKNAD,
              navn: 'Førstegangssøknad',
              kodeverk: 'BEHANDLING_TYPE',
            },
            {
              kode: behandlingType.REVURDERING,
              navn: 'Revurdering',
              kodeverk: 'BEHANDLING_TYPE',
            },
            {
              kode: behandlingType.TILBAKEKREVING,
              navn: 'Tilbakekreving',
              kodeverk: 'BEHANDLING_TYPE',
            },
          ],
        }}
        fagsakPerson={{}}
        arbeidsgiverOpplysningerPerId={{}}
        parterMedKlagerett={[]}
      />,
    );
    const vedtakSelect = wrapper.find('SelectField');
    expect(vedtakSelect).to.have.length(1);
    expect(vedtakSelect.prop('selectValues')).to.have.length(4);
    expect(vedtakSelect.prop('selectValues')[0].props.children).to.equal('Ikke påklagd et vedtak');
    expect(vedtakSelect.prop('selectValues')[1].props.children).to.equal('Førstegangssøknad 25.10.2018');
    expect(vedtakSelect.prop('selectValues')[2].props.children).to.equal('Revurdering 25.10.2018');
    expect(vedtakSelect.prop('selectValues')[3].props.children).to.equal('Tilbakekreving 06.02.2020');
  });
});
