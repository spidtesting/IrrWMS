"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export type CountWizardStep = {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode;
};

export type CountWizardProps = {
  steps: CountWizardStep[];
  onComplete: () => void;
  isCompleting?: boolean;
};

export function CountWizard({ steps, onComplete, isCompleting }: CountWizardProps) {
  const t = useTranslations("physicalCount");
  const [currentStep, setCurrentStep] = useState(0);

  const progress = ((currentStep + 1) / steps.length) * 100;
  const isLast = currentStep === steps.length - 1;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">
            {t("step")} {currentStep + 1} / {steps.length}
          </span>
          <span className="text-muted-foreground">{steps[currentStep]?.title}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="min-h-[300px] rounded-lg border p-6">
        <h2 className="text-lg font-semibold">{steps[currentStep]?.title}</h2>
        {steps[currentStep]?.description && (
          <p className="mt-1 text-sm text-muted-foreground">{steps[currentStep].description}</p>
        )}
        <div className="mt-6">{steps[currentStep]?.content}</div>
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((s) => s - 1)}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          {t("previous")}
        </Button>

        {isLast ? (
          <Button onClick={onComplete} disabled={isCompleting}>
            <Check className="mr-2 h-4 w-4" />
            {t("completeCount")}
          </Button>
        ) : (
          <Button onClick={() => setCurrentStep((s) => s + 1)}>
            {t("next")}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
