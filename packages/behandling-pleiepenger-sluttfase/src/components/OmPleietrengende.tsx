import React from 'react';

interface OwnProps{
  omPleietrengende: {
    navn: string;
    fnr: string;
  }
}

const OmPleietrengende:React.FunctionComponent<OwnProps> = ({omPleietrengende}) => {
  if(!omPleietrengende){
    return <p>Ikke hentet inn data.</p>
  }

  return <>
    <h3>
      Om pleietrengende
    </h3>
    <p>Navn: <b>{omPleietrengende.navn}</b> Fødselsnummer: <b>{omPleietrengende.fnr}</b></p>
  </>;
};

export default OmPleietrengende;
