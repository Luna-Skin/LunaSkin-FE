import { useState } from "react";
import styled from "styled-components";
import RecordListRow from "./RecordListRow";
import StepperBottomSheet from "./StepperBottomSheet";
import ChipBottomSheet from "./ChipBottomSheet";
import { STEPPER_FIELDS, MEAL_OPTIONS, SKIN_STATUS_OPTIONS } from "../../utils/recordFormOptions";

// 선택된 식사 항목을 화면에 보여줄 문자열로 변환.
// 4개 넘으면 4개까지 보여주고 그다음부터는 다음 줄로 넘김 
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
  overflow: hidden;
`;

// 값 자체는 이제 이 컴포넌트가 안 들고 있고, 전부 부모(TodaySkinForm)로부터 props로 받는 controlled 컴포넌트로 바꿈 
// 어떤 바텀시트가 열려있는지는 그대로 내부에서 관리
export default function RecordForm({
  stepperValues,
  onStepperValuesChange,
  meals,
  onMealsChange,
  skinStatus,
  onSkinStatusChange,
}) {
  const [activeSheet, setActiveSheet] = useState(null); // null | "sleep" | "water" | "exercise" | "meals" | "skinStatus"

  const openStepperSheet = (key) => {
    if (stepperValues[key] === null) {
      onStepperValuesChange({ ...stepperValues, [key]: STEPPER_FIELDS[key].default });
    }
    setActiveSheet(key);
  };

  const updateStepperValue = (key, value) => {
    onStepperValuesChange({ ...stepperValues, [key]: value });
  };

  const closeSheet = () => setActiveSheet(null);

  const toggleMeal = (option) => {
    onMealsChange(
      meals.includes(option)
        ? meals.filter((meal) => meal !== option)
        : [...meals, option],
    );
  };

  const toggleSkinStatus = (option) => {
    onSkinStatusChange(skinStatus === option ? null : option);
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
