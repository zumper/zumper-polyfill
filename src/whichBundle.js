// https://github.com/Tokimon/es-feature-detection/tree/master/syntax

// unique to dGrade browsers
// a dGrade browser would fail one of these tests
const dGrade = [
  // es2015
  'for(var i of []) {}', // for...of
  // 'return /.*/y.sticky === true', // RegExp.prototype.sticky
  // 'return /\\u{61}/u.unicode === true', // RegExp.prototype.unicode
  'const b=42', // const
  'let a=42', // let
  'var {a:A,b:B=3}={a:1};var [a,b]=[1,2];', // Destructuring
  'var a=[...[1,2]];var [...b]=a;', // Spread Array
  'function t(a,b) {};t(...[1,2]);t.call(this,...[1,2])', // Spread Function call
  'function t(a,...args) {};t(...[1,2,3]);t.call(this,...[1,2,3])', // Rest parameters
  'function t(a=1) {};t()', // Default parameters
  'var f=()=>{}', // Arrow function
  'function* g(){}', // Generator function
  '0b00100001', // Binary literals
  '0o222', // Octal literals
  'function f(a, b) {return a[0]+(b+1)+a[1];}var s=`life=${40+2}`,t=f`a:${5}x`', // Template Strings
  'var a=2,o={a}', // Shorthand property
  'var o={a(){}}', // Shorthand method
  "var a='a',o={[a]:1,['p']:2,[a+'p']:3}", // Computed property
  "(function(){'use strict';function f(){return 1;}{function f(){return 2;}}if(f()===2)throw 'Failed';})()", // Block level function declaration
  'class A {};class B extends A {}', // class
]

// unique to cGrade browsers
// a cGrade browser would fail one of these tests
const cGrade = [
  // es2016
  '2**3', // Exponentiation operator
  'function f(a,{b:{c}},...[d,...e]){};f(1,{b: {c: 2}}, 3,4,5,6)', // Rest parameter destructuring
  'var {a:{b,c}}={a:{b:1,c:2}}', // Nested rest destructuring
]

// unique to bGrade browsers
// a bGrade browser would fail one of these tests
const bGrade = [
  // es2017
  'async function f(){var a=await Promise.resolve(42);return a};f()', // async/await
  'function f(a,b,){};f()', // Trailing parameter commas
]

// TODO: resort these into proper graded browsers instead of syntax years
const grade2018 = [
  // 'return /.*/s.dotAll === true', // RegExp.prototype.dotAll
  // "var r = /(?<a>a)\\k<a>/.exec('aa'); return r && r.groups.a === 'a'", // RegExp Named Capture Groups
  // '/(?<!a)b(?<=b)c/', // RegExp Lookbehind Assertions
  'var a={a:1},b={b:2},c={...a,...b};var {...d}=c;', // Object Spread Properties
  // "return typeof Symbol.asyncIterator !== 'undefined'", // Symbol.asyncIterator
]

const grade2019 = [
  "try{throw ''}catch{return true;}", // Optional Catch Bindings
]

// NOTE: we don't need to test aGrade browsers

// NOTE: we're testing for failures so the logic is inversed.
const testSyntax = (script) => {
  try {
    return new Function('"use strict";\n' + script)() === false
  } catch (e) {
    return true
  }
}
module.exports = () => {
  try {
    if (dGrade.some(testSyntax)) {
      return 'd-grade'
    } else if (cGrade.some(testSyntax)) {
      return 'c-grade'
    } else if (bGrade.some(testSyntax)) {
      return 'b-grade'
    } else if (grade2018.some(testSyntax)) {
      return 'b-plus-grade'
    } else if (grade2019.some(testSyntax)) {
      return 'a-minus-grade'
    }
    return 'a-grade'
  } catch (error) {
    return 'd-grade'
  }
}
