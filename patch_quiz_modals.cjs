const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const modals = `
      {/* View Completed Quiz Modal */}
      {viewCompletedQuiz && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
          <div className="bg-[#fcfaf5] p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col gap-6 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto border-2 border-slate-200">
            <div className="flex justify-between items-start border-b-2 border-slate-200 pb-4 relative">
              <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-bl-full flex items-center justify-center">
                <span className={\`font-black text-4xl rotate-12 drop-shadow-sm \${
                  viewCompletedQuiz.grade === 'A' ? 'text-green-600' :
                  viewCompletedQuiz.grade === 'B' ? 'text-blue-600' :
                  viewCompletedQuiz.grade === 'C' ? 'text-yellow-600' :
                  viewCompletedQuiz.grade === 'D' ? 'text-orange-600' : 'text-red-600'
                }\`}>{viewCompletedQuiz.grade}</span>
              </div>
              <div>
                <h3 className="font-black text-2xl text-slate-800 pr-16">{viewCompletedQuiz.title}</h3>
                <p className="text-slate-500 font-bold mt-1 pr-16">التصحيح بواسطة: {viewCompletedQuiz.sender}</p>
              </div>
              <button onClick={() => setViewCompletedQuiz(null)} className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-500 transition-colors z-10">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              {viewCompletedQuiz.questions.map((q, idx) => {
                const studentAnswer = viewCompletedQuiz.answers[idx];
                const isCorrect = studentAnswer === q.correctIndex;
                return (
                  <div key={idx} className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm">
                    <h4 className="font-bold text-slate-800 mb-4">{idx + 1}. {q.question}</h4>
                    <div className="space-y-2">
                      {q.options.map((opt, oIdx) => {
                        const isStudentChoice = studentAnswer === oIdx;
                        const isActualCorrect = q.correctIndex === oIdx;
                        
                        let optClasses = "p-3 rounded-xl border-2 flex justify-between items-center ";
                        if (isStudentChoice && isActualCorrect) optClasses += "bg-emerald-50 border-emerald-400 text-emerald-800";
                        else if (isStudentChoice && !isActualCorrect) optClasses += "bg-red-50 border-red-400 text-red-800";
                        else if (!isStudentChoice && isActualCorrect) optClasses += "bg-emerald-50/50 border-emerald-200 text-emerald-600";
                        else optClasses += "bg-slate-50 border-slate-200 text-slate-500 opacity-50";

                        return (
                          <div key={oIdx} className={optClasses}>
                            <span className="font-bold">{opt}</span>
                            {isStudentChoice && (
                              isActualCorrect ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <X className="w-5 h-5 text-red-500" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Take Quiz Modal */}
      {activeQuiz && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col gap-6 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-slate-800">{activeQuiz.title}</h3>
                  <p className="text-sm font-bold text-slate-500">مرسل من: {activeQuiz.sender}</p>
                </div>
              </div>
              <button onClick={() => setActiveQuiz(null)} className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-8 mt-4">
              {activeQuiz.questions.map((q, idx) => (
                <div key={idx} className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200">
                  <h4 className="font-black text-slate-800 text-lg mb-4">{idx + 1}. {q.question}</h4>
                  <div className="space-y-3">
                    {q.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => {
                          const newAns = [...quizAnswers];
                          newAns[idx] = oIdx;
                          setQuizAnswers(newAns);
                        }}
                        className={\`w-full text-right p-4 rounded-xl border-2 font-bold transition-colors flex justify-between items-center \${
                          quizAnswers[idx] === oIdx 
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm' 
                            : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                        }\`}
                      >
                        {opt}
                        {quizAnswers[idx] === oIdx && <div className="w-3 h-3 rounded-full bg-indigo-500"></div>}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              disabled={quizAnswers.includes(-1)}
              onClick={async () => {
                // Calculate grade
                const correctCount = activeQuiz.questions.reduce((count, q, idx) => count + (q.correctIndex === quizAnswers[idx] ? 1 : 0), 0);
                const percent = correctCount / activeQuiz.questions.length;
                let grade = 'F';
                if (percent === 1) grade = 'A';
                else if (percent >= 0.8) grade = 'B';
                else if (percent >= 0.6) grade = 'C';
                else if (percent >= 0.5) grade = 'D';

                const completedQuiz = {
                  ...activeQuiz,
                  answers: quizAnswers,
                  grade,
                  timestamp: Date.now()
                };

                const newPending = (state.pendingQuizzes || []).filter(q => q.id !== activeQuiz.id);
                const newCompleted = [...(state.completedQuizzes || []), completedQuiz];

                if (user) {
                  const { doc, updateDoc } = await import('firebase/firestore');
                  const { db } = await import('./firebase');
                  await updateDoc(doc(db, 'users', user.uid), {
                    pendingQuizzes: newPending,
                    completedQuizzes: newCompleted
                  });
                } else {
                  setState(prev => ({ ...prev, pendingQuizzes: newPending, completedQuizzes: newCompleted }));
                }
                
                setActiveQuiz(null);
                setToastMessage('تم تسليم الاختبار! ✅');
                setTimeout(() => setToastMessage(''), 3000);
              }}
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold text-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              تسليم الإجابات
            </button>
          </div>
        </div>
      )}
`;

code = code.replace("<WaterGunOverlay ", modals + "\n      <WaterGunOverlay ");
fs.writeFileSync('src/App.tsx', code);
