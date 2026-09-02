const fs = require('fs');
let content = fs.readFileSync('src/components/DayProgressModal.tsx', 'utf8');

// Current logic:
// if (completed === 0 && punished) {
//   message = "يتم تفتيقها لعدم مذاكرتها أي درس🔫!";
//   msgColor = "text-blue-500";
// } else if (punished) {
//   message = PUNISHED_PHRASES[dateHash % PUNISHED_PHRASES.length];
//   msgColor = "text-rose-600";
// }

// New logic:
// if (completed === 0 && stats?.punished2Days) {
//   message = PUNISHED_PHRASES[dateHash % PUNISHED_PHRASES.length];
//   msgColor = "text-rose-600";
// } else if (completed === 0 && stats?.punishedDaily) {
//   message = "يتم تفتيقها لعدم مذاكرتها أي درس🔫!";
//   msgColor = "text-blue-500";
// } else if (punished) {
//   message = PUNISHED_PHRASES[dateHash % PUNISHED_PHRASES.length];
//   msgColor = "text-rose-600";
// }

content = content.replace(
  /\} else if \(completed === 0 && punished\) \{\s*message = "يتم تفتيقها لعدم مذاكرتها أي درس🔫!";\s*msgColor = "text-blue-500";/,
  `} else if (completed === 0 && stats?.punished2Days) {
      message = PUNISHED_PHRASES[dateHash % PUNISHED_PHRASES.length];
      msgColor = "text-rose-600";
    } else if (completed === 0 && stats?.punishedDaily) {
      message = "يتم تفتيقها لعدم مذاكرتها أي درس🔫!";
      msgColor = "text-blue-500";`
);

fs.writeFileSync('src/components/DayProgressModal.tsx', content);
console.log('DayProgressModal patched');
