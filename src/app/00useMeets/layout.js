export default function useMeetsLayout({ meetAll, meetToday }) {
  return (
    <>
      <h1>Meets Use Pages</h1>
      <p>Use this page to manage and view meets.</p>
      <section id="archive-filter">{meetAll}</section>
      <section id="archive-latest">{meetToday}</section>
    </>
  );
}
