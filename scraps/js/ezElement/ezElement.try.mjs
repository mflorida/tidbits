import ezElement from './ezElement.js';

// console.log(ezElement('input:text#full-name.validate.required?fullName|required|data-validate="required length:1"'));
console.log(ezElement(`

input:text 
#full-name 
.validate
.required 
?fullName 
| title="Full Name" 
| required 
| data-validate="required length:1"

`));
