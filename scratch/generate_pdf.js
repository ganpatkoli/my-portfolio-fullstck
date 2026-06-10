import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const streamContent = `BT
/F1 22 Tf
50 780 Td
(Ganpat Koli - Resume) Tj
0 -26 Td
/F1 12 Tf
(Front-End Developer) Tj
0 -22 Td
(Location: Indore, Madhya Pradesh, India) Tj
0 -15 Td
(Profiles: github.com/ganpatkoli  |  linkedin.com/in/ganpatkoli) Tj
0 -15 Td
(Contact: Email & Phone available upon request via LinkedIn or GitHub) Tj
0 -30 Td
/F1 14 Tf
(PROFESSIONAL SUMMARY) Tj
0 -18 Td
/F1 10 Tf
(Front-End Developer at P&P Infotech with 4+ years of experience building high-performance,) Tj
0 -12 Td
(responsive React applications, customized trading charts, and secure document signing systems.) Tj
0 -24 Td
/F1 14 Tf
(PROFESSIONAL EXPERIENCE) Tj
0 -18 Td
/F1 11 Tf
(P&P Infotech - Front-End Developer  [December 2021 - Present]) Tj
0 -15 Td
/F1 10 Tf
(- SMART-ALGO (v-2.0): Engineered algorithmic option chain and strategy builder. Built modular) Tj
0 -12 Td
(  user interfaces, preset themes, and achieved 3x rendering speed increase via DOM rendering audits.) Tj
0 -14 Td
(- COPY TRADING: Constructed low-latency trade replication system connecting Master and Child client portals.) Tj
0 -14 Td
(- E-SIGN: Developed secure document signature platform integrated with SurePass API for KYC.) Tj
0 -14 Td
(- SERVICE-VAULT: Programmed localized workflow management dashboard supporting multiple languages.) Tj
0 -14 Td
(- SMART-ALGO (v-1.0): Designed stock price trigger indicator systems for automatic trade execution.) Tj
0 -26 Td
/F1 14 Tf
(TECHNICAL SKILLS) Tj
0 -18 Td
/F1 10 Tf
(Languages & Core: ReactJS, Redux, Redux-Toolkit, JavaScript, HTML5, CSS3) Tj
0 -14 Td
(UI Frameworks: Tailwind CSS, Bootstrap 4/5, Responsive Grid Layouts) Tj
0 -14 Td
(Back-End & Databases: Node.js (Familiar), MongoDB, MySQL, Redis, WebSockets) Tj
0 -14 Td
(Tools & Services: SurePass API, Broker APIs, Git, GitHub, Postman, Thunder Client) Tj
0 -26 Td
/F1 14 Tf
(EDUCATION) Tj
0 -18 Td
/F1 11 Tf
(Bachelor of Computer Application (BCA)) Tj
0 -14 Td
/F1 10 Tf
(Seeta Devi College (Bhilwara)  -  Graduated July 2019) Tj
ET`;

const streamLength = Buffer.byteLength(streamContent);

let pdf = `%PDF-1.4\n`;
const offsets = [];

const addObject = (content) => {
  offsets.push(pdf.length);
  pdf += content + `\n`;
};

// Obj 1: Catalog
addObject(`1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj`);

// Obj 2: Pages list
addObject(`2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj`);

// Obj 3: Page definition (A4 Size: 595 x 842 points)
addObject(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.275 841.889] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj`);

// Obj 4: Content stream
addObject(`4 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamContent}\nendstream\nendobj`);

// Obj 5: Font definition
addObject(`5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj`);

// Cross-reference table
const xrefOffset = pdf.length;
let xref = `xref\n0 ${offsets.length + 1}\n0000000000 65535 f \n`;
for (let i = 0; i < offsets.length; i++) {
  const pad = String(offsets[i]).padStart(10, '0');
  xref += `${pad} 00000 n \n`;
}

pdf += xref;
pdf += `trailer\n<< /Size ${offsets.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

const targetPath = path.join(__dirname, '../public/Ganpat_Koli_Resume.pdf');
fs.writeFileSync(targetPath, pdf);
console.log('PDF Generated Successfully at:', targetPath);
