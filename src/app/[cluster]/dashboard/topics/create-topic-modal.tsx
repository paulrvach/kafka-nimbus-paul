import { useState, type ChangeEvent } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Heading,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { useAppDispatch, useAppSelector } from "~/app/_redux/hooks";
import {
  settopicName,
  settopicPartitions,
  settopicReplications,
} from "~/app/_redux/slices/createSingleTopicSlice";
import { api } from "~/trpc/react";
import { PlusCircledIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

const CreateTopicModal = ({ clusterId }: { clusterId: string }) => {
  const dispatch = useAppDispatch();
  const createTopic = useAppSelector((state) => state.createTopic);
  const createNewTopic = api.topic.createTopic.useMutation();
  const replicationAmount = new Array(10).fill("x");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // creates a new topic
  const createTopicHandler = async () => {
    const { name, numPartitions, replicationFactor } = createTopic;
    setLoading(true);
    // api call
    await createNewTopic.mutateAsync({
      id: clusterId,
      topicName: name,
      numPartitions: numPartitions,
      replicationFactor: replicationFactor,
    });
    router.refresh();
    setLoading(false);
  };
  // keeps track of partition change
  const partitionChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.currentTarget.value);
    dispatch(settopicPartitions(parseInt(event.currentTarget.value)));
  };

  // keeps track of replication change
  const replicationChangeHandler = (value: string) => {
    console.log(value);
    dispatch(settopicReplications(parseInt(value)));
  };

  // keeps track of name change
  const nameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.currentTarget.value);
    dispatch(settopicName(event.currentTarget.value));
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button>
          <PlusCircledIcon className="mr-2 inline" /> Create Topic
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create new topic.
            <p className=" text-sm text-muted-foreground">
              Provide the required details to deploy a new topic to the cluster.
            </p>
          </DialogTitle>
        </DialogHeader>

        <DialogDescription className="flex flex-col gap-8 ">
          <div className="flex flex-col gap-2">
            <Label className="text-md text-white">Topic Name</Label>
            <Input
              placeholder="Topic Name"
              type="text"
              onChange={nameChangeHandler}
            />
            <p className="text-sm text-muted-foreground ">
              This is the identifier for the data category or stream that you
              want to create within the Kafka cluster.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-md text-white">Partitions</Label>
            <Input
              placeholder="Partitions"
              type="number"
              onChange={partitionChangeHandler}
            />

            <p className=" text-sm text-muted-foreground">
              Increasing the partition count can enhance throughput and
              parallelism for handling data within the topic.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-md text-white">Replication Factor</Label>
            <Select onValueChange={replicationChangeHandler}>
              <SelectTrigger className="">
                <SelectValue placeholder="Replication Factor" />
              </SelectTrigger>
              <SelectContent>
                {replicationAmount.map((num, i) => (
                  <SelectItem
                    value={`${i + 1}`}
                    key={`rep_select_item_${i + 1}`}
                  >
                    {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className=" text-sm text-muted-foreground">
              A higher replication factor ensures fault tolerance by creating
              redundant copies of data across different brokers, allowing for
              resilience against node failures.
            </p>
          </div>
        </DialogDescription>
        <DialogFooter>
          {!loading ? (
            <Button onClick={createTopicHandler}>Create</Button>
          ) : (
            <Button disabled>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTopicModal;
