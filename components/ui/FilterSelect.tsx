"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import { cn } from "@/lib/utils";
import { Avatar } from "./avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

interface FilterSelectOption {
  label: string;
  value: string;
  color?: string;
  role?: string;
  disabled?: boolean;
}

interface FilterSelectProps
  extends Omit<
    SelectPrimitive.Root.Props<string>,
    "onValueChange" | "value" | "children"
  > {
  align?: "start" | "center" | "end";
  options: FilterSelectOption[];
  placeholder?: string;
  triggerPrefix?: string;
  triggerClassName?: string;
  contentClassName?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disableAll?: boolean;
  extraContentChildren?: React.ReactNode;
}

const FilterSelect = ({
  align,
  options,
  placeholder = "All",
  triggerPrefix,
  triggerClassName,
  contentClassName,
  value,
  onValueChange,
  disableAll = false,
  extraContentChildren,
  ...props
}: FilterSelectProps) => {
  const isAll = !value || value === "all";
  const hasAllOption = options.some((o) => o.value === "all");
  const selected = options.find((o) => o.value === value);
  const showPlaceholder = (isAll && !disableAll) || !selected;

  return (
    <Select
      value={value}
      onValueChange={(v) => v != null && onValueChange?.(v)}
      {...props}
    >
      <SelectTrigger className={cn(triggerClassName)}>
        <SelectValue>
          {showPlaceholder ? (
            placeholder
          ) : (
            <>
              {selected?.color && (
                <div
                  style={{ backgroundColor: selected.color }}
                  className="size-2 rounded-full"
                />
              )}
              {triggerPrefix} {selected?.label}
            </>
          )}
        </SelectValue>
      </SelectTrigger>

      <SelectContent
        align={align || "center"}
        className={cn("min-w-[180px]", contentClassName)}
      >
        {!hasAllOption && !disableAll && (
          <SelectItem value="all">All</SelectItem>
        )}
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.color && (
              <div
                style={{ backgroundColor: option.color }}
                className="size-2 rounded-full"
              />
            )}
            {option.label}
          </SelectItem>
        ))}

        {extraContentChildren}
      </SelectContent>
    </Select>
  );
};

const UserFilterSelect = ({
  align,
  options,
  placeholder = "All",
  triggerPrefix,
  triggerClassName,
  contentClassName,
  value,
  onValueChange,
  disableAll = false,
  extraContentChildren,
  ...props
}: FilterSelectProps) => {
  const isAll = !value || value === "all";
  const hasAllOption = options.some((o) => o.value === "all");
  const selected = options.find((o) => o.value === value);
  const showPlaceholder = (isAll && !disableAll) || !selected;

  return (
    <Select
      value={value}
      onValueChange={(v) => v != null && onValueChange?.(v)}
      {...props}
    >
      <SelectTrigger className={cn(triggerClassName)}>
        <SelectValue>
          {showPlaceholder ? (
            placeholder
          ) : (
            <>
              <Avatar className="size-6" />
              {triggerPrefix} {selected?.label}
            </>
          )}
        </SelectValue>
      </SelectTrigger>

      <SelectContent
        align={align || "center"}
        className={cn("min-w-[180px]", contentClassName)}
      >
        {!hasAllOption && !disableAll && (
          <SelectItem value="all">All</SelectItem>
        )}
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            <Avatar className="size-6" />
            {option.label}
            {option.role && (
              <p className="font-normal text-muted-foreground">{option.role}</p>
            )}
          </SelectItem>
        ))}

        {extraContentChildren}
      </SelectContent>
    </Select>
  );
};

export { FilterSelect, UserFilterSelect };
export type { FilterSelectOption, FilterSelectProps };
