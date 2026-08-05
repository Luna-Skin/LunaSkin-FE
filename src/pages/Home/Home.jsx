// pages/Home/Home.jsx (테스트용 임시 코드 - 이슈 3에서 정식으로 교체됩니다)
import CalendarView from "../../components/home/CalendarView";
import { MOCK_PERIOD_CYCLES, MOCK_SKIN_RECORDS } from "../../mocks/homeMock";

export default function Home() {
  return (
    <div>
      <CalendarView periodCycles={MOCK_PERIOD_CYCLES} skinRecords={MOCK_SKIN_RECORDS} />
    </div>
  );
}