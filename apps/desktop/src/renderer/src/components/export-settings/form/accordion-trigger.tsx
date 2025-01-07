import { AccordionTrigger as AccordionTriggerPrimitive } from '@/components/ui/accordion';
import { Text } from '@/components/ui/typography';

export { AccordionContent } from '@/components/ui/accordion';

export function AccordionTrigger({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <AccordionTriggerPrimitive className="py-2 text-foreground/75 px-5 gap-1.5 [&[data-state=open]_.sub-title]:opacity-0">
      <div className="flex flex-1 justify-between items-center">
        <Text className="shrink-0 text-foreground/80" size="sm">
          {title}
        </Text>
        <div className="min-w-24 -my-2 max-w-[70%]">
          {subtitle && (
            <Text
              variant="muted"
              size="xs"
              className="line-clamp-1 text-end sub-title transition-opacity"
            >
              {subtitle}
            </Text>
          )}
        </div>
      </div>
    </AccordionTriggerPrimitive>
  );
}
