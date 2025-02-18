import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import vedtaksbrevtype from '@fpsak-frontend/kodeverk/src/vedtaksbrevtype';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';

import { Formik } from 'formik';
import { intlMock } from '../../../i18n/index';
import messages from '../../../i18n/nb_NO.json';
import { BrevPanel } from './BrevPanel';

describe('<BrevPanel>', () => {
  const ingenTilgjengeligeVedtaksbrev = {
    vedtaksbrevmaler: {},
    begrunnelse: '',
    alternativeMottakere: [],
  };
  const alleTilgjengeligeVedtaksbrev = {
    vedtaksbrevmaler: {
      [vedtaksbrevtype.AUTOMATISK]: dokumentMalType.INNVILGELSE,
      [vedtaksbrevtype.FRITEKST]: dokumentMalType.FRITKS,
    },
    begrunnelse: '',
    alternativeMottakere: [],
  };
  const automatiskInnvilgelsebrevTilgjengelig = {
    vedtaksbrevmaler: { [vedtaksbrevtype.AUTOMATISK]: dokumentMalType.INNVILGELSE },
    begrunnelse: '',
    alternativeMottakere: [],
  };
  const fritekstbrevTilgjenglig = {
    vedtaksbrevmaler: { [vedtaksbrevtype.FRITEKST]: dokumentMalType.FRITKS },
    begrunnelse: '',
    alternativeMottakere: [],
  };

  it('skal forhåndsvise brev når ingen behandlingsresultat', async () => {
    renderWithIntl(
      <Formik onSubmit={vi.fn()} initialValues={[]}>
        <BrevPanel
          intl={intlMock}
          readOnly={false}
          sprakkode="NB"
          dokumentdata={{}}
          tilgjengeligeVedtaksbrev={automatiskInnvilgelsebrevTilgjengelig}
          informasjonsbehovValues={[]}
          skalBrukeOverstyrendeFritekstBrev={false}
          begrunnelse=""
          previewCallback={vi.fn()}
          brødtekst={null}
          overskrift={null}
          behandlingResultat={null}
          overstyrtMottaker={null}
          formikProps={{ values: [], setFieldValue: vi.fn(), validateForm: vi.fn(), setTouched: vi.fn() }}
          getPreviewAutomatiskBrevCallback={vi.fn(() => vi.fn())}
          aktiverteInformasjonsbehov={[]}
          arbeidsgiverOpplysningerPerId={{}}
          hentFritekstbrevHtmlCallback={vi.fn()}
          informasjonsbehovVedtaksbrev={{ informasjonsbehov: [], mangler: [] }}
          lagreDokumentdata={vi.fn()}
          personopplysninger={{ aktoerId: '', fnr: '' }}
          ytelseTypeKode=""
        />
      </Formik>,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'Forhåndsvis brev' })).toBeInTheDocument();
  });

  it('skal vise fritekstpanel når overstyrt', () => {
    renderWithIntl(
      <Formik onSubmit={vi.fn()} initialValues={[]}>
        <BrevPanel
          intl={intlMock}
          readOnly={false}
          sprakkode="NB"
          dokumentdata={{}}
          tilgjengeligeVedtaksbrev={alleTilgjengeligeVedtaksbrev}
          informasjonsbehovValues={[]}
          skalBrukeOverstyrendeFritekstBrev
          begrunnelse=""
          previewCallback={vi.fn()}
          brødtekst={null}
          overskrift={null}
          behandlingResultat={null}
          overstyrtMottaker={null}
          formikProps={{ values: [], setFieldValue: vi.fn(), validateForm: vi.fn(), setTouched: vi.fn() }}
          getPreviewAutomatiskBrevCallback={vi.fn(() => vi.fn())}
          aktiverteInformasjonsbehov={[]}
          arbeidsgiverOpplysningerPerId={{}}
          hentFritekstbrevHtmlCallback={vi.fn()}
          informasjonsbehovVedtaksbrev={{ informasjonsbehov: [], mangler: [] }}
          lagreDokumentdata={vi.fn()}
          personopplysninger={{ aktoerId: '', fnr: '' }}
          ytelseTypeKode=""
        />
      </Formik>,
      { messages },
    );
    expect(screen.getByRole('button', { name: 'Forhåndsvis brev' })).toBeInTheDocument();
    expect(screen.getByText('Innhold fra det automatiske brevet kan nå redigeres')).toBeInTheDocument();
  });

  it('skal vise fritekstpanel selv om ikke overstyrt når fritekst er eneste typen', () => {
    renderWithIntl(
      <Formik onSubmit={vi.fn()} initialValues={[]}>
        <BrevPanel
          intl={intlMock}
          readOnly={false}
          sprakkode="NB"
          dokumentdata={{}}
          tilgjengeligeVedtaksbrev={fritekstbrevTilgjenglig}
          informasjonsbehovValues={[]}
          skalBrukeOverstyrendeFritekstBrev={false}
          begrunnelse=""
          previewCallback={vi.fn()}
          brødtekst={null}
          overskrift={null}
          behandlingResultat={null}
          overstyrtMottaker={null}
          formikProps={{ values: [], setFieldValue: vi.fn(), validateForm: vi.fn(), setTouched: vi.fn() }}
          getPreviewAutomatiskBrevCallback={vi.fn(() => vi.fn())}
          aktiverteInformasjonsbehov={[]}
          arbeidsgiverOpplysningerPerId={{}}
          hentFritekstbrevHtmlCallback={vi.fn()}
          informasjonsbehovVedtaksbrev={{ informasjonsbehov: [], mangler: [] }}
          lagreDokumentdata={vi.fn()}
          personopplysninger={{ aktoerId: '', fnr: '' }}
          ytelseTypeKode=""
        />
      </Formik>,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'Forhåndsvis brev' })).toBeInTheDocument();
    expect(
      screen.getByText('Denne type behandling er det ikke utviklet automatisk brev for enda.'),
    ).toBeInTheDocument();
  });

  it('skal vise varsel om ingen brev når ingen brev', () => {
    renderWithIntl(
      <Formik onSubmit={vi.fn()} initialValues={[]}>
        <BrevPanel
          intl={intlMock}
          readOnly={false}
          sprakkode="NB"
          dokumentdata={{}}
          tilgjengeligeVedtaksbrev={ingenTilgjengeligeVedtaksbrev}
          informasjonsbehovValues={[]}
          skalBrukeOverstyrendeFritekstBrev={false}
          begrunnelse=""
          previewCallback={vi.fn()}
          brødtekst={null}
          overskrift={null}
          behandlingResultat={null}
          overstyrtMottaker={null}
          formikProps={{ values: [], setFieldValue: vi.fn(), validateForm: vi.fn(), setTouched: vi.fn() }}
          getPreviewAutomatiskBrevCallback={vi.fn(() => vi.fn())}
          aktiverteInformasjonsbehov={[]}
          arbeidsgiverOpplysningerPerId={{}}
          hentFritekstbrevHtmlCallback={vi.fn()}
          informasjonsbehovVedtaksbrev={{ informasjonsbehov: [], mangler: [] }}
          lagreDokumentdata={vi.fn()}
          personopplysninger={{ aktoerId: '', fnr: '' }}
          ytelseTypeKode=""
        />
      </Formik>,
      { messages },
    );

    expect(screen.getByText('I denne behandlingen er det ikke vedtaksbrev.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Forhåndsvis brev' })).not.toBeInTheDocument();
  });

  it('skal vise valg av mottaker hvis alternative mottakere er definert', () => {
    renderWithIntl(
      <Formik onSubmit={vi.fn()} initialValues={[]}>
        <BrevPanel
          intl={intlMock}
          readOnly={false}
          sprakkode="NB"
          dokumentdata={{}}
          tilgjengeligeVedtaksbrev={{
            vedtaksbrevmaler: alleTilgjengeligeVedtaksbrev.vedtaksbrevmaler,
            begrunnelse: null,
            alternativeMottakere: [
              {
                id: '00000000000',
                type: 'ORGNR',
              },
              {
                id: '979312059',
                type: 'ORGNR',
              },
            ],
          }}
          informasjonsbehovValues={[]}
          skalBrukeOverstyrendeFritekstBrev={false}
          begrunnelse=""
          previewCallback={vi.fn()}
          brødtekst={null}
          overskrift={null}
          behandlingResultat={null}
          overstyrtMottaker={null}
          formikProps={{ values: [], setFieldValue: vi.fn(), validateForm: vi.fn(), setTouched: vi.fn() }}
          getPreviewAutomatiskBrevCallback={vi.fn(() => vi.fn())}
          aktiverteInformasjonsbehov={[]}
          arbeidsgiverOpplysningerPerId={{}}
          hentFritekstbrevHtmlCallback={vi.fn()}
          informasjonsbehovVedtaksbrev={{ informasjonsbehov: [], mangler: [] }}
          lagreDokumentdata={vi.fn()}
          personopplysninger={{ aktoerId: '', fnr: '' }}
          ytelseTypeKode=""
        />
      </Formik>,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'Forhåndsvis brev' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Velg mottaker' })).toBeInTheDocument();
    expect(screen.queryByText('I denne behandlingen er det ikke vedtaksbrev.')).not.toBeInTheDocument();
    expect(screen.queryByText('Innhold fra det automatiske brevet kan nå redigeres')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Denne type behandling er det ikke utviklet automatisk brev for enda.'),
    ).not.toBeInTheDocument();
  });
});
