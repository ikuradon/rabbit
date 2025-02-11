import { Component } from 'solid-js';

import GlobeAlt from 'heroicons/24/outline/globe-alt.svg';

import BasicColumnHeader from '@/components/column/BasicColumnHeader';
import Column from '@/components/column/Column';
import ColumnSettings from '@/components/column/ColumnSettings';
import Timeline from '@/components/timeline/Timeline';
import { RelaysColumnType } from '@/core/column';
import { applyContentFilter } from '@/core/contentFilter';
import useConfig from '@/core/useConfig';
import { useTranslation } from '@/i18n/useTranslation';
import useSubscription from '@/nostr/useSubscription';
import epoch from '@/utils/epoch';

type RelaysColumnDisplayProps = {
  columnIndex: number;
  lastColumn: boolean;
  column: RelaysColumnType;
};

const RelaysColumn: Component<RelaysColumnDisplayProps> = (props) => {
  const i18n = useTranslation();
  const { removeColumn } = useConfig();

  const { events } = useSubscription(() => ({
    relayUrls: props.column.relayUrls,
    filters: [
      {
        kinds: [1, 6],
        limit: 25,
        since: epoch() - 4 * 60 * 60,
      },
    ],
    clientEventFilter: (event) => {
      if (props.column.contentFilter == null) return true;
      return applyContentFilter(props.column.contentFilter)(event.content);
    },
  }));

  return (
    <Column
      header={
        <BasicColumnHeader
          name={props.column.name ?? i18n()('column.relay')}
          icon={<GlobeAlt />}
          settings={() => <ColumnSettings column={props.column} columnIndex={props.columnIndex} />}
          onClose={() => removeColumn(props.column.id)}
        />
      }
      width={props.column.width}
      columnIndex={props.columnIndex}
      lastColumn={props.lastColumn}
    >
      <Timeline events={events()} />
    </Column>
  );
};

export default RelaysColumn;
