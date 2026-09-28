import { canCreateOrEditQuestion } from './questionAuthorization';

const cases = [
  {
    name: 'Unauthenticated',
    profile: null,
    expected: false,
  },
  {
    name: 'Registered user - active',
    profile: {
      role: 'user',
      status: 'active',
    },
    expected: false,
  },
  {
    name: 'Editor - active',
    profile: {
      role: 'editor',
      status: 'active',
    },
    expected: true,
  },
  {
    name: 'Moderator - active',
    profile: {
      role: 'moderator',
      status: 'active',
    },
    expected: true,
  },
  {
    name: 'Admin - active',
    profile: {
      role: 'admin',
      status: 'active',
    },
    expected: true,
  },
  {
    name: 'Editor - restricted',
    profile: {
      role: 'editor',
      status: 'restricted',
    },
    expected: false,
  },
  {
    name: 'Moderator - suspended',
    profile: {
      role: 'moderator',
      status: 'suspended',
    },
    expected: false,
  },
  {
    name: 'Admin - blocked',
    profile: {
      role: 'admin',
      status: 'blocked',
    },
    expected: false,
  },
];

console.table(
  cases.map((testCase) => {
    const actual = canCreateOrEditQuestion(testCase.profile as any);
    return {
      test: testCase.name,
      expected: testCase.expected,
      actual,
      result: actual === testCase.expected ? 'PASS' : 'FAIL',
    };
  })
);
