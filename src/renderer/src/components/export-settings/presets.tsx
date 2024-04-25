import { RadioGroup } from '@/components/ui/radio-group';
import { useSettingsStore } from '@/stores/settingsStore';
import { Preset } from '@/types/preset';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import ScrollCard from '../layout/scroll-card';
import { Button } from '../ui/button';
import { CardContent } from '../ui/card';
import PresetItem from './preset-item';

function Presets() {
  const { presets, addPreset, removePreset } = useSettingsStore();
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<string>();
  const form = useFormContext<Preset>();

  const handleApplyPreset = (id: string | null) => {
    if (!id) return;
    const preset = useSettingsStore.getState().presets.find((p) => p.id === id);
    if (preset) {
      form.reset(preset);
      setTimeout(() => {
        setSelectedPreset(id);
        toast.info(`Preset "${preset.name}" applied`);
      }, 100);
    } else {
      toast.error('Preset not found');
    }
  };

  const handleAddPreset = () => {
    // check if the form is valid
    if (form.formState.isValid) {
      const formValues = form.getValues();
      const id = addPreset({ ...formValues, name: 'New Preset' });
      handleApplyPreset(id);
      setActivePreset(id);
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handleRemovePreset = (id: string) => {
    removePreset(id);
    setSelectedPreset(null);
  };

  return (
    <ScrollCard
      title="Presets"
      className="w-full md:w-[220px] lg:w-[250px] xl:w-[280px]"
      scrollAreaClassName="h-[calc(100vh-14rem-1.5rem)]"
      footerClassName="grid grid-cols-2 place-items-stretch pb-0 -mx-6"
      footer={
        <>
          <Button
            size="sm"
            variant="outline"
            className="rounded-none border-x-0 border-b-0"
            onClick={handleAddPreset}
          >
            <Plus className="size-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-none border-b-0"
            disabled={!selectedPreset}
            onClick={() => handleRemovePreset(selectedPreset as string)}
          >
            <Minus className="size-4" />
          </Button>
        </>
      }
    >
      <CardContent className="px-0">
        <RadioGroup
          value={activePreset ?? undefined}
          onValueChange={handleApplyPreset}
        >
          {presets?.length ? (
            presets?.map((preset) => (
              <PresetItem
                key={preset.id}
                preset={preset}
                selectedPreset={selectedPreset}
                onSelected={setSelectedPreset}
              />
            ))
          ) : (
            <div className="flex items-center justify-center h-24">
              No presets available
            </div>
          )}
        </RadioGroup>
        <div />
      </CardContent>
    </ScrollCard>
  );
}

export default Presets;
