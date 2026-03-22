/**
 * Shared utility — detects if a string looks like C++ code.
 * Used in both page.js (client) and route.js (server).
 */
export function looksLikeCode(text) {
  const t = text.trim();

  // Strong single signals — any one is enough
  const strongSignals = [
    /#include\s*[<"]/,          // #include <...> or #include "..."
    /int\s+main\s*\(/,          // int main(
    /std::/,                    // std::vector, std::cout etc
    /cout\s*<</,                // cout <<
    /cin\s*>>/,                 // cin >>
    /#define\s+\w+/,            // #define MACRO
    /using\s+namespace\s+std/,  // using namespace std
    /\btemplate\s*</,           // template<
    /\bnew\s+\w+/,              // new SomeType
    /\bdelete\s+\w+/,           // delete ptr
  ];

  for (const re of strongSignals) {
    if (re.test(t)) return true;
  }

  // Weak signals — need multiple
  const weakSignals = [
    /\bvoid\b/,
    /\bint\b/,
    /\breturn\s+\w+/,
    /\bfor\s*\(/,
    /\bwhile\s*\(/,
    /\bif\s*\(/,
    /\bvector\s*</,
    /\bstring\b/,
    /[;{}]/,
    /\w+\s*\(.*\)\s*\{/,       // function definition
    /swap\s*\(/,
    /sort\s*\(/,
    /push_back\s*\(/,
    /\.size\s*\(\)/,
    /arr\[/,
    /ptr->/,
  ];

  const weakCount = weakSignals.filter((re) => re.test(t)).length;

  // 3+ weak signals and more than 3 lines = very likely code
  const lineCount = t.split('\n').length;
  return weakCount >= 3 && lineCount >= 3;
}