import { useLegitApi } from '@/lib/legit/context';
import { useAssistantState } from '@assistant-ui/react';
import { HistoryItem } from '@legit-sdk/core';
import { useEffect, useState } from 'react';

const Changes = () => {
  const message = useAssistantState(({ message }) => message);
  const messageIndex = useAssistantState(({ thread }) =>
    thread.messages.findIndex(m => m.id === message.id)
  );
  const nextMessageCreatedAt = useAssistantState(
    ({ thread }) => thread.messages.at(messageIndex + 1)?.createdAt
  );
  const messageCreatedAt = message.createdAt;
  const { getRawHistory } = useLegitApi();
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const history = await getRawHistory();
      setHistory(JSON.parse(history));
    };
    if (message.status.type === 'complete') {
      setTimeout(() => {
        // wait for the history to be ready - TODO: make this more robust
        fetchHistory();
      }, 500);
    }
  }, [message.status]);

  useEffect(() => {
    if (history && history.length > 0) {
      console.log('history for message', message.id, history);
    }
  }, [history]);

  // useEffect(() => {
  //   if (history && history.length > 0 && messageCreatedAt) {
  //     const messageDate = new Date(messageCreatedAt)?.getTime();
  //     const nextMessageDate = nextMessageCreatedAt
  //       ? new Date(nextMessageCreatedAt)?.getTime()
  //       : null;

  //     console.log('messageDate', messageDate);
  //     console.log('nextMessageDate', nextMessageDate);

  //     console.log('before', history);

  //     const filteredHistory = history.filter(item => {
  //       console.log(
  //         'id',
  //         item.oid,
  //         'date',
  //         new Date(item.author.timestamp * 1000)?.getTime()
  //       );
  //       const itemDate = new Date(item.author.timestamp * 1000)?.getTime();
  //       return (
  //         itemDate > messageDate &&
  //         (nextMessageDate ? itemDate < nextMessageDate : true)
  //       );
  //     });
  //     console.log('after', filteredHistory);
  //   }
  // }, [history, messageCreatedAt, nextMessageCreatedAt]);

  const relevantToolCallNames = ['set_form_field'];
  // check if message has parts with the key 'tool_call' and toolName is in relevantToolCallNames
  // if not don't render anything
  const relevantToolCallParts = message.parts.filter(
    (part: any) =>
      part.type === 'tool-call' && relevantToolCallNames.includes(part.toolName)
  );

  // use the createdAt date and the legit history to get the last commit before the createdAt date

  // if all of them are status complete, render a list of the changes
  if (
    relevantToolCallParts.length > 0 &&
    relevantToolCallParts.every((part: any) => part.status.type === 'complete')
  ) {
    return <div>Changes {JSON.stringify(relevantToolCallParts)}</div>;
  }

  return null;
};

export default Changes;
