const fs = require('fs');
let code = fs.readFileSync('src/components/CalendarTracker.tsx', 'utf8');

const oldCheck = `    const expelled = stats?.failedPunishments ? true : stats?.expelled;
    const resolved = stats?.resolvedPunishments || (stats?.punishmentResolved ? 1 : 0);
    const punished = stats?.punishedDaily || stats?.punished2Days;
    const completed = stats?.lessonsCompleted || 0;`;

const newCheck = `    const expelled = stats?.failedPunishments ? true : stats?.expelled;
    const resolved = stats?.resolvedPunishments || (stats?.punishmentResolved ? 1 : 0);
    const punished2Days = stats?.punished2Days;
    const punishedDaily = stats?.punishedDaily;
    const completed = stats?.lessonsCompleted || 0;`;

const oldToday = `        if (expelled) {
            boxClass += "bg-slate-100 border-2 border-slate-800 text-lg shadow-sm";
            content = <>🔪</>;
        } else if (punished) {
            boxClass += "bg-red-100 border-2 border-red-500 text-lg shadow-sm";
            content = <>🔫</>;
        }`;

const newToday = `        if (expelled) {
            boxClass += "bg-slate-100 border-2 border-slate-800 text-lg shadow-sm";
            content = <>🔪</>;
        } else if (punished2Days) {
            boxClass += "bg-red-100 border-2 border-red-500 text-lg shadow-sm";
            content = <>📦</>;
        } else if (punishedDaily) {
            boxClass += "bg-blue-100 border-2 border-blue-400 text-lg shadow-sm";
            content = <>🔫</>;
        }`;

const oldPast = `        if (expelled) {
            boxClass += "bg-slate-800 text-white text-lg shadow-sm";
            content = <>🔪</>;
        } else if (punished) {
            boxClass += "bg-red-500 text-white text-lg shadow-sm shadow-red-200";
            content = <>🔫</>;
        }`;

const newPast = `        if (expelled) {
            boxClass += "bg-slate-800 text-white text-lg shadow-sm";
            content = <>🔪</>;
        } else if (punished2Days) {
            boxClass += "bg-red-500 text-white text-lg shadow-sm shadow-red-200";
            content = <>📦</>;
        } else if (punishedDaily) {
            boxClass += "bg-blue-400 text-white text-lg shadow-sm shadow-blue-200";
            content = <>🔫</>;
        }`;

code = code.replace(oldCheck, newCheck);
code = code.replace(oldToday, newToday);
code = code.replace(oldPast, newPast);

fs.writeFileSync('src/components/CalendarTracker.tsx', code);
console.log("Patched CalendarTracker.tsx");
