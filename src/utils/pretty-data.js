/**
 * pretty-data - nodejs plugin to pretty-print or minify data in XML, JSON and CSS formats.
 *
 * Version - 0.40.0
 * Copyright (c) 2012 Vadim Kiryukhin
 * vkiryukhin @ gmail.com
 * http://www.eslinstructor.net/pretty-data/
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 *  pd.xml(data ) - pretty print XML;
 *  pd.json(data) - pretty print JSON;
 *  pd.css(data ) - pretty print CSS;
 *  pd.sql(data)  - pretty print SQL;
 *
 *  pd.xmlmin(data [, preserveComments] ) - minify XML;
 *  pd.jsonmin(data)                      - minify JSON;
 *  pd.cssmin(data [, preserveComments] ) - minify CSS;
 *  pd.sqlmin(data)                       - minify SQL;
 *
 * PARAMETERS:
 *
 *  @data        - String; XML, JSON, CSS or SQL text to beautify;
 *  @preserveComments  - Bool (optional, used in minxml and mincss only);
 *          Set this flag to true to prevent removing comments from @text;
 *  @Return    - String;
 *
 * USAGE:
 *
 *  var pd  = require('pretty-data').pd;
 *
 *  var xml_pp   = pd.xml(xml_text);
 *  var xml_min  = pd.xmlmin(xml_text [,true]);
 *  var json_pp  = pd.json(json_text);
 *  var json_min = pd.jsonmin(json_text);
 *  var css_pp   = pd.css(css_text);
 *  var css_min  = pd.cssmin(css_text [, true]);
 *  var sql_pp   = pd.sql(sql_text);
 *  var sql_min  = pd.sqlmin(sql_text);
 *
 * TEST:
 *  comp-name:pretty-data$ node ./test/test_xml
 *  comp-name:pretty-data$ node ./test/test_json
 *  comp-name:pretty-data$ node ./test/test_css
 *  comp-name:pretty-data$ node ./test/test_sql
 */


function PP() {
  this.shift = ['\n']; // array of shifts
  this.step = '  '; // 2 spaces
  let maxdeep = 100; // nesting level
  let ix;

  // initialize array with shifts //
  for (ix = 0; ix < maxdeep; ix++) {
    this.shift.push(this.shift[ix] + this.step);
  }

}

PP.prototype.setStep = function (step) {
  this.shift = ['\n']; // array of shifts
  this.step = ' '.repeat(Number(step)); // 2 spaces
  let maxdeep = 100; // nesting level
  let ix;

  // initialize array with shifts //
  for (ix = 0; ix < maxdeep; ix++) {
    this.shift.push(this.shift[ix] + this.step);
  }
}

// ----------------------- XML section ----------------------------------------------------

PP.prototype.xml = function (text) {

  let ar = text.replace(/>\s*</g, "><")
      .replace(/></g,">~::~<")
      .replace(/xmlns:/g, "~::~xmlns:")
      .replace(/xmlns=/g, "~::~xmlns=")
      .split('~::~'),
    len = ar.length,
    inComment = false,
    deep = 0,
    str = '',
    ix;

  for (ix = 0; ix < len; ix++) {
    // start comment or <![CDATA[...]]> or <!DOCTYPE //
    if (ar[ix].search(/<!/) > -1) {
      str += this.shift[deep] + ar[ix];
      inComment = true;
      // end comment  or <![CDATA[...]]> //
      if (ar[ix].search(/-->/) > -1 || ar[ix].search(/]>/) > -1 || ar[ix].search(/!DOCTYPE/) > -1) {
        inComment = false;
      }
    } else
      // end comment  or <![CDATA[...]]> //
    if (ar[ix].search(/-->/) > -1 || ar[ix].search(/]>/) > -1) {
      str += ar[ix];
      inComment = false;
    } else
      // <elm></elm> //
    if (/^<\w/.exec(ar[ix - 1]) && /^<\/\w/.exec(ar[ix]) &&
      // eslint-disable-next-line
      /^<[\w:\-.,]+/.exec(ar[ix - 1]) == /^<\/[\w:\-.,]+/.exec(ar[ix])[0].replace('/', '')) {
      str += ar[ix];
      if (!inComment) deep--;
    } else
      // <elm> //
    if (ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) === -1 && ar[ix].search(/\/>/) === -1) {
      str = !inComment ? str += this.shift[deep++] + ar[ix] : str += ar[ix];
    } else
      // <elm>...</elm> //
    if (ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) > -1) {
      str = !inComment ? str += this.shift[deep] + ar[ix] : str += ar[ix];
    } else
      // </elm> //
    if(ar[ix].search(/<\//) > -1) {
      let shift = (ar[ix].search(/xmlns:/) > -1  || ar[ix].search(/xmlns=/) > -1) ? deep-- : --deep;
      str = !inComment ? str += this.shift[shift]+ar[ix] : str += ar[ix];
    } else
      // <elm/> //
    if (ar[ix].search(/\/>/) > -1) {
      str = !inComment ? str += this.shift[deep] + ar[ix] : str += ar[ix];
      if( ar[ix].search(/xmlns:/) > -1  || ar[ix].search(/xmlns=/) > -1) {
        deep--;
      }
    } else
      // <? xml ... ?> //
    if (ar[ix].search(/<\?/) > -1) {
      str += this.shift[deep] + ar[ix];
    } else
      // xmlns //
    if (ar[ix].search(/xmlns:/) > -1 || ar[ix].search(/xmlns=/) > -1) {
      str += this.shift[deep] + ar[ix];
    } else {
      str += ar[ix];
    }
    // remove excessive spaces
    if (!inComment) {
      str = str.replace(/\s+$/, '');
    }
  }

  return (str[0] === '\n') ? str.slice(1) : str;
}

