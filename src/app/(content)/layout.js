import MainHeader from "@/components/Mainheader";
import MainFoolter from "@/components/Mainfooter";

export const metadata = {
  title: "FbMRm",
  description: "Use FB Consultation Room",
};

export default function ContentLayout({ children }) {
  return (
    <div id="page">
      <MainHeader />
      {children}
      <MainFoolter />
    </div>
  );
}
