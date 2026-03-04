import { adresseType as OpplysningAdresseType } from '@k9-sak-web/backend/k9sak/kodeverk/geografisk/adresseType.js';
import type { PersonadresseDto } from '@k9-sak-web/backend/k9sak/kontrakt/person/PersonadresseDto.js';

const landkoder = {
  NORGE: 'NOR',
};

const emptyIfnull = (text?: string): string => (text == null ? '' : text);

const constructAddress = (adresse = '', postnummer = '', poststed = '', land = ''): string =>
  `${emptyIfnull(adresse)}, ${emptyIfnull(postnummer)} ${emptyIfnull(poststed)} ${emptyIfnull(land)}`;

export type Adresser = { [key in OpplysningAdresseType]?: string };

const getAddresses = (addresses: PersonadresseDto[] = []): Adresser =>
  addresses.reduce<Adresser>((acc, address) => {
    if (!address.adresseType || address.adresseType === OpplysningAdresseType.UKJENT_ADRESSE) {
      return {
        ...acc,
        [OpplysningAdresseType.BOSTEDSADRESSE]: 'UKJENT',
      };
    }

    const currentAddress = [address.adresselinje1, address.adresselinje2, address.adresselinje3]
      .filter(linje => !!linje)
      .join(', ');
    if (!currentAddress) {
      return acc;
    }

    const country = address.land !== landkoder.NORGE ? address.land : undefined;
    return {
      ...acc,
      [address.adresseType]: constructAddress(
        currentAddress,
        `${address.postNummer}`,
        `${address.poststed}`,
        country,
      ).trim(),
    };
  }, {});

export default getAddresses;
