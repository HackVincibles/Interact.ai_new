// Comprehensive Dynamic Coding Problem Bank for Interact.ai Studio
// Organized by difficulty (Easy, Medium, Hard/FAANG) and role/category

export const CODING_PROBLEMS = [
  // ==========================================
  // EASY PROBLEMS
  // ==========================================
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Array & Hash Map',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice. You can return the answer in any order.`,
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0, 1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1, 2]', explanation: 'nums[1] + nums[2] == 6.' }
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9'],
    testCases: [
      { id: 1, name: 'Test 1', input: 'nums = [2, 7, 11, 15], target = 9', expected: '[0, 1]', args: [[2, 7, 11, 15], 9], status: 'pending' },
      { id: 2, name: 'Test 2', input: 'nums = [3, 2, 4], target = 6', expected: '[1, 2]', args: [[3, 2, 4], 6], status: 'pending' },
      { id: 3, name: 'Test 3', input: 'nums = [3, 3], target = 6', expected: '[0, 1]', args: [[3, 3], 6], status: 'pending' }
    ],
    fnName: 'solveProblem',
    boilerplate: {
      javascript: `// JavaScript Solution (Optimal Hash Map - O(N))
function solveProblem(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) return [map.get(diff), i];
    map.set(nums[i], i);
  }
  return [];
}`,
      python: `# Python 3 Solution (Optimal Hash Map)
def solve_problem(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`,
      cpp: `// C++ 17 Solution
#include <vector>
#include <unordered_map>

class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        std::unordered_map<int, int> map;
        for (int i = 0; i < nums.size(); i++) {
            int diff = target - nums[i];
            if (map.find(diff) != map.end()) return {map[diff], i};
            map[nums[i]] = i;
        }
        return {};
    }
};`,
      java: `// Java 17 Solution
import java.util.HashMap;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        HashMap<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int diff = target - nums[i];
            if (map.containsKey(diff)) return new int[] { map.get(diff), i };
            map.put(nums[i], i);
        }
        return new int[0];
    }
}`,
      sql: `-- SQL Solution
SELECT t1.id AS index1, t2.id AS index2
FROM numbers t1 JOIN numbers t2 ON t1.id < t2.id
WHERE t1.val + t2.val = 9;`
    }
  },
  {
    id: 'valid-palindrome',
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    category: 'Two Pointers',
    description: `A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.

Given a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.`,
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' },
      { input: 's = "race a car"', output: 'false', explanation: '"raceacar" is not a palindrome.' }
    ],
    constraints: ['1 <= s.length <= 2 * 10^5', 's consists only of printable ASCII characters.'],
    testCases: [
      { id: 1, name: 'Test 1', input: 's = "A man, a plan, a canal: Panama"', expected: 'true', args: ["A man, a plan, a canal: Panama"], status: 'pending' },
      { id: 2, name: 'Test 2', input: 's = "race a car"', expected: 'false', args: ["race a car"], status: 'pending' },
      { id: 3, name: 'Test 3', input: 's = " "', expected: 'true', args: [" "], status: 'pending' }
    ],
    fnName: 'solveProblem',
    boilerplate: {
      javascript: `// JavaScript Solution (Two Pointers - O(N))
function solveProblem(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0, right = clean.length - 1;
  while (left < right) {
    if (clean[left] !== clean[right]) return false;
    left++;
    right--;
  }
  return true;
}`,
      python: `# Python 3 Solution
def solve_problem(s):
    clean = "".join(ch.lower() for ch in s if ch.isalnum())
    return clean == clean[::-1]`,
      cpp: `// C++ 17 Solution
#include <string>
#include <cctype>

class Solution {
public:
    bool isPalindrome(std::string s) {
        int left = 0, right = s.length() - 1;
        while (left < right) {
            while (left < right && !isalnum(s[left])) left++;
            while (left < right && !isalnum(s[right])) right--;
            if (tolower(s[left]) != tolower(s[right])) return false;
            left++; right--;
        }
        return true;
    }
};`,
      java: `// Java 17 Solution
class Solution {
    public boolean isPalindrome(String s) {
        String clean = s.toLowerCase().replaceAll("[^a-z0-9]", "");
        int left = 0, right = clean.length() - 1;
        while (left < right) {
            if (clean.charAt(left) != clean.charAt(right)) return false;
            left++; right--;
        }
        return true;
    }
}`,
      sql: `-- SQL String Match
SELECT CASE WHEN LOWER(s) = REVERSE(LOWER(s)) THEN 'true' ELSE 'false' END FROM strings;`
    }
  },

  // ==========================================
  // MEDIUM PROBLEMS
  // ==========================================
  {
    id: 'container-with-most-water',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    category: 'Two Pointers',
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i-th\` line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the *maximum amount of water* a container can store.`,
    examples: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explanation: 'The max area is formed between index 1 (height 8) and index 8 (height 7) = 7 * 7 = 49.' },
      { input: 'height = [1,1]', output: '1', explanation: 'Area = 1 * 1 = 1.' }
    ],
    constraints: ['n == height.length', '2 <= n <= 10^5', '0 <= height[i] <= 10^4'],
    testCases: [
      { id: 1, name: 'Test 1', input: 'height = [1, 8, 6, 2, 5, 4, 8, 3, 7]', expected: '49', args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], status: 'pending' },
      { id: 2, name: 'Test 2', input: 'height = [1, 1]', expected: '1', args: [[1, 1]], status: 'pending' },
      { id: 3, name: 'Test 3', input: 'height = [4, 3, 2, 1, 4]', expected: '16', args: [[4, 3, 2, 1, 4]], status: 'pending' }
    ],
    fnName: 'solveProblem',
    boilerplate: {
      javascript: `// JavaScript Solution (Two Pointers - O(N))
function solveProblem(height) {
  let maxArea = 0;
  let left = 0, right = height.length - 1;
  while (left < right) {
    const currentArea = Math.min(height[left], height[right]) * (right - left);
    maxArea = Math.max(maxArea, currentArea);
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  return maxArea;
}`,
      python: `# Python 3 Solution
def solve_problem(height):
    max_area = 0
    left, right = 0, len(height) - 1
    while left < right:
        area = min(height[left], height[right]) * (right - left)
        max_area = max(max_area, area)
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return max_area`,
      cpp: `// C++ 17 Solution
#include <vector>
#include <algorithm>

class Solution {
public:
    int maxArea(std::vector<int>& height) {
        int max_water = 0;
        int left = 0, right = height.size() - 1;
        while (left < right) {
            int h = std::min(height[left], height[right]);
            max_water = std::max(max_water, h * (right - left));
            if (height[left] < height[right]) left++;
            else right--;
        }
        return max_water;
    }
};`,
      java: `// Java 17 Solution
class Solution {
    public int maxArea(int[] height) {
        int maxArea = 0;
        int left = 0, right = height.length - 1;
        while (left < right) {
            int currentArea = Math.min(height[left], height[right]) * (right - left);
            maxArea = Math.max(maxArea, currentArea);
            if (height[left] < height[right]) left++;
            else right--;
        }
        return maxArea;
    }
}`,
      sql: `-- SQL Area Calculation
SELECT MAX(LEAST(h1.val, h2.val) * (h2.id - h1.id)) FROM heights h1 JOIN heights h2 ON h1.id < h2.id;`
    }
  },
  {
    id: 'product-except-self',
    title: 'Product of Array Except Self',
    difficulty: 'Medium',
    category: 'Prefix & Suffix Array',
    description: `Given an integer array \`nums\`, return an array \`answer\` such that \`answer[i]\` is equal to the product of all the elements of \`nums\` except \`nums[i]\`.

The algorithm must run in **O(N)** time complexity and **without using the division operation**.`,
    examples: [
      { input: 'nums = [1,2,3,4]', output: '[24, 12, 8, 6]', explanation: 'Prefix & Suffix product calculations.' },
      { input: 'nums = [-1,1,0,-3,3]', output: '[0, 0, 9, 0, 0]', explanation: 'Product with zero handling.' }
    ],
    constraints: ['2 <= nums.length <= 10^5', '-30 <= nums[i] <= 30', 'Product fits in 32-bit integer.'],
    testCases: [
      { id: 1, name: 'Test 1', input: 'nums = [1, 2, 3, 4]', expected: '[24, 12, 8, 6]', args: [[1, 2, 3, 4]], status: 'pending' },
      { id: 2, name: 'Test 2', input: 'nums = [-1, 1, 0, -3, 3]', expected: '[0, 0, 9, 0, 0]', args: [[-1, 1, 0, -3, 3]], status: 'pending' }
    ],
    fnName: 'solveProblem',
    boilerplate: {
      javascript: `// JavaScript Solution (O(N) Prefix & Suffix Product)
function solveProblem(nums) {
  const n = nums.length;
  const res = new Array(n).fill(1);
  let prefix = 1;
  for (let i = 0; i < n; i++) {
    res[i] = prefix;
    prefix *= nums[i];
  }
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    res[i] *= suffix;
    suffix *= nums[i];
  }
  return res;
}`,
      python: `# Python 3 Solution
def solve_problem(nums):
    n = len(nums)
    res = [1] * n
    prefix = 1
    for i in range(n):
        res[i] = prefix
        prefix *= nums[i]
    suffix = 1
    for i in range(n - 1, -1, -1):
        res[i] *= suffix
        suffix *= nums[i]
    return res`,
      cpp: `// C++ 17 Solution
#include <vector>

class Solution {
public:
    std::vector<int> productExceptSelf(std::vector<int>& nums) {
        int n = nums.size();
        std::vector<int> res(n, 1);
        int prefix = 1;
        for (int i = 0; i < n; i++) {
            res[i] = prefix;
            prefix *= nums[i];
        }
        int suffix = 1;
        for (int i = n - 1; i >= 0; i--) {
            res[i] *= suffix;
            suffix *= nums[i];
        }
        return res;
    }
};`,
      java: `// Java 17 Solution
class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] res = new int[n];
        int prefix = 1;
        for (int i = 0; i < n; i++) {
            res[i] = prefix;
            prefix *= nums[i];
        }
        int suffix = 1;
        for (int i = n - 1; i >= 0; i--) {
            res[i] *= suffix;
            suffix *= nums[i];
        }
        return res;
    }
}`,
      sql: `-- SQL Calculation
SELECT id, (SELECT EXP(SUM(LN(ABS(val)))) FROM numbers n2 WHERE n2.id <> n1.id) AS prod FROM numbers n1;`
    }
  },

  // ==========================================
  // HARD / FAANG LEVEL PROBLEMS
  // ==========================================
  {
    id: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    difficulty: 'FAANG Level (Hard)',
    category: 'Two Pointers & Monotonic Stack',
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: '6 units of rain water trapped in elevation map.' },
      { input: 'height = [4,2,0,3,2,5]', output: '9', explanation: '9 units of rain water trapped.' }
    ],
    constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    testCases: [
      { id: 1, name: 'Test 1', input: 'height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]', expected: '6', args: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], status: 'pending' },
      { id: 2, name: 'Test 2', input: 'height = [4, 2, 0, 3, 2, 5]', expected: '9', args: [[4, 2, 0, 3, 2, 5]], status: 'pending' }
    ],
    fnName: 'solveProblem',
    boilerplate: {
      javascript: `// JavaScript Solution (Two Pointers - O(N) Time, O(1) Space)
function solveProblem(height) {
  if (!height || height.length === 0) return 0;
  let left = 0, right = height.length - 1;
  let maxLeft = 0, maxRight = 0;
  let trapped = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= maxLeft) maxLeft = height[left];
      else trapped += maxLeft - height[left];
      left++;
    } else {
      if (height[right] >= maxRight) maxRight = height[right];
      else trapped += maxRight - height[right];
      right--;
    }
  }
  return trapped;
}`,
      python: `# Python 3 Solution
def solve_problem(height):
    if not height: return 0
    left, right = 0, len(height) - 1
    max_left, max_right = 0, 0
    water = 0
    while left < right:
        if height[left] < height[right]:
            if height[left] >= max_left: max_left = height[left]
            else: water += max_left - height[left]
            left += 1
        else:
            if height[right] >= max_right: max_right = height[right]
            else: water += max_right - height[right]
            right -= 1
    return water`,
      cpp: `// C++ 17 Solution
#include <vector>
#include <algorithm>

class Solution {
public:
    int trap(std::vector<int>& height) {
        int left = 0, right = height.size() - 1;
        int maxLeft = 0, maxRight = 0, water = 0;
        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= maxLeft) maxLeft = height[left];
                else water += maxLeft - height[left];
                left++;
            } else {
                if (height[right] >= maxRight) maxRight = height[right];
                else water += maxRight - height[right];
                right--;
            }
        }
        return water;
    }
};`,
      java: `// Java 17 Solution
class Solution {
    public int trap(int[] height) {
        int left = 0, right = height.length - 1;
        int maxLeft = 0, maxRight = 0, water = 0;
        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= maxLeft) maxLeft = height[left];
                else water += maxLeft - height[left];
                left++;
            } else {
                if (height[right] >= maxRight) maxRight = height[right];
                else water += maxRight - height[right];
                right--;
            }
        }
        return water;
    }
}`,
      sql: `-- SQL Trapping Water Calculation
SELECT SUM(water) FROM (SELECT LEAST(max_l, max_r) - height AS water FROM elevation_map);`
    }
  },

  // ==========================================
  // SQL / DATABASE ROLE PROBLEM
  // ==========================================
  {
    id: 'employees-earning-more-than-manager',
    title: 'Employees Earning More Than Their Managers',
    difficulty: 'Medium',
    category: 'SQL Database',
    description: `Given the \`Employee\` table containing employee \`id\`, \`name\`, \`salary\`, and \`managerId\`, write a SQL query to find the employees who earn more than their managers.

Return the result table in any order.`,
    examples: [
      { input: 'Employee table with Joe (70000, managerId: 3) and Sam (60000, managerId: 4)', output: 'Joe', explanation: 'Joe earns 70000 which is greater than his manager (30000).' }
    ],
    constraints: ['Employee id is primary key.', 'managerId references Employee id.'],
    testCases: [
      { id: 1, name: 'Test 1', input: 'Employee: [Joe: 70k (mgr: 3), Henry: 80k (mgr: 4), Sam: 60k, Max: 90k]', expected: '["Joe"]', args: [], status: 'pending' }
    ],
    fnName: 'solveProblem',
    boilerplate: {
      javascript: `// JavaScript Solution (Self-Join Simulation)
function solveProblem(employees) {
  const map = new Map();
  employees.forEach(e => map.set(e.id, e));
  return employees
    .filter(e => e.managerId && map.has(e.managerId) && e.salary > map.get(e.managerId).salary)
    .map(e => e.name);
}`,
      python: `# Python 3 Solution
def solve_problem(employees):
    emp_map = {e['id']: e for e in employees}
    return [e['name'] for e in employees if e.get('managerId') in emp_map and e['salary'] > emp_map[e['managerId']]['salary']]`,
      cpp: `// C++ 17 Solution
#include <vector>
#include <string>
#include <unordered_map>

struct Employee { int id; std::string name; int salary; int managerId; };

class Solution {
public:
    std::vector<std::string> findHighEarners(std::vector<Employee>& employees) {
        std::unordered_map<int, int> salaries;
        for (auto& e : employees) salaries[e.id] = e.salary;
        std::vector<std::string> result;
        for (auto& e : employees) {
            if (e.managerId && salaries.count(e.managerId) && e.salary > salaries[e.managerId]) {
                result.push_back(e.name);
            }
        }
        return result;
    }
};`,
      java: `// Java 17 Solution
import java.util.*;

class Solution {
    public List<String> findHighEarners(List<Map<String, Object>> employees) {
        Map<Integer, Integer> salaries = new HashMap<>();
        for (var e : employees) salaries.put((Integer)e.get("id"), (Integer)e.get("salary"));
        List<String> result = new ArrayList<>();
        for (var e : employees) {
            Integer mgrId = (Integer)e.get("managerId");
            if (mgrId != null && salaries.containsKey(mgrId) && (Integer)e.get("salary") > salaries.get(mgrId)) {
                result.add((String)e.get("name"));
            }
        }
        return result;
    }
}`,
      sql: `-- SQL Solution (Self Join)
SELECT e1.name AS Employee
FROM Employee e1
JOIN Employee e2 ON e1.managerId = e2.id
WHERE e1.salary > e2.salary;`
    }
  }
];

