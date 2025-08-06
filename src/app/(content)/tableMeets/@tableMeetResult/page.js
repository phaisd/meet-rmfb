"use client";

import { db } from "@/lib/firebaseConfig";
import { ref, onValue } from "firebase/database";
import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  LabelList,
} from "recharts";

export default function MonthlySummaryAllViews() {
  const [meetsList, setMeetsList] = useState([]);
  const [selectedYear, setSelectedYear] = useState("ทั้งหมด");

  const thaiMonthNames = {
    "01": "มกราคม",
    "02": "กุมภาพันธ์",
    "03": "มีนาคม",
    "04": "เมษายน",
    "05": "พฤษภาคม",
    "06": "มิถุนายน",
    "07": "กรกฎาคม",
    "08": "สิงหาคม",
    "09": "กันยายน",
    10: "ตุลาคม",
    11: "พฤศจิกายน",
    12: "ธันวาคม",
  };

  const getThaiShortMonth = (monthNumber) => {
    const months = [
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ];
    return months[parseInt(monthNumber, 10) - 1] || "";
  };

  function getThaiMonth(month) {
    return thaiMonthNames[month] || month;
  }

  useEffect(() => {
    const meetsRef = ref(db, "Request_Meeting");
    const unsubscribe = onValue(meetsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const monthNumbers = {
          มกราคม: "01",
          กุมภาพันธ์: "02",
          มีนาคม: "03",
          เมษายน: "04",
          พฤษภาคม: "05",
          มิถุนายน: "06",
          กรกฎาคม: "07",
          สิงหาคม: "08",
          กันยายน: "09",
          ตุลาคม: "10",
          พฤศจิกายน: "11",
          ธันวาคม: "12",
        };

        const sorted = Object.entries(data)
          .map(([id, item]) => {
            let dateObj = new Date(0);
            if (item.dateUse) {
              const [day, monthName, year] = item.dateUse.split("-");
              const month = monthNumbers[monthName] || "01";
              dateObj = new Date(`${year}-${month}-${day}`);
              return { id, ...item, _date: dateObj };
            }
            return null;
          })
          .filter(Boolean)
          .sort((a, b) => b._date - a._date);

        setMeetsList(sorted);
      } else {
        setMeetsList([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // สร้างปีทั้งหมด (สำหรับ dropdown)
  const allYears = Array.from(
    new Set(meetsList.map((item) => (item.dateUse || "").split("-")[2]))
  ).filter(Boolean);

  // สร้าง summary ใช้สำหรับ chart
  const summary = meetsList.reduce((acc, item) => {
    const [day, month, year] = (item.dateUse || "").split("-");
    const key = `${month}-${year}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // กรองตามปีที่เลือก
  const filteredSummary = Object.entries(summary).filter(([key]) => {
    const [month, year] = key.split("-");
    return selectedYear === "ทั้งหมด" || year === selectedYear;
  });

  // เรียงเดือนตามลำดับที่ถูกต้อง
  const sortedSummary = filteredSummary.sort((a, b) => {
    const [monthA, yearA] = a[0].split("-");
    const [monthB, yearB] = b[0].split("-");
    const yearDiff = parseInt(yearA) - parseInt(yearB);
    return yearDiff !== 0 ? yearDiff : parseInt(monthA) - parseInt(monthB);
  });

  // แปลงข้อมูลไปใช้กับ BarChart
  const chartData = sortedSummary.map(([monthYear, count]) => {
    const [month] = monthYear.split("-");
    return {
      name: getThaiMonth(month),
      value: count,

      // const [month] = monthYear.split("-");
      // return {
      //   name: getThaiShortMonth(month),
      //   value: count,
    };
  });

  // ✅ สำหรับกราฟวงกลม ใช้ forUse
  const forUseSummary = meetsList.reduce((acc, item) => {
    const key = item.forUse?.trim() || "ไม่ระบุ";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = Object.entries(forUseSummary).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#8dd1e1",
    "#d0ed57",
    "#a4de6c",
    "#d8854f",
    "#f36c6c",
    "#ad6ae6",
  ];

  return (
    <div>
      <h1>สรุปการขอใช้ห้องประชุม</h1>
      <p style={{ textAlign: "center" }}>
        ตารางและกราฟแท่งจาก วันใช้งาน, กราฟวงกลมจาก ใช่สำหรับ
      </p>

      {/* ✅ ตัวกรองปี */}
      <div style={{ marginBottom: "0.5rem", textAlign: "center" }}>
        <label>กรองตามปี: </label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="ทั้งหมด">ทั้งหมด</option>
          {allYears.sort().map((year) => (
            <option key={year} value={year}>
              {parseInt(year) + 543}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
          justifyContent: "center",
        }}
      >
        {/* ✅ กราฟแท่ง */}
        <div style={{ flex: "1 1 400px", minWidth: "300px", height: "300px" }}>
          <h3 style={{ textAlign: "center" }}>สรุปการใช้แต่ละเดือน</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" interval={0} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value">
                <LabelList dataKey="value" position="top" />
                {chartData.map((entry, index) => (
                  <Cell
                    key={`bar-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ✅ กราฟวงกลม */}
        <div style={{ flex: "1 1 400px", minWidth: "300px", height: "300px" }}>
          <h3 style={{ textAlign: "center" }}>ขอใช้ห้องสำหรับ </h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
