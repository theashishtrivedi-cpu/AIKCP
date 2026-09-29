import { canPerformQuestionAction } from './questionAuthorization';

type TestCase = {
  name: string;
  action: 'create' | 'edit';
};

const testCases: TestCase[] = [
  { name: 'create question', action: 'create' },
  { name: 'edit question', action: 'edit' },
];

async function runTests(): Promise<void> {
  const results = [];

  for (const testCase of testCases) {
    try {
      const actual = await canPerformQuestionAction(testCase.action);

      results.push({
        test: testCase.name,
        result: actual,
        status: 'PASS',
      });
    } catch (error) {
      results.push({
        test: testCase.name,
        result: false,
        status: 'FAIL',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  console.table(results);

  if (results.some((result) => result.status === 'FAIL')) {
    throw new Error('Question authorization validation failed.');
  }
}

void runTests();
