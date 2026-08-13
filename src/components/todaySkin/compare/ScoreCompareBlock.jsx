import styled from "styled-components";
import chevronDown from "../../../assets/icons/calendar_chevron_down.svg";

const Row = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  width: 354px;
`;

const Column = styled.div`
  display: flex;
  width: 165px;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const DatePill = styled.button`
  display: flex;
  width: 158px;
  height: 30px;
  padding: 8px 16px;
  justify-content: space-between;
  align-items: center;
  border-radius: 16px;
  border: 1px solid #d9d9d9;
  background: #fff;
  cursor: pointer;
  box-sizing: border-box;
`;

const DateText = styled.span`
  color: #000;
  font-family: "Pretendard Variable";
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const ChevronIcon = styled.img`
  width: 15px;
  height: 15px;
`;

const Photo = styled.div`
  width: 165px;
  height: 220px;
  aspect-ratio: 3 / 4;
  margin-top: 19px;
  border-radius: 18px;
  overflow: hidden;
  background: #d9d9d9;
  box-sizing: border-box;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const ScoreRow = styled.div`
  display: flex;
  align-items: baseline;
  margin-top: 12px;
`;

const ScoreNumber = styled.span`
  color: #a985e7;
  font-family: "Pretendard Variable";
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

const ScoreUnit = styled.span`
  color: #a985e7;
  font-family: "Pretendard Variable";
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const StatusText = styled.p`
  margin: 8px 0 0;
  color: #000;
  font-family: "Pretendard Variable";
  font-size: 17px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

// dateLabel: "2026년 8월 1일" 같은 포맷된 문자열
function ScoreCompareColumn({ dateLabel, photoUrl, score, statusText, onDateClick }) {
  return (
    <Column>
      <DatePill type="button" onClick={onDateClick}>
        <DateText>{dateLabel}</DateText>
        <ChevronIcon src={chevronDown} alt="" />
      </DatePill>
      <Photo>{photoUrl && <img src={photoUrl} alt="" />}</Photo>
      <ScoreRow>
        <ScoreNumber>{score} </ScoreNumber>
        <ScoreUnit> 점</ScoreUnit>
      </ScoreRow>
      <StatusText>{statusText}</StatusText>
    </Column>
  );
}

// past, current: { dateLabel, photoUrl, score, statusText }
export default function ScoreCompareBlock({ past, current, onSelectPastDate, onSelectCurrentDate }) {
  return (
    <Row>
      <ScoreCompareColumn
        dateLabel={past.dateLabel}
        photoUrl={past.photoUrl}
        score={past.score}
        statusText={past.statusText}
        onDateClick={onSelectPastDate}
      />
      <ScoreCompareColumn
        dateLabel={current.dateLabel}
        photoUrl={current.photoUrl}
        score={current.score}
        statusText={current.statusText}
        onDateClick={onSelectCurrentDate}
      />
    </Row>
  );
}