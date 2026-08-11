import dayjs from "dayjs";
import styled from "styled-components";
import SkinScoreGauge from "./SkinScoreGauge";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DateText = styled.span`
  color: #7e7979;
  font-family: "Pretendard Variable";
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
`;

const PhotoLink = styled.button`
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  color: #a985e7;
  text-align: right;
  font-family: "Pretendard Variable";
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

const ScoreRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

const StatusTitle = styled.h3`
  margin: 0;
  color: #000;
  font-family: "Pretendard Variable";
  font-size: 17px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const StatusSummary = styled.p`
  margin: 0;
  color: #7a7686;
  font-family: "Pretendard Variable";
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const AskButton = styled.button`
  align-self: flex-start;
  display: inline-flex;
  padding: 4px 8px;
  align-items: center;
  gap: 10px;
  border: none;
  border-radius: 6px;
  background: #a985e7;
  margin-top: 19px;
  cursor: pointer;
  color: #fff;
  font-family: "Pretendard Variable";
  font-size: 13px;
  font-weight: 600;
`;

export default function SkinScoreSummary({
  date,
  score,
  statusText,
  statusSummary,
  onPhotoClick,
  onAskClick,
}) {
  return (
    <Wrapper>
      <TopRow>
        <DateText>{dayjs(date).format("YYYY년 M월 D일")}</DateText>
        <PhotoLink type="button" onClick={onPhotoClick}>
          사진 보기
        </PhotoLink>
      </TopRow>

      <ScoreRow>
        <SkinScoreGauge score={score} />
        <TextBlock>
          <StatusTitle>{statusText}</StatusTitle>
          <StatusSummary>{statusSummary}</StatusSummary>
          <AskButton type="button" onClick={onAskClick}>
            끼끼에게 질문하기 &gt;
          </AskButton>
        </TextBlock>
      </ScoreRow>
    </Wrapper>
  );
}