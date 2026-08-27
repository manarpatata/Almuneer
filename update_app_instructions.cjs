const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldInstructions = `
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold shrink-0">٢</div>
                <div>
                  <h3 className="font-bold text-base mb-1">منطقة التهديد</h3>
                  <p>إذا لم تنجزي الحد الأدنى في يوم ما، ستكونين مهددة بالعقاب في اليوم التالي. الصندوق سيتحول للون الأصفر التحذيري.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold shrink-0">٣</div>
                <div>
                  <h3 className="font-bold text-base mb-1 text-red-700">لجنة العقوبات</h3>
                  <p>إذا فشلتِ في تحقيق الهدف (الحد الأدنى × ٢) لمجموع يومين متتاليين، ستحصلين على صندوق عقاب. يجب تنفيذه وإلا ستطردين من البرنامج وتخسرين نقاطك.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center font-bold shrink-0">٤</div>
                <div>
                  <h3 className="font-bold text-base mb-1 text-yellow-700">كروت الإعفاء والهدايا</h3>
                  <p>عند إنجاز ٢٠ درساً أو أكثر ليومين متتاليين، ستحصلين على "كرت إعفاء" كهدية. يمكنك استخدامه لإلغاء أي عقاب.</p>
                </div>
              </div>
`;

const newInstructions = `
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold shrink-0">٢</div>
                <div>
                  <h3 className="font-bold text-base mb-1">منطقة التهديد والرش بالماء</h3>
                  <p>إذا لم تنجزي الحد الأدنى في يوم ما، ستكونين مهددة بالعقاب في اليوم التالي.</p>
                  <p className="mt-1 text-blue-600 font-bold">🔫 رشة الماء: إذا مر يوم كامل بدون أي إنجاز (صفر درس)، سيتم رشك بالماء وخصم نقاط من رصيدك، وسيتم معاقبتك فوراً بصندوق عقاب!</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold shrink-0">٣</div>
                <div>
                  <h3 className="font-bold text-base mb-1 text-red-700">لجنة العقوبات</h3>
                  <p>إذا فشلتِ في تحقيق الهدف (الحد الأدنى × ٢) لمجموع يومين متتاليين، ستحصلين على صندوق عقاب. يجب تنفيذه وإلا ستطردين من البرنامج وتخسرين نقاطك.</p>
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
`;

code = code.replace(oldInstructions, newInstructions);
fs.writeFileSync('src/App.tsx', code);
