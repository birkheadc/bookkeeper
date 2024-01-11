import { Range } from "../../types/range/range";

export default function sortedArrayToArrayOfRange(items: number[]): Range<number>[] {
  const ranges: Range<number>[] = [];

  let i = 1;
  let range: Range<number> = {
    from: items[0],
    to: items[0]
  }
  while (i < items.length) {
    const item = items[i];
    if (item === range.to + 1) {
      range.to = item;
    } else {
      ranges.push({...range});
      range.from = item;
      range.to = item;
    }
    i++;
  }
  ranges.push(range);
  return ranges;
}