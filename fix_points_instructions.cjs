const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<div className="flex gap-4">\s*<div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold shrink-0">٦<\/div>\s*<div>\s*<h3 className="font-bold text-base mb-1 text-amber-700">نظام النقاط<\/h3>\s*<ul className="list-disc pr-4 space-y-1 mt-1">\s*<li>تجمع النقاط من خلال إتمام أيام متتالية، الإنجازات، وهدايا لجنة المتابعة والمشرف\.<\/li>\s*<li>يمكنك استبدال النقاط في <strong>المتجر 🛒<\/strong> للحصول على كروت إعفاء من العقوبات أو كروت تجميد ستريك\.<\/li>\s*<\/ul>\s*<\/div>\s*<\/div>/g;

const replacement = `<div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold shrink-0">٦</div>
                <div>
                  <h3 className="font-bold text-base mb-1 text-amber-700">نظام النقاط</h3>
                  <div className="space-y-3 mt-2">
                    <div>
                      <strong className="text-emerald-700 block mb-1">كسب النقاط 📈:</strong>
                      <ul className="list-disc pr-5 space-y-1 text-sm text-slate-600">
                        <li>إتمام الهدف اليومي: <span className="text-emerald-600 font-bold">+١٠ نقاط</span></li>
                        <li>إتمام ٢٠ درساً أو أكثر: <span className="text-emerald-600 font-bold">+٥٠ نقطة</span></li>
                        <li>إتمام ختمة كاملة: <span className="text-emerald-600 font-bold">+١٠٠ نقطة</span></li>
                        <li>هدايا المتابعة والمشرف: <span className="text-emerald-600 font-bold">+٣٠٠ نقطة</span></li>
                      </ul>
                    </div>
                    <div>
                      <strong className="text-rose-700 block mb-1">خصم النقاط 📉:</strong>
                      <ul className="list-disc pr-5 space-y-1 text-sm text-slate-600">
                        <li>عدم إكمال الهدف اليومي: <span className="text-rose-600 font-bold">-١٠ نقاط</span></li>
                        <li>الوقوع في عقاب: <span className="text-rose-600 font-bold">-٥٠ نقطة</span></li>
                        <li>تجاهل العقاب / الطرد: <span className="text-rose-600 font-bold">-١٠٠ نقطة</span></li>
                      </ul>
                    </div>
                    <p className="pt-2 text-slate-700 font-bold">💡 يمكنك استبدال النقاط في <strong>المتجر 🛒</strong> للحصول على كروت إعفاء وتجميد.</p>
                  </div>
                </div>
              </div>`;

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Successfully replaced points instructions.");
} else {
  console.log("Regex didn't match. Here is the file content around section 6:");
  const lines = content.split('\n');
  const index = lines.findIndex(l => l.includes("نظام النقاط"));
  console.log(lines.slice(index - 5, index + 10).join('\n'));
}
