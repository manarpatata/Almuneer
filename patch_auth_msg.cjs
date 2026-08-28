const fs = require('fs');
let code = fs.readFileSync('src/components/Auth.tsx', 'utf8');

code = code.replace(
  "return 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';",
  "return 'هذا الحساب غير مسجل أو كلمة المرور غير صحيحة. يرجى التأكد أو إنشاء حساب جديد.';"
);

fs.writeFileSync('src/components/Auth.tsx', code);
console.log("Patched error message");
