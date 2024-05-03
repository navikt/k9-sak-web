import { renderWithIntlAndReduxForm } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../../i18n/nb_NO.json';
import { ArbeidsforholdBegrunnelse } from './ArbeidsforholdBegrunnelse';

describe('<ArbeidsforholdBegrunnelse>', () => {
  it('skal ikke vise begrunnelsesfelt når ikke dirty, uten begrunnelse, og ikke avslå ytelse', () => {
    renderWithIntlAndReduxForm(
      <ArbeidsforholdBegrunnelse
        readOnly={false}
        formName=""
        isDirty={false}
        harBegrunnelse={false}
        skalAvslaaYtelse={false}
        behandlingId={1}
        behandlingVersjon={1}
      />,
      { messages },
    );

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
  it('skal ikke vise begrunnelsesfelt når ikke dirty, uten begrunnelse, og avslå ytelse', () => {
    renderWithIntlAndReduxForm(
      <ArbeidsforholdBegrunnelse
        readOnly={false}
        formName=""
        isDirty={false}
        harBegrunnelse={false}
        skalAvslaaYtelse
        behandlingId={1}
        behandlingVersjon={1}
      />,
      { messages },
    );
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
  it('skal ikke vise begrunnelsesfelt når dirty, uten begrunnelse, og avslå ytelse', () => {
    renderWithIntlAndReduxForm(
      <ArbeidsforholdBegrunnelse
        readOnly={false}
        formName=""
        isDirty
        harBegrunnelse={false}
        skalAvslaaYtelse
        behandlingId={1}
        behandlingVersjon={1}
      />,
      { messages },
    );
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
  it('skal ikke vise begrunnelsesfelt når dirty, med begrunnelse, og avslå ytelse', () => {
    renderWithIntlAndReduxForm(
      <ArbeidsforholdBegrunnelse
        readOnly={false}
        formName=""
        isDirty
        harBegrunnelse
        skalAvslaaYtelse
        behandlingId={1}
        behandlingVersjon={1}
      />,
      { messages },
    );
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('skal vise begrunnelsesfelt når dirty, med begrunnelse, og ikke avslå ytelse', () => {
    renderWithIntlAndReduxForm(
      <ArbeidsforholdBegrunnelse
        readOnly={false}
        formName=""
        isDirty
        harBegrunnelse
        skalAvslaaYtelse={false}
        behandlingId={1}
        behandlingVersjon={1}
      />,
      { messages },
    );

    expect(screen.getByRole('textbox', { name: 'Begrunn endringene' })).toBeInTheDocument();
  });
  it('skal vise begrunnelsesfelt når dirty, uten begrunnelse, og ikke avslå ytelse', () => {
    renderWithIntlAndReduxForm(
      <ArbeidsforholdBegrunnelse
        readOnly={false}
        formName=""
        isDirty
        harBegrunnelse={false}
        skalAvslaaYtelse={false}
        behandlingId={1}
        behandlingVersjon={1}
      />,
      { messages },
    );
    expect(screen.getByRole('textbox', { name: 'Begrunn endringene' })).toBeInTheDocument();
  });
  it('skal vise begrunnelsesfelt når ikke dirty, med begrunnelse, og ikke avslå ytelse', () => {
    renderWithIntlAndReduxForm(
      <ArbeidsforholdBegrunnelse
        readOnly={false}
        formName=""
        isDirty={false}
        harBegrunnelse
        skalAvslaaYtelse={false}
        behandlingId={1}
        behandlingVersjon={1}
      />,
      { messages },
    );
    expect(screen.getByRole('textbox', { name: 'Begrunn endringene' })).toBeInTheDocument();
  });
});
