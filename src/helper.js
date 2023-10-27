export var ecmaScriptInfo = (function() {
  // () => { is not allowed
function getESEdition() {
var array = [];
switch (true) {
case !Array.isArray:
return 3;
// eslint-disable-next-line no-undef
case !window.Promise:
return 5;
case !array.includes:
return 6;
case !''.padStart:
return 7;
case !Promise.prototype.finally:
return 8;
// eslint-disable-next-line no-undef
case !window.BigInt:
return 9;
case !Promise.allSettled:
return 10;
case !''.replaceAll:
return 11;
case !array.at:
return 12;
default:
return 13;
}
}

function getESYear(edition) {
return {
3: 1999,
5: 2009
}[edition] || (2009 + edition); // nullish coalescing (??) is not allowed
}

var edition = getESEdition();
var year = getESYear(edition);

return {
edition: edition, // usually shortened [edition,]
year: year,       // usually shortened [year,]
text: 'Edition: '+ edition +' | Year: '+ year
// `Edition: ${edition} | Year: ${year}` is not allowed
}
})();
