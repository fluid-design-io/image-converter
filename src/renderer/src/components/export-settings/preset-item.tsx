/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-use-before-define */
import useContextMenu from '@/hooks/use-context-menu';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import EditableText from '../ui/editable-text';
import { Label } from '../ui/label';
import { RadioGroupItem } from '../ui/radio-group';

// Task: build a context menu when right-clicking on the PresetItem component.
/* menuitems:
  - Rename
  - Duplicate
  - Delete
  - Export
 */

function PresetItem() {
  const { open, points, setOpen, setPoints } = useContextMenu();
  const [isEditing, setIsEditing] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(true);
    setPoints({ x: e.clientX, y: e.clientY });
  };
  return (
    <>
      <div
        className={cn('px-5 flex items-center space-x-2 transition-colors', {
          'bg-accent': open || active,
          'hover:bg-accent/30': !open && !active && !isEditing,
        })}
        onClick={() => setActive(!active)}
        onBlur={() => setActive(false)}
        onDoubleClick={() => setIsEditing(true)}
        onContextMenu={handleContextMenu}
      >
        <RadioGroupItem value="option-one" id="option-one" />
        <Label htmlFor="option-one" className="flex-1">
          <EditableText
            value="Default"
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            onChange={() => {}}
          />
        </Label>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            data-state={open ? 'open' : 'closed'}
            data-side="bottom"
            className={cn(
              'fixed z-50 min-w-[8rem] w-48 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-xl dark:shadow-background/50',
              'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            )}
            style={{ top: points.y, left: points.x }}
          >
            <div>
              <Item title="Rename" onClick={() => setIsEditing(true)} />
              <Item title="Duplicate" onClick={() => {}} />
              <Item title="Delete" onClick={() => {}} />
              <Item title="Export" onClick={() => {}} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default PresetItem;

function Item({ title, onClick }: { title: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative w-full flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        'hover:bg-accent focus-visible:bg-accent',
      )}
    >
      {title}
    </button>
  );
}
