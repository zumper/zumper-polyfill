// defaults
// Unique to d-grade
// a d-grade browser would fail one of these tests
const dGrade = [
  // transform-arrow-functions { "chrome":"38", "ie":"11", "safari":"5.1" }
  '()=>{}',
  // transform-block-scoped-functions { "chrome":"38", "safari":"5.1" }
  // TODO: unclear how to test "block-scoped-functions"
  // transform-classes { "chrome":"38", "ie":"11", "safari":"5.1" }
  'class A {};class B extends A {}',
  // transform-object-super { "chrome":"38", "ie":"11", "safari":"5.1" }
  'var a={a() {return 1}};var b={a() {return super.a()}};Object.setPrototypeOf(b,a);b.a()',
  // transform-shorthand-properties { "chrome":"38", "ie":"11", "safari":"5.1" }
  'var c=1;({c})',
  '({c(){}})',
  // transform-duplicate-keys { "chrome":"38", "ie":"11", "safari":"5.1" }
  // TODO: unclear how to test "duplicate-keys"
  // transform-computed-properties { "chrome":"38", "ie":"11", "safari":"5.1" }
  'var d=1;({["x"+d]:1})',
  // transform-sticky-regex { "chrome":"38", "ie":"11", "safari":"5.1" }
  '/./y',
  // transform-spread { "chrome":"38", "ie":"11", "safari":"5.1" }" }
  'var e=[];[...e];isNaN(...e)',
  // transform-new-target { "chrome":"38", "ie":"11", "safari":"5.1" }
  'function f() {new.target}',
]

// c-grade
// Unique to c-grade (excluding d-grade)
// a c-grade browser would fail one of these tests
const cGrade = [
  // transform-template-literals { "ios":"10.3", "safari":"10.1" }
  'var a=1;`${a}`;function b(a, b) {return ""};b`${a}`',
  // transform-literals { "firefox":"46" }
  '0b11;0o7',
  // transform-function-name { "chrome":"49", "edge":"14", "firefox":"46" }
  // TODO: unclear how to test "function-name"
  // transform-for-of { "chrome":"49", "edge":"14", "firefox":"46" }
  'for(var c of []) {}',
  // transform-unicode-regex { "chrome":"49", "firefox":"46", "ios":"10.3", "safari":"10.1" }
  '/./u',
  // transform-parameters { "edge":"14", "firefox":"46" }
  'function d(x=0,{y},...z) {}',
  // transform-destructuring { "chrome":"49", "edge":"14", "firefox":"46" }
  'let {e}={};let[...f]=[]',
  // transform-block-scoping { "firefox":"46", "ios":"10.3", "safari":"10.1" }
  'let g=1;const h=1',
  // transform-regenerator { "chrome":"49", "firefox":"46" }
  'function* i(){}',
  // transform-exponentiation-operator { "chrome":"49", "firefox":"46" }
  'let j=1**1;j**=1;',
  // proposal-object-rest-spread { "chrome":"49", "edge":"14", "firefox":"46", "ios":"10.3", "safari":"10.1" }
  'let {...k}={};let l={...k}',
]

// b-grade
// Unique to b-grade (excluding c-grade)
// a b-grade browser would fail one of these tests
const bGrade = [
  // proposal-async-generator-functions { "chrome":"61" }
  'async function*a(){await 1;yield 2;}',
  // proposal-json-strings { "chrome":"61", "firefox":"60" }
  // TODO: unclear how to test "json-strings"
  // proposal-optional-catch-binding { "chrome":"61" }
  'try {throw 0} catch {1}',
  'try {throw 0} catch {1} finally {2}',
]

// a-grade
// Unique to a-grade (excluding b-grade)
// an a-grade browser would fail one of these tests
// NOTE: no need to test for aGrade as it's implied by passing the other tests
// const aGrade = [
//   // transform-dotall-regex { "firefox":"69" }
//   '/./s.dotAll',
//   // proposal-unicode-property-regex { "firefox":"69" }
//   '/\p{Script=Greek}/u.test("μ")',
//   // transform-named-capturing-groups-regex { "firefox":"69" }
//   '/(?<a>\d)/.exec("1").groups.a'
// ]

// NOTE: we're testing for failures so the logic is inversed.
const testSyntax = (grade) => {
  const script = '"use strict";\n' + grade.join(';\n')
  try {
    new Function(script)()
    return false
  } catch (e) {
    console.error(e)
    return true
  }
}

module.exports = () => {
  try {
    if (testSyntax(dGrade)) {
      return 'd-grade'
    } else if (testSyntax(cGrade)) {
      return 'c-grade'
    } else if (testSyntax(bGrade)) {
      return 'b-grade'
    }
    return 'a-grade'
  } catch (error) {
    console.error(error)
    return 'd-grade'
  }
}