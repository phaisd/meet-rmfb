import { getMeetsForYear, getMeetsForYearAndMonth } from "@/lib/meets";
import MeetsList from "./MeetsList";

export default async function FitleredMeets({ year, month }) {
  let meets;
  if (year && !month) {
    meets = await getMeetsForYear(year);

  } else if (year && month) {
    meets = await getMeetsForYearAndMonth(year, month);
  }
  //  else {
  //   meets = [];
  // }

  let meetsContent = <p>No found for the selected period</p>
  if (meets && meets.length > 0) {
    meetsContent = <MeetsList meets={meets} />;
  }

  return meetsContent;

}