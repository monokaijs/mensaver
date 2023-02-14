import React from "react";

interface BoxedLayoutProps {
  children: any,
  maxWidth?: number,
}

export const BoxedLayout = ({children, maxWidth}: BoxedLayoutProps) => {
  if (!maxWidth) maxWidth = 1024;

  return (
    <div
      className={'boxed-layout-outer'}
      style={{
        width: '100%'
      }}
    >
      <div
        className={'boxed-layout-inner'}
        style={{
          maxWidth: `${maxWidth}px`,
          margin: 'auto',
          padding: '0 16px'
        }}
      >
        {children}
      </div>
    </div>
  )
}
