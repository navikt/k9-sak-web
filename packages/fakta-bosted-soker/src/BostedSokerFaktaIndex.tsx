import BostedSokerView from './components/BostedSokerView';
import { BostedSokerPersonopplysninger } from './types';

interface OwnProps {
  personopplysninger: BostedSokerPersonopplysninger;
  sokerTypeText?: string;
}

const BostedSokerFaktaIndex = ({ personopplysninger, sokerTypeText = 'Søker' }: OwnProps): JSX.Element => (
  <BostedSokerView personopplysninger={personopplysninger} sokerTypeText={sokerTypeText} />
);

export default BostedSokerFaktaIndex;
