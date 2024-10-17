"use client"

import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { LlmList } from "@/app/api/ollama/route";
import { useAppDispatch } from '../lib/hooks'
import { selectvalue } from "@/lib/features/Llm/LlmSelect";
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import Loader from "./ui/Loader";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


export function ComboboxDemo({ svalue }) {
  const [open, setOpen] = React.useState(false)
  const [Loading, setLoading] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [LlmLists, setLlmLists] = React.useState([])

  React.useEffect(() => {
    setLoading(true)
    const lllm = async () => {

      let a = await LlmList()
      if (a.models.length === 0) {
      
        setLlmLists(prevLlmLists => {
          if (a.models.length !== prevLlmLists.length) {
            return a.models.map(element => ({
              value: element.model,
              label: element.name
            }))
        }
        return prevLlmLists
      })
    }
  }
  
    lllm()
    setLoading(false)
  }, [open])



  React.useEffect(() => {
    setValue(svalue)
  }, [svalue])

  const dispatch = useAppDispatch()


  return (
    <Popover open={open} onOpenChange={setOpen} >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? LlmLists.find((llm) => llm.value === value)?.label
            : "Select llm"}

          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command >
          <CommandInput placeholder="Search llm..." className="h-9" />
          <CommandList className='pb-1.5'>
            {!Loading && LlmLists.length === 0 && <CommandEmpty>No local llms found.</CommandEmpty>}

            <CommandGroup>
              {LlmLists.map((llm) => (
                <CommandItem
                  key={llm.value}
                  value={llm.value}
                  onSelect={(currentValue) => {
                    const newValue = currentValue === value ? "" : currentValue;
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    dispatch(selectvalue(newValue))
                  }}
                >
                  {llm.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === llm.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            {Loading && <Loader />}

          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}






