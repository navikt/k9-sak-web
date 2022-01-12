import React from 'react';
import { KodeverkMedNavn } from '@k9-sak-web/types';
import Tidslinje from '@fpsak-frontend/tidslinje/src/components/pleiepenger/Tidslinje';
import { EtikettFokus } from 'nav-frontend-etiketter';
import shallowWithIntl, { intlMock, mountWithIntl } from '../../i18n';

import { VedtakAksjonspunktPanelImpl } from './VedtakAksjonspunktPanel';
import VedtakOverlappendeYtelsePanel, { VedtakOverlappendeYtelsePanelImpl } from './VedtakOverlappendeYtelsePanel';

const overlappendeYtelserMock = [
    {
        "ytelseType": {
            "kode": "SP",
            "kodeverk": "FAGSAK_YTELSE"
        },
        "kilde": {
            "kode": "INFOTRYGD",
            "kodeverk": "FAGSYSTEM"
        },
        "overlappendePerioder": [
            {
                "fom": "2021-08-18",
                "tom": "2021-08-20"
            },
            {
                "fom": "2021-08-23",
                "tom": "2021-08-27"
            },
            {
                "fom": "2021-08-30",
                "tom": "2021-08-31"
            }
        ]
    },
];

const alleKodeverk: { [key: string]: KodeverkMedNavn[] } = {}

describe('<VedtakOverlappendeYtelsePanel>', () => {

    it('skal ikke vise overlappende ytelser', () => {
        const wrapper = shallowWithIntl(
            <VedtakAksjonspunktPanelImpl
                intl={intlMock}
                behandlingStatusKode="OPPR"
                aksjonspunktKoder={[]}
                readOnly={false}
                overlappendeYtelser={[]}
                alleKodeverk={{}}
            />);

        expect(wrapper.find(VedtakOverlappendeYtelsePanelImpl).exists()).toBeFalsy();
    });

    it('skal vise overlappende ytelser', () => {

        const wrapper = shallowWithIntl(
            <VedtakAksjonspunktPanelImpl
                intl={intlMock}
                behandlingStatusKode="OPPR"
                aksjonspunktKoder={[]}
                readOnly={false}
                overlappendeYtelser={overlappendeYtelserMock}
                alleKodeverk={alleKodeverk}
            />);

        expect(wrapper.find(VedtakOverlappendeYtelsePanel).exists()).toBeTruthy();

        const panelWrapper = mountWithIntl(
            <VedtakOverlappendeYtelsePanelImpl
                intl={intlMock}
                overlappendeYtelser={overlappendeYtelserMock}
                alleKodeverk={alleKodeverk}
            />);

        expect(panelWrapper.find(Tidslinje).exists()).toBeTruthy();

        expect(panelWrapper.find(EtikettFokus).exists()).toBeFalsy();

        // Legge til test som sjekker innholdet i detaljer/etikettene

    });

});
