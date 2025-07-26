import React from 'react';

export interface NavigationWithDetailViewProps {
  navigationSection: () => React.ReactNode;
  detailSection: () => React.ReactNode;
  showDetailSection?: boolean;
  belowNavigationContent?: React.ReactNode;
}

export const NavigationWithDetailView = ({
  navigationSection,
  detailSection,
  belowNavigationContent: belowNavigationSection,
  showDetailSection,
}: NavigationWithDetailViewProps) => (
  <div className="flex items-start">
    <div>
      <div className="border border-solid border-[#c6c2bf] rounded-md flex flex-col">{navigationSection()}</div>
      {belowNavigationSection && <>{belowNavigationSection}</>}
    </div>
    {showDetailSection && <div className="flex-[0.66] grow flex-wrap ml-5">{detailSection()}</div>}
  </div>
);
