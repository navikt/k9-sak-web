import { RestApiErrorProvider, RestApiProvider } from '@k9-sak-web/rest-api-hooks';
import { Outlet } from 'react-router';

/** Denne brukast på tvers av k9 og ung for å tilby globale data frå legacy rest api mekanisme til rutene som treng det */
export const RestApiProviderLayout = () => {
  return (
    <RestApiProvider>
      <RestApiErrorProvider>
        <Outlet />
      </RestApiErrorProvider>
    </RestApiProvider>
  );
};
