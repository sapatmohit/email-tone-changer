import React, { forwardRef } from "react";
import { Textarea } from "../../src/component/ui/textarea";
import { cn } from "../../src/lib/utils";

export const EmailInput = forwardRef((props, ref) => {
  const { label, subtext, error, className, ...rest } = props;

  return (
    <div className="space-y-2">
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
      </div>
      <Textarea
        ref={ref}
        className={cn(
          "min-h-[150px] resize-none transition-all focus-visible:ring-purple-500",
          error ? "border-red-500 focus-visible:ring-red-500" : "",
          className
        )}
        {...rest}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
});

EmailInput.displayName = "EmailInput";
