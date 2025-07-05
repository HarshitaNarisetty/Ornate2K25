
import React, { useState, useEffect } from 'react';

// Simple motion components to avoid adding a dependency
interface MotionProps {
  initial?: Record<string, any>;
  animate?: Record<string, any>;
  transition?: Record<string, any>;
  children: React.ReactNode;
  className?: string;
}

export const motion = {
  div: ({ initial, animate, transition, children, className, ...props }: MotionProps) => {
    const [isActive, setIsActive] = useState(false);
    
    useEffect(() => {
      setIsActive(true);
    }, []);
    
    const style = {
      transition: `all ${transition?.duration || 0.3}s ${transition?.ease || 'ease'} ${transition?.delay || 0}s`,
      ...Object.entries(initial || {}).reduce((acc, [key, value]) => {
        if (!isActive) {
          acc[key as keyof typeof acc] = value;
        }
        return acc;
      }, {} as Record<string, any>),
      ...Object.entries(animate || {}).reduce((acc, [key, value]) => {
        if (isActive) {
          acc[key as keyof typeof acc] = value;
        }
        return acc;
      }, {} as Record<string, any>)
    };
    
    return (
      <div className={className} style={style} {...props}>
        {children}
      </div>
    );
  },
  
  h2: ({ initial, animate, transition, children, className, ...props }: MotionProps) => {
    const [isActive, setIsActive] = useState(false);
    
    useEffect(() => {
      setIsActive(true);
    }, []);
    
    const style = {
      transition: `all ${transition?.duration || 0.3}s ${transition?.ease || 'ease'} ${transition?.delay || 0}s`,
      ...Object.entries(initial || {}).reduce((acc, [key, value]) => {
        if (!isActive) {
          acc[key as keyof typeof acc] = value;
        }
        return acc;
      }, {} as Record<string, any>),
      ...Object.entries(animate || {}).reduce((acc, [key, value]) => {
        if (isActive) {
          acc[key as keyof typeof acc] = value;
        }
        return acc;
      }, {} as Record<string, any>)
    };
    
    return (
      <h2 className={className} style={style} {...props}>
        {children}
      </h2>
    );
  },
  
  p: ({ initial, animate, transition, children, className, ...props }: MotionProps) => {
    const [isActive, setIsActive] = useState(false);
    
    useEffect(() => {
      setIsActive(true);
    }, []);
    
    const style = {
      transition: `all ${transition?.duration || 0.3}s ${transition?.ease || 'ease'} ${transition?.delay || 0}s`,
      ...Object.entries(initial || {}).reduce((acc, [key, value]) => {
        if (!isActive) {
          acc[key as keyof typeof acc] = value;
        }
        return acc;
      }, {} as Record<string, any>),
      ...Object.entries(animate || {}).reduce((acc, [key, value]) => {
        if (isActive) {
          acc[key as keyof typeof acc] = value;
        }
        return acc;
      }, {} as Record<string, any>)
    };
    
    return (
      <p className={className} style={style} {...props}>
        {children}
      </p>
    );
  }
};
