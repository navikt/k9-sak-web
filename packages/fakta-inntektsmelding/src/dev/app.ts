/* eslint-disable no-console */
import '@navikt/ds-css';
import '@navikt/ft-plattform-komponenter/dist/style.css';
import ContainerContract from '../types/ContainerContract';
import renderers from '../util/renderers';

interface ExtendedWindow extends Window {
  renderKompletthetApp: (id: string, contract: ContainerContract) => void;
}

const data = {
  readOnly: false,
  dokumenter: [
    { journalpostId: '1111', href: '/foo' },
    { journalpostId: '4444', href: '/bar' },
  ],
  arbeidsforhold: {
    896929119: {
      identifikator: '896929119',
      personIdentifikator: null,
      navn: 'SAUEFABRIKK',
      fødselsdato: null,
      arbeidsforholdreferanser: [
        {
          internArbeidsforholdId: 'b28c0e54-0e9d-4af4-bdde-37c4d5cc5b7e',
          eksternArbeidsforholdId: '2',
        },
        {
          internArbeidsforholdId: 'e0018e43-25a6-4722-844c-7483d7528424',
          eksternArbeidsforholdId: '1',
        },
      ],
    },
  },
  endpoints: {
    kompletthetBeregning: 'http://localhost:8082/mock/kompletthet',
  },
  httpErrorHandler: () => console.error('An error occured'),
  onFinished: d => console.log('Aksjonspunkt løst', d),
  aksjonspunkter: [
    {
      aksjonspunktType: 'MANU',
      begrunnelse: null,
      besluttersBegrunnelse: null,
      definisjon: '9069', // #Kodeverk inneholdt: skalAvbrytesVedTilbakeføring: false,
      erAktivt: true,
      fristTid: null,
      kanLoses: false,
      status: 'UTFO',
      toTrinnsBehandling: false,
      toTrinnsBehandlingGodkjent: null,
      vilkarType: null,
      vurderPaNyttArsaker: null,
      venteårsak: '-', // #Kodeverk inneholdt: kanVelgesIGui: false,
      venteårsakVariant: null,
      opprettetAv: 'srvk9sak',
    },
    {
      aksjonspunktType: 'MANU',
      begrunnelse: 'wwdwdwwqwdwqwqw',
      besluttersBegrunnelse: null,
      definisjon: '9071', // #Kodeverk inneholdt: skalAvbrytesVedTilbakeføring: false,
      erAktivt: true,
      fristTid: null,
      kanLoses: false,
      status: 'UTFO',
      toTrinnsBehandling: true,
      toTrinnsBehandlingGodkjent: null,
      vilkarType: null,
      vurderPaNyttArsaker: null,
      venteårsak: '-', // #Kodeverk inneholdt: kanVelgesIGui: false,
      venteårsakVariant: null,
      opprettetAv: 'srvk9sak',
    },
  ],
};

(window as Partial<ExtendedWindow>).renderKompletthetApp = async appId => {
  const { renderAppInSuccessfulState } = renderers;
  renderAppInSuccessfulState(appId, data);
};
