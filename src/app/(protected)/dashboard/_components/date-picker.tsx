"use client";

import { addMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { parseAsIsoDate, useQueryState } from "nuqs";
import * as React from "react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function DatePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const today = React.useMemo(() => new Date(), []);
  const nextMonth = React.useMemo(() => addMonths(today, 1), [today]);

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: today,
    to: nextMonth,
  });

  const [from] = useQueryState("from", parseAsIsoDate.withDefault(today));
  const [to] = useQueryState("to", parseAsIsoDate.withDefault(nextMonth));

  const handleDateSelect = async (dateRange: DateRange | undefined) => {
    setDate(dateRange);

    if (!dateRange) return;

    try {
      const searchParams = new URLSearchParams(window.location.search);

      if (dateRange.from) {
        searchParams.set("from", dateRange.from.toISOString().split("T")[0]);
      }

      if (dateRange.to) {
        searchParams.set("to", dateRange.to.toISOString().split("T")[0]);
      }

      const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
      window.history.pushState({}, "", newUrl);
    } catch (error) {
      console.error("Error updating dates:", error);
    }
  };

  React.useEffect(() => {
    setDate({ from, to });
  }, [from, to]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd 'de' MMMM", {
                    locale: ptBR,
                  })}{" "}
                  -{" "}
                  {format(date.to, "dd 'de' MMMM", {
                    locale: ptBR,
                  })}
                </>
              ) : (
                format(date.from, "dd 'de' MMMM", { locale: ptBR })
              )
            ) : (
              <span>Selecione um período</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
