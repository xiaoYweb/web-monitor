import recordJsError from  './lib/jsError';
import recordPromiseError from './lib/promiseError';
import enhanceAjax from './lib/ajax';
import timing from './lib/timing';

recordJsError()
recordPromiseError()
enhanceAjax()
// timing()