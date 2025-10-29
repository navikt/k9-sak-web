import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import { Formik } from 'formik';
import { intlMock } from '../../../i18n/index';
import messages from '../../../i18n/nb_NO.json';
import InformasjonsbehovAutomatiskVedtaksbrev from './InformasjonsbehovAutomatiskVedtaksbrev';

describe('<InformasjonsbehovAutomatiskVedtaksbrev>', () => {
  const defaultProps = {
    intl: intlMock,
    språkkode: 'NB',
    readOnly: false,
    begrunnelse: '',
    informasjonsbehovVedtaksbrev: {
      informasjonsbehov: [],
      mangler: [],
    },
  };

  it('skal ikke vise noe når det ikke er noen informasjonsbehov av type FRITEKST', () => {
    const { container } = renderWithIntl(
      <Formik onSubmit={vi.fn()} initialValues={{}}>
        <InformasjonsbehovAutomatiskVedtaksbrev {...defaultProps} />
      </Formik>,
      { messages },
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('skal vise fritekstfelt med beskrivelse som label når beskrivelse er definert', () => {
    const props = {
      ...defaultProps,
      informasjonsbehovVedtaksbrev: {
        informasjonsbehov: [
          {
            kode: 'TEST_KODE',
            beskrivelse: 'Test beskrivelse for fritekstfelt',
            type: 'FRITEKST',
          },
        ],
        mangler: [],
      },
    };

    renderWithIntl(
      <Formik onSubmit={vi.fn()} initialValues={{}}>
        <InformasjonsbehovAutomatiskVedtaksbrev {...props} />
      </Formik>,
      { messages },
    );

    expect(screen.getByText('Test beskrivelse for fritekstfelt')).toBeInTheDocument();
  });

  it('skal vise fritekstfelt med fallback label når beskrivelse er tom', () => {
    const props = {
      ...defaultProps,
      informasjonsbehovVedtaksbrev: {
        informasjonsbehov: [
          {
            kode: 'AVSLAG_INSTITUSJON',
            beskrivelse: '',
            type: 'FRITEKST',
          },
        ],
        mangler: [],
      },
    };

    renderWithIntl(
      <Formik onSubmit={vi.fn()} initialValues={{}}>
        <InformasjonsbehovAutomatiskVedtaksbrev {...props} />
      </Formik>,
      { messages },
    );

    // Fallback label should be used when beskrivelse is empty
    expect(screen.getByText('Beskriv årsaken til avslag')).toBeInTheDocument();
  });

  it('skal vise fritekstfelt med fallback label når beskrivelse er undefined', () => {
    const props = {
      ...defaultProps,
      informasjonsbehovVedtaksbrev: {
        informasjonsbehov: [
          {
            kode: 'AVSLAG_INSTITUSJON',
            beskrivelse: undefined as any,
            type: 'FRITEKST',
          },
        ],
        mangler: [],
      },
    };

    renderWithIntl(
      <Formik onSubmit={vi.fn()} initialValues={{}}>
        <InformasjonsbehovAutomatiskVedtaksbrev {...props} />
      </Formik>,
      { messages },
    );

    // Fallback label should be used when beskrivelse is undefined
    expect(screen.getByText('Beskriv årsaken til avslag')).toBeInTheDocument();
  });

  it('skal vise heading "Fritekstbeskrivelse" når ikke readOnly', () => {
    const props = {
      ...defaultProps,
      informasjonsbehovVedtaksbrev: {
        informasjonsbehov: [
          {
            kode: 'TEST_KODE',
            beskrivelse: 'Test beskrivelse',
            type: 'FRITEKST',
          },
        ],
        mangler: [],
      },
    };

    renderWithIntl(
      <Formik onSubmit={vi.fn()} initialValues={{}}>
        <InformasjonsbehovAutomatiskVedtaksbrev {...props} />
      </Formik>,
      { messages },
    );

    expect(screen.getByText('Fritekstbeskrivelse')).toBeInTheDocument();
  });

  it('skal vise advarsel om skjønnsmessig vurdering når BEREGNING_SKJONNSMESSIG mangler', () => {
    const props = {
      ...defaultProps,
      informasjonsbehovVedtaksbrev: {
        informasjonsbehov: [
          {
            kode: 'BEREGNING_SKJONNSMESSIG',
            beskrivelse: 'Beregning fritekst',
            type: 'FRITEKST',
          },
        ],
        mangler: ['BEREGNING_SKJONNSMESSIG'],
      },
    };

    renderWithIntl(
      <Formik onSubmit={vi.fn()} initialValues={{}}>
        <InformasjonsbehovAutomatiskVedtaksbrev {...props} />
      </Formik>,
      { messages },
    );

    expect(screen.getByText('Suppler med fritekst i henhold til skjønnsmessig vurdering.')).toBeInTheDocument();
  });
});
