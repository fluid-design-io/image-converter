import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Preset } from '@/types/preset';
import { useEffect, useState } from 'react';
import { CommonPaths } from 'src/main/util';
import { AccordionContent, AccordionTrigger } from './accordion-trigger';

function ExportLocation() {
  const form = useFormContext<Preset>();
  const [commonFolders, setCommonFolders] = useState<CommonPaths>();

  const handleOpenDialog = () => {
    window.electron.ipcRenderer.emit('open-directory-dialog');
  };

  useEffect(() => {
    window.electron.ipcRenderer.on('directory-selected', (path: unknown) => {
      form.setValue('exportLocation', path as string);
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners('directory-selected');
    };
  }, [form]);

  const handleGetCommonPaths = async () => {
    const commonPaths = (await window.electron.ipcRenderer.invoke(
      'get-common-paths',
    )) as CommonPaths;
    setCommonFolders(commonPaths);
  };
  useEffect(() => {
    handleGetCommonPaths();
  }, []);

  return (
    <>
      <AccordionTrigger
        title="Export Location"
        subtitle={form.watch('exportLocation') ?? 'Not Selected'}
      />
      <AccordionContent className="space-y-4 px-5 pt-2">
        <div className="grid w-full items-center gap-1.5">
          <FormField
            control={form.control}
            name="exportLocation"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="w-full max-w-md lg:flex lg:items-center lg:gap-4 space-y-2 lg:space-y-0">
                  <FormLabel className="text-xs lg:flex-shrink-0 min-w-24">
                    Image Format
                  </FormLabel>
                  <div className="flex items-center gap-4 flex-1">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue placeholder="custom" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="custom">Specifc Folder</SelectItem>
                        {Object.entries(commonFolders ?? {}).map(
                          ([key, value]) => (
                            <SelectItem
                              className="capitalize"
                              key={key}
                              value={value}
                            >
                              {key}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      type="button"
                      size="sm"
                      className="h-8"
                      onClick={handleOpenDialog}
                    >
                      Choose...
                    </Button>
                  </div>
                </div>
                <FormDescription>
                  Folder:
                  {field.value ?? 'Not Selected'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </AccordionContent>
    </>
  );
}

export default ExportLocation;