/**
 * Selects an optimal coding problem based on difficulty, role, and previously used problem IDs in the session.
 */
export function selectCodingProblem(difficulty = 'Medium', targetRole = '', roundType = '', usedIds = []) {
  let candidatePool = CODING_PROBLEMS;

  // 1. Role / Round domain matching
  const isSqlRole = targetRole?.toLowerCase().includes('data') || targetRole?.toLowerCase().includes('sql') || roundType?.toLowerCase() === 'sql';
  if (isSqlRole) {
    const sqlProblems = candidatePool.filter(p => p.category === 'SQL Database');
    if (sqlProblems.length > 0) candidatePool = sqlProblems;
  }

  // 2. Difficulty matching
  const targetDiff = (difficulty || '').toLowerCase();
  let diffFiltered = candidatePool.filter(p => {
    const pDiff = p.difficulty.toLowerCase();
    if (targetDiff.includes('easy')) return pDiff.includes('easy');
    if (targetDiff.includes('hard') || targetDiff.includes('faang')) return pDiff.includes('hard') || pDiff.includes('faang');
    return pDiff.includes('medium') || pDiff.includes('easy');
  });

  if (diffFiltered.length === 0) {
    diffFiltered = candidatePool;
  }

  // 3. Deduplication against usedIds in current interview session
  const unusedPool = diffFiltered.filter(p => !usedIds.includes(p.id));
  const finalPool = unusedPool.length > 0 ? unusedPool : diffFiltered;

  // 4. Return random problem from final matching pool
  const selected = finalPool[Math.floor(Math.random() * finalPool.length)];
  return selected || CODING_PROBLEMS[0];
}
