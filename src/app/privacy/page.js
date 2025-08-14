export default function PrivacyPolicyPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        นโยบายความเป็นส่วนตัว (Privacy Policy)
      </h1>
      <p>
        เว็บไซต์นี้ให้ความสำคัญต่อการคุ้มครองข้อมูลส่วนบุคคลของผู้ใช้
        ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
      </p>
      <h2 className="text-xl font-semibold mt-4 mb-2">
        1. การเก็บรวบรวมข้อมูล
      </h2>
      <p>
        เราเก็บข้อมูลที่จำเป็น เช่น ชื่อ, อีเมล, เบอร์โทรศัพท์
        และข้อมูลการใช้งานเว็บไซต์
      </p>
      <h2 className="text-xl font-semibold mt-4 mb-2">
        2. วัตถุประสงค์ในการใช้ข้อมูล
      </h2>
      <p>ให้บริการและปรับปรุงเว็บไซต์</p>
      <h2 className="text-xl font-semibold mt-4 mb-2">3. การเปิดเผยข้อมูล</h2>
      <p>เราจะไม่เปิดเผยข้อมูลส่วนบุคคลของผู้ใช้ให้กับบุคคลภายนอก</p>
      <h2 className="text-xl font-semibold mt-4 mb-2">4. ระยะเวลาเก็บข้อมูล</h2>
      <p>เราจะเก็บข้อมูลเท่าที่จำเป็นตามวัตถุประสงค์</p>
      <h2 className="text-xl font-semibold mt-4 mb-2">
        5. สิทธิของเจ้าของข้อมูล
      </h2>
      <ul className="list-disc list-inside">
        <li>ขอเข้าถึงข้อมูล</li>
        <li>ขอแก้ไขข้อมูล</li>
        <li>ขอลบข้อมูล</li>
        <li>ถอนความยินยอม</li>
      </ul>
    </div>
  );
}
