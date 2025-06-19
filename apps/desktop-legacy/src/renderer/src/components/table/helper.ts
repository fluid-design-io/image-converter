/* eslint-disable import/prefer-default-export */
import { Row } from '@tanstack/react-table';

export const getRowRange = (
  rows: Row<any>[],
  currentID: number,
  selectedID: number,
): Row<any>[] => {
  const rangeStart = selectedID > currentID ? currentID : selectedID;
  const rangeEnd = rangeStart === currentID ? selectedID : currentID;
  return rows.slice(rangeStart, rangeEnd + 1);
};
