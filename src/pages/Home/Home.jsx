import Header from "../../components/home/Header";
import CalendarView from "../../components/home/CalendarView";
import { MOCK_PERIOD_CYCLES, MOCK_SKIN_RECORDS } from "../../mocks/homeMock";

export default function Home() {
  return (
    <div>
      <Header />
      <CalendarView
        periodCycles={MOCK_PERIOD_CYCLES}
        skinRecords={MOCK_SKIN_RECORDS}
      />
    </div>
  );
}
