import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useFormContext } from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Preset, resizeModeOptions } from '@/types/preset';
import { AccordionContent, AccordionTrigger } from './accordion-trigger';

function ImageSizing() {
  const form = useFormContext<Preset>();
  const resizeToFit = form.getValues('resizeToFit');
  let resizeModeBody;
  switch (form.watch('resizeMode')) {
    case 'long-edge':
    case 'short-edge':
      resizeModeBody = (
        <FormField
          control={form.control}
          name="resizeOptions.length"
          render={({ field }) => (
            <FormItem className="space-y-0 flex items-center gap-1.5">
              <FormLabel className="text-xs sr-only">Length:</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  className="w-24 h-8 hide-number-arrow text-center"
                  min={1}
                  disabled={!resizeToFit}
                  {...field}
                />
              </FormControl>
              <span>px</span>
              <FormMessage />
            </FormItem>
          )}
        />
      );
      break;
    case 'width-height':
      resizeModeBody = (
        <>
          <FormField
            control={form.control}
            name="resizeOptions.width"
            render={({ field }) => (
              <FormItem className="space-y-0 flex items-center gap-1.5">
                <FormLabel className="text-xs">W:</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="w-24 h-8 hide-number-arrow text-center"
                    min={1}
                    disabled={!resizeToFit}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="resizeOptions.height"
            render={({ field }) => (
              <FormItem className="space-y-0 flex items-center gap-1.5">
                <FormLabel className="text-xs">H:</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="w-24 h-8 hide-number-arrow text-center"
                    min={1}
                    disabled={!resizeToFit}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      );
      break;
    case 'percentage':
      resizeModeBody = (
        <FormField
          control={form.control}
          name="resizeOptions.percentage"
          render={({ field }) => (
            <FormItem className="space-y-0 flex items-center gap-1.5">
              <FormLabel className="text-xs sr-only">Percentage:</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  className="w-24 h-8 hide-number-arrow text-center"
                  min={1}
                  disabled={!resizeToFit}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
      break;
    default:
      resizeModeBody = null;
  }
  return (
    <>
      <AccordionTrigger
        title="Image Sizing"
        subtitle={resizeToFit ? 'Enabled' : 'Disabled'}
      />
      <AccordionContent className="space-y-4 px-5 pt-2">
        <div className="grid w-full max-w-md items-center gap-1.5">
          <fieldset
            className="flex justify-between items-center gap-2 flex-wrap"
            disabled={form.formState.isSubmitting}
          >
            <FormField
              control={form.control}
              name="resizeToFit"
              render={({ field }) => (
                <FormItem className="space-y-0 flex items-center space-x-1.5 shrink-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-xs">Resize to fit:</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="resizeMode"
              render={({ field }) => (
                <FormItem className="flex-1 space-y-0">
                  <FormLabel className="sr-only">Resize Mode</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!resizeToFit}
                  >
                    <FormControl>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue
                          placeholder="Long Edge"
                          className="capitalize"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {resizeModeOptions.map((option) => (
                        <SelectItem
                          key={option}
                          value={option}
                          className="capitalize"
                        >
                          {option.replace('-', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dontEnlarge"
              render={({ field }) => (
                <FormItem className="space-y-0 flex items-center space-x-1.5 shrink-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!resizeToFit}
                    />
                  </FormControl>
                  <FormLabel className="text-xs">Don&apos;t enlarge</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>
          <fieldset className="flex justify-end items-center gap-2 flex-wrap">
            {resizeModeBody}
            {/* resolution */}
            <FormField
              control={form.control}
              name="resolution"
              render={({ field }) => (
                <FormItem className="space-y-0 flex items-center gap-1.5">
                  <FormLabel className="text-xs">Resolution:</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-24 h-8 hide-number-arrow text-center"
                      min={1}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>
        </div>
      </AccordionContent>
    </>
  );
}

export default ImageSizing;
