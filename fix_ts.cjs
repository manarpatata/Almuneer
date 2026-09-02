const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// replace systemPunishments map
const target = `            const systemPunishments = Array.from({ length: state.pendingPunishmentsCount || (state.pendingPunishment ? 1 : 0) }).map((_, i) => ({
              id: \`sys-\${i}\`,
              type: 'system',
              reason: 'لم تنجز المطلوب في اليومين الماضيين! تحمل العواقب الوخيمة🔪',
              sender: 'لجنة العقوبات'
            }));`;
const replacement = `            const systemPunishments = Array.from({ length: state.pendingPunishmentsCount || (state.pendingPunishment ? 1 : 0) }).map((_, i) => ({
              id: \`sys-\${i}\`,
              type: 'system',
              reason: 'لم تنجز المطلوب في اليومين الماضيين! تحمل العواقب الوخيمة🔪',
              sender: 'لجنة العقوبات'
            } as any));`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', content);
  console.log('Fixed TS cast');
} else {
  console.log('Not found');
}
