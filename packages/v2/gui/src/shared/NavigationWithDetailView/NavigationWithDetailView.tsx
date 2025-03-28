import React from 'react';

export interface NavigationWithDetailViewProps {
  navigationSection: () => React.ReactNode;
  detailSection: () => React.ReactNode;
}

export const NavigationWithDetailView = ({ navigationSection, detailSection }: NavigationWithDetailViewProps) => (
  <div className="flex items-start">
    <div className="border border-solid border-[#c6c2bf] rounded-md flex flex-col">{navigationSection()}</div>
    <div className="flex-[0.66] flex-grow flex-wrap ml-5">{detailSection()}</div>
  </div>
);
