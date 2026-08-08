import { useState } from "react";
import styled from "styled-components";
import StepperField from "./StepperField";
import ChipGroup from "./ChipGroup";

const MEAL_OPTIONS = [
  "해당 없음",
  "유제품",
  "매운 음식",
  "카페인",
  "고지방",
  "당분",
  "탄산음료",
  "음주",
];
const EXERCISE_OPTIONS = ["0분", "30분", "60분", "90분+"];
const SKIN_STATUS_OPTIONS = ["건조", "번들거림", "트러블", "칙칙함"];

const Wrapper = styled.div`
  width: 354px;
  height: 410px;
  border-radius: 18px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #fff;
  box-sizing: border-box;
`;
export default function RecordForm() {
  const [sleepHours, setSleepHours] = useState(7);
  const [waterIntake, setWaterIntake] = useState(1);
  const [meals, setMeals] = useState([]);
  const [exercise, setExercise] = useState(null);
  const [skinStatus, setSkinStatus] = useState(null);

  const toggleMeal = (value) => {
    setMeals((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const handleSelectExercise = (option) => {
    setExercise((prev) => (prev === option ? null : option));
  };

  const handleSelectSkinStatus = (option) => {
    setSkinStatus((prev) => (prev === option ? null : option));
  };

  return (
    <Wrapper>
      <StepperField
        title="수면"
        value={sleepHours}
        unit="시간"
        onChange={setSleepHours}
      />
      <StepperField
        title="수분 섭취"
        value={waterIntake}
        unit="잔"
        onChange={setWaterIntake}
      />

      <ChipGroup
        title="식사"
        options={MEAL_OPTIONS}
        isSelected={(value) => meals.includes(value)}
        onSelect={toggleMeal}
      />

      <ChipGroup
        title="운동"
        options={EXERCISE_OPTIONS}
        isSelected={(value) => exercise === value}
        onSelect={handleSelectExercise}
      />

      <ChipGroup
        title="피부 상태"
        options={SKIN_STATUS_OPTIONS}
        isSelected={(value) => skinStatus === value}
        onSelect={handleSelectSkinStatus}
        hideBorder
      />
    </Wrapper>
  );
}
