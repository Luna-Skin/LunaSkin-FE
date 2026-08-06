import styled from "styled-components";

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
`;

const Arrow = styled.span`
  color: #c5bdd3;
  font-size: 18px;
`;

export default function SelectableChip({ value, onClick }) {
  return (
    <Field type="button" onClick={onClick}>
      {value}
      <Arrow>⌄</Arrow>
    </Field>
  );
}