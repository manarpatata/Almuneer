const fs = require('fs');
let code = fs.readFileSync('src/components/StatsModal.tsx', 'utf8');

const searchProps = `interface StatsModalProps {
  history: Record<string, DailyStats>;
  dailyGoal: number;
  khatmatCount: number;
  immunityCards: number;
  onClose: () => void;
}`;

const replaceProps = `interface StatsModalProps {
  history: Record<string, DailyStats>;
  dailyGoal: number;
  khatmatCount: number;
  immunityCards: number;
  extraPoints: number;
  onClose: () => void;
}`;

code = code.replace(searchProps, replaceProps);

const searchParams = `export function StatsModal({ history, dailyGoal, khatmatCount, immunityCards, onClose }: StatsModalProps) {`;
const replaceParams = `export function StatsModal({ history, dailyGoal, khatmatCount, immunityCards, extraPoints, onClose }: StatsModalProps) {`;
code = code.replace(searchParams, replaceParams);

const searchScore = `  let score = khatmatCount * 100;`;
const replaceScore = `  let score = (khatmatCount * 100) + (extraPoints || 0);`;
code = code.replace(searchScore, replaceScore);

fs.writeFileSync('src/components/StatsModal.tsx', code);
