"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { CopyIcon, CaretSortIcon } from "@radix-ui/react-icons";

import { Button, Badge, Badges } from "@/components/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Offsets = {
  partition: number;
  offset: string;
  high: string;
  low: string;
};

export type Topic = {
  name: string;
  offsets: Offsets[];
  partitions: object[];
};

const calculateOffset = (offsets: Array<Offsets>): number => {
  let totalOffset = 0;
  for (const partitions of offsets) {
    const offset = Number(partitions.offset);
    totalOffset += offset;
  }
  return totalOffset;
};

export const topicsColumns: ColumnDef<Topic>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const groupId = row.original.name;
      return (
        <p>
          {groupId} <CopyIcon className="ml-2 inline h-4 w-4" />
        </p>
      );
    },
  },
  {
    accessorKey: "offsets",
    header: "Offsets",
    cell: ({ row }) => {
      const offset = calculateOffset(row.original.offsets);

      return <p>{offset}</p>;
    },
  },

  {
    accessorKey: "partitions",
    header: "Partitions",
    cell: ({ row }) => {
      return <p>{row.original.partitions.length}</p>;
    },
  },
];
