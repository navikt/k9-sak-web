import React from 'react';

/* Brukes til å tilgjengeliggjøre saksbehandlernavn. Brukes direkte i VurdertAv.tsx 
  
{
  'Z12345': 'Tommy Tilbakekreving',
}
*/

export const SaksbehandlernavnContext = React.createContext<Record<string, string>>({});
