import React from "react";
import { ValidationScenario } from "../types/clinical";
import { PatientCensusModal } from "./PatientCensusModal";

interface ScenarioSelectorBarProps {
  scenarios: ValidationScenario[];
  selectedScenarioId: string;
  onSelectScenario: (scenario: ValidationScenario) => void;
  onResetToDefault: () => void;
}

// Backwards-compatible export that does not render the rowdy dark test bar inline.
export const ScenarioSelectorBar: React.FC<ScenarioSelectorBarProps> = () => {
  return null;
};
