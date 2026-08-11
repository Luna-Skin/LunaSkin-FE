import styled from "styled-components";
import plusIcon from "../../assets/icons/record_plus.svg";
import editIcon from "../../assets/icons/record_edit.svg";

const Row = styled.button`
  display: flex;
  width: 350px;
  height: 59px;
  padding: 16px;
  align-items: center;
  justify-content: space-between;
  border: none;
  border-bottom: 1px dashed #ede8f8;
  background: #fff;
  cursor: pointer;
  box-sizing: border-box;
`;

const Label = styled.span`
  color: #000;
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

const ValueGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ValueText = styled.span`
  color: #000;
  text-align: right;
  font-family: "Pretendard Variable";
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const IconCircle = styled.span`
  display: flex;
  width: 26px;
  height: 26px;
  padding: 8px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 1000px;
  background: #f0e8ff;
  box-sizing: border-box;

  img {
    display: block;
    width: 10px;
    height: 10px;
  }
`;

export default function RecordListRow({ label, value, onClick }) {
  const isSet = value !== null && value !== undefined && value !== "";

  return (
    <Row type="button" onClick={onClick}>
      <Label>{label}</Label>
      {isSet ? (
        <ValueGroup>
          <ValueText>{value}</ValueText>
          <IconCircle aria-hidden="true">
            <img src={editIcon} alt="" />
          </IconCircle>
        </ValueGroup>
      ) : (
        <IconCircle aria-hidden="true">
          <img src={plusIcon} alt="" />
        </IconCircle>
      )}
    </Row>
  );
}