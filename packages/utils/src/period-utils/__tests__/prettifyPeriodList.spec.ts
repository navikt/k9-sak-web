import Period from '../Period';
import prettifyPeriodList from '../prettifyPeriodList';

describe('prettifyPeriodList', () => {
  it("should prettify a list of periods on the format DD.MM.YYYY-DD.MM.YYYY, with each period separated by ', '", () => {
    const periods = [new Period('2028-01-01', '2028-01-01'), new Period('2028-01-02', '2028-01-02')];
    expect(prettifyPeriodList(periods)).toEqual('01.01.2028 - 01.01.2028, 02.01.2028 - 02.01.2028');
  });
});
