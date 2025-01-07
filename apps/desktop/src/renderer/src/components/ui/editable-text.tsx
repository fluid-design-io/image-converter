import { cn } from '@/lib/utils';
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
function EditableText({
  value,
  onChange,
  setIsEditing: setIsEditingProp,
  isEditing: isEditingProp,
  ...props
}: EditableTextProps) {
  const [_isEditing, _setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const inputId = useId();
  const isControlled = isEditingProp !== undefined;
  const isEditing = isControlled ? isEditingProp : _isEditing;
  const setIsEditing = isControlled ? setIsEditingProp! : _setIsEditing;
  return isEditing ? (
    <div>
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
          onChange(inputValue.length > 0 ? inputValue : 'Unnamed');
        }}
        className={cn(
          'h-8 text-xs px-0 rounded bg-accent text-accent-foreground border-0 border-transparent focus-visible:ring-0 ring-transparent shadow-none translate-y-[-0.5px]',
          props?.className,
          props?.inputClassName,
        )}
        autoFocus
      />
    </div>
  ) : (
    <div
      key={`div-${inputId}`}
      onDoubleClick={() => (isControlled ? null : setIsEditing(true))}
      className={cn(
        'h-8 text-xs select-none flex items-center w-full pointer-events-none',
        props?.className,
        props?.textClassName,
      )}
    >
      {value}
    </div>
  );
}

export default EditableText;
