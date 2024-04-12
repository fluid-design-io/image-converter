import { CardContent } from '../ui/card';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Form } from '@/components/ui/form';
import { Preset, presetSchema } from '@/types/preset';
import ScrollCard from '../layout/scroll-card';

import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { useFileStore } from '@/stores/fileStore';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import ExportLocation from './form/export-location';
import FileSettings from './form/file-settings';
import ImageSizing from './form/image-sizing';

function ExportSettingsForm() {
  const { files } = useFileStore();
  const submitRef = useRef<HTMLButtonElement>(null);
  const form = useForm<Preset>({
    resolver: zodResolver(presetSchema),
    defaultValues: {
      imageFormat: 'webp',
      quality: 85,
      dontEnlarge: false,
      resizeToFit: true,
      resizeMode: 'long-edge',
      resizeOptions: {
        length: 2560,
        width: 2560,
        height: 1440,
        percentage: 50,
      },
      resolution: 72,
      exportLocation: '',
    },
  });

  async function onSubmit(values: Preset) {
    // check if the form is valid
    if (form.formState.isValid) {
      try {
        const filePaths = files?.map((file) => file.path);
        await window.electron.ipcRenderer.invoke(
          'process-images',
          filePaths,
          values,
        );
        toast.success('Images processed successfully');
      } catch (error) {
        toast.error(
          'Failed to process images, please see the logs for more details',
        );
        // eslint-disable-next-line no-console
        console.error(error);
      }
    } else {
      toast.error('Please fill in all required fields');
    }
  }

  // add a event listener to `#convert-button` to listen for a click event
  useEffect(() => {
    const submitForm = () => {
      submitRef.current?.click();
    };
    const convertButton = document.getElementById('convert-button');
    convertButton?.addEventListener('click', submitForm);
    return () => {
      convertButton?.removeEventListener('click', submitForm);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);
  return (
    <ScrollCard
      title="Export Settings"
      className="flex-1 pb-0"
      scrollAreaClassName="h-48 md:h-56"
    >
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1">
            <Accordion
              type="multiple"
              className="w-full"
              defaultValue={['file-settings']}
            >
              <AccordionItem
                value="file-settings"
                className="-mx-5 data-[state=open]:bg-muted/30"
              >
                <FileSettings />
              </AccordionItem>
              <AccordionItem
                value="image-sizing"
                className="-mx-5 data-[state=open]:bg-muted/30"
              >
                <ImageSizing />
              </AccordionItem>
              <AccordionItem
                value="export-location"
                className="-mx-5 data-[state=open]:bg-muted/30"
              >
                <ExportLocation />
              </AccordionItem>
            </Accordion>
            <Button
              ref={submitRef}
              className="hidden"
              type="submit"
              aria-hidden
              hidden
            >
              Convert
            </Button>
          </form>
        </Form>
      </CardContent>
    </ScrollCard>
  );
}

export default ExportSettingsForm;
