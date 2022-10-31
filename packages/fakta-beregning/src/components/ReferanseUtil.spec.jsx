import { expect } from 'chai';
import { finnEksternIdSubstring } from './ReferanseUtil';


describe('ReferanseUtil', () => {
  it('skal gi 4 siffer når kun ett arbeidsforhold og en arbeidsgiver', () => {
    const arbeidsgiverIdent = "12536713482";
    const arbeidsforholdId = "fjeisf84j34f";
    const eksternArbeidsforholdId = "heusif-3543t-esfsf";
    const forventetSubstring = "...sfsf";

    const arbeidsgiverOpplysningerPerId = {
      [arbeidsgiverIdent]: {
        arbeidsforholdreferanser: [{
          internArbeidsforholdId: arbeidsforholdId,
          eksternArbeidsforholdId
        }]
      },
    };

    const substring = finnEksternIdSubstring(arbeidsgiverIdent, arbeidsforholdId, arbeidsgiverOpplysningerPerId);

    expect(substring).to.equal(forventetSubstring);
  });

  it('skal gi 4 siffer når to arbeidsgivere', () => {
    const arbeidsgiverIdent1 = "12536713482";
    const arbeidsforholdId1 = "fjeisf84j34f";
    const eksternArbeidsforholdId1 = "heusif-3543t-esfsf";
    const forventetSubstring = "...sfsf";

    const arbeidsgiverIdent2 = "3451423414";
    const arbeidsforholdId2 = "fjeisf84j34f";
    const eksternArbeidsforholdId2 = "heusif-3543t-esfsf";


    const arbeidsgiverOpplysningerPerId = {
      [arbeidsgiverIdent1]: {
        arbeidsforholdreferanser: [{
          internArbeidsforholdId: arbeidsforholdId1,
          eksternArbeidsforholdId: eksternArbeidsforholdId1
        }]
      },
      [arbeidsgiverIdent2]: {
        arbeidsforholdreferanser: [{
          internArbeidsforholdId: arbeidsforholdId2,
          eksternArbeidsforholdId: eksternArbeidsforholdId2
        }]
      }
    };

    const substring = finnEksternIdSubstring(arbeidsgiverIdent1, arbeidsforholdId1, arbeidsgiverOpplysningerPerId);

    expect(substring).to.equal(forventetSubstring);
  });

  it('skal gi 4 siffer når to arbeidsforhold hos samme arbeidsgiver med ulik tegn i siste siffer', () => {
    const arbeidsgiverIdent1 = "12536713482";
    const arbeidsforholdId1 = "fjeisf84j34f";
    const eksternArbeidsforholdId1 = "heusif-3543t-esfsf";
    const forventetSubstring = "...sfsf";

    const arbeidsforholdId2 = "fjeisf84j34f";
    const eksternArbeidsforholdId2 = "heusif-3543t-esfst";

    const arbeidsgiverOpplysningerPerId = {
      [arbeidsgiverIdent1]: {
        arbeidsforholdreferanser: [{
          internArbeidsforholdId: arbeidsforholdId1,
          eksternArbeidsforholdId: eksternArbeidsforholdId1
        },
          {
            internArbeidsforholdId: arbeidsforholdId2,
            eksternArbeidsforholdId: eksternArbeidsforholdId2
          }]
      }
    };

    const substring = finnEksternIdSubstring(arbeidsgiverIdent1, arbeidsforholdId1, arbeidsgiverOpplysningerPerId);

    expect(substring).to.equal(forventetSubstring);
  });

  it('skal gi 4 siffer når to arbeidsforhold hos samme arbeidsgiver med ulikt tegn i nest siste siffer', () => {
    const arbeidsgiverIdent1 = "12536713482";
    const arbeidsforholdId1 = "fjeisf84j34f";
    const eksternArbeidsforholdId1 = "heusif-3543t-esfsf";
    const forventetSubstring = "...sfsf";

    const arbeidsforholdId2 = "fjeisf84j34f";
    const eksternArbeidsforholdId2 = "heusif-3543t-esfaf";

    const arbeidsgiverOpplysningerPerId = {
      [arbeidsgiverIdent1]: {
        arbeidsforholdreferanser: [{
          internArbeidsforholdId: arbeidsforholdId1,
          eksternArbeidsforholdId: eksternArbeidsforholdId1
        },
          {
            internArbeidsforholdId: arbeidsforholdId2,
            eksternArbeidsforholdId: eksternArbeidsforholdId2
          }]
      }
    };

    const substring = finnEksternIdSubstring(arbeidsgiverIdent1, arbeidsforholdId1, arbeidsgiverOpplysningerPerId);

    expect(substring).to.equal(forventetSubstring);
  });

  it('skal gi 5 siffer når to arbeidsforhold hos samme arbeidsgiver med like tegn i siste 4 og ulike i siste 5', () => {
    const arbeidsgiverIdent1 = "12536713482";
    const arbeidsforholdId1 = "fjeisf84j34f";
    const eksternArbeidsforholdId1 = "heusif-3543t-esfsf";
    const forventetSubstring = "...esfsf";

    const arbeidsforholdId2 = "fjeisf84j34f";
    const eksternArbeidsforholdId2 = "heusif-3543t-asfsf";

    const arbeidsgiverOpplysningerPerId = {
      [arbeidsgiverIdent1]: {
        arbeidsforholdreferanser: [{
          internArbeidsforholdId: arbeidsforholdId1,
          eksternArbeidsforholdId: eksternArbeidsforholdId1
        },
          {
            internArbeidsforholdId: arbeidsforholdId2,
            eksternArbeidsforholdId: eksternArbeidsforholdId2
          }]
      }
    };

    const substring = finnEksternIdSubstring(arbeidsgiverIdent1, arbeidsforholdId1, arbeidsgiverOpplysningerPerId);

    expect(substring).to.equal(forventetSubstring);
  });

  it('skal gi 7 siffer når to arbeidsforhold hos samme arbeidsgiver med like tegn i siste 6 og ulike i siste 7', () => {
    const arbeidsgiverIdent1 = "12536713482";
    const arbeidsforholdId1 = "fjeisf84j34f";
    const eksternArbeidsforholdId1 = "heusif-3543t-esfsf";
    const forventetSubstring = "...t-esfsf";

    const arbeidsforholdId2 = "fjeisf84j34f";
    const eksternArbeidsforholdId2 = "heusif-3543a-esfsf";

    const arbeidsgiverOpplysningerPerId = {
      [arbeidsgiverIdent1]: {
        arbeidsforholdreferanser: [{
          internArbeidsforholdId: arbeidsforholdId1,
          eksternArbeidsforholdId: eksternArbeidsforholdId1
        },
          {
            internArbeidsforholdId: arbeidsforholdId2,
            eksternArbeidsforholdId: eksternArbeidsforholdId2
          }]
      }
    };

    const substring = finnEksternIdSubstring(arbeidsgiverIdent1, arbeidsforholdId1, arbeidsgiverOpplysningerPerId);
    expect(substring).to.equal(forventetSubstring);
  });


  it('skal gi 8 siffer når to arbeidsforhold hos samme arbeidsgiver med like tegn i siste 7 og den andre eksternIden har 7 tegn', () => {
    const arbeidsgiverIdent1 = "12536713482";
    const arbeidsforholdId1 = "fjeisf84j34f";
    const eksternArbeidsforholdId1 = "heusif-3543t-esfsf";
    const forventetSubstring = "...3t-esfsf";

    const arbeidsforholdId2 = "fjeisf84j34f";
    const eksternArbeidsforholdId2 = "t-esfsf";

    const arbeidsgiverOpplysningerPerId = {
      [arbeidsgiverIdent1]: {
        arbeidsforholdreferanser: [{
          internArbeidsforholdId: arbeidsforholdId1,
          eksternArbeidsforholdId: eksternArbeidsforholdId1
        },
          {
            internArbeidsforholdId: arbeidsforholdId2,
            eksternArbeidsforholdId: eksternArbeidsforholdId2
          }]
      }
    };

    const substring = finnEksternIdSubstring(arbeidsgiverIdent1, arbeidsforholdId1, arbeidsgiverOpplysningerPerId);

    expect(substring).to.equal(forventetSubstring);
  });

  it('skal gi 7 siffer når to arbeidsforhold hos samme arbeidsgiver med like tegn i siste 7 og denne eksternIden har 7 tegn', () => {
    const arbeidsgiverIdent1 = "12536713482";
    const arbeidsforholdId1 = "fjeisf84j34f";
    const eksternArbeidsforholdId1 = "t-esfsf";
    const forventetSubstring = "...t-esfsf";

    const arbeidsforholdId2 = "fjeisf84j34f";
    const eksternArbeidsforholdId2 = "heusif-3543t-esfsf";

    const arbeidsgiverOpplysningerPerId = {
      [arbeidsgiverIdent1]: {
        arbeidsforholdreferanser: [{
          internArbeidsforholdId: arbeidsforholdId1,
          eksternArbeidsforholdId: eksternArbeidsforholdId1
        },
          {
            internArbeidsforholdId: arbeidsforholdId2,
            eksternArbeidsforholdId: eksternArbeidsforholdId2
          }]
      }
    };

    const substring = finnEksternIdSubstring(arbeidsgiverIdent1, arbeidsforholdId1, arbeidsgiverOpplysningerPerId);

    expect(substring).to.equal(forventetSubstring);
  });

});
