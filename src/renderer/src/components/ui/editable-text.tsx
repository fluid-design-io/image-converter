import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useId, useState } from 'react';
import { Input } from './input';

type EditableTextProps = {
  value?: string;
  onChange: (value: string) => void;
  /**
   * Uncontrolled mode
   */
  isEditing?: boolean;
  /**
   * Unontrolled mode
   */
  setIsEditing?: (isEditing: boolean) => void;
  /**
   * Applies to both the text and input
   */
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  textClassName?: string;
};

/**
 * Editable text component by double clicking on the text
 *
 * Default height is `h-8`
 */
function EditableText({ value, onChange, ...props }: EditableTextProps) {
  const [_isEditing, _setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const inputId = useId();
  const isControlled = props.isEditing !== undefined;
  const isEditing = isControlled ? props.isEditing : _isEditing;
  const setIsEditing = isControlled ? props.setIsEditing! : _setIsEditing;
  return (
    <AnimatePresence mode="popLayout">
      {isEditing ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Input
            {...props}
            key={`input-${inputId}`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            // listen for enter key
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.currentTarget.blur();
                setIsEditing(false);
              }
            }}
            onBlur={() => {
              setIsEditing(false);
              onChange(inputValue);
            }}
            className={cn(
              'h-8 text-xs px-0 rounded bg-accent text-accent-foreground border-0 border-transparent focus-visible:ring-0 ring-transparent shadow-none py-0',
              props?.className,
              props?.inputClassName,
            )}
            autoFocus
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          key={`div-${inputId}`}
          onDoubleClick={() => (isControlled ? null : setIsEditing(true))}
          className={cn(
            'h-8 text-xs select-none flex items-center w-full',
            props?.className,
            props?.textClassName,
          )}
        >
          {value}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default EditableText;
