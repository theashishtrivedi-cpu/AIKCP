import { canPerformQuestionAction } from './questionAuthorization';

const cases = [
  {
    name: 'Unauthenticated - create',
    profile: null,
    action: 'create' as const,
    expected: false,
  },
  {
    name: 'User - create',
    profile: {
      role: 'user',
      status: 'active',
    },
    action: 'create' as const,
    expected: false,
  },
  {
    name: 'Moderator - create',
    profile: {
      role: 'moderator',
      status: 'active',
    },
    action: 'create' as const,
    expected: false,
  },
  {
    name: 'Admin - create',
    profile: {
      role: 'admin',
      status: 'active',
    },
    action: 'create' as const,
    expected: false,
  },
  {
    name: 'User - edit',
    profile: {
      role: 'user',
      status: 'active',
    },
    action: 'edit' as const,
    expected: false,
  },
  {
    name: 'Moderator - edit',
    profile: {
      role: 'moderator',
      status: 'active',
    },
    action: 'edit' as const,
    expected: false,
  },
  {
    name: 'Admin - edit',
    profile: {
      role: 'admin',
      status: 'active',
    },
    action: 'edit' as const,
    expected: false,
  },
];

console.table(
  cases.map((testCase) => {
    const actual = canPerformQuestionAction(
      testCase.profile as any,
      testCase.action
    );

    return {
      test: testCase.name,
      expected: testCase.expected,
      actual,
      result: actual === testCase.expected ? 'PASS' : 'FAIL',
    };
  })
);
