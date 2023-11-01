"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { CopyIcon, CaretSortIcon } from "@radix-ui/react-icons";

import { Button, Badge, Badges } from "@/components/ui";

export type Consumer = {
  groupId: string;
  protocol: string;
  members: string[];
  subscribedTopics: string[];
  state: string;
};

export const consumerColumns: ColumnDef<Consumer>[] = [
  {
    accessorKey: "groupId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Group ID
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const groupId = row.original.groupId;
      return (
        <p>
          {groupId}{" "}
          <Button
            onClick={() => navigator.clipboard.writeText(groupId)}
            variant={"ghost"}
          >
            <CopyIcon className="ml-2 inline h-4 w-4" />
          </Button>
        </p>
      );
    },
  },
  {
    accessorKey: "protocol",
    header: "Protocol",
  },
  {
    accessorKey: "members",
    header: "Members",
    cell: ({ row }) => {
      const members = row.original.members;
      return (
        <Badges length={4}>
          {members.map((mem) => (
            <Badge key={mem}>{mem}</Badge>
          ))}
        </Badges>
      );
    },
  },
  {
    id: "subscribedTopics",
    header: "subscribedTopics",
    cell: ({ row }) => {
      const topics = row.original.subscribedTopics;
      return (
        <Badges length={4}>
          {topics.map((topic) => (
            <Badge key={topic}>{topic}</Badge>
          ))}
        </Badges>
      );
    },
  },
  {
    id: "state",
    header: "State",
  },
];
