import styled from "styled-components";
import Stepper from "./Stepper";

const Field = styled.div`
  display: flex;
  width: 354px;
  padding: 16px;
  align-items: center;
  justify-content: space-between;
border-bottom: 0.5px dashed #EDE8F8;
`;

const Title = styled.span`
  color: #000;
  font-family: "Pretendard Variable";
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

export default function StepperField({ title, value, unit, min, max, onChange }) {
  return (
    <Field>
      <Title>{title}</Title>
      <Stepper value={value} unit={unit} min={min} max={max} onChange={onChange} />
    </Field>
  );
}