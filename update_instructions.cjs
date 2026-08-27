const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const instructionsStart = '<div className="p-6 overflow-y-auto flex flex-col gap-6 text-slate-700 text-sm leading-relaxed">';
const instructionsEnd = '            <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0">';

const beforeIndex = code.indexOf(instructionsStart);
const afterIndex = code.indexOf(instructionsEnd, beforeIndex);

if (beforeIndex !== -1 && afterIndex !== -1) {
  const replacement = `${instructionsStart}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold shrink-0">١</div>
                <div>
                  <h3 className="font-bold text-base mb-1">الهدف اليومي</h3>
                  <p>عليك إكمال الحد الأدنى من الدروس يومياً (يمكنك تعديله من الإعدادات، الافتراضي هو ١٠ دروس).</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold shrink-0">٢</div>
                <div>
                  <h3 className="font-bold text-base mb-1">منطقة التهديد</h3>
                  <p>إذا لم تنجزي الحد الأدنى في يوم ما، ستكونين مهددة بالعقاب في اليوم التالي.</p>
                  <p className="mt-1 text-blue-600 font-bold">🔫 التفتيق: إذا لم تتم أي درس في يوم ما (صفر درس) ستعاقب!</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold shrink-0">٣</div>
                <div>
                  <h3 className="font-bold text-base mb-1 text-red-700">لجنة العقوبات</h3>
                  <p>لتجنب العقاب العادي، عليكِ إكمال الهدف (الحد الأدنى × ٢) في يومين متتاليين. إذا لم تتمّ ذلك، ستعاقب.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold shrink-0">٤</div>
                <div>
                  <h3 className="font-bold text-base mb-1">الطرد من المجموعة</h3>
                  <p>عند وقوع العقاب، يجب عليكِ الضغط على "أتممت العقاب". إذا ضغطتِ على "لم أتمم" سيتم طردك نهائياً من المجموعة (يمكنك التراجع خلال ٤ ثوانٍ).</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shrink-0">٥</div>
                <div>
                  <h3 className="font-bold text-base mb-1 text-indigo-700">الستريك</h3>
                  <ul className="list-disc pr-4 space-y-1 mt-1">
                    <li><strong>نظام الستريك 🔥:</strong> يتم حساب عدد الأيام المتتالية التي أنهيت فيها درساً واحداً على الأقل. انقطاع يوم يعيدك للصفر!</li>
                  </ul>
                </div>
              </div>
            </div>
`;
  code = code.substring(0, beforeIndex) + replacement + code.substring(afterIndex);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Replaced instructions successfully.");
} else {
  console.log("Could not find the target strings.");
}
