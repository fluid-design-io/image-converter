import { RadioGroup } from '@/components/ui/radio-group';
import { Minus, Plus } from 'lucide-react';
import ScrollCard from '../layout/scroll-card';
import { Button } from '../ui/button';
import { CardContent } from '../ui/card';
import PresetItem from './preset-item';

function Presets() {
  return (
    <ScrollCard
      title="Presets"
      className="w-full md:w-[220px] lg:w-[250px] xl:w-[280px]"
      scrollAreaClassName="h-24 md:h-48"
      footerClassName="grid grid-cols-2 place-items-stretch pb-0 -mx-6"
      footer={
        <>
          <Button
            size="sm"
            variant="outline"
            className="rounded-none border-x-0 border-b-0"
          >
            <Plus className="size-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-none border-b-0"
          >
            <Minus className="size-4" />
          </Button>
        </>
      }
    >
      <CardContent className="px-0">
        <RadioGroup defaultValue="option-one">
          <PresetItem />
        </RadioGroup>
        <div />
      </CardContent>
    </ScrollCard>
  );
}

export default Presets;
