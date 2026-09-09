const fs = require('fs');
let content = fs.readFileSync('src/components/SupervisorDashboard.tsx', 'utf8');

const importRegex = /import \{ doc, getDoc, updateDoc, onSnapshot, arrayUnion, arrayRemove \} from 'firebase\/firestore';/g;
const importReplacement = `import { doc, getDoc, updateDoc, onSnapshot, arrayUnion, arrayRemove, increment } from 'firebase/firestore';`;

content = content.replace(importRegex, importReplacement);

const punishRegex = /await updateDoc\(userRef, \{\s*supervisorPunishments: arrayUnion\(\{\s*id: Date\.now\(\)\.toString\(\),\s*reason: punishReason \|\| 'عقاب من المشرف',\s*sender: punishSender \|\| 'المشرف',\s*signature: punishSignature,\s*timestamp: Date\.now\(\)\s*\}\)\s*\}\);/g;

const punishReplacement = `await updateDoc(userRef, {
        supervisorPunishments: arrayUnion({
          id: Date.now().toString(),
          reason: punishReason || 'عقاب من المشرف',
          sender: punishSender || 'المشرف',
          signature: punishSignature,
          timestamp: Date.now()
        }),
        points: increment(-50)
      });`;

if (punishRegex.test(content)) {
  content = content.replace(punishRegex, punishReplacement);
  fs.writeFileSync('src/components/SupervisorDashboard.tsx', content);
  console.log("Successfully replaced supervisor punishment in SupervisorDashboard.tsx");
} else {
  console.log("Regex didn't match for punishReplacement");
}