// ----------------------- CSS section ----------------------------------------------------

PP.prototype.css = function (text) {

  let ar = text.replace(/\s+/g, ' ')
      .replace(/\{/g, "{~::~")
      .replace(/}/g, "~::~}~::~")
      .replace(/;/g, ";~::~")
      .replace(/\/\*/g, "~::~/*")
      .replace(/\*\//g, "*/~::~")
      .replace(/~::~\s*~::~/g, "~::~")
      .split('~::~'),
    len = ar.length,
    deep = 0,
    str = '',
    ix;

  for (ix = 0; ix < len; ix++) {

    if (/\{/.exec(ar[ix])) {
      str += this.shift[deep++] + ar[ix];
    } else if (/}/.exec(ar[ix])) {
      str += this.shift[--deep] + ar[ix];
    } else if (/\*\\/.exec(ar[ix])) {
      str += this.shift[deep] + ar[ix];
    } else {
      str += this.shift[deep] + ar[ix];
    }
  }
  return str.replace(/^\n+/, '');
}

// ----------------------- SQL section ----------------------------------------------------

function isSubquery(str, parenthesisLevel) {
  return parenthesisLevel - (str.replace(/\(/g, '').length - str.replace(/\)/g, '').length)
}

function split_sql(str, tab) {

  return str.replace(/\s+/g, " ")

    .replace(/ AND /ig, "~::~" + tab + tab + "AND ")
    .replace(/ BETWEEN /ig, "~::~" + tab + "BETWEEN ")
    .replace(/ CASE /ig, "~::~" + tab + "CASE ")
    .replace(/ ELSE /ig, "~::~" + tab + "ELSE ")
    .replace(/ END /ig, "~::~" + tab + "END ")
    .replace(/ FROM /ig, "~::~FROM ")
    .replace(/ GROUP\s+BY/ig, "~::~GROUP BY ")
    .replace(/ HAVING /ig, "~::~HAVING ")
    //.replace(/ IN /ig,"~::~"+tab+"IN ")
    .replace(/ IN /ig, " IN ")
    .replace(/ JOIN /ig, "~::~JOIN ")
    .replace(/ CROSS~::~+JOIN /ig, "~::~CROSS JOIN ")
    .replace(/ INNER~::~+JOIN /ig, "~::~INNER JOIN ")
    .replace(/ LEFT~::~+JOIN /ig, "~::~LEFT JOIN ")
    .replace(/ RIGHT~::~+JOIN /ig, "~::~RIGHT JOIN ")
    .replace(/ ON /ig, "~::~" + tab + "ON ")
    .replace(/ OR /ig, "~::~" + tab + tab + "OR ")
    .replace(/ ORDER\s+BY/ig, "~::~ORDER BY ")
    .replace(/ OVER /ig, "~::~" + tab + "OVER ")
    .replace(/\(\s*SELECT /ig, "~::~(SELECT ")
    .replace(/\)\s*SELECT /ig, ")~::~SELECT ")
    .replace(/ THEN /ig, " THEN~::~" + tab + "")
    .replace(/ UNION /ig, "~::~UNION~::~")
    .replace(/ USING /ig, "~::~USING ")
    .replace(/ WHEN /ig, "~::~" + tab + "WHEN ")
    .replace(/ WHERE /ig, "~::~WHERE ")
    .replace(/ WITH /ig, "~::~WITH ")
    //.replace(/\,\s{0,}\(/ig,",~::~( ")
    //.replace(/\,/ig,",~::~"+tab+tab+"")
    .replace(/ ALL /ig, " ALL ")
    .replace(/ AS /ig, " AS ")
    .replace(/ ASC /ig, " ASC ")
    .replace(/ DESC /ig, " DESC ")
    .replace(/ DISTINCT /ig, " DISTINCT ")
    .replace(/ EXISTS /ig, " EXISTS ")
    .replace(/ NOT /ig, " NOT ")
    .replace(/ NULL /ig, " NULL ")
    .replace(/ LIKE /ig, " LIKE ")
    .replace(/\s*SELECT /ig, "SELECT ")
    .replace(/~::~+/g, "~::~")
    .split('~::~');
}

PP.prototype.sql = function (text) {

  let ar_by_quote = text.replace(/\s+/g, " ")
      .replace(/'/ig, "~::~'")
      .split('~::~'),
    len = ar_by_quote.length,
    ar = [],
    deep = 0,
    tab = this.step,//+this.step,
    // inComment = true,
    // inQuote = false,
    parenthesisLevel = 0,
    str = '',
    ix;

  for (ix = 0; ix < len; ix++) {

    if (ix % 2) {
      ar = ar.concat(ar_by_quote[ix]);
    } else {
      ar = ar.concat(split_sql(ar_by_quote[ix], tab));
    }
  }

  len = ar.length;
  for (ix = 0; ix < len; ix++) {

    parenthesisLevel = isSubquery(ar[ix], parenthesisLevel);

    if (/\s*\s*SELECT\s*/.exec(ar[ix])) {
      ar[ix] = ar[ix].replace(/,/g, ",\n" + tab + tab + "")
    }

    if (/\s*\(\s*SELECT\s*/.exec(ar[ix])) {
      deep++;
      str += this.shift[deep] + ar[ix];
    } else if (/'/.exec(ar[ix])) {
      if (parenthesisLevel < 1 && deep) {
        deep--;
      }
      str += ar[ix];
    } else {
      str += this.shift[deep] + ar[ix];
      if (parenthesisLevel < 1 && deep) {
        deep--;
      }
    }
  }

  // eslint-disable-next-line
  str = str.replace(/^\n+/, '').replace(/\n+/g, "\n").replace(/;(?=([^"'\\]*(\\.|(["'])([^"'\\]*\\.)*[^"'\\]*(["'])))*[^"']*$)/g, ";\n\n");
  // old regex: /;(?=([^"\\]*(\\.|"([^"\\]*\\.)*[^"\\]*"))*[^"]*$)/g

  return str;
}

// ----------------------- min section ----------------------------------------------------

PP.prototype.xmlmin = function (text, preserveComments) {

  let str = preserveComments ? text
    : text.replace(/<![ \r\n\t]*(--([^-]|[\r\n]|-[^-])*--[ \r\n\t]*)>/g, "");
  return str.replace(/>\s*</g, "><");
}

PP.prototype.cssmin = function (text, preserveComments) {

  let str = preserveComments ? text
    : text.replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//g, "");
  return str.replace(/\s+/g, ' ')
    .replace(/\{\s+/g, "{")
    .replace(/}\s+/g, "}")
    .replace(/;\s+/g, ";")
    .replace(/\/\*\s+/g, "/*")
    .replace(/\*\/\s+/g, "*/");
}

PP.prototype.sqlmin = function (text) {
  return text.replace(/\s+/g, " ").replace(/\s+\(/, "(").replace(/\s+\)/, ")");
}

// HTML simple minifier by Zerrium
PP.prototype.htmlmin = function (text) {
  return text.replace(/(<!--|<--)(.*?)(-->|--!>)|(\/\*)((.|\S|\r|\n)*?)(\*\/)|^\/\/.*|\s\B/gm, "");
}

// --------------------------------------------------------------------------------------------

// exports.pd= new pp;
export const pd = new PP()










