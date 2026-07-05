# Crocadee-FE (CodeBite Project)

Dự án Frontend cho nền tảng CodeBite.

## Tech Stack

| Technology              | Purpose                                 |
| :---------------------- | :-------------------------------------- |
| **React 19**            | UI library                              |
| **TypeScript**          | Type safety                             |
| **Vite**                | Build tool & dev server                 |
| **Tailwind CSS v4**     | Utility-first styling                   |
| **TanStack Router**     | Type-safe client-side routing           |
| **Zustand**             | State management                        |
| **Axios**               | HTTP client                             |
| **ESLint**              | Code linting                            |
| **Prettier**            | Code formatting                         |
| **Husky + lint-staged** | Pre-commit hooks & conventional commits |

## Setup

```bash
# 1. Install dependencies
yarn

# 2. Start development server
yarn dev

# 3. Build for production
yarn build

Pre-commit Rules:
Chạy lint-staged — Tự động dò lỗi (ESLint) và format lại code (Prettier) cho các file đã staged.

Kiểm tra Commit Message — Phải tuân thủ chuẩn Conventional Commits (ví dụ: feat: add login, fix: header bug).

Kiểm tra Branch Name — Nhanh làm việc của bạn phải tuân thủ quy tắc dưới đây.

Quy tắc đặt tên nhánh (Branch Naming Convention):
```
