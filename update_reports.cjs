const fs = require('fs');
let content = fs.readFileSync('src/components/SupervisorReports.tsx', 'utf8');

// We want to remove the button and the AnimatePresence modal wrapper, just returning the inner content.
// The inner content starts with `<div className="flex-1 overflow-y-auto p-6" ref={chartRef}>` (wait, there's a header with Trophy).

content = content.replace(
  'return (\n    <>\n      <button \n        onClick={() => setShowModal(true)}\n        className="fixed bottom-6 left-6 z-50 bg-indigo-600 text-white p-4 rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 border-4 border-indigo-200"\n      >\n        <FileText className="w-8 h-8" />\n        <span className="font-black">لوحة الأبطال 🦸‍♀️</span>\n      </button>\n\n      <AnimatePresence>\n        {showModal && (\n          <div className="fixed inset-0 z-[300] bg-slate-900/80 backdrop-blur-sm flex justify-center items-center p-4">\n            <motion.div \n              initial={{ opacity: 0, scale: 0.9, y: 20 }}\n              animate={{ opacity: 1, scale: 1, y: 0 }}\n              exit={{ opacity: 0, scale: 0.9, y: 20 }}\n              className="bg-slate-50 w-full max-w-4xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden relative border-4 border-slate-200"\n              dir="rtl"\n            >\n              <div className="flex justify-between items-center p-6 bg-white border-b border-slate-200 shrink-0">\n                <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">\n                  <Trophy className="w-8 h-8 text-amber-500" />\n                  التقرير الأسبوعي ولوحة الأبطال ⭐️\n                </h2>\n                <div className="flex items-center gap-3">\n                  <button \n                    onClick={handleToggleGlobal}\n                    className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors ${showGlobal ? \'bg-emerald-100 text-emerald-700\' : \'bg-slate-100 text-slate-600\'}`}\n                  >\n                    {showGlobal ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}\n                    {showGlobal ? \'مرئي للطلاب\' : \'مخفي عن الطلاب\'}\n                  </button>\n                  <button \n                    onClick={downloadReport}\n                    className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors"\n                  >\n                    <Download className="w-4 h-4" />\n                    تحميل كصورة\n                  </button>\n                  <button onClick={() => setShowModal(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">\n                    <X className="w-6 h-6 text-slate-600" />\n                  </button>\n                </div>\n              </div>\n              \n              <div className="flex-1 overflow-y-auto p-6" ref={chartRef}>',
  `return (
    <div className="w-full mt-8 bg-slate-50 rounded-3xl shadow-sm border border-slate-200 overflow-hidden" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-center p-6 bg-white border-b border-slate-200 shrink-0 gap-4">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
          <Trophy className="w-8 h-8 text-amber-500" />
          التقرير الأسبوعي ولوحة الأبطال ⭐️
        </h2>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleToggleGlobal}
            className={\`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors \${showGlobal ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}\`}
          >
            {showGlobal ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {showGlobal ? 'مرئي للطلاب' : 'مخفي عن الطلاب'}
          </button>
          <button 
            onClick={downloadReport}
            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            تحميل كصورة
          </button>
        </div>
      </div>
      
      <div className="p-6" ref={chartRef}>`
);

content = content.replace(
  '</div>\n            </motion.div>\n          </div>\n        )}\n      </AnimatePresence>\n    </>',
  '</div>\n    </div>'
);

fs.writeFileSync('src/components/SupervisorReports.tsx', content);
console.log('Reports updated');
