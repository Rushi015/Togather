
import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}
export default function SiteLayout({ children }: LayoutProps){
    return( <div>
        {children}
    </div>)
   
}