const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// The end of main currently looks like:
//             <LessonsList 
//               completedLessons={state.completedLessons} 
//               onToggle={handleToggleLesson} 
//             />
//           </div>
//         </>
//         )}
//       </main>

// It SHOULD look like:
//             <LessonsList 
//               completedLessons={state.completedLessons} 
//               onToggle={handleToggleLesson} 
//             />
//           </div>
//         )}
//         </>
//         )}
//       </main>

content = content.replace(
  '          </div>\n        </>\n        )}\n      </main>',
  '          </div>\n        )}\n        </>\n        )}\n      </main>'
);

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx syntax fixed 2');
