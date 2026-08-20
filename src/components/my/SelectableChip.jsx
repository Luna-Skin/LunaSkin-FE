import styled from "styled-components";
import directionIcon from "../../assets/icons/direction.svg";

const Field = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 354px;
  height: 50px;
  margin-top: 8px;
  padding: 16px;
border: 1.5px solid rgba(0, 0, 0, 0.10);
border-radius: 18px;
  background: #fff;
  color: #2C2C2C;
font-family: "Pretendard Variable";
font-size: 15px;
font-style: normal;
font-weight: 500;
line-height: normal;
  cursor: pointer;
`;

const DirectionIcon = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
`;

export default function SelectableChip({ value, onClick }) {
  return (
    <Field type="button" onClick={onClick}>
      {value}
      <DirectionIcon src={directionIcon} alt="" />
    </Field>
  );
}
