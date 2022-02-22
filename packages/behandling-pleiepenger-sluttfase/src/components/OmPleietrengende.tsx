import React from 'react';
import { useIntl } from 'react-intl';

interface OwnProps{
  omPleietrengende: {
    navn: string;
    fnr: string;
  }
}

const OmPleietrengende:React.FunctionComponent<OwnProps> = ({omPleietrengende}) => {
  const intl = useIntl();

  if(!omPleietrengende){
    return <p>Ikke hentet inn data.</p>
  }

  return <>
    <h3>
      {intl.formatMessage({ id: 'OmPleietrengende.Titel' })}
    </h3>
    <p>Navn: <b>{omPleietrengende.navn}</b> Fødselsnummer: <b>{omPleietrengende.fnr}</b></p>
  </>;
};

export default OmPleietrengende;
