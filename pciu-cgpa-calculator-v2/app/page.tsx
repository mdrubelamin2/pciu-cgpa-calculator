import Chart from "./components/Chart";
import DetailsModal from "./components/DetailsModal";
import GpaHistory from "./components/GpaHistory";
import SearchID from "./components/SearchID";

export default function Home() {
  return (
    <main>
      {/* <div className="before-search"> */}
      <div>
        <div className="main-container ">
          <Heading />
          <div className="content-container">
            <SearchID />
            <GpaHistory />
          </div>

          <Chart />
        </div>
        <DetailsModal />
      </div>
    </main>
  );
}

const Heading = () => {
  return (
    <>
      <div className="header-section">
        <h1 className="header-title">CGPA Calculator</h1>
        <p className="header-subtitle">
          Port City International University, Chattogram
        </p>
      </div>
    </>
  );
};
