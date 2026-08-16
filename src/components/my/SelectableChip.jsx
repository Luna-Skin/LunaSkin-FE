import styled from "styled-components";
import directionIcon from "../../assets/icons/direction.svg";

const Field = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 8px;
  padding: 12px 14px;
  border: 1px solid #e3e0e8;
  border-radius: 12px;
  background: #fff;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  font-weight: 550;
`;

const DirectionIcon = styled.img`
  width: 19px;
  height: 19px;
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