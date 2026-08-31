const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldMain = `<main className="flex-1 p-4 md:p-6 flex flex-col-reverse md:flex-row gap-6 max-w-7xl mx-auto w-full">
        <section className="flex-[1.8] flex flex-col gap-4 h-full">
          <LessonsList 
            completedLessons={state.completedLessons} 
            onToggle={handleToggleLesson} 
          />
        </section>
        
        <aside className="flex-1 flex flex-col gap-6 pb-6 pr-1">
          <CalendarTracker history={state.history} dailyGoal={dailyGoal} currentScore={currentScore} pendingPunishment={state.pendingPunishment} pendingPunishmentsCount={state.pendingPunishmentsCount} />
          {state.leaderboardSettings && <UserLeaderboard settings={state.leaderboardSettings} />}`;

const newMain = `<main className="flex-1 p-4 md:p-6 flex flex-col gap-6 max-w-7xl mx-auto w-full">
        {activeTab === 'home' && (
          <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
            <CalendarTracker history={state.history} dailyGoal={dailyGoal} currentScore={currentScore} pendingPunishment={state.pendingPunishment} pendingPunishmentsCount={state.pendingPunishmentsCount} />
            {state.leaderboardSettings && <UserLeaderboard settings={state.leaderboardSettings} />}
            
            {/* Chalkboard for Quizzes */}
            <div className="bg-emerald-800 rounded-lg border-[12px] border-[#8b5a2b] p-6 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] shadow-xl relative min-h-[200px]">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-2 bg-slate-300 rounded-sm opacity-50 blur-[1px]"></div>
              <h3 className="text-white/80 font-serif font-black text-center mb-6 text-xl tracking-widest" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>لوحة الاختبارات المنجزة</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {(!state.completedQuizzes || state.completedQuizzes.length === 0) ? (
                  <div className="col-span-full text-center text-white/40 font-bold py-4">لا توجد اختبارات منجزة بعد</div>
                ) : (
                  state.completedQuizzes.map((quiz, i) => {
                    const gradeColor = 
                      quiz.grade === 'A' ? 'text-green-600' :
                      quiz.grade === 'B' ? 'text-blue-600' :
                      quiz.grade === 'C' ? 'text-yellow-600' :
                      quiz.grade === 'D' ? 'text-orange-600' : 'text-red-600';
                    return (
                      <div key={i} className="bg-[#fcfaf5] p-3 rounded shadow-md transform rotate-[-3deg] hover:rotate-0 transition-transform cursor-pointer relative border border-slate-200">
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-500 shadow-sm border border-red-700"></div>
                        <h4 className="font-bold text-slate-800 text-xs mb-2 mt-1 truncate">{quiz.title}</h4>
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] text-slate-500 font-bold">{new Date(quiz.timestamp).toLocaleDateString('ar-EG')}</span>
                          <span className={\`font-black text-2xl \${gradeColor}\`}>{quiz.grade}</span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
`;

code = code.replace(oldMain, newMain);
fs.writeFileSync('src/App.tsx', code);
