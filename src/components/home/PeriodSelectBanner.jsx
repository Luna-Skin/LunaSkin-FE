import styled from "styled-components";

const Banner = styled.div`
  width: 354px;
  margin: 0 auto 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f0e8ff;
  border-radius: 12px;
  padding: 10px 14px;
  box-sizing: border-box;
`;

const Message = styled.span`
  color: #5b3e96;
  font-family: "Pretendard Variable";
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const CancelButton = styled.button`
  border: none;
  background: none;
  padding: 4px;
  cursor: pointer;
  color: #5b3e96;
  font-family: "Pretendard Variable";
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

export default function PeriodSelectBanner({ message, onCancel }) {
  return (
    <Banner>
      <Message>{message}</Message>
      <CancelButton type="button" onClick={onCancel}>
        취소
      </CancelButton>
    </Banner>
  );
}