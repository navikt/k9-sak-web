import { CoApplicantFilled, People, PeopleFilled } from '@navikt/ds-icons';
import Kilde from '../../../types/Kilde';

const PartIkon = ({ parter, fontSize = '24px' }: { parter: Kilde[]; fontSize?: string }) => {
  if (parter.includes(Kilde.SØKER) && parter.includes(Kilde.ANDRE)) {
    return <CoApplicantFilled title="To søkere" style={{ height: 'unset', width: 'unset', fontSize, scale: '0.90' }} />;
  }
  if (parter.includes(Kilde.SØKER)) {
    return (
      <PeopleFilled
        title="Søker"
        style={{ height: 'unset', width: 'unset', fontSize, paddingBottom: '2px', marginRight: '6px' }}
      />
    );
  }
  if (parter.includes(Kilde.ANDRE)) {
    return (
      <People
        title="Annen part"
        style={{ height: 'unset', width: 'unset', fontSize, paddingBottom: '2px', marginRight: '6px' }}
      />
    );
  }
  return null;
};

export default PartIkon;
