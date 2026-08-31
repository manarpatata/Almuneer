const fs = require('fs');

// Fix in SupervisorReports.tsx
let repContent = fs.readFileSync('src/components/SupervisorReports.tsx', 'utf8');
repContent = repContent.replace(
  'avatarUrl: data.avatarUrl',
  "avatarUrl: data.avatarUrl || null"
);
fs.writeFileSync('src/components/SupervisorReports.tsx', repContent);

// Fix in App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(
  'await updateDoc(doc(db, \'users\', user.uid), {\n                    pendingQuizzes: newPending,\n                    completedQuizzes: newCompleted\n                  });',
  'await updateDoc(doc(db, \'users\', user.uid), JSON.parse(JSON.stringify({\n                    pendingQuizzes: newPending,\n                    completedQuizzes: newCompleted\n                  })));'
);
fs.writeFileSync('src/App.tsx', appContent);

console.log("Replaced undefineds");
