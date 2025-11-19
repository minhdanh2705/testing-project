// Tên file: frontend/src/setupTests.ts
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react'; // <--- THÊM DÒNG NÀY

configure({ testIdAttribute: 'data-text' });