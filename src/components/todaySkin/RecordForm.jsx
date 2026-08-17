import { useState } from "react";
import styled from "styled-components";
import RecordListRow from "./RecordListRow";
import StepperBottomSheet from "./StepperBottomSheet";
import ChipBottomSheet from "./ChipBottomSheet";

function formatExerciseHours(hours) {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  return minutes === 0 ? `${wholeHours}시간` : `${wholeHours}시간 ${minutes}분`;
}

const STEPPER_FIELDS = {
  sleep: {
    label: "수면",
    min: 0,
    max: 16,
    step: 0.5,
    default: 7,
    formatValue: (v) => `${v}시간`,
  },
  water: {
    label: "수분 섭취",
    min: 0,
    max: 4,
    step: 0.5,
    default: 0.5,
    formatValue: (v) => `${v}L`,
  },
  exercise: {
    label: "운동",
    min: 0,
    max: 4,
    step: 0.5,
    default: 1,
    formatValue: formatExerciseHours,
  },
};

const MEAL_OPTIONS = [
  "유제품",
  "과일",
  "매운 음식",
  "카페인",
  "고지방",
  "당분",
  "탄산음료",
  "음주",
];
const SKIN_STATUS_OPTIONS = ["건조", "번들거림", "트러블", "칙칙함"];

// 선택된 식사 항목을 화면에 보여줄 문자열로 변환.
// 4개 넘으면 4개까지 보여주고 그다음부터는 다음 줄로 넘김 (\n은 RecordListRow의
// white-space: pre-line 덕분에 실제 줄바꿈으로 보여짐)
function formatMeals(meals) {
  if (meals.length === 0) return null;
  if (meals.length <= 4) return meals.join(", ");

  const firstLine = `${meals.slice(0, 4).join(", ")},`;
  const secondLine = meals.slice(4).join(", ");
  return `${firstLine}\n${secondLine}`;
}

const Container = styled.div`
  width: 354px;
  min-height: 302px;
  border-radius: 18px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  background: #fff;
  // box-sizing: border-box;
  overflow: hidden;
`;

export default function RecordForm() {
  const [stepperValues, setStepperValues] = useState({
    sleep: null,
    water: null,
    exercise: null,
  });
  const [meals, setMeals] = useState([]);
  const [skinStatus, setSkinStatus] = useState(null);
  const [activeSheet, setActiveSheet] = useState(null); // null | "sleep" | "water" | "exercise" | "meals" | "skinStatus"

  const openStepperSheet = (key) => {
    setStepperValues((prev) =>
      prev[key] === null
        ? { ...prev, [key]: STEPPER_FIELDS[key].default }
        : prev,
    );
    setActiveSheet(key);
  };

  const updateStepperValue = (key, value) => {
    setStepperValues((prev) => ({ ...prev, [key]: value }));
  };

  const closeSheet = () => setActiveSheet(null);

  const toggleMeal = (option) => {
    setMeals((prev) =>
      prev.includes(option)
        ? prev.filter((meal) => meal !== option)
        : [...prev, option],
    );
  };

  const toggleSkinStatus = (option) => {
    setSkinStatus((prev) => (prev === option ? null : option));
  };

  const activeStepperField = activeSheet ? STEPPER_FIELDS[activeSheet] : null;

  return (
    <Container>
      {Object.entries(STEPPER_FIELDS).map(([key, field]) => (
        <RecordListRow
          key={key}
          label={field.label}
          value={
            stepperValues[key] === null
              ? null
              : field.formatValue(stepperValues[key])
          }
          onClick={() => openStepperSheet(key)}
        />
      ))}

      <RecordListRow
        label="식사"
        value={formatMeals(meals)}
        onClick={() => setActiveSheet("meals")}
      />
      <RecordListRow
        label="피부 상태"
        value={skinStatus}
        onClick={() => setActiveSheet("skinStatus")}
        hideBorder
      />
      {activeStepperField && (
        <StepperBottomSheet
          label={activeStepperField.label}
          value={stepperValues[activeSheet]}
          min={activeStepperField.min}
          max={activeStepperField.max}
          step={activeStepperField.step}
          formatValue={activeStepperField.formatValue}
          onChange={(value) => updateStepperValue(activeSheet, value)}
          onClose={closeSheet}
        />
      )}

      {activeSheet === "meals" && (
        <ChipBottomSheet
          label="식사"
          options={MEAL_OPTIONS}
          isSelected={(option) => meals.includes(option)}
          onSelect={toggleMeal}
          onClose={closeSheet}
        />
      )}

      {activeSheet === "skinStatus" && (
        <ChipBottomSheet
          label="피부 상태"
          options={SKIN_STATUS_OPTIONS}
          isSelected={(option) => skinStatus === option}
          onSelect={toggleSkinStatus}
          onClose={closeSheet}
        />
      )}
    </Container>
  );
}
