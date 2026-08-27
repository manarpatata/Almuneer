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
                  <h3 className="font-bold text-base mb-1">منطقة التهديد والرش بالماء</h3>
                  <p>إذا لم تنجزي الحد الأدنى في يوم ما، ستكونين مهددة بالعقاب في اليوم التالي.</p>
                  <p className="mt-1 text-blue-600 font-bold">🔫 رشة الماء: إذا لم تتم أي درس في يوم ما (صفر درس) ستعاقب! سيتم رشك بالماء وخصم نقاط من رصيدك، وسيتم معاقبتك فوراً بصندوق عقاب!</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold shrink-0">٣</div>
                <div>
                  <h3 className="font-bold text-base mb-1 text-red-700">لجنة العقوبات</h3>
                  <p>لتجنب العقاب العادي، عليكِ إكمال الهدف (الحد الأدنى × ٢) في يومين متتاليين. إذا قصرتِ في ذلك، سيطبق عليكِ العقاب وسيظهر صندوق أحمر منفصل لطلب تنفيذه.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center font-bold shrink-0">٤</div>
                <div>
                  <h3 className="font-bold text-base mb-1 text-yellow-700">الهدايا والمكافآت والستريك</h3>
                  <ul className="list-disc pr-4 space-y-1 mt-1">
                    <li><strong>كروت الإعفاء:</strong> عند إنجاز ٢٠ درساً أو أكثر ليومين متتاليين، ستحصلين على "كرت إعفاء" يلغي العقاب.</li>
                    <li><strong>نظام الستريك 🔥:</strong> يتم حساب عدد الأيام المتتالية التي أنهيت فيها درساً واحداً على الأقل. انقطاع يوم يعيدك للصفر!</li>
                    <li><strong>استعادة الستريك 🧊:</strong> تبدأين بـ ٣ كروت لحماية الستريك من الضياع عند الانقطاع.</li>
                    <li><strong>لجنة المتابعة 🚀:</strong> كل ٧ أيام من الاستمرارية في الستريك ستحصلين على صندوق هدية يحتوي إما على ٣٠٠ نقطة أو كرت استعادة ستريك إضافي.</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold shrink-0">٥</div>
                <div>
                  <h3 className="font-bold text-base mb-1">الطرد من المجموعة</h3>
                  <p>عند وقوع العقاب، يجب عليكِ الضغط على "أتممت العقاب". إذا ضغطتِ على "لم أتمم" سيتم طردك نهائياً من المجموعة (يمكنك التراجع خلال ٤ ثوانٍ).</p>
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
