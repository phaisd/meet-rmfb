import {
  getAvailableMeetsYears,
  getAvailableMeetsMonths,
  getMeetsForYear,
  getMeetsForYearAndMonth,
} from "@/lib/meets";
import MeetsList from "@/components/MeetsList";

export default async function ArchiveFilterPage({ params }) {
  const { filter } = await params;

  let selectedYear;
  let selectedMonth;

  if (filter?.length > 0) {
    selectedYear = filter[0];
  }
  if (filter?.length > 1) {
    selectedMonth = filter[1];
  }

  const availableYears = await getAvailableMeetsYears();
  if (selectedYear && !availableYears.includes(selectedYear)) {
    throw new Error("Invalid year selected");
  }

  if (selectedMonth) {
    const availableMonth = await getAvailableMeetsMonths(selectedYear);
    if (!availableMonth.includes(selectedMonth)) {
      throw new Error("Invaied month seleted");
    }
  }

  let links = [];

  if (!selectedYear) {
    //ยังไม่เลือกปี -> แสดงลิงค์รายปีทั้งหมด
    links = (await getAvailableMeetsYears()).map((year) => ({
      label: year,
      href: `/archive/${year}`,
    }));
  } else if (selectedYear && !selectedMonth) {
    //เลือกปีแล้ว -> แสดงลิงค์รายเดือนของปีนั้น
    links = (await getAvailableMeetsMonths(selectedYear)).map((month) => ({
      label: ` ${month}`,
      href: `/archive/${selectedYear}/${month}`,
    }));
  }

  let meets;

  if (selectedYear && !selectedMonth) {
    meets = await getMeetsForYear(selectedYear);
  } else if (selectedYear && selectedMonth) {
    meets = await getMeetsForYearAndMonth(selectedYear, selectedMonth);
  }

  let meetsContent = <p>No Meets found for the selected period</p>;

  if (meets && meets.length > 0) {
    meetsContent = <MeetsList meets={meets} />;
  }

  if (!meetsContent) {
    meetsContent = <p>Loading...</p>;
  }

  return (
    <>
      <header id="archive-header">
        <div>
          <h1>Archive Filter Page</h1>
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </header>

      {meetsContent}
    </>
  );
}
