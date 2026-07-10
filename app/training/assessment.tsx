import { ASSESSMENT, AssessmentQuestion } from "@/constants/assessment-content";
import { fontFamily } from "@/constants/fontFamily";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  CloseCircle,
  Refresh,
  TickCircle,
} from "iconsax-react-nativejs";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// answers[questionId] = selected option index
type AnswerMap = Record<string, number>;

const TYPE_TAG: Record<AssessmentQuestion["type"], string> = {
  mcq: "MULTIPLE CHOICE",
  tf: "TRUE / FALSE",
  match: "SYMPTOM TO CAUSE",
};

function QuestionCard({
  question,
  qNumber,
  selected,
  submitted,
  onSelect,
}: {
  question: AssessmentQuestion;
  qNumber: number;
  selected: number | undefined;
  submitted: boolean;
  onSelect: (index: number) => void;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.typeTag}>{TYPE_TAG[question.type]}</Text>

      {question.type === "match" && question.symptom && (
        <View style={styles.symptomBox}>
          <Text style={styles.symptomLabel}>SYMPTOM</Text>
          <Text style={styles.symptomText}>{question.symptom}</Text>
        </View>
      )}

      <Text style={styles.prompt}>
        {qNumber}. {question.prompt}
      </Text>

      {question.options.map((option, i) => {
        const isSelected = selected === i;
        const isCorrect = i === question.correctIndex;

        // After submission, color the correct option green and a wrong
        // selection red. Before submission, only highlight the selection.
        const showCorrect = submitted && isCorrect;
        const showWrong = submitted && isSelected && !isCorrect;

        return (
          <Pressable
            key={option}
            disabled={submitted}
            onPress={() => onSelect(i)}
            android_ripple={{ color: "#E2E2E8" }}
            style={({ pressed }) => [
              styles.option,
              isSelected && !submitted && styles.optionSelected,
              showCorrect && styles.optionCorrect,
              showWrong && styles.optionWrong,
              pressed && !submitted && styles.optionPressed,
            ]}
          >
            <View
              style={[
                styles.radio,
                isSelected && !submitted && styles.radioSelected,
                showCorrect && styles.radioCorrect,
                showWrong && styles.radioWrong,
              ]}
            >
              {(isSelected || showCorrect) && <View style={styles.radioDot} />}
            </View>
            <Text
              style={[
                styles.optionText,
                isSelected && !submitted && styles.optionTextSelected,
                showCorrect && styles.optionTextCorrect,
                showWrong && styles.optionTextWrong,
              ]}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}

      {submitted && (
        <View style={styles.explanationBox}>
          {selected === question.correctIndex ? (
            <TickCircle size={18} color="#0AC084" variant="Bold" />
          ) : (
            <CloseCircle size={18} color="#FF5252" variant="Bold" />
          )}
          <Text style={styles.explanationText}>{question.explanation}</Text>
        </View>
      )}
    </View>
  );
}

export default function Assessment() {
  const router = useRouter();
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitted, setSubmitted] = useState(false);

  const total = ASSESSMENT.questions.length;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === total;

  const score = useMemo(() => {
    if (!submitted) return 0;
    return ASSESSMENT.questions.reduce(
      (sum, q) => sum + (answers[q.id] === q.correctIndex ? 1 : 0),
      0
    );
  }, [submitted, answers]);

  const percent = Math.round((score / total) * 100);
  const passed = percent >= ASSESSMENT.passMark;

  const select = (id: string, index: number) => {
    setAnswers((prev) => ({ ...prev, [id]: index }));
  };

  const retake = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>
          {ASSESSMENT.number}. {ASSESSMENT.title}
        </Text>
        <Text style={styles.intro}>{ASSESSMENT.intro}</Text>

        {/* Score card, shown after submission */}
        {submitted && (
          <View
            style={[
              styles.scoreCard,
              { backgroundColor: passed ? "#E7FBF2" : "#FFECEC" },
            ]}
          >
            <Text style={styles.scoreLabel}>YOUR SCORE</Text>
            <Text
              style={[
                styles.scoreValue,
                { color: passed ? "#0B6B45" : "#C0392B" },
              ]}
            >
              {score}/{total} ({percent}%)
            </Text>
            <Text style={styles.scoreVerdict}>
              {passed
                ? "Passed. Review the explanations below to reinforce anything you missed."
                : `Below the ${ASSESSMENT.passMark}% pass mark. Review the explanations below, then retake the assessment.`}
            </Text>
          </View>
        )}

        {/* Progress, shown before submission */}
        {!submitted && (
          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(answeredCount / total) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {answeredCount}/{total}
            </Text>
          </View>
        )}

        {ASSESSMENT.questions.map((q, i) => (
          <QuestionCard
            key={q.id}
            question={q}
            qNumber={i + 1}
            selected={answers[q.id]}
            submitted={submitted}
            onSelect={(index) => select(q.id, index)}
          />
        ))}

        {/* Submit / Retake */}
        {!submitted ? (
          <Pressable
            onPress={() => setSubmitted(true)}
            disabled={!allAnswered}
            android_ripple={allAnswered ? { color: "#2A5BFF" } : undefined}
            style={({ pressed }) => [
              styles.submitBtn,
              !allAnswered && styles.submitBtnDisabled,
              allAnswered && pressed && styles.submitBtnPressed,
            ]}
          >
            <Text style={styles.submitBtnText}>
              {allAnswered
                ? "SUBMIT ANSWERS"
                : `ANSWER ALL QUESTIONS (${answeredCount}/${total})`}
            </Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={retake}
            android_ripple={{ color: "#E2E2E8" }}
            style={({ pressed }) => [
              styles.retakeBtn,
              pressed && styles.retakeBtnPressed,
            ]}
          >
            <Refresh size={16} color="#1A1A1A" variant="Linear" />
            <Text style={styles.retakeBtnText}>RETAKE ASSESSMENT</Text>
          </Pressable>
        )}

        <View style={styles.navRow}>
          <Pressable
            onPress={() => router.push("/training/procedures" as any)}
            android_ripple={{ color: "#E2E2E8" }}
            style={({ pressed }) => [
              styles.navBtnGhost,
              pressed && styles.navBtnPressed,
            ]}
          >
            <ArrowLeft size={16} color="#1A1A1A" variant="Linear" />
            <Text style={styles.navBtnGhostText}>Procedures</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F4F4F8" },
  scroll: { flex: 1, paddingTop: 48 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28 },

  pageTitle: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    color: "#1A1A1A",
    letterSpacing: -0.5,
    marginBottom: 14,
  },
  intro: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: "#3D3D3D",
    lineHeight: 23,
    letterSpacing: -0.2,
    marginBottom: 20,
  },

  // Progress
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E2E2E8",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: "#0749FF",
  },
  progressText: {
    fontSize: 12,
    fontFamily: fontFamily.semibold,
    color: "#6B6B6B",
  },

  // Score card
  scoreCard: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    gap: 6,
  },
  scoreLabel: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
    color: "#6B6B6B",
    letterSpacing: 1,
  },
  scoreValue: {
    fontSize: 28,
    fontFamily: fontFamily.bold,
    letterSpacing: -0.5,
  },
  scoreVerdict: {
    fontSize: 13,
    fontFamily: fontFamily.regular,
    color: "#3D3D3D",
    lineHeight: 20,
    letterSpacing: -0.2,
  },

  // Question card
  card: {
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  typeTag: {
    fontSize: 11,
    fontFamily: fontFamily.regular,
    color: "#9A9AA0",
    letterSpacing: 1,
    marginBottom: 10,
  },
  symptomBox: {
    backgroundColor: "#1B2B3F",
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    gap: 4,
    borderRadius: 6,
  },
  symptomLabel: {
    fontSize: 10,
    fontFamily: fontFamily.regular,
    color: "#9BE7C4",
    letterSpacing: 1,
  },
  symptomText: {
    fontSize: 14,
    fontFamily: fontFamily.semibold,
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },
  prompt: {
    fontSize: 14.5,
    fontFamily: fontFamily.semibold,
    color: "#1A1A1A",
    lineHeight: 22,
    letterSpacing: -0.2,
    marginBottom: 14,
  },

  // Options
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E2E8",
    backgroundColor: "#FAFAFC",
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  optionPressed: { transform: [{ scale: 0.995 }] },
  optionSelected: {
    borderColor: "#0749FF",
    backgroundColor: "#EEF3FF",
  },
  optionCorrect: {
    borderColor: "#0AC084",
    backgroundColor: "#E7FBF2",
  },
  optionWrong: {
    borderColor: "#FF5252",
    backgroundColor: "#FFECEC",
  },
  optionText: {
    flex: 1,
    fontSize: 13.5,
    fontFamily: fontFamily.regular,
    color: "#3D3D3D",
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  optionTextSelected: { color: "#0749FF", fontFamily: fontFamily.medium },
  optionTextCorrect: { color: "#0B6B45", fontFamily: fontFamily.medium },
  optionTextWrong: { color: "#C0392B", fontFamily: fontFamily.medium },

  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "#C6C6CE",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: { borderColor: "#0749FF" },
  radioCorrect: { borderColor: "#0AC084" },
  radioWrong: { borderColor: "#FF5252" },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0749FF",
  },

  // Explanation
  explanationBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 6,
    borderRadius: 12,
    backgroundColor: "#F4F4F8",
    padding: 12,
  },
  explanationText: {
    flex: 1,
    fontSize: 12.5,
    fontFamily: fontFamily.regular,
    color: "#3D3D3D",
    lineHeight: 19,
    letterSpacing: -0.2,
  },

  // Submit / retake
  submitBtn: {
    marginTop: 12,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#0749FF",
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnDisabled: { backgroundColor: "#C7D0DD" },
  submitBtnPressed: {
    backgroundColor: "#0640DB",
    transform: [{ scale: 0.99 }],
  },
  submitBtnText: {
    fontSize: 14,
    fontFamily: fontFamily.semibold,
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  retakeBtn: {
    marginTop: 12,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  retakeBtnPressed: { transform: [{ scale: 0.99 }] },
  retakeBtnText: {
    fontSize: 14,
    fontFamily: fontFamily.semibold,
    color: "#1A1A1A",
    letterSpacing: 0.2,
  },

  // Bottom nav
  navRow: { flexDirection: "row", gap: 12, marginTop: 12 },
  navBtnGhost: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  navBtnGhostText: {
    fontSize: 14,
    fontFamily: fontFamily.semibold,
    color: "#1A1A1A",
    letterSpacing: -0.2,
  },
  navBtnPressed: { transform: [{ scale: 0.99 }] },
});
