import axios from "axios";
import { parse } from "node-html-parser";
import Chart from "./components/Chart";
import DetailsModal from "./components/DetailsModal";
import SearchID from "./components/SearchID";
import { currentPublishedResultSemester, trimestersList } from "./utils/helper";

export default async function Home() {
  const getTrimestersList = await trimestersList();
  console.log({ getTrimestersList });
  const getCurPublishedResSemester = await currentPublishedResultSemester();
  console.log({ getCurPublishedResSemester });

  return (
    <main>
      {/* <div className="before-search"> */}
      <>
        <div className="main-container ">
          <Heading />
          <div className="content-container">
            <SearchID />
            {/* <GpaHistory /> */}
          </div>

          <Chart />
        </div>
        <DetailsModal />
      </>
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
