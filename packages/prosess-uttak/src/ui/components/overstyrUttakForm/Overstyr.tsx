import React from 'react';

import OverstyrUttakForm from './OverstyrUttakForm';

interface OverstyrProps {}

const Overstyr: React.FC<OverstyrProps> = () => (
  // const { lasterOverstyringer, overstyringer } = useOverstyrUttak();

  <div>
    {/* {!lasterOverstyringer && (
                <>
                    {overstyringer &&
                        overstyringer.map((overstyring: any) => <div key={overstyring.id}>{overstyring.id}</div>)}
                    {!overstyringer && <>ikke overstyringer</>}
                </>
            )} */}
    <OverstyrUttakForm />
  </div>
);
export default Overstyr;
