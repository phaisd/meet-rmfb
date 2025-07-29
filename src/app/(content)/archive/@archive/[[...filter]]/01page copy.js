import FilterHeader from "@/components/FilterHeader";
import FitleredMeets from "@/components/FilterMeets";
import { Suspense } from "react";

export default function FilterPage({ params }) {
  const { year, month } = params;

  return (
    <>
      <Suspense fallback={<p>กำลังโหลดหัวข้อ...</p>}>
        <FilterHeader year={year} month={month} />
      </Suspense>

      <Suspense fallback={<p>กำลังโหลดการใช้ห้องประชุม...</p>}>
        <FitleredMeets year={year} month={month} />
      </Suspense>

    </>
  );
}