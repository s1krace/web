import { run } from '/src/run.js';
import * as program from '/ascii.js';
run(program, { element: document.querySelector('pre') }).then(function (e) {
    console.log(e)
}).catch(function (e) {
    console.warn(e.message)
    console.log(e.error)
});
