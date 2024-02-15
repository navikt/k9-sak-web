import React from 'react';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/src/test-utils';
import { screen } from '@testing-library/react';
import TilbakekrevingEditerVedtaksbrevPanel from './TilbakekrevingEditerVedtaksbrevPanel';

describe('<TilbakekrevingEditerVedtaksbrevPanel>', () => {
  const vedtaksbrevAvsnitt = [
    {
      avsnittstype: 'OPPSUMMERING',
      overskrift: 'Du må betale tilbake foreldrepenger',
      underavsnittsliste: [
        {
          overskrift: 'Du må betale tilbake foreldrepenger',
          fritekstTillatt: true,
          fritekst: 'oppsummeringsfritekst',
        },
      ],
    },
    {
      fom: '2019-10-10',
      tom: '2019-11-10',
      avsnittstype: 'PERIODE',
      overskrift: 'Perioden fra og med 10. april 2019 til og med 14. april 2019',
      underavsnittsliste: [
        {
          underavsnittstype: 'FAKTA',
          overskrift:
            'Både du og den andre forelderen har fått foreldrepenger for samme periode fordi du var innlagt i helseinstitusjon. ' +
            'Du kan ikke overføre kvoten din til den andre forelderen og i tillegg få utbetal foreldrepenger for samme periode. Du har ' +
            'derfor fått 2500 kroner for mye utbetalt i denne perioden.',
          fritekstTillatt: true,
          fritekst: 'faktafritekst for periode 1',
        },
        {
          underavsnittstype: 'VILKÅR',
          overskrift:
            'Både du og den andre forelderen har fått foreldrepenger for samme periode fordi du var innlagt i helseinstitusjon. ' +
            'Du kan ikke overføre kvoten din til den andre forelderen og i tillegg få utbetal foreldrepenger for samme periode. Du har ' +
            'derfor fått 2500 kroner for mye utbetalt i denne perioden.',
          fritekstTillatt: true,
          fritekst: 'vilkårfritekst for periode 1',
        },
        {
          underavsnittstype: 'SÆRLIGEGRUNNER',
          overskrift:
            'Både du og den andre forelderen har fått foreldrepenger for samme periode fordi du var innlagt i helseinstitusjon. ' +
            'Du kan ikke overføre kvoten din til den andre forelderen og i tillegg få utbetal foreldrepenger for samme periode. Du har ' +
            'derfor fått 2500 kroner for mye utbetalt i denne perioden.',
          fritekstTillatt: true,
          fritekst: 'særligegrunner-fritekst for periode 1',
        },
      ],
    },
    {
      avsnittstype: 'EKSTRA',
      overskrift: 'Hvordan betale tilbake pengene du skylder',
      underavsnittsliste: [
        {
          overskrift: 'Hvordan betale tilbake pengene du skylder',
          brødtekst:
            'Vi har overført beløpet du skylder til NAV Innkreving, som vil sende deg et krav om å betale tilbake det feilutbetalte beløpet.' +
            ' Har du spørsmål om dette, kan du kontakte NAV Innkreving (tlf eller modia)?',
          fritekstTillatt: false,
        },
        {
          overskrift: 'Du har rett til å klage',
          brødtekst:
            'Du kan klage innen 12 uker fra den datoen du mottok vedtaket. Du finner skjema og informasjon på nav.no/klage.',
          fritekstTillatt: false,
        },
      ],
    },
  ];

  it('skal vise tekstfelt for begrunnelse og godkjenningsknapp', () => {
    renderWithIntlAndReduxForm(
      <TilbakekrevingEditerVedtaksbrevPanel
        vedtaksbrevAvsnitt={vedtaksbrevAvsnitt}
        formName="testForm"
        readOnly={false}
        behandlingId={1}
        behandlingVersjon={1}
        perioderSomIkkeHarUtfyltObligatoriskVerdi={[]}
        fritekstOppsummeringPakrevdMenIkkeUtfylt={false}
      />,
    );

    expect(screen.getByText('Du må betale tilbake foreldrepenger', { selector: 'h3' })).toBeInTheDocument();
    expect(
      screen.getByText('Perioden fra og med 10. april 2019 til og med 14. april 2019', { selector: 'h3' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Hvordan betale tilbake pengene du skylder', { selector: 'h3' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { expanded: false })).toHaveLength(3);
  });

  it('skal automatisk åpne panel som ikke har obligatorisk verdi utfylt', () => {
    renderWithIntlAndReduxForm(
      <TilbakekrevingEditerVedtaksbrevPanel
        vedtaksbrevAvsnitt={vedtaksbrevAvsnitt}
        formName="testForm"
        readOnly={false}
        behandlingId={1}
        behandlingVersjon={1}
        perioderSomIkkeHarUtfyltObligatoriskVerdi={['2019-10-10_2019-11-10']}
        fritekstOppsummeringPakrevdMenIkkeUtfylt
      />,
    );

    expect(screen.getAllByRole('button', { expanded: false })).toHaveLength(1);
    expect(screen.getAllByRole('button', { expanded: true })).toHaveLength(2);
  });

  it('skal sette opp initial values for form', () => {
    const initialValues = TilbakekrevingEditerVedtaksbrevPanel.buildInitialValues(vedtaksbrevAvsnitt);

    expect(initialValues).toEqual({
      '2019-10-10_2019-11-10': {
        FAKTA: 'faktafritekst for periode 1',
        SÆRLIGEGRUNNER: 'særligegrunner-fritekst for periode 1',
        VILKÅR: 'vilkårfritekst for periode 1',
      },
      OPPSUMMERING: 'oppsummeringsfritekst',
    });
  });
});
