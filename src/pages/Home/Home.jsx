import Header from "../../components/home/Header";
import UserInfo from "../../components/home/UserInfo";
import CalendarView from "../../components/home/CalendarView";
import { MOCK_USER, MOCK_PERIOD_CYCLES, MOCK_SKIN_RECORDS } from "../../mocks/homeMock";

export default function Home() {
  return (
    <div>
      <Header />
      <UserInfo name={MOCK_USER.name} skinType={MOCK_USER.skinType} skinConcerns={MOCK_USER.skinConcerns} />
      <CalendarView periodCycles={MOCK_PERIOD_CYCLES} skinRecords={MOCK_SKIN_RECORDS} />
    </div>
  );
}
