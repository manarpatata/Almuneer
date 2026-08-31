const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldClose = `            {/* Status Box (Left side in RTL) */}
            <div className="flex-1">
              <div className={statusBoxClasses}>
                {statusBoxContent}
              </div>
            </div>
          </div>
        </aside>`;

const newClose = `            {/* Status Box (Left side in RTL) */}
            <div className="flex-1">
              <div className={statusBoxClasses}>
                {statusBoxContent}
              </div>
            </div>
          </div>
        </div>
        )}

        {activeTab === 'lessons' && (
          <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto h-full">
            <div className="flex gap-4 h-32 shrink-0">
              {/* Status Box */}
              <div className="flex-[2]">
                <div className={statusBoxClasses}>
                  {statusBoxContent}
                </div>
              </div>
              
              {/* Quizzes Box */}
              {(state.pendingQuizzes && state.pendingQuizzes.length > 0) ? (
                <div 
                  onClick={() => {/* TODO */}}
                  className="flex-1 bg-indigo-500 rounded-3xl p-4 text-white flex flex-col justify-center items-center gap-2 relative overflow-hidden shadow-lg shadow-indigo-200/50 cursor-pointer hover:bg-indigo-600 transition-colors"
                >
                  <FileText className="w-8 h-8 opacity-90" />
                  <h4 className="text-sm font-bold text-center">اختبار جديد</h4>
                  <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-indigo-500 animate-pulse"></div>
                </div>
              ) : (
                <div className="flex-1 bg-slate-100 rounded-3xl p-4 text-slate-400 flex flex-col justify-center items-center gap-2 relative overflow-hidden shadow-inner border-2 border-dashed border-slate-200">
                  <FileText className="w-8 h-8 opacity-50" />
                  <h4 className="text-xs font-bold text-center opacity-80">لا توجد<br/>اختبارات</h4>
                </div>
              )}
            </div>
            
            <LessonsList 
              completedLessons={state.completedLessons} 
              onToggle={handleToggleLesson} 
            />
          </div>
        )}`;

code = code.replace(oldClose, newClose);
fs.writeFileSync('src/App.tsx', code);
