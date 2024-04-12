import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

import { useFormContext } from 'react-hook-form';
import { AccordionContent, AccordionTrigger } from './accordion-trigger';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Preset } from '@/types/preset';

function FileSettings() {
  const form = useFormContext<Preset>();
  return (
    <>
      <AccordionTrigger
        title="File Settings"
        subtitle={`${form.watch('imageFormat').toUpperCase()} ${form.watch(
          'quality',
        )}%`}
      />
      <AccordionContent className="space-y-4 px-5 pt-2">
        <div className="grid w-full max-w-md items-center gap-1.5">
          <FormField
            control={form.control}
            name="imageFormat"
            render={({ field }) => (
              <FormItem className="lg:flex lg:items-center lg:gap-4 lg:space-y-0">
                <FormLabel className="text-xs lg:flex-shrink-0 min-w-24">
                  Image Format
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="WEBP" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                    <SelectItem value="webp">WEBP</SelectItem>
                    <SelectItem value="avif">AVIF</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid lg:flex lg:flex-row w-full max-w-md items-center space-y-2 lg:space-y-0 lg:gap-4">
          <Label htmlFor="image-format" className="text-xs shrink-0 min-w-24">
            Quality
          </Label>
          <div className="flex justify-between items-center gap-2 flex-1">
            <Slider
              defaultValue={[85]}
              max={100}
              min={30}
              step={1}
              className="w-full h-8"
              value={[form.watch('quality')]}
              onValueChange={(value) => form.setValue('quality', value[0])}
            />

            <FormField
              control={form.control}
              name="quality"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className="sr-only">Quality</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-14 h-8 hide-number-arrow text-center"
                      min={30}
                      max={100}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </AccordionContent>
    </>
  );
}

export default FileSettings;
