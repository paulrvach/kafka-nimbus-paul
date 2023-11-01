import React from "react";
import { Card, Skeleton, Heading } from "@/components/ui";


const LoadingCard = () => {
  return (
    <Card.Root variant={"outlined"} className={`max-h-[245px] `}>
      <Card.Media className="h-full w-full"></Card.Media>
      <Card.Header className="">
        <Heading.Root className="items-start">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </Heading.Root>
      </Card.Header>
      <Card.Text>
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </Card.Text>
    </Card.Root>
  );
};

export default LoadingCard;
