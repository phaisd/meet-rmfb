export default function useMeetsLayout({ meetToday, meetsAll }) {
  return (
    <>
      <section id="archive-filter">{meetToday}</section>
      <section id="archive-latest">{meetsAll}</section>
    </>
  );
}
