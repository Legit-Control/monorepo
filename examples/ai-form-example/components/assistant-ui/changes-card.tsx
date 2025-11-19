import { useLegitFs } from '@legit-sdk/assistant-ui';
import { useAssistantState } from '@assistant-ui/react';
import { FC, useEffect, useState } from 'react';

const ChangesCard: FC = () => {
  const messageId = useAssistantState(({ message }) => message.id);
  const { legitFs, getMessageDiff, getPastState } = useLegitFs();
  const [diff, setDiff] = useState<DiffMap | undefined>(undefined);

  const ignoreKeys = ['hidden'];

  type DiffEntry = {
    old: string;
    new: string;
    operation: 'new' | 'deleted' | 'changed';
  };

  type DiffMap = Record<string, DiffEntry>;

  useEffect(() => {
    const logOperationHistory = async () => {
      const diff = await getMessageDiff(messageId);
      if (!diff?.newOid || !diff?.oldOid) return;

      const [newStateRaw, oldStateRaw] = await Promise.all([
        getPastState(diff.newOid, '/form-values.json'),
        getPastState(diff.oldOid, '/form-values.json'),
      ]);
      if (!newStateRaw && !oldStateRaw) return;

      const newState = newStateRaw ? JSON.parse(newStateRaw) : {};
      const oldState = oldStateRaw ? JSON.parse(oldStateRaw) : {};

      const keys = new Set([
        ...Object.keys(newState),
        ...Object.keys(oldState),
      ]);
      const atomicDiff: DiffMap = {};

      for (const key of keys) {
        const newVal = newState[key];
        const oldVal = oldState[key];
        if (ignoreKeys.includes(key)) continue;
        if (newVal !== oldVal) {
          if (oldVal === null || oldVal === undefined || oldVal === '') {
            atomicDiff[key] = { old: '', new: newVal, operation: 'new' };
          } else if (newVal === null || newVal === undefined || newVal === '') {
            atomicDiff[key] = { old: oldVal, new: '', operation: 'deleted' };
          } else {
            atomicDiff[key] = {
              old: oldVal,
              new: newVal,
              operation: 'changed',
            };
          }
        }
      }
      setDiff(atomicDiff);
    };

    if (legitFs) {
      logOperationHistory();
    }
  }, [messageId, legitFs]);

  if (!diff) return null;

  return (
    <div className="text-sm border border-gray-200 rounded-lg mr-20 mb-3">
      <h2 className="flex h-12 items-center px-3 gap-2 border-b border-gray-200 font-medium">
        <span className="bg-gray-200 px-2 rounded">
          {`${Object.entries(diff).length}`}
        </span>
        Changes
      </h2>
      <div className="py-2">
        {Object.entries(diff).map(([key, value]) => {
          const color =
            value.operation === 'new'
              ? 'text-green-500'
              : value.operation === 'deleted'
                ? 'text-red-500'
                : 'text-blue-500';
          const bgColor =
            value.operation === 'new'
              ? 'bg-green-100'
              : value.operation === 'deleted'
                ? 'bg-red-100'
                : 'bg-blue-100';
          return (
            <div key={key} className="px-3 py-2 flex gap-2">
              <h3 className={`${color} ${bgColor} px-2 rounded w-fit h-fit`}>
                {key}
              </h3>
              {value.old.length === 0 ? (
                <i className="text-gray-400">Empty</i>
              ) : (
                value.old
              )}
              <span className="text-gray-400">→</span>
              {value.new.length === 0 ? (
                <i className="text-gray-400">Empty</i>
              ) : (
                value.new
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { ChangesCard };
