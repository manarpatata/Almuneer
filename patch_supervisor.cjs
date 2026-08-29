const fs = require('fs');
let code = fs.readFileSync('src/components/SupervisorDashboard.tsx', 'utf8');

code = code.replace(
  "export function SupervisorDashboard({ onClose, supervisorId, trackedUsers = [] }: { onClose: () => void, supervisorId: string, trackedUsers?: string[] }) {",
  "export function SupervisorDashboard({ onClose, supervisorId, trackedUsers = [], showToast }: { onClose: () => void, supervisorId: string, trackedUsers?: string[], showToast?: (msg: string) => void }) {"
);

code = code.replace(/alert\('حدث خطأ أثناء الإزالة'\);/g, "showToast ? showToast('حدث خطأ أثناء الإزالة') : alert('حدث خطأ أثناء الإزالة');");
code = code.replace(/alert\('تم إرسال الهدية بنجاح!'\);/g, "showToast ? showToast('تم إرسال الهدية بنجاح! ✨') : alert('تم إرسال الهدية بنجاح!');");
code = code.replace(/alert\('حدث خطأ أثناء الإرسال'\);/g, "showToast ? showToast('حدث خطأ أثناء الإرسال') : alert('حدث خطأ أثناء الإرسال');");
code = code.replace(/alert\('تم إرسال العقوبة بنجاح!'\);/g, "showToast ? showToast('تم إرسال العقوبة بنجاح! 💀') : alert('تم إرسال العقوبة بنجاح!');");
code = code.replace(/alert\('تم تعديل النقاط بنجاح!'\);/g, "showToast ? showToast('تم تعديل النقاط بنجاح! 🌟') : alert('تم تعديل النقاط بنجاح!');");
code = code.replace(/alert\('حدث خطأ أثناء تعديل النقاط'\);/g, "showToast ? showToast('حدث خطأ أثناء تعديل النقاط') : alert('حدث خطأ أثناء تعديل النقاط');");
code = code.replace(/alert\('تم تطبيق الطرد لمدة 24 ساعة بنجاح!'\);/g, "showToast ? showToast('تم تطبيق الطرد لمدة 24 ساعة بنجاح! 🚫') : alert('تم تطبيق الطرد لمدة 24 ساعة بنجاح!');");
code = code.replace(/alert\('حدث خطأ أثناء الطرد'\);/g, "showToast ? showToast('حدث خطأ أثناء الطرد') : alert('حدث خطأ أثناء الطرد');");

fs.writeFileSync('src/components/SupervisorDashboard.tsx', code);
console.log("Patched SupervisorDashboard alerts");
