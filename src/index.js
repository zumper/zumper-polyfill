import 'core-js/stable'

import './intersectionObserver'
import './requestIdleCallback'
import './smoothScroll'

// NOTE: Conditional require calls can't exist in the same file as import statements in rollup.
// https://github.com/rollup/rollup/issues/1058#issuecomment-254187433
import './legacy'
