import { Button } from '@/components/ui/button';
import React from 'react';

export type ButtonType = 'component' | 'button';

export type HeaderButton = {
  type: 'button';
  title: string;
  description?: string;
  onClick: () => void;
  icon?: React.ReactElement<{ className: string }>;
  // @ts-ignore
  variant?: typeof Button.defaultProps.variant;
  /**
   * Keyboard shortcut to be displayed next to the button
   */
  kbd?: string;
} & React.ComponentProps<typeof Button>;

export type HeaderButtonComponent = {
  title: string;
  type: 'component';
  description?: string;
  component: React.ReactElement;
};

/**
 * Group of buttons to be displayed in the header
 */
export type ButtonGroup<T = ButtonType> = T extends 'component'
  ? HeaderButtonComponent[]
  : HeaderButton[];

export interface HeaderProps {
  title?: string;
  /**
   * Group of buttons to be displayed in the header
   */
  buttonGroups?: ButtonGroup[];
}

export type LayoutProps = {
  children: React.ReactNode;
} & HeaderProps;
