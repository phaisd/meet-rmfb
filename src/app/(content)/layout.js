import MainHeader from "@/components/Mainheader";

export const metadata = {
  title: "FbMRm",
  description: "Use FB Consultation Room",
};

export default function ContentLayout({ children }) {
  return (
    <div id="page">
      <MainHeader />
      {children}

    </div>
  );
}
