import LinkRel from '../constants/LinkRel';
import Link from '../types/Link';

export const findLinkByRel = (linkRel: LinkRel, links: Link[]): Link => links.find(({ rel }) => rel === linkRel);

export const findHrefByRel = (linkRel: LinkRel, links: Link[]): string => findLinkByRel(linkRel, links)?.href;
