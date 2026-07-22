import { Table } from 'antd';
import type { TableProps } from 'antd';

export function DataTable<RecordType extends object>(
  props: TableProps<RecordType>,
) {
  return (
    <Table<RecordType>
      className="data-table"
      pagination={{ pageSize: 5, showSizeChanger: false, ...props.pagination }}
      scroll={{ x: 960, ...props.scroll }}
      {...props}
    />
  );
}
