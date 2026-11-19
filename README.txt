TH03 - BAI 1 + BAI 2 (React + Vite) - BAN PROJECT DAY DU

PROJECT DA BAO GOM:
- package.json
- index.html
- vite.config.js
- src/ va public/data/courses.json

CAI DAT VA CHAY:
1. Giai nen ZIP.
2. Mo thu muc TH03_Bai1_Bai2_Complete bang VS Code.
3. Mo Terminal tai thu muc goc (noi co package.json).
4. Chay:
   npm install
   npm run dev
5. Mo dia chi localhost do Vite hien trong Terminal.

BUILD KIEM TRA:
   npm run build

THU VIEN:
- React va React DOM
- Vite va plugin React
- Redux Toolkit
- React Redux
- Context API va cac React Hooks da co san trong React.

NEU MUON CHEP VAO PROJECT VITE DANG CO:
- Khong can copy package.json/index.html neu project da co san.
- Copy noi dung src/ va public/ vao project hien tai.
- Copy vite.config.js neu can ho tro JSX trong App.js.
- Chay npm install @reduxjs/toolkit react-redux trong thu muc goc cua project.

BAI 1:
- useFetch + AbortController
- useReducer quan ly danh sach mon hoc
- useRef focus o ma mon
- useMemo tinh thong ke va loc
- them, sua diem, xoa mon, tim kiem

BAI 2:
- Context API quan ly giao dien sang/toi
- Redux Toolkit quan ly GPA muc tieu va tin chi con lai
- Tinh GPA can dat cho cac tin chi con lai

YEU CAU DE BAI:
- BUILD_TAG = "gp-4073" trong src/App.js sau cac import
- data-build tren div ngoai cung cua App
- Ham tim kiem ten handleCourseShift
- Fetch /data/courses.json
