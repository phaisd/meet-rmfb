import { getAvailableMeetsMonths, getAvailableMeetsYears } from "@/lib/meets";


export default async function FilterHeader({ year, month }) {
  const availableYears = await getAvailableMeetsYears();
  const availableMonths = year ? getAvailableMeetsMonths(year) : [];

  if (year && !availableYears.includes(year)) {
    throw new Error('ปีไม่ถูกต้อง');
  }
  if (month && !availableMonths.includes(month)) {
    throw new Error('เดือนไม่ถูกต้อง');
  }
  return (
    <header>
      <h3>ปี :{year} เดือน : {month || '-'}</h3>
      {/**ลิงค์สำหรับปี/เดือน */}

    </header>
  )
}