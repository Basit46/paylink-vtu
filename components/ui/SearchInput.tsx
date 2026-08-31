"use client";

import { ComponentProps } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps extends Omit<ComponentProps<"input">, "className"> {
  className?: string;
  inputClassName?: string;
}

const SearchInput = ({
  className,
  inputClassName,
  type = "search",
  ...props
}: SearchInputProps) => {
  return (
    <label
      className={cn(
        "flex h-10 shrink-0 items-center gap-2.5 rounded-[10px] border border-border bg-card px-3.5",
        className,
      )}
    >
      <Search
        strokeWidth={1.75}
        className="size-4 shrink-0 text-muted-foreground"
      />
      <input
        type={type}
        className={cn(
          "w-full bg-transparent text-[14px] outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:appearance-none",
          inputClassName,
        )}
        {...props}
      />
    </label>
  );
};

export { SearchInput };
export type { SearchInputProps };
