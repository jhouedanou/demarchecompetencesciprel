import * as React from 'react';
import { mergeStyles } from '@fluentui/react';

// Simple Card component replacement that matches Fluent UI Card interface
const Card: React.FC<{ children: React.ReactNode; className?: string }> & { 
  Section: React.FC<{ children: React.ReactNode; styles?: any }> 
} = ({ children, className }) => (
  <div className={`${mergeStyles({ 
    backgroundColor: 'white', 
    border: '1px solid #edebe9', 
    borderRadius: '2px', 
    boxShadow: '0 1.6px 3.6px 0 rgba(0,0,0,.132), 0 0.3px 0.9px 0 rgba(0,0,0,.108)'
  })} ${className || ''}`}>
    {children}
  </div>
);

// Add Section as a static property
Card.Section = ({ children, styles }) => (
  <div className={mergeStyles({
    padding: '12px',
    borderBottom: '1px solid #edebe9',
    ...styles?.root
  })}>
    {children}
  </div>
);

export default Card;
