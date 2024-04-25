import { HeaderProps } from '@/types/layout';
import React from 'react';
import { Button } from '../ui/button';
import KBD from '../ui/kbd';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { Heading } from '../ui/typography';

function Header({ title, buttonGroups }: HeaderProps) {
  return (
    <header className="header flex justify-between items-center h-[53px] pl-24 gap-8 pr-5 transition-colors duration-100">
      <div>
        {title ? (
          <Heading
            type="h1"
            className="text-foreground/80 dark:text-foreground/95"
          >
            {title}
          </Heading>
        ) : null}
      </div>
      <div className="gap-8 shrink-0 flex items-center toolbar">
        {buttonGroups?.map((buttons, i) => (
          <div
            className="flex gap-2 items-center"
            // eslint-disable-next-line react/no-array-index-key
            key={`header-button-group-${i}`}
          >
            {buttons?.map((button) => {
              if (button.type === 'component') {
                if (React.isValidElement(button.component)) {
                  return (
                    <TooltipProvider key={`header-button-${button.title}`}>
                      <Tooltip delayDuration={250}>
                        <TooltipTrigger asChild>
                          <div title={button?.description || button.title}>
                            {button.component}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>{button.title}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                }
              } else if (button.type === 'button') {
                const {
                  onClick,
                  title: buttonTitle,
                  description,
                  ...rest
                } = button;
                const hasIcon = !!button?.icon;
                const Icon = hasIcon ? button.icon : null;
                return (
                  <TooltipProvider key={`header-button-${buttonTitle}`}>
                    <Tooltip delayDuration={250}>
                      <TooltipTrigger asChild>
                        <Button
                          size={hasIcon ? 'icon' : 'sm'}
                          variant={button.variant || 'ghost'}
                          key={`header-button-${buttonTitle}`}
                          onClick={onClick}
                          title={description || buttonTitle}
                          {...rest}
                        >
                          {hasIcon ? (
                            // @ts-ignore
                            <Icon className="size-4" />
                          ) : (
                            buttonTitle
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {hasIcon ? buttonTitle : null}
                        {button.kbd && <KBD>{button.kbd}</KBD>}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              }
              return null;
            })}
          </div>
        ))}
      </div>
    </header>
  );
}

export default Header;
