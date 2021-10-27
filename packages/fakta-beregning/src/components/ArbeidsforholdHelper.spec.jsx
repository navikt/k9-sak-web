import { expect } from 'chai';
import { sortArbeidsforholdList } from './ArbeidsforholdHelper';

const createArbeidsforhold = (arbeidsgiverIdent, startdato, opphoersdato, arbeidsforholdId) => ({
  arbeidsgiverIdent,
  startdato,
  opphoersdato,
  arbeidsforholdId,
});

const aleneståendeArbeidsforholdList = [
  { arbeidsforhold: createArbeidsforhold('213456789', '1995-01-01', null, '2142324235') },
  { arbeidsforhold: createArbeidsforhold('8439347348', '1999-01-01', null, '872489238') },
  { arbeidsforhold: createArbeidsforhold('1234342342', '2001-01-01', '2003-01-01', '1231414') },
  { arbeidsforhold: createArbeidsforhold('4646234', '1991-03-21', '2010-01-01', '5462242') },
  { arbeidsforhold: createArbeidsforhold('1234342342', '2001-01-01', '2003-01-01', '1231414') },
];

describe('<ArbeidsforholdHelper>', () => {
  it('skal sortere arbeidsforhold på startdato', () => {
    const sorted = sortArbeidsforholdList(aleneståendeArbeidsforholdList);
    expect(sorted).has.length(aleneståendeArbeidsforholdList.length);
    expect(sorted[0]).to.equal(aleneståendeArbeidsforholdList[3]);
    expect(sorted[1]).to.equal(aleneståendeArbeidsforholdList[0]);
    expect(sorted[2]).to.equal(aleneståendeArbeidsforholdList[1]);
    expect(sorted[3]).to.equal(aleneståendeArbeidsforholdList[2]);
    expect(sorted[4]).to.equal(aleneståendeArbeidsforholdList[4]);
  });
});
