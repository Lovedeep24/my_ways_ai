import React from 'react';

export default function Layout({ children }) {
  return (
    <div>
      <div>20% off for next 3 days</div>
      {children}
    </div>
  );
}
