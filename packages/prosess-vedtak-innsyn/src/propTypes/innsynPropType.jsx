// eslint-disable-next-line import/no-duplicates
import PropTypes from 'prop-types';

// eslint-disable-next-line import/no-duplicates
import { kodeverkObjektPropType } from '@k9-sak-web/prop-types';

const innsynPropType = PropTypes.shape({
  dokumenter: PropTypes.arrayOf(
    PropTypes.shape({
      journalpostId: PropTypes.string.isRequired,
      dokumentId: PropTypes.string.isRequired,
      tidspunkt: PropTypes.string,
      fikkInnsyn: PropTypes.bool.isRequired,
    }),
  ).isRequired,
  innsynMottattDato: PropTypes.string.isRequired,
  innsynResultatType: kodeverkObjektPropType.isRequired,
});

export default innsynPropType;
