const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const stateHookStr = "const [activeTab, setActiveTab] = useState<'home' | 'lessons'>('home');";
const quizState = "const [activeQuiz, setActiveQuiz] = useState<any | null>(null);\n  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);\n  const [viewCompletedQuiz, setViewCompletedQuiz] = useState<any | null>(null);";

code = code.replace(stateHookStr, stateHookStr + "\n  " + quizState);

// Replace TODO with setActiveQuiz
code = code.replace(
    "onClick={() => {/* TODO */}}",
    "onClick={() => { setActiveQuiz(state.pendingQuizzes[0]); setQuizAnswers(new Array(state.pendingQuizzes[0].questions.length).fill(-1)); }}"
);

code = code.replace(
    "className=\"bg-[#fcfaf5] p-3 rounded shadow-md transform rotate-[-3deg] hover:rotate-0 transition-transform cursor-pointer relative border border-slate-200\"",
    "className=\"bg-[#fcfaf5] p-3 rounded shadow-md transform rotate-[-3deg] hover:rotate-0 transition-transform cursor-pointer relative border border-slate-200\" onClick={() => setViewCompletedQuiz(quiz)}"
);

fs.writeFileSync('src/App.tsx', code);
