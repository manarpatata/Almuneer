const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `{/* Shipping Label */}
                  <div className="absolute top-4 left-4 bg-[#fdf8e6] px-2.5 py-2 rounded shadow-sm border border-[#d4b483] w-40 rotate-[5deg] z-20 font-mono">
                    <div className="text-center text-[10px] font-bold text-[#8c6b44] border-b border-[#8c6b44] pb-0.5 mb-2">بـيـانـات الـشـحـن</div>`;

const replacement = `{/* Shipping Label */}
                  <div className="absolute top-4 left-4 bg-[#fdf8e6] px-2.5 py-2 rounded shadow-sm border border-[#d4b483] w-40 rotate-[5deg] z-20 font-mono">
                    {/* Tape piece */}
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 h-5 bg-white/60 backdrop-blur-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.12)] border border-white/40 -rotate-3 z-30" style={{ clipPath: 'polygon(2% 0, 98% 0, 100% 10%, 99% 20%, 100% 30%, 98% 40%, 100% 50%, 99% 60%, 100% 70%, 98% 80%, 100% 90%, 98% 100%, 2% 100%, 0 90%, 2% 80%, 0 70%, 1% 60%, 0 50%, 2% 40%, 0 30%, 1% 20%, 0 10%)' }}></div>
                    
                    <div className="text-center text-[10px] font-bold text-[#8c6b44] border-b border-[#8c6b44] pb-0.5 mb-2 pt-1">بـيـانـات الـشـحـن</div>`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync('src/App.tsx', content);
    console.log("Tape added!");
} else {
    console.log("Target not found!");
}
