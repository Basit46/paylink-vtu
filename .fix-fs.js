const fs = require("fs");
const p = "components/ui/FilterSelect.tsx";
let s = fs.readFileSync(p, "utf8");

s = s.replace(/^iimport /m, "import ");

const firstExport = 'export { FilterSelect, UserFilterSelect };';
const i = s.indexOf(firstExport);
if (i === -1) throw new Error("export not found");
s = s.slice(0, i + firstExport.length) + "\n";

s = s.replace("text-grey-600 font-normal", "font-normal text-muted-foreground");

const userDestructure = `const UserFilterSelect = ({
  align,
  options,
  placeholder = "All",
  triggerClassName,
  value,
  onValueChange,
  ...props
}: FilterSelectProps) => {`;
if (!s.includes(userDestructure)) throw new Error("UserFilterSelect no match");
s = s.replace(
  userDestructure,
  `const UserFilterSelect = ({
  align,
  options,
  placeholder = "All",
  triggerPrefix,
  triggerClassName,
  contentClassName,
  value,
  onValueChange,
  disableAll,
  extraContentChildren,
  ...props
}: FilterSelectProps) => {`
);

s = s.replace(
  `      <SelectContent align={align || "center"} className="min-w-[180px]">
        {!hasAllOption && <SelectItem value="all">All</SelectItem>}`,
  `      <SelectContent
        align={align || "center"}
        className={cn("min-w-[180px]", contentClassName)}
      >
        {!hasAllOption && !disableAll && (
          <SelectItem value="all">All</SelectItem>
        )}`
);

s = s.replace(
  `            {option.label}
            {option.role && (`,
  `            {triggerPrefix ? null : null}
            {option.label}
            {option.role && (`
);
s = s.replace("            {triggerPrefix ? null : null}\n", "");

s = s.replace(
  `        ))}
      </SelectContent>
    </Select>
  );
};

export { FilterSelect, UserFilterSelect };`,
  `        ))}

        {extraContentChildren}
      </SelectContent>
    </Select>
  );
};

export { FilterSelect, UserFilterSelect };`
);

s = s.replace(/\n\n\n+/g, "\n\n");
fs.writeFileSync(p, s);
console.log("ok");
