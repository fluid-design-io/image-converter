import { CardContent } from '../ui/card';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Form } from '@/components/ui/form';
import { Preset, presetSchema } from '@/types/preset';
import ScrollCard from '../layout/scroll-card';

import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { useFileStore } from '@/stores/fileStore';
import React, { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import ExportLocation from './form/export-location';
import FileSettings from './form/file-settings';
import ImageSizing from './form/image-sizing';

import { useSettingsStore } from '@/stores/settingsStore';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

function ExportSettingsForm({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { files, loading, setLoading } = useFileStore();
  const { exportSettings, setExportSettings } = useSettingsStore();
  const submitRef = useRef<HTMLButtonElement>(null);
  const form = useForm<Preset>({
    resolver: zodResolver(presetSchema),
    defaultValues: {
      id: uuidv4(),
      name: 'New Preset',
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
    disabled: loading,
  });

  async function onSubmit(values: Preset) {
    // check if the form is valid
    if (presetSchema.safeParse(values)) {
      try {
        setLoading(true);
        const filePaths = files?.map((file) => file.path);
        await window.electron.ipcRenderer.invoke(
          'process-images',
          filePaths,
          values,
        );
        toast.success('Images processed successfully');
        navigate(`/completed/${encodeURIComponent(values.exportLocation)}`);
      } catch (error) {
        toast.error(
          'Failed to process images, please see the logs for more details',
        );
        // eslint-disable-next-line no-console
        console.error(error);
      } finally {
        setLoading(false);
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
    <Form {...form}>
      {children}
      <ScrollCard
        title="Export Settings"
        className="flex-1 pb-0"
        scrollAreaClassName="h-[calc(100vh-14rem)]"
      >
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1">
            <Accordion
              type="multiple"
              className="w-full"
              defaultValue={exportSettings}
              onValueChange={setExportSettings}
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
        </CardContent>
      </ScrollCard>
    </Form>
  );
}

export default ExportSettingsForm;
