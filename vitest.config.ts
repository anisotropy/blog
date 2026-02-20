import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    typecheck: {
      enabled: true,
      ignoreSourceErrors: true, // 타입 테스트 파일(*)만 검증, 소스 코드 오류는 무시
    },
  },
});
