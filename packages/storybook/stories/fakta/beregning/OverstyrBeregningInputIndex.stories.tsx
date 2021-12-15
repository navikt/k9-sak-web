import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '@fpsak-frontend/fakta-overstyr-beregning/i18n'
import OverstyrBeregningFaktaIndex from '@fpsak-frontend/fakta-overstyr-beregning';
import { Aksjonspunkt, ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';
import { OverstyrInputBeregningDto } from '@fpsak-frontend/fakta-overstyr-beregning/src/types/OverstyrInputBeregningDto';
import { action } from '@storybook/addon-actions';

const intl = createIntl(
    {
        locale: 'nb-NO',
        messages: { ...messages },
    },
    createIntlCache(),
);

const arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId = {
    "910909088": {
        "identifikator": "910909088",
        "personIdentifikator": null,
        "navn": "BEDRIFT AS",
        "fødselsdato": null,
        erPrivatPerson: false,
    },
    "910909081": {
        "identifikator": "910909081",
        "personIdentifikator": null,
        "navn": "ANNEN BEDRIFT AS",
        "fødselsdato": null,
        erPrivatPerson: false,
    }
}

const overstyrInputBeregning: OverstyrInputBeregningDto[] = [
    {
        "skjaeringstidspunkt": "2021-10-04",
        "aktivitetliste": [
            {
                "arbeidsgiverOrgnr": "910909088",
                "arbeidsgiverAktørId": null,
                "inntektPrAar": null,
                "refusjonPrAar": null,
                "opphørRefusjon": null
            }
        ]
    },
    {
        "skjaeringstidspunkt": "2021-10-04",
        "aktivitetliste": [
            {
                "arbeidsgiverOrgnr": "910909081",
                "arbeidsgiverAktørId": null,
                "inntektPrAar": null,
                "refusjonPrAar": null,
                "opphørRefusjon": null
            }
        ]
    },

];

const aksjonspunkter: Aksjonspunkt[] = [
    {
        "aksjonspunktType": {
            "kode": "MANU",
            "kodeverk": "AKSJONSPUNKT_TYPE"
        },
        "begrunnelse": null,
        "besluttersBegrunnelse": null,
        "definisjon": {
            "kode": "9005",
            "kodeverk": "AKSJONSPUNKT_DEF"
        },
        "erAktivt": true,
        "kanLoses": true,
        "status": {
            "kode": "OPPR",
            "kodeverk": "AKSJONSPUNKT_STATUS"
        },
        "toTrinnsBehandling": true,
        "toTrinnsBehandlingGodkjent": null,
        "vilkarType": null,
        "vurderPaNyttArsaker": null,
    }
]

export default {
    title: 'fakta/overstyr-beregning-input',
    component: OverstyrBeregningFaktaIndex,
};

export const visOverstyrBeregningIndex = () => (
    <RawIntlProvider value={intl}>
        <OverstyrBeregningFaktaIndex
            arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
            overstyrInputBeregning={overstyrInputBeregning}
            submitCallback={action('button-click')}
            readOnly={false}
            submittable
            aksjonspunkter={aksjonspunkter}
        />
    </RawIntlProvider>
);
