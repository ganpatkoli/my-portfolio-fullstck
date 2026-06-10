const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = walkSync(dirFile, filelist);
    } catch (err) {
      if (err.code === 'ENOTDIR' || err.code === 'EBUSY') filelist = [...filelist, dirFile];
      else throw err;
    }
  });
  return filelist;
};

const files = walkSync('src')
  .filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

// A map to replace tailwind's neutral palette with pure black/white alpha equivalents
// This enforces a pure dark mode glassmorphism look
const replacements = {
  // Text
  'text-neutral-50': 'text-white',
  'text-neutral-100': 'text-white/90',
  'text-neutral-200': 'text-white/80',
  'text-neutral-300': 'text-white/70',
  'text-neutral-400': 'text-white/60',
  'text-neutral-500': 'text-white/50',
  'text-neutral-600': 'text-white/40',
  'text-neutral-700': 'text-white/30',
  'text-neutral-800': 'text-white/20',
  'text-neutral-900': 'text-white/10',
  'text-neutral-950': 'text-white/5',
  
  // Backgrounds
  'bg-neutral-50': 'bg-white/10',
  'bg-neutral-100': 'bg-white/5',
  'bg-neutral-200': 'bg-white/5',
  'bg-neutral-300': 'bg-white/5',
  'bg-neutral-700': 'bg-black/20',
  'bg-neutral-800': 'bg-black/40',
  'bg-neutral-850': 'bg-black/60',
  'bg-neutral-900': 'bg-black/60',
  'bg-neutral-950': 'bg-black/80',

  // Borders
  'border-neutral-200': 'border-white/10',
  'border-neutral-300': 'border-white/20',
  'border-neutral-700': 'border-white/10',
  'border-neutral-800': 'border-white/10',
  'border-neutral-850': 'border-white/5',
  'border-neutral-900': 'border-white/5',
  'border-neutral-950': 'border-white/5',

  // Rings
  'ring-neutral-200': 'ring-white/10',
  'ring-neutral-800': 'ring-white/10',
  'ring-neutral-900': 'ring-white/5',
  'ring-neutral-950': 'ring-white/5',
  
  // Placeholder
  'placeholder-neutral-400': 'placeholder-white/40',
  'placeholder-neutral-500': 'placeholder-white/30',
};

let totalReplaced = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Since we force dark mode, we can also remove the "dark:" prefix from these replacements to simplify
  // or just replace the exact word.
  // Actually, we'll just replace the exact word (e.g. `dark:text-neutral-400` -> `dark:text-white/60`, which is fine)
  
  for (const [key, value] of Object.entries(replacements)) {
    // regex to match the exact class name
    const regex = new RegExp(`\\b${key}\\b`, 'g');
    content = content.replace(regex, value);
  }
  
  // Also catch any missed neutral
  content = content.replace(/\bneutral\b/g, 'white');

  if (content !== original) {
    fs.writeFileSync(file, content);
    totalReplaced++;
    console.log(`Updated ${file}`);
  }
});

console.log(`Done. Updated ${totalReplaced} files.`);
