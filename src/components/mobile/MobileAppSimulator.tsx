import React from 'react';

interface MobileAppSimulatorProps {
  children: React.ReactNode;
}

// Neutralized: Directly renders children to guarantee no fake phone frames or device preview toolbars are rendered.
export const MobileAppSimulator: React.FC<MobileAppSimulatorProps> = ({ children }) => {
  return <>{children}</>;
};

export default MobileAppSimulator;
