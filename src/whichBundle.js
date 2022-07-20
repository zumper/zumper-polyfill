/**
 * @author       grady@zumper.com (Grady Kuhnline)
 * @copyright    Copyright (c) 2019, Zumper
 * @description  Use code evaluation to determine which syntax this browser supports
 */

// defaults
// Unique to d-grade
// a d-grade browser would fail one of these tests
const dGrade = [
  // transform-arrow-functions
  '()=>{}',
  // transform-block-scoped-functions
  // transform-classes
  'class A {};class B extends A {}',
  // transform-object-super
  'var a={a() {return 1}};var b={a() {return super.a()}};Object.setPrototypeOf(b,a);b.a()',
  // transform-shorthand-properties
  'var c=1;({c})',
  '({c(){}})',
  // transform-duplicate-keys
  // transform-computed-properties
  'var d=1;({["x"+d]:1})',
  // transform-sticky-regex
  '/./y',
  // transform-spread
  'var e=[];[...e];isNaN(...e)',
  // transform-typeof-symbol
  'function f() {new.target}',
  // transform-new-target
]

// c-grade
// Unique to c-grade (excluding d-grade)
// a c-grade browser would fail one of these tests
const cGrade = [
  // proposal-object-rest-spread
  'let {...k}={};let l={...k}',
  // transform-async-to-generator
  // transform-exponentiation-operator
  'let j=1**1;j**=1;',
  // transform-template-literals
  'var a=1;`${a}`;function b(a, b) {return ""};b`${a}`',
  // transform-literals
  '0b11;0o7',
  // transform-function-name
  // transform-for-of
  'for(var c of []) {}',
  // transform-unicode-escapes
  'var \\u{1d49c} = 1',
  // transform-unicode-regex
  '/./u',
  // transform-destructuring
  'let {e}={};let[...f]=[]',
  // transform-block-scoping
  'let g=1;const h=1',
  // transform-regenerator
  'function* i(){}',
  // transform-parameters <-- babel preset-env thinks all bundles need this
  'function d(x=0,{y},...z) {}',
]

// b-grade
// Unique to b-grade (excluding c-grade)
// a b-grade browser would fail one of these tests
const bGrade = [
  // proposal-private-property-in-object
  // proposal-class-properties
  'class A { a = 1; static b = 2 }',
  // proposal-private-methods
  'class B { #a = 1 }',
  // proposal-numeric-separator
  '1_000',
  // proposal-logical-assignment-operators
  'var a = {a:0};a.a||= 1',
  'var a = {a:1};a.a&&= 2',
  'var a = {};a.a??= 1',
  // proposal-nullish-coalescing-operator
  'null??1',
  // proposal-optional-chaining
  '({a:1})?.a',
  // proposal-json-strings
  // proposal-optional-catch-binding
  'try {throw 0} catch {1}',
  'try {throw 0} catch {1} finally {2}',
  // proposal-async-generator-functions
  'async function*a(){await 1;yield 2;}',
  // transform-dotall-regex
  '/./s.dotAll',
  // proposal-unicode-property-regex
  '/\\p{Sc}/gu.test("¥")',
  // transform-named-capturing-groups-regex
  '/(?<a>\\d)/.exec("1").groups.a',
]

// a-grade
// NOTE: no need to test for aGrade as it's implied by passing the other tests

// NOTE: we're testing for failures so the logic is inverted.
const testSyntax = (grade) => {
  try {
    new Function('"use strict";\n' + grade.join(';\n'))()
    return false
  } catch (e) {
    console.error(e)
    return true
  }
}

let grade
module.exports = () => {
  if (grade) {
    return grade
  }
  try {
    if (testSyntax(dGrade)) {
      grade = 'd-grade'
    } else if (testSyntax(cGrade)) {
      grade = 'c-grade'
    } else if (testSyntax(bGrade)) {
      grade = 'b-grade'
    } else {
      grade = 'a-grade'
    }
  } catch (error) {
    console.error(error)
    return 'd-grade'
  }
  return grade
}
