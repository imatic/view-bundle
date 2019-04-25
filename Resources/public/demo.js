/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/bundles/imaticview/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 251);
/******/ })
/************************************************************************/
/******/ ({

/***/ 108:
/***/ (function(module, exports, __webpack_require__) {


// Highlight
__webpack_require__(248);

// Platform - demo
__webpack_require__(247);
__webpack_require__(113);

/***/ }),

/***/ 113:
/***/ (function(module, exports, __webpack_require__) {

// Platform demo initialization
var hljs = __webpack_require__(218);
hljs.registerLanguage('twig', __webpack_require__(222));
hljs.registerLanguage('php', __webpack_require__(221));
hljs.registerLanguage('javascript', __webpack_require__(219));
hljs.registerLanguage('json', __webpack_require__(220));
hljs.registerLanguage('typescript', __webpack_require__(223));
hljs.registerLanguage('yaml', __webpack_require__(224));
hljs.initHighlightingOnLoad();

/***/ }),

/***/ 218:
/***/ (function(module, exports, __webpack_require__) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
Syntax highlighting with language autodetection.
https://highlightjs.org/
*/

(function (factory) {

  // Find the global object for export to both the browser and web workers.
  var globalObject = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window || (typeof self === 'undefined' ? 'undefined' : _typeof(self)) === 'object' && self;

  // Setup highlight.js for different environments. First is Node.js or
  // CommonJS.
  if (true) {
    factory(exports);
  } else if (globalObject) {
    // Export hljs globally even when using AMD for cases when this script
    // is loaded with others that may still expect a global hljs.
    globalObject.hljs = factory({});

    // Finally register the global hljs with AMD.
    if (typeof define === 'function' && define.amd) {
      define([], function () {
        return globalObject.hljs;
      });
    }
  }
})(function (hljs) {
  // Convenience variables for build-in objects
  var ArrayProto = [],
      objectKeys = Object.keys;

  // Global internal variables used within the highlight.js library.
  var languages = {},
      aliases = {};

  // Regular expressions used throughout the highlight.js library.
  var noHighlightRe = /^(no-?highlight|plain|text)$/i,
      languagePrefixRe = /\blang(?:uage)?-([\w-]+)\b/i,
      fixMarkupRe = /((^(<[^>]+>|\t|)+|(?:\n)))/gm;

  var spanEndTag = '</span>';

  // Global options used when within external APIs. This is modified when
  // calling the `hljs.configure` function.
  var options = {
    classPrefix: 'hljs-',
    tabReplace: null,
    useBR: false,
    languages: undefined
  };

  /* Utility functions */

  function escape(value) {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function tag(node) {
    return node.nodeName.toLowerCase();
  }

  function testRe(re, lexeme) {
    var match = re && re.exec(lexeme);
    return match && match.index === 0;
  }

  function isNotHighlighted(language) {
    return noHighlightRe.test(language);
  }

  function blockLanguage(block) {
    var i, match, length, _class;
    var classes = block.className + ' ';

    classes += block.parentNode ? block.parentNode.className : '';

    // language-* takes precedence over non-prefixed class names.
    match = languagePrefixRe.exec(classes);
    if (match) {
      return getLanguage(match[1]) ? match[1] : 'no-highlight';
    }

    classes = classes.split(/\s+/);

    for (i = 0, length = classes.length; i < length; i++) {
      _class = classes[i];

      if (isNotHighlighted(_class) || getLanguage(_class)) {
        return _class;
      }
    }
  }

  function inherit(parent) {
    // inherit(parent, override_obj, override_obj, ...)
    var key;
    var result = {};
    var objects = Array.prototype.slice.call(arguments, 1);

    for (key in parent) {
      result[key] = parent[key];
    }objects.forEach(function (obj) {
      for (key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  }

  /* Stream merging */

  function nodeStream(node) {
    var result = [];
    (function _nodeStream(node, offset) {
      for (var child = node.firstChild; child; child = child.nextSibling) {
        if (child.nodeType === 3) offset += child.nodeValue.length;else if (child.nodeType === 1) {
          result.push({
            event: 'start',
            offset: offset,
            node: child
          });
          offset = _nodeStream(child, offset);
          // Prevent void elements from having an end tag that would actually
          // double them in the output. There are more void elements in HTML
          // but we list only those realistically expected in code display.
          if (!tag(child).match(/br|hr|img|input/)) {
            result.push({
              event: 'stop',
              offset: offset,
              node: child
            });
          }
        }
      }
      return offset;
    })(node, 0);
    return result;
  }

  function mergeStreams(original, highlighted, value) {
    var processed = 0;
    var result = '';
    var nodeStack = [];

    function selectStream() {
      if (!original.length || !highlighted.length) {
        return original.length ? original : highlighted;
      }
      if (original[0].offset !== highlighted[0].offset) {
        return original[0].offset < highlighted[0].offset ? original : highlighted;
      }

      /*
      To avoid starting the stream just before it should stop the order is
      ensured that original always starts first and closes last:
       if (event1 == 'start' && event2 == 'start')
        return original;
      if (event1 == 'start' && event2 == 'stop')
        return highlighted;
      if (event1 == 'stop' && event2 == 'start')
        return original;
      if (event1 == 'stop' && event2 == 'stop')
        return highlighted;
       ... which is collapsed to:
      */
      return highlighted[0].event === 'start' ? original : highlighted;
    }

    function open(node) {
      function attr_str(a) {
        return ' ' + a.nodeName + '="' + escape(a.value).replace('"', '&quot;') + '"';
      }
      result += '<' + tag(node) + ArrayProto.map.call(node.attributes, attr_str).join('') + '>';
    }

    function close(node) {
      result += '</' + tag(node) + '>';
    }

    function render(event) {
      (event.event === 'start' ? open : close)(event.node);
    }

    while (original.length || highlighted.length) {
      var stream = selectStream();
      result += escape(value.substring(processed, stream[0].offset));
      processed = stream[0].offset;
      if (stream === original) {
        /*
        On any opening or closing tag of the original markup we first close
        the entire highlighted node stack, then render the original tag along
        with all the following original tags at the same offset and then
        reopen all the tags on the highlighted stack.
        */
        nodeStack.reverse().forEach(close);
        do {
          render(stream.splice(0, 1)[0]);
          stream = selectStream();
        } while (stream === original && stream.length && stream[0].offset === processed);
        nodeStack.reverse().forEach(open);
      } else {
        if (stream[0].event === 'start') {
          nodeStack.push(stream[0].node);
        } else {
          nodeStack.pop();
        }
        render(stream.splice(0, 1)[0]);
      }
    }
    return result + escape(value.substr(processed));
  }

  /* Initialization */

  function expand_mode(mode) {
    if (mode.variants && !mode.cached_variants) {
      mode.cached_variants = mode.variants.map(function (variant) {
        return inherit(mode, { variants: null }, variant);
      });
    }
    return mode.cached_variants || mode.endsWithParent && [inherit(mode)] || [mode];
  }

  function compileLanguage(language) {

    function reStr(re) {
      return re && re.source || re;
    }

    function langRe(value, global) {
      return new RegExp(reStr(value), 'm' + (language.case_insensitive ? 'i' : '') + (global ? 'g' : ''));
    }

    function compileMode(mode, parent) {
      if (mode.compiled) return;
      mode.compiled = true;

      mode.keywords = mode.keywords || mode.beginKeywords;
      if (mode.keywords) {
        var compiled_keywords = {};

        var flatten = function flatten(className, str) {
          if (language.case_insensitive) {
            str = str.toLowerCase();
          }
          str.split(' ').forEach(function (kw) {
            var pair = kw.split('|');
            compiled_keywords[pair[0]] = [className, pair[1] ? Number(pair[1]) : 1];
          });
        };

        if (typeof mode.keywords === 'string') {
          // string
          flatten('keyword', mode.keywords);
        } else {
          objectKeys(mode.keywords).forEach(function (className) {
            flatten(className, mode.keywords[className]);
          });
        }
        mode.keywords = compiled_keywords;
      }
      mode.lexemesRe = langRe(mode.lexemes || /\w+/, true);

      if (parent) {
        if (mode.beginKeywords) {
          mode.begin = '\\b(' + mode.beginKeywords.split(' ').join('|') + ')\\b';
        }
        if (!mode.begin) mode.begin = /\B|\b/;
        mode.beginRe = langRe(mode.begin);
        if (!mode.end && !mode.endsWithParent) mode.end = /\B|\b/;
        if (mode.end) mode.endRe = langRe(mode.end);
        mode.terminator_end = reStr(mode.end) || '';
        if (mode.endsWithParent && parent.terminator_end) mode.terminator_end += (mode.end ? '|' : '') + parent.terminator_end;
      }
      if (mode.illegal) mode.illegalRe = langRe(mode.illegal);
      if (mode.relevance == null) mode.relevance = 1;
      if (!mode.contains) {
        mode.contains = [];
      }
      mode.contains = Array.prototype.concat.apply([], mode.contains.map(function (c) {
        return expand_mode(c === 'self' ? mode : c);
      }));
      mode.contains.forEach(function (c) {
        compileMode(c, mode);
      });

      if (mode.starts) {
        compileMode(mode.starts, parent);
      }

      var terminators = mode.contains.map(function (c) {
        return c.beginKeywords ? '\\.?(' + c.begin + ')\\.?' : c.begin;
      }).concat([mode.terminator_end, mode.illegal]).map(reStr).filter(Boolean);
      mode.terminators = terminators.length ? langRe(terminators.join('|'), true) : { exec: function exec() /*s*/{
          return null;
        } };
    }

    compileMode(language);
  }

  /*
  Core highlighting function. Accepts a language name, or an alias, and a
  string with the code to highlight. Returns an object with the following
  properties:
   - relevance (int)
  - value (an HTML string with highlighting markup)
   */
  function highlight(name, value, ignore_illegals, continuation) {

    function subMode(lexeme, mode) {
      var i, length;

      for (i = 0, length = mode.contains.length; i < length; i++) {
        if (testRe(mode.contains[i].beginRe, lexeme)) {
          return mode.contains[i];
        }
      }
    }

    function endOfMode(mode, lexeme) {
      if (testRe(mode.endRe, lexeme)) {
        while (mode.endsParent && mode.parent) {
          mode = mode.parent;
        }
        return mode;
      }
      if (mode.endsWithParent) {
        return endOfMode(mode.parent, lexeme);
      }
    }

    function isIllegal(lexeme, mode) {
      return !ignore_illegals && testRe(mode.illegalRe, lexeme);
    }

    function keywordMatch(mode, match) {
      var match_str = language.case_insensitive ? match[0].toLowerCase() : match[0];
      return mode.keywords.hasOwnProperty(match_str) && mode.keywords[match_str];
    }

    function buildSpan(classname, insideSpan, leaveOpen, noPrefix) {
      var classPrefix = noPrefix ? '' : options.classPrefix,
          openSpan = '<span class="' + classPrefix,
          closeSpan = leaveOpen ? '' : spanEndTag;

      openSpan += classname + '">';

      return openSpan + insideSpan + closeSpan;
    }

    function processKeywords() {
      var keyword_match, last_index, match, result;

      if (!top.keywords) return escape(mode_buffer);

      result = '';
      last_index = 0;
      top.lexemesRe.lastIndex = 0;
      match = top.lexemesRe.exec(mode_buffer);

      while (match) {
        result += escape(mode_buffer.substring(last_index, match.index));
        keyword_match = keywordMatch(top, match);
        if (keyword_match) {
          relevance += keyword_match[1];
          result += buildSpan(keyword_match[0], escape(match[0]));
        } else {
          result += escape(match[0]);
        }
        last_index = top.lexemesRe.lastIndex;
        match = top.lexemesRe.exec(mode_buffer);
      }
      return result + escape(mode_buffer.substr(last_index));
    }

    function processSubLanguage() {
      var explicit = typeof top.subLanguage === 'string';
      if (explicit && !languages[top.subLanguage]) {
        return escape(mode_buffer);
      }

      var result = explicit ? highlight(top.subLanguage, mode_buffer, true, continuations[top.subLanguage]) : highlightAuto(mode_buffer, top.subLanguage.length ? top.subLanguage : undefined);

      // Counting embedded language score towards the host language may be disabled
      // with zeroing the containing mode relevance. Usecase in point is Markdown that
      // allows XML everywhere and makes every XML snippet to have a much larger Markdown
      // score.
      if (top.relevance > 0) {
        relevance += result.relevance;
      }
      if (explicit) {
        continuations[top.subLanguage] = result.top;
      }
      return buildSpan(result.language, result.value, false, true);
    }

    function processBuffer() {
      result += top.subLanguage != null ? processSubLanguage() : processKeywords();
      mode_buffer = '';
    }

    function startNewMode(mode) {
      result += mode.className ? buildSpan(mode.className, '', true) : '';
      top = Object.create(mode, { parent: { value: top } });
    }

    function processLexeme(buffer, lexeme) {

      mode_buffer += buffer;

      if (lexeme == null) {
        processBuffer();
        return 0;
      }

      var new_mode = subMode(lexeme, top);
      if (new_mode) {
        if (new_mode.skip) {
          mode_buffer += lexeme;
        } else {
          if (new_mode.excludeBegin) {
            mode_buffer += lexeme;
          }
          processBuffer();
          if (!new_mode.returnBegin && !new_mode.excludeBegin) {
            mode_buffer = lexeme;
          }
        }
        startNewMode(new_mode, lexeme);
        return new_mode.returnBegin ? 0 : lexeme.length;
      }

      var end_mode = endOfMode(top, lexeme);
      if (end_mode) {
        var origin = top;
        if (origin.skip) {
          mode_buffer += lexeme;
        } else {
          if (!(origin.returnEnd || origin.excludeEnd)) {
            mode_buffer += lexeme;
          }
          processBuffer();
          if (origin.excludeEnd) {
            mode_buffer = lexeme;
          }
        }
        do {
          if (top.className) {
            result += spanEndTag;
          }
          if (!top.skip) {
            relevance += top.relevance;
          }
          top = top.parent;
        } while (top !== end_mode.parent);
        if (end_mode.starts) {
          startNewMode(end_mode.starts, '');
        }
        return origin.returnEnd ? 0 : lexeme.length;
      }

      if (isIllegal(lexeme, top)) throw new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.className || '<unnamed>') + '"');

      /*
      Parser should not reach this point as all types of lexemes should be caught
      earlier, but if it does due to some bug make sure it advances at least one
      character forward to prevent infinite looping.
      */
      mode_buffer += lexeme;
      return lexeme.length || 1;
    }

    var language = getLanguage(name);
    if (!language) {
      throw new Error('Unknown language: "' + name + '"');
    }

    compileLanguage(language);
    var top = continuation || language;
    var continuations = {}; // keep continuations for sub-languages
    var result = '',
        current;
    for (current = top; current !== language; current = current.parent) {
      if (current.className) {
        result = buildSpan(current.className, '', true) + result;
      }
    }
    var mode_buffer = '';
    var relevance = 0;
    try {
      var match,
          count,
          index = 0;
      while (true) {
        top.terminators.lastIndex = index;
        match = top.terminators.exec(value);
        if (!match) break;
        count = processLexeme(value.substring(index, match.index), match[0]);
        index = match.index + count;
      }
      processLexeme(value.substr(index));
      for (current = top; current.parent; current = current.parent) {
        // close dangling modes
        if (current.className) {
          result += spanEndTag;
        }
      }
      return {
        relevance: relevance,
        value: result,
        language: name,
        top: top
      };
    } catch (e) {
      if (e.message && e.message.indexOf('Illegal') !== -1) {
        return {
          relevance: 0,
          value: escape(value)
        };
      } else {
        throw e;
      }
    }
  }

  /*
  Highlighting with language detection. Accepts a string with the code to
  highlight. Returns an object with the following properties:
   - language (detected language)
  - relevance (int)
  - value (an HTML string with highlighting markup)
  - second_best (object with the same structure for second-best heuristically
    detected language, may be absent)
   */
  function highlightAuto(text, languageSubset) {
    languageSubset = languageSubset || options.languages || objectKeys(languages);
    var result = {
      relevance: 0,
      value: escape(text)
    };
    var second_best = result;
    languageSubset.filter(getLanguage).forEach(function (name) {
      var current = highlight(name, text, false);
      current.language = name;
      if (current.relevance > second_best.relevance) {
        second_best = current;
      }
      if (current.relevance > result.relevance) {
        second_best = result;
        result = current;
      }
    });
    if (second_best.language) {
      result.second_best = second_best;
    }
    return result;
  }

  /*
  Post-processing of the highlighted markup:
   - replace TABs with something more useful
  - replace real line-breaks with '<br>' for non-pre containers
   */
  function fixMarkup(value) {
    return !(options.tabReplace || options.useBR) ? value : value.replace(fixMarkupRe, function (match, p1) {
      if (options.useBR && match === '\n') {
        return '<br>';
      } else if (options.tabReplace) {
        return p1.replace(/\t/g, options.tabReplace);
      }
      return '';
    });
  }

  function buildClassName(prevClassName, currentLang, resultLang) {
    var language = currentLang ? aliases[currentLang] : resultLang,
        result = [prevClassName.trim()];

    if (!prevClassName.match(/\bhljs\b/)) {
      result.push('hljs');
    }

    if (prevClassName.indexOf(language) === -1) {
      result.push(language);
    }

    return result.join(' ').trim();
  }

  /*
  Applies highlighting to a DOM node containing code. Accepts a DOM node and
  two optional parameters for fixMarkup.
  */
  function highlightBlock(block) {
    var node, originalStream, result, resultNode, text;
    var language = blockLanguage(block);

    if (isNotHighlighted(language)) return;

    if (options.useBR) {
      node = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
      node.innerHTML = block.innerHTML.replace(/\n/g, '').replace(/<br[ \/]*>/g, '\n');
    } else {
      node = block;
    }
    text = node.textContent;
    result = language ? highlight(language, text, true) : highlightAuto(text);

    originalStream = nodeStream(node);
    if (originalStream.length) {
      resultNode = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
      resultNode.innerHTML = result.value;
      result.value = mergeStreams(originalStream, nodeStream(resultNode), text);
    }
    result.value = fixMarkup(result.value);

    block.innerHTML = result.value;
    block.className = buildClassName(block.className, language, result.language);
    block.result = {
      language: result.language,
      re: result.relevance
    };
    if (result.second_best) {
      block.second_best = {
        language: result.second_best.language,
        re: result.second_best.relevance
      };
    }
  }

  /*
  Updates highlight.js global options with values passed in the form of an object.
  */
  function configure(user_options) {
    options = inherit(options, user_options);
  }

  /*
  Applies highlighting to all <pre><code>..</code></pre> blocks on a page.
  */
  function initHighlighting() {
    if (initHighlighting.called) return;
    initHighlighting.called = true;

    var blocks = document.querySelectorAll('pre code');
    ArrayProto.forEach.call(blocks, highlightBlock);
  }

  /*
  Attaches highlighting to the page load event.
  */
  function initHighlightingOnLoad() {
    addEventListener('DOMContentLoaded', initHighlighting, false);
    addEventListener('load', initHighlighting, false);
  }

  function registerLanguage(name, language) {
    var lang = languages[name] = language(hljs);
    if (lang.aliases) {
      lang.aliases.forEach(function (alias) {
        aliases[alias] = name;
      });
    }
  }

  function listLanguages() {
    return objectKeys(languages);
  }

  function getLanguage(name) {
    name = (name || '').toLowerCase();
    return languages[name] || languages[aliases[name]];
  }

  /* Interface definition */

  hljs.highlight = highlight;
  hljs.highlightAuto = highlightAuto;
  hljs.fixMarkup = fixMarkup;
  hljs.highlightBlock = highlightBlock;
  hljs.configure = configure;
  hljs.initHighlighting = initHighlighting;
  hljs.initHighlightingOnLoad = initHighlightingOnLoad;
  hljs.registerLanguage = registerLanguage;
  hljs.listLanguages = listLanguages;
  hljs.getLanguage = getLanguage;
  hljs.inherit = inherit;

  // Common regexps
  hljs.IDENT_RE = '[a-zA-Z]\\w*';
  hljs.UNDERSCORE_IDENT_RE = '[a-zA-Z_]\\w*';
  hljs.NUMBER_RE = '\\b\\d+(\\.\\d+)?';
  hljs.C_NUMBER_RE = '(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)'; // 0x..., 0..., decimal, float
  hljs.BINARY_NUMBER_RE = '\\b(0b[01]+)'; // 0b...
  hljs.RE_STARTERS_RE = '!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~';

  // Common modes
  hljs.BACKSLASH_ESCAPE = {
    begin: '\\\\[\\s\\S]', relevance: 0
  };
  hljs.APOS_STRING_MODE = {
    className: 'string',
    begin: '\'', end: '\'',
    illegal: '\\n',
    contains: [hljs.BACKSLASH_ESCAPE]
  };
  hljs.QUOTE_STRING_MODE = {
    className: 'string',
    begin: '"', end: '"',
    illegal: '\\n',
    contains: [hljs.BACKSLASH_ESCAPE]
  };
  hljs.PHRASAL_WORDS_MODE = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  };
  hljs.COMMENT = function (begin, end, inherits) {
    var mode = hljs.inherit({
      className: 'comment',
      begin: begin, end: end,
      contains: []
    }, inherits || {});
    mode.contains.push(hljs.PHRASAL_WORDS_MODE);
    mode.contains.push({
      className: 'doctag',
      begin: '(?:TODO|FIXME|NOTE|BUG|XXX):',
      relevance: 0
    });
    return mode;
  };
  hljs.C_LINE_COMMENT_MODE = hljs.COMMENT('//', '$');
  hljs.C_BLOCK_COMMENT_MODE = hljs.COMMENT('/\\*', '\\*/');
  hljs.HASH_COMMENT_MODE = hljs.COMMENT('#', '$');
  hljs.NUMBER_MODE = {
    className: 'number',
    begin: hljs.NUMBER_RE,
    relevance: 0
  };
  hljs.C_NUMBER_MODE = {
    className: 'number',
    begin: hljs.C_NUMBER_RE,
    relevance: 0
  };
  hljs.BINARY_NUMBER_MODE = {
    className: 'number',
    begin: hljs.BINARY_NUMBER_RE,
    relevance: 0
  };
  hljs.CSS_NUMBER_MODE = {
    className: 'number',
    begin: hljs.NUMBER_RE + '(' + '%|em|ex|ch|rem' + '|vw|vh|vmin|vmax' + '|cm|mm|in|pt|pc|px' + '|deg|grad|rad|turn' + '|s|ms' + '|Hz|kHz' + '|dpi|dpcm|dppx' + ')?',
    relevance: 0
  };
  hljs.REGEXP_MODE = {
    className: 'regexp',
    begin: /\//, end: /\/[gimuy]*/,
    illegal: /\n/,
    contains: [hljs.BACKSLASH_ESCAPE, {
      begin: /\[/, end: /\]/,
      relevance: 0,
      contains: [hljs.BACKSLASH_ESCAPE]
    }]
  };
  hljs.TITLE_MODE = {
    className: 'title',
    begin: hljs.IDENT_RE,
    relevance: 0
  };
  hljs.UNDERSCORE_TITLE_MODE = {
    className: 'title',
    begin: hljs.UNDERSCORE_IDENT_RE,
    relevance: 0
  };
  hljs.METHOD_GUARD = {
    // excludes method names from keyword processing
    begin: '\\.\\s*' + hljs.UNDERSCORE_IDENT_RE,
    relevance: 0
  };

  return hljs;
});

/***/ }),

/***/ 219:
/***/ (function(module, exports) {

module.exports = function (hljs) {
  var IDENT_RE = '[A-Za-z$_][0-9A-Za-z$_]*';
  var KEYWORDS = {
    keyword: 'in of if for while finally var new function do return void else break catch ' + 'instanceof with throw case default try this switch continue typeof delete ' + 'let yield const export super debugger as async await static ' +
    // ECMAScript 6 modules import
    'import from as',

    literal: 'true false null undefined NaN Infinity',
    built_in: 'eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent ' + 'encodeURI encodeURIComponent escape unescape Object Function Boolean Error ' + 'EvalError InternalError RangeError ReferenceError StopIteration SyntaxError ' + 'TypeError URIError Number Math Date String RegExp Array Float32Array ' + 'Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array ' + 'Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require ' + 'module console window document Symbol Set Map WeakSet WeakMap Proxy Reflect ' + 'Promise'
  };
  var EXPRESSIONS;
  var NUMBER = {
    className: 'number',
    variants: [{ begin: '\\b(0[bB][01]+)' }, { begin: '\\b(0[oO][0-7]+)' }, { begin: hljs.C_NUMBER_RE }],
    relevance: 0
  };
  var SUBST = {
    className: 'subst',
    begin: '\\$\\{', end: '\\}',
    keywords: KEYWORDS,
    contains: [] // defined later
  };
  var TEMPLATE_STRING = {
    className: 'string',
    begin: '`', end: '`',
    contains: [hljs.BACKSLASH_ESCAPE, SUBST]
  };
  SUBST.contains = [hljs.APOS_STRING_MODE, hljs.QUOTE_STRING_MODE, TEMPLATE_STRING, NUMBER, hljs.REGEXP_MODE];
  var PARAMS_CONTAINS = SUBST.contains.concat([hljs.C_BLOCK_COMMENT_MODE, hljs.C_LINE_COMMENT_MODE]);

  return {
    aliases: ['js', 'jsx'],
    keywords: KEYWORDS,
    contains: [{
      className: 'meta',
      relevance: 10,
      begin: /^\s*['"]use (strict|asm)['"]/
    }, {
      className: 'meta',
      begin: /^#!/, end: /$/
    }, hljs.APOS_STRING_MODE, hljs.QUOTE_STRING_MODE, TEMPLATE_STRING, hljs.C_LINE_COMMENT_MODE, hljs.C_BLOCK_COMMENT_MODE, NUMBER, { // object attr container
      begin: /[{,]\s*/, relevance: 0,
      contains: [{
        begin: IDENT_RE + '\\s*:', returnBegin: true,
        relevance: 0,
        contains: [{ className: 'attr', begin: IDENT_RE, relevance: 0 }]
      }]
    }, { // "value" container
      begin: '(' + hljs.RE_STARTERS_RE + '|\\b(case|return|throw)\\b)\\s*',
      keywords: 'return throw case',
      contains: [hljs.C_LINE_COMMENT_MODE, hljs.C_BLOCK_COMMENT_MODE, hljs.REGEXP_MODE, {
        className: 'function',
        begin: '(\\(.*?\\)|' + IDENT_RE + ')\\s*=>', returnBegin: true,
        end: '\\s*=>',
        contains: [{
          className: 'params',
          variants: [{
            begin: IDENT_RE
          }, {
            begin: /\(\s*\)/
          }, {
            begin: /\(/, end: /\)/,
            excludeBegin: true, excludeEnd: true,
            keywords: KEYWORDS,
            contains: PARAMS_CONTAINS
          }]
        }]
      }, { // E4X / JSX
        begin: /</, end: /(\/\w+|\w+\/)>/,
        subLanguage: 'xml',
        contains: [{ begin: /<\w+\s*\/>/, skip: true }, {
          begin: /<\w+/, end: /(\/\w+|\w+\/)>/, skip: true,
          contains: [{ begin: /<\w+\s*\/>/, skip: true }, 'self']
        }]
      }],
      relevance: 0
    }, {
      className: 'function',
      beginKeywords: 'function', end: /\{/, excludeEnd: true,
      contains: [hljs.inherit(hljs.TITLE_MODE, { begin: IDENT_RE }), {
        className: 'params',
        begin: /\(/, end: /\)/,
        excludeBegin: true,
        excludeEnd: true,
        contains: PARAMS_CONTAINS
      }],
      illegal: /\[|%/
    }, {
      begin: /\$[(.]/ // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
    }, hljs.METHOD_GUARD, { // ES6 class
      className: 'class',
      beginKeywords: 'class', end: /[{;=]/, excludeEnd: true,
      illegal: /[:"\[\]]/,
      contains: [{ beginKeywords: 'extends' }, hljs.UNDERSCORE_TITLE_MODE]
    }, {
      beginKeywords: 'constructor', end: /\{/, excludeEnd: true
    }],
    illegal: /#(?!!)/
  };
};

/***/ }),

/***/ 220:
/***/ (function(module, exports) {

module.exports = function (hljs) {
  var LITERALS = { literal: 'true false null' };
  var TYPES = [hljs.QUOTE_STRING_MODE, hljs.C_NUMBER_MODE];
  var VALUE_CONTAINER = {
    end: ',', endsWithParent: true, excludeEnd: true,
    contains: TYPES,
    keywords: LITERALS
  };
  var OBJECT = {
    begin: '{', end: '}',
    contains: [{
      className: 'attr',
      begin: /"/, end: /"/,
      contains: [hljs.BACKSLASH_ESCAPE],
      illegal: '\\n'
    }, hljs.inherit(VALUE_CONTAINER, { begin: /:/ })],
    illegal: '\\S'
  };
  var ARRAY = {
    begin: '\\[', end: '\\]',
    contains: [hljs.inherit(VALUE_CONTAINER)], // inherit is a workaround for a bug that makes shared modes with endsWithParent compile only the ending of one of the parents
    illegal: '\\S'
  };
  TYPES.splice(TYPES.length, 0, OBJECT, ARRAY);
  return {
    contains: TYPES,
    keywords: LITERALS,
    illegal: '\\S'
  };
};

/***/ }),

/***/ 221:
/***/ (function(module, exports) {

module.exports = function (hljs) {
  var VARIABLE = {
    begin: '\\$+[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*'
  };
  var PREPROCESSOR = {
    className: 'meta', begin: /<\?(php)?|\?>/
  };
  var STRING = {
    className: 'string',
    contains: [hljs.BACKSLASH_ESCAPE, PREPROCESSOR],
    variants: [{
      begin: 'b"', end: '"'
    }, {
      begin: 'b\'', end: '\''
    }, hljs.inherit(hljs.APOS_STRING_MODE, { illegal: null }), hljs.inherit(hljs.QUOTE_STRING_MODE, { illegal: null })]
  };
  var NUMBER = { variants: [hljs.BINARY_NUMBER_MODE, hljs.C_NUMBER_MODE] };
  return {
    aliases: ['php3', 'php4', 'php5', 'php6'],
    case_insensitive: true,
    keywords: 'and include_once list abstract global private echo interface as static endswitch ' + 'array null if endwhile or const for endforeach self var while isset public ' + 'protected exit foreach throw elseif include __FILE__ empty require_once do xor ' + 'return parent clone use __CLASS__ __LINE__ else break print eval new ' + 'catch __METHOD__ case exception default die require __FUNCTION__ ' + 'enddeclare final try switch continue endfor endif declare unset true false ' + 'trait goto instanceof insteadof __DIR__ __NAMESPACE__ ' + 'yield finally',
    contains: [hljs.HASH_COMMENT_MODE, hljs.COMMENT('//', '$', { contains: [PREPROCESSOR] }), hljs.COMMENT('/\\*', '\\*/', {
      contains: [{
        className: 'doctag',
        begin: '@[A-Za-z]+'
      }]
    }), hljs.COMMENT('__halt_compiler.+?;', false, {
      endsWithParent: true,
      keywords: '__halt_compiler',
      lexemes: hljs.UNDERSCORE_IDENT_RE
    }), {
      className: 'string',
      begin: /<<<['"]?\w+['"]?$/, end: /^\w+;?$/,
      contains: [hljs.BACKSLASH_ESCAPE, {
        className: 'subst',
        variants: [{ begin: /\$\w+/ }, { begin: /\{\$/, end: /\}/ }]
      }]
    }, PREPROCESSOR, {
      className: 'keyword', begin: /\$this\b/
    }, VARIABLE, {
      // swallow composed identifiers to avoid parsing them as keywords
      begin: /(::|->)+[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/
    }, {
      className: 'function',
      beginKeywords: 'function', end: /[;{]/, excludeEnd: true,
      illegal: '\\$|\\[|%',
      contains: [hljs.UNDERSCORE_TITLE_MODE, {
        className: 'params',
        begin: '\\(', end: '\\)',
        contains: ['self', VARIABLE, hljs.C_BLOCK_COMMENT_MODE, STRING, NUMBER]
      }]
    }, {
      className: 'class',
      beginKeywords: 'class interface', end: '{', excludeEnd: true,
      illegal: /[:\(\$"]/,
      contains: [{ beginKeywords: 'extends implements' }, hljs.UNDERSCORE_TITLE_MODE]
    }, {
      beginKeywords: 'namespace', end: ';',
      illegal: /[\.']/,
      contains: [hljs.UNDERSCORE_TITLE_MODE]
    }, {
      beginKeywords: 'use', end: ';',
      contains: [hljs.UNDERSCORE_TITLE_MODE]
    }, {
      begin: '=>' // No markup, just a relevance booster
    }, STRING, NUMBER]
  };
};

/***/ }),

/***/ 222:
/***/ (function(module, exports) {

module.exports = function (hljs) {
  var PARAMS = {
    className: 'params',
    begin: '\\(', end: '\\)'
  };

  var FUNCTION_NAMES = 'attribute block constant cycle date dump include ' + 'max min parent random range source template_from_string';

  var FUNCTIONS = {
    beginKeywords: FUNCTION_NAMES,
    keywords: { name: FUNCTION_NAMES },
    relevance: 0,
    contains: [PARAMS]
  };

  var FILTER = {
    begin: /\|[A-Za-z_]+:?/,
    keywords: 'abs batch capitalize convert_encoding date date_modify default ' + 'escape first format join json_encode keys last length lower ' + 'merge nl2br number_format raw replace reverse round slice sort split ' + 'striptags title trim upper url_encode',
    contains: [FUNCTIONS]
  };

  var TAGS = 'autoescape block do embed extends filter flush for ' + 'if import include macro sandbox set spaceless use verbatim';

  TAGS = TAGS + ' ' + TAGS.split(' ').map(function (t) {
    return 'end' + t;
  }).join(' ');

  return {
    aliases: ['craftcms'],
    case_insensitive: true,
    subLanguage: 'xml',
    contains: [hljs.COMMENT(/\{#/, /#}/), {
      className: 'template-tag',
      begin: /\{%/, end: /%}/,
      contains: [{
        className: 'name',
        begin: /\w+/,
        keywords: TAGS,
        starts: {
          endsWithParent: true,
          contains: [FILTER, FUNCTIONS],
          relevance: 0
        }
      }]
    }, {
      className: 'template-variable',
      begin: /\{\{/, end: /}}/,
      contains: ['self', FILTER, FUNCTIONS]
    }]
  };
};

/***/ }),

/***/ 223:
/***/ (function(module, exports) {

module.exports = function (hljs) {
  var KEYWORDS = {
    keyword: 'in if for while finally var new function do return void else break catch ' + 'instanceof with throw case default try this switch continue typeof delete ' + 'let yield const class public private protected get set super ' + 'static implements enum export import declare type namespace abstract ' + 'as from extends async await',
    literal: 'true false null undefined NaN Infinity',
    built_in: 'eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent ' + 'encodeURI encodeURIComponent escape unescape Object Function Boolean Error ' + 'EvalError InternalError RangeError ReferenceError StopIteration SyntaxError ' + 'TypeError URIError Number Math Date String RegExp Array Float32Array ' + 'Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array ' + 'Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require ' + 'module console window document any number boolean string void Promise'
  };

  return {
    aliases: ['ts'],
    keywords: KEYWORDS,
    contains: [{
      className: 'meta',
      begin: /^\s*['"]use strict['"]/
    }, hljs.APOS_STRING_MODE, hljs.QUOTE_STRING_MODE, { // template string
      className: 'string',
      begin: '`', end: '`',
      contains: [hljs.BACKSLASH_ESCAPE, {
        className: 'subst',
        begin: '\\$\\{', end: '\\}'
      }]
    }, hljs.C_LINE_COMMENT_MODE, hljs.C_BLOCK_COMMENT_MODE, {
      className: 'number',
      variants: [{ begin: '\\b(0[bB][01]+)' }, { begin: '\\b(0[oO][0-7]+)' }, { begin: hljs.C_NUMBER_RE }],
      relevance: 0
    }, { // "value" container
      begin: '(' + hljs.RE_STARTERS_RE + '|\\b(case|return|throw)\\b)\\s*',
      keywords: 'return throw case',
      contains: [hljs.C_LINE_COMMENT_MODE, hljs.C_BLOCK_COMMENT_MODE, hljs.REGEXP_MODE, {
        className: 'function',
        begin: '(\\(.*?\\)|' + hljs.IDENT_RE + ')\\s*=>', returnBegin: true,
        end: '\\s*=>',
        contains: [{
          className: 'params',
          variants: [{
            begin: hljs.IDENT_RE
          }, {
            begin: /\(\s*\)/
          }, {
            begin: /\(/, end: /\)/,
            excludeBegin: true, excludeEnd: true,
            keywords: KEYWORDS,
            contains: ['self', hljs.C_LINE_COMMENT_MODE, hljs.C_BLOCK_COMMENT_MODE]
          }]
        }]
      }],
      relevance: 0
    }, {
      className: 'function',
      begin: 'function', end: /[\{;]/, excludeEnd: true,
      keywords: KEYWORDS,
      contains: ['self', hljs.inherit(hljs.TITLE_MODE, { begin: /[A-Za-z$_][0-9A-Za-z$_]*/ }), {
        className: 'params',
        begin: /\(/, end: /\)/,
        excludeBegin: true,
        excludeEnd: true,
        keywords: KEYWORDS,
        contains: [hljs.C_LINE_COMMENT_MODE, hljs.C_BLOCK_COMMENT_MODE],
        illegal: /["'\(]/
      }],
      illegal: /%/,
      relevance: 0 // () => {} is more typical in TypeScript
    }, {
      beginKeywords: 'constructor', end: /\{/, excludeEnd: true,
      contains: ['self', {
        className: 'params',
        begin: /\(/, end: /\)/,
        excludeBegin: true,
        excludeEnd: true,
        keywords: KEYWORDS,
        contains: [hljs.C_LINE_COMMENT_MODE, hljs.C_BLOCK_COMMENT_MODE],
        illegal: /["'\(]/
      }]
    }, { // prevent references like module.id from being higlighted as module definitions
      begin: /module\./,
      keywords: { built_in: 'module' },
      relevance: 0
    }, {
      beginKeywords: 'module', end: /\{/, excludeEnd: true
    }, {
      beginKeywords: 'interface', end: /\{/, excludeEnd: true,
      keywords: 'interface extends'
    }, {
      begin: /\$[(.]/ // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
    }, {
      begin: '\\.' + hljs.IDENT_RE, relevance: 0 // hack: prevents detection of keywords after dots
    }, {
      className: 'meta', begin: '@[A-Za-z]+'
    }]
  };
};

/***/ }),

/***/ 224:
/***/ (function(module, exports) {

module.exports = function (hljs) {
  var LITERALS = 'true false yes no null';

  var keyPrefix = '^[ \\-]*';
  var keyName = '[a-zA-Z_][\\w\\-]*';
  var KEY = {
    className: 'attr',
    variants: [{ begin: keyPrefix + keyName + ":" }, { begin: keyPrefix + '"' + keyName + '"' + ":" }, { begin: keyPrefix + "'" + keyName + "'" + ":" }]
  };

  var TEMPLATE_VARIABLES = {
    className: 'template-variable',
    variants: [{ begin: '\{\{', end: '\}\}' }, // jinja templates Ansible
    { begin: '%\{', end: '\}' } // Ruby i18n
    ]
  };
  var STRING = {
    className: 'string',
    relevance: 0,
    variants: [{ begin: /'/, end: /'/ }, { begin: /"/, end: /"/ }, { begin: /\S+/ }],
    contains: [hljs.BACKSLASH_ESCAPE, TEMPLATE_VARIABLES]
  };

  return {
    case_insensitive: true,
    aliases: ['yml', 'YAML', 'yaml'],
    contains: [KEY, {
      className: 'meta',
      begin: '^---\s*$',
      relevance: 10
    }, { // multi line string
      className: 'string',
      begin: '[\\|>] *$',
      returnEnd: true,
      contains: STRING.contains,
      // very simple termination: next hash key
      end: KEY.variants[0].begin
    }, { // Ruby/Rails erb
      begin: '<%[%=-]?', end: '[%-]?%>',
      subLanguage: 'ruby',
      excludeBegin: true,
      excludeEnd: true,
      relevance: 0
    }, { // data type
      className: 'type',
      begin: '!!' + hljs.UNDERSCORE_IDENT_RE
    }, { // fragment id &ref
      className: 'meta',
      begin: '&' + hljs.UNDERSCORE_IDENT_RE + '$'
    }, { // fragment reference *ref
      className: 'meta',
      begin: '\\*' + hljs.UNDERSCORE_IDENT_RE + '$'
    }, { // array listing
      className: 'bullet',
      begin: '^ *-',
      relevance: 0
    }, hljs.HASH_COMMENT_MODE, {
      beginKeywords: LITERALS,
      keywords: { literal: LITERALS }
    }, hljs.C_NUMBER_MODE, STRING]
  };
};

/***/ }),

/***/ 247:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 248:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 251:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(44);
module.exports = __webpack_require__(108);


/***/ }),

/***/ 44:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgY2QwZmYyODFmMDlmNTE1NzdlZGY/MzJiMyIsIndlYnBhY2s6Ly8vLi9SZXNvdXJjZXMvYXNzZXRzL2RlbW8uanMiLCJ3ZWJwYWNrOi8vLy4vUmVzb3VyY2VzL2Fzc2V0cy9qcy9kZW1vL2RlbW8uanMiLCJ3ZWJwYWNrOi8vLy4vfi9oaWdobGlnaHQuanMvbGliL2hpZ2hsaWdodC5qcyIsIndlYnBhY2s6Ly8vLi9+L2hpZ2hsaWdodC5qcy9saWIvbGFuZ3VhZ2VzL2phdmFzY3JpcHQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9oaWdobGlnaHQuanMvbGliL2xhbmd1YWdlcy9qc29uLmpzIiwid2VicGFjazovLy8uL34vaGlnaGxpZ2h0LmpzL2xpYi9sYW5ndWFnZXMvcGhwLmpzIiwid2VicGFjazovLy8uL34vaGlnaGxpZ2h0LmpzL2xpYi9sYW5ndWFnZXMvdHdpZy5qcyIsIndlYnBhY2s6Ly8vLi9+L2hpZ2hsaWdodC5qcy9saWIvbGFuZ3VhZ2VzL3R5cGVzY3JpcHQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9oaWdobGlnaHQuanMvbGliL2xhbmd1YWdlcy95YW1sLmpzIiwid2VicGFjazovLy8uL1Jlc291cmNlcy9hc3NldHMvc3R5bGVzL2RlbW8vZGVtby5jc3MiLCJ3ZWJwYWNrOi8vLy4vfi9oaWdobGlnaHQuanMvc3R5bGVzL2RlZmF1bHQuY3NzIiwid2VicGFjazovLy8uL1Jlc291cmNlcy9hc3NldHMvcGxhdGZvcm0uc2Nzcz9kMTU5Il0sIm5hbWVzIjpbInJlcXVpcmUiLCJobGpzIiwicmVnaXN0ZXJMYW5ndWFnZSIsImluaXRIaWdobGlnaHRpbmdPbkxvYWQiLCJmYWN0b3J5IiwiZ2xvYmFsT2JqZWN0Iiwid2luZG93Iiwic2VsZiIsImV4cG9ydHMiLCJkZWZpbmUiLCJhbWQiLCJBcnJheVByb3RvIiwib2JqZWN0S2V5cyIsIk9iamVjdCIsImtleXMiLCJsYW5ndWFnZXMiLCJhbGlhc2VzIiwibm9IaWdobGlnaHRSZSIsImxhbmd1YWdlUHJlZml4UmUiLCJmaXhNYXJrdXBSZSIsInNwYW5FbmRUYWciLCJvcHRpb25zIiwiY2xhc3NQcmVmaXgiLCJ0YWJSZXBsYWNlIiwidXNlQlIiLCJ1bmRlZmluZWQiLCJlc2NhcGUiLCJ2YWx1ZSIsInJlcGxhY2UiLCJ0YWciLCJub2RlIiwibm9kZU5hbWUiLCJ0b0xvd2VyQ2FzZSIsInRlc3RSZSIsInJlIiwibGV4ZW1lIiwibWF0Y2giLCJleGVjIiwiaW5kZXgiLCJpc05vdEhpZ2hsaWdodGVkIiwibGFuZ3VhZ2UiLCJ0ZXN0IiwiYmxvY2tMYW5ndWFnZSIsImJsb2NrIiwiaSIsImxlbmd0aCIsIl9jbGFzcyIsImNsYXNzZXMiLCJjbGFzc05hbWUiLCJwYXJlbnROb2RlIiwiZ2V0TGFuZ3VhZ2UiLCJzcGxpdCIsImluaGVyaXQiLCJwYXJlbnQiLCJrZXkiLCJyZXN1bHQiLCJvYmplY3RzIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJzbGljZSIsImNhbGwiLCJhcmd1bWVudHMiLCJmb3JFYWNoIiwib2JqIiwibm9kZVN0cmVhbSIsIl9ub2RlU3RyZWFtIiwib2Zmc2V0IiwiY2hpbGQiLCJmaXJzdENoaWxkIiwibmV4dFNpYmxpbmciLCJub2RlVHlwZSIsIm5vZGVWYWx1ZSIsInB1c2giLCJldmVudCIsIm1lcmdlU3RyZWFtcyIsIm9yaWdpbmFsIiwiaGlnaGxpZ2h0ZWQiLCJwcm9jZXNzZWQiLCJub2RlU3RhY2siLCJzZWxlY3RTdHJlYW0iLCJvcGVuIiwiYXR0cl9zdHIiLCJhIiwibWFwIiwiYXR0cmlidXRlcyIsImpvaW4iLCJjbG9zZSIsInJlbmRlciIsInN0cmVhbSIsInN1YnN0cmluZyIsInJldmVyc2UiLCJzcGxpY2UiLCJwb3AiLCJzdWJzdHIiLCJleHBhbmRfbW9kZSIsIm1vZGUiLCJ2YXJpYW50cyIsImNhY2hlZF92YXJpYW50cyIsInZhcmlhbnQiLCJlbmRzV2l0aFBhcmVudCIsImNvbXBpbGVMYW5ndWFnZSIsInJlU3RyIiwic291cmNlIiwibGFuZ1JlIiwiZ2xvYmFsIiwiUmVnRXhwIiwiY2FzZV9pbnNlbnNpdGl2ZSIsImNvbXBpbGVNb2RlIiwiY29tcGlsZWQiLCJrZXl3b3JkcyIsImJlZ2luS2V5d29yZHMiLCJjb21waWxlZF9rZXl3b3JkcyIsImZsYXR0ZW4iLCJzdHIiLCJrdyIsInBhaXIiLCJOdW1iZXIiLCJsZXhlbWVzUmUiLCJsZXhlbWVzIiwiYmVnaW4iLCJiZWdpblJlIiwiZW5kIiwiZW5kUmUiLCJ0ZXJtaW5hdG9yX2VuZCIsImlsbGVnYWwiLCJpbGxlZ2FsUmUiLCJyZWxldmFuY2UiLCJjb250YWlucyIsImNvbmNhdCIsImFwcGx5IiwiYyIsInN0YXJ0cyIsInRlcm1pbmF0b3JzIiwiZmlsdGVyIiwiQm9vbGVhbiIsImhpZ2hsaWdodCIsIm5hbWUiLCJpZ25vcmVfaWxsZWdhbHMiLCJjb250aW51YXRpb24iLCJzdWJNb2RlIiwiZW5kT2ZNb2RlIiwiZW5kc1BhcmVudCIsImlzSWxsZWdhbCIsImtleXdvcmRNYXRjaCIsIm1hdGNoX3N0ciIsImhhc093blByb3BlcnR5IiwiYnVpbGRTcGFuIiwiY2xhc3NuYW1lIiwiaW5zaWRlU3BhbiIsImxlYXZlT3BlbiIsIm5vUHJlZml4Iiwib3BlblNwYW4iLCJjbG9zZVNwYW4iLCJwcm9jZXNzS2V5d29yZHMiLCJrZXl3b3JkX21hdGNoIiwibGFzdF9pbmRleCIsInRvcCIsIm1vZGVfYnVmZmVyIiwibGFzdEluZGV4IiwicHJvY2Vzc1N1Ykxhbmd1YWdlIiwiZXhwbGljaXQiLCJzdWJMYW5ndWFnZSIsImNvbnRpbnVhdGlvbnMiLCJoaWdobGlnaHRBdXRvIiwicHJvY2Vzc0J1ZmZlciIsInN0YXJ0TmV3TW9kZSIsImNyZWF0ZSIsInByb2Nlc3NMZXhlbWUiLCJidWZmZXIiLCJuZXdfbW9kZSIsInNraXAiLCJleGNsdWRlQmVnaW4iLCJyZXR1cm5CZWdpbiIsImVuZF9tb2RlIiwib3JpZ2luIiwicmV0dXJuRW5kIiwiZXhjbHVkZUVuZCIsIkVycm9yIiwiY3VycmVudCIsImNvdW50IiwiZSIsIm1lc3NhZ2UiLCJpbmRleE9mIiwidGV4dCIsImxhbmd1YWdlU3Vic2V0Iiwic2Vjb25kX2Jlc3QiLCJmaXhNYXJrdXAiLCJwMSIsImJ1aWxkQ2xhc3NOYW1lIiwicHJldkNsYXNzTmFtZSIsImN1cnJlbnRMYW5nIiwicmVzdWx0TGFuZyIsInRyaW0iLCJoaWdobGlnaHRCbG9jayIsIm9yaWdpbmFsU3RyZWFtIiwicmVzdWx0Tm9kZSIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudE5TIiwiaW5uZXJIVE1MIiwidGV4dENvbnRlbnQiLCJjb25maWd1cmUiLCJ1c2VyX29wdGlvbnMiLCJpbml0SGlnaGxpZ2h0aW5nIiwiY2FsbGVkIiwiYmxvY2tzIiwicXVlcnlTZWxlY3RvckFsbCIsImFkZEV2ZW50TGlzdGVuZXIiLCJsYW5nIiwiYWxpYXMiLCJsaXN0TGFuZ3VhZ2VzIiwiSURFTlRfUkUiLCJVTkRFUlNDT1JFX0lERU5UX1JFIiwiTlVNQkVSX1JFIiwiQ19OVU1CRVJfUkUiLCJCSU5BUllfTlVNQkVSX1JFIiwiUkVfU1RBUlRFUlNfUkUiLCJCQUNLU0xBU0hfRVNDQVBFIiwiQVBPU19TVFJJTkdfTU9ERSIsIlFVT1RFX1NUUklOR19NT0RFIiwiUEhSQVNBTF9XT1JEU19NT0RFIiwiQ09NTUVOVCIsImluaGVyaXRzIiwiQ19MSU5FX0NPTU1FTlRfTU9ERSIsIkNfQkxPQ0tfQ09NTUVOVF9NT0RFIiwiSEFTSF9DT01NRU5UX01PREUiLCJOVU1CRVJfTU9ERSIsIkNfTlVNQkVSX01PREUiLCJCSU5BUllfTlVNQkVSX01PREUiLCJDU1NfTlVNQkVSX01PREUiLCJSRUdFWFBfTU9ERSIsIlRJVExFX01PREUiLCJVTkRFUlNDT1JFX1RJVExFX01PREUiLCJNRVRIT0RfR1VBUkQiLCJtb2R1bGUiLCJLRVlXT1JEUyIsImtleXdvcmQiLCJsaXRlcmFsIiwiYnVpbHRfaW4iLCJFWFBSRVNTSU9OUyIsIk5VTUJFUiIsIlNVQlNUIiwiVEVNUExBVEVfU1RSSU5HIiwiUEFSQU1TX0NPTlRBSU5TIiwiTElURVJBTFMiLCJUWVBFUyIsIlZBTFVFX0NPTlRBSU5FUiIsIk9CSkVDVCIsIkFSUkFZIiwiVkFSSUFCTEUiLCJQUkVQUk9DRVNTT1IiLCJTVFJJTkciLCJQQVJBTVMiLCJGVU5DVElPTl9OQU1FUyIsIkZVTkNUSU9OUyIsIkZJTFRFUiIsIlRBR1MiLCJ0Iiwia2V5UHJlZml4Iiwia2V5TmFtZSIsIktFWSIsIlRFTVBMQVRFX1ZBUklBQkxFUyJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7QUMvREE7QUFDQSxtQkFBQUEsQ0FBUSxHQUFSOztBQUVBO0FBQ0EsbUJBQUFBLENBQVEsR0FBUjtBQUNBLG1CQUFBQSxDQUFRLEdBQVIsRTs7Ozs7OztBQ05BO0FBQ0EsSUFBTUMsT0FBTyxtQkFBQUQsQ0FBUSxHQUFSLENBQWI7QUFDQUMsS0FBS0MsZ0JBQUwsQ0FBc0IsTUFBdEIsRUFBOEIsbUJBQUFGLENBQVEsR0FBUixDQUE5QjtBQUNBQyxLQUFLQyxnQkFBTCxDQUFzQixLQUF0QixFQUE2QixtQkFBQUYsQ0FBUSxHQUFSLENBQTdCO0FBQ0FDLEtBQUtDLGdCQUFMLENBQXNCLFlBQXRCLEVBQW9DLG1CQUFBRixDQUFRLEdBQVIsQ0FBcEM7QUFDQUMsS0FBS0MsZ0JBQUwsQ0FBc0IsTUFBdEIsRUFBOEIsbUJBQUFGLENBQVEsR0FBUixDQUE5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QUFPM0gsUUFKbkI7QUFLRTtBQUNBTixXQUFLMEksSUFBSW5LLFFBQUosQ0FBYSxDQUFiLEVBQWdCdUI7QUFOdkIsS0FQUSxFQWVSLEVBQUU7QUFDQUEsYUFBTyxVQURULEVBQ3FCRSxLQUFLLFNBRDFCO0FBRUV3QyxtQkFBYSxNQUZmO0FBR0VVLG9CQUFjLElBSGhCO0FBSUVLLGtCQUFZLElBSmQ7QUFLRWxELGlCQUFXO0FBTGIsS0FmUSxFQXNCUixFQUFFO0FBQ0E5RSxpQkFBVyxNQURiO0FBRUV1RSxhQUFPLE9BQU90SCxLQUFLa047QUFGckIsS0F0QlEsRUEwQlIsRUFBRTtBQUNBbkssaUJBQVcsTUFEYjtBQUVFdUUsYUFBTyxNQUFNdEgsS0FBS2tOLG1CQUFYLEdBQWlDO0FBRjFDLEtBMUJRLEVBOEJSLEVBQUU7QUFDQW5LLGlCQUFXLE1BRGI7QUFFRXVFLGFBQU8sUUFBUXRILEtBQUtrTixtQkFBYixHQUFtQztBQUY1QyxLQTlCUSxFQWtDUixFQUFFO0FBQ0FuSyxpQkFBVyxRQURiO0FBRUV1RSxhQUFPLE1BRlQ7QUFHRU8saUJBQVc7QUFIYixLQWxDUSxFQXVDUjdILEtBQUsrTixpQkF2Q0csRUF3Q1I7QUFDRWxILHFCQUFlcUksUUFEakI7QUFFRXRJLGdCQUFVLEVBQUMrSCxTQUFTTyxRQUFWO0FBRlosS0F4Q1EsRUE0Q1JsUCxLQUFLaU8sYUE1Q0csRUE2Q1J3QixNQTdDUTtBQUhMLEdBQVA7QUFtREQsQ0F0RkQsQzs7Ozs7OztBQ0FBLHlDOzs7Ozs7O0FDQUEseUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQSx5QyIsImZpbGUiOiJkZW1vLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvYnVuZGxlcy9pbWF0aWN2aWV3L1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDI1MSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgY2QwZmYyODFmMDlmNTE1NzdlZGYiLCJcbi8vIEhpZ2hsaWdodFxucmVxdWlyZSgnaGlnaGxpZ2h0LmpzL3N0eWxlcy9kZWZhdWx0LmNzcycpO1xuXG4vLyBQbGF0Zm9ybSAtIGRlbW9cbnJlcXVpcmUoJy4vc3R5bGVzL2RlbW8vZGVtby5jc3MnKTtcbnJlcXVpcmUoJy4vanMvZGVtby9kZW1vLmpzJyk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9SZXNvdXJjZXMvYXNzZXRzL2RlbW8uanMiLCIvLyBQbGF0Zm9ybSBkZW1vIGluaXRpYWxpemF0aW9uXG5jb25zdCBobGpzID0gcmVxdWlyZSgnaGlnaGxpZ2h0LmpzL2xpYi9oaWdobGlnaHQnKTtcbmhsanMucmVnaXN0ZXJMYW5ndWFnZSgndHdpZycsIHJlcXVpcmUoJ2hpZ2hsaWdodC5qcy9saWIvbGFuZ3VhZ2VzL3R3aWcnKSk7XG5obGpzLnJlZ2lzdGVyTGFuZ3VhZ2UoJ3BocCcsIHJlcXVpcmUoJ2hpZ2hsaWdodC5qcy9saWIvbGFuZ3VhZ2VzL3BocCcpKTtcbmhsanMucmVnaXN0ZXJMYW5ndWFnZSgnamF2YXNjcmlwdCcsIHJlcXVpcmUoJ2hpZ2hsaWdodC5qcy9saWIvbGFuZ3VhZ2VzL2phdmFzY3JpcHQnKSk7XG5obGpzLnJlZ2lzdGVyTGFuZ3VhZ2UoJ2pzb24nLCByZXF1aXJlKCdoaWdobGlnaHQuanMvbGliL2xhbmd1YWdlcy9qc29uJykpO1xuaGxqcy5yZWdpc3Rlckxhbmd1YWdlKCd0eXBlc2NyaXB0JywgcmVxdWlyZSgnaGlnaGxpZ2h0LmpzL2xpYi9sYW5ndWFnZXMvdHlwZXNjcmlwdCcpKTtcbmhsanMucmVnaXN0ZXJMYW5ndWFnZSgneWFtbCcsIHJlcXVpcmUoJ2hpZ2hsaWdodC5qcy9saWIvbGFuZ3VhZ2VzL3lhbWwnKSk7XG5obGpzLmluaXRIaWdobGlnaHRpbmdPbkxvYWQoKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL1Jlc291cmNlcy9hc3NldHMvanMvZGVtby9kZW1vLmpzIiwiLypcblN5bnRheCBoaWdobGlnaHRpbmcgd2l0aCBsYW5ndWFnZSBhdXRvZGV0ZWN0aW9uLlxuaHR0cHM6Ly9oaWdobGlnaHRqcy5vcmcvXG4qL1xuXG4oZnVuY3Rpb24oZmFjdG9yeSkge1xuXG4gIC8vIEZpbmQgdGhlIGdsb2JhbCBvYmplY3QgZm9yIGV4cG9ydCB0byBib3RoIHRoZSBicm93c2VyIGFuZCB3ZWIgd29ya2Vycy5cbiAgdmFyIGdsb2JhbE9iamVjdCA9IHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnICYmIHdpbmRvdyB8fFxuICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIHNlbGYgPT09ICdvYmplY3QnICYmIHNlbGY7XG5cbiAgLy8gU2V0dXAgaGlnaGxpZ2h0LmpzIGZvciBkaWZmZXJlbnQgZW52aXJvbm1lbnRzLiBGaXJzdCBpcyBOb2RlLmpzIG9yXG4gIC8vIENvbW1vbkpTLlxuICBpZih0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBmYWN0b3J5KGV4cG9ydHMpO1xuICB9IGVsc2UgaWYoZ2xvYmFsT2JqZWN0KSB7XG4gICAgLy8gRXhwb3J0IGhsanMgZ2xvYmFsbHkgZXZlbiB3aGVuIHVzaW5nIEFNRCBmb3IgY2FzZXMgd2hlbiB0aGlzIHNjcmlwdFxuICAgIC8vIGlzIGxvYWRlZCB3aXRoIG90aGVycyB0aGF0IG1heSBzdGlsbCBleHBlY3QgYSBnbG9iYWwgaGxqcy5cbiAgICBnbG9iYWxPYmplY3QuaGxqcyA9IGZhY3Rvcnkoe30pO1xuXG4gICAgLy8gRmluYWxseSByZWdpc3RlciB0aGUgZ2xvYmFsIGhsanMgd2l0aCBBTUQuXG4gICAgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICBkZWZpbmUoW10sIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gZ2xvYmFsT2JqZWN0LmhsanM7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxufShmdW5jdGlvbihobGpzKSB7XG4gIC8vIENvbnZlbmllbmNlIHZhcmlhYmxlcyBmb3IgYnVpbGQtaW4gb2JqZWN0c1xuICB2YXIgQXJyYXlQcm90byA9IFtdLFxuICAgICAgb2JqZWN0S2V5cyA9IE9iamVjdC5rZXlzO1xuXG4gIC8vIEdsb2JhbCBpbnRlcm5hbCB2YXJpYWJsZXMgdXNlZCB3aXRoaW4gdGhlIGhpZ2hsaWdodC5qcyBsaWJyYXJ5LlxuICB2YXIgbGFuZ3VhZ2VzID0ge30sXG4gICAgICBhbGlhc2VzICAgPSB7fTtcblxuICAvLyBSZWd1bGFyIGV4cHJlc3Npb25zIHVzZWQgdGhyb3VnaG91dCB0aGUgaGlnaGxpZ2h0LmpzIGxpYnJhcnkuXG4gIHZhciBub0hpZ2hsaWdodFJlICAgID0gL14obm8tP2hpZ2hsaWdodHxwbGFpbnx0ZXh0KSQvaSxcbiAgICAgIGxhbmd1YWdlUHJlZml4UmUgPSAvXFxibGFuZyg/OnVhZ2UpPy0oW1xcdy1dKylcXGIvaSxcbiAgICAgIGZpeE1hcmt1cFJlICAgICAgPSAvKCheKDxbXj5dKz58XFx0fCkrfCg/OlxcbikpKS9nbTtcblxuICB2YXIgc3BhbkVuZFRhZyA9ICc8L3NwYW4+JztcblxuICAvLyBHbG9iYWwgb3B0aW9ucyB1c2VkIHdoZW4gd2l0aGluIGV4dGVybmFsIEFQSXMuIFRoaXMgaXMgbW9kaWZpZWQgd2hlblxuICAvLyBjYWxsaW5nIHRoZSBgaGxqcy5jb25maWd1cmVgIGZ1bmN0aW9uLlxuICB2YXIgb3B0aW9ucyA9IHtcbiAgICBjbGFzc1ByZWZpeDogJ2hsanMtJyxcbiAgICB0YWJSZXBsYWNlOiBudWxsLFxuICAgIHVzZUJSOiBmYWxzZSxcbiAgICBsYW5ndWFnZXM6IHVuZGVmaW5lZFxuICB9O1xuXG5cbiAgLyogVXRpbGl0eSBmdW5jdGlvbnMgKi9cblxuICBmdW5jdGlvbiBlc2NhcGUodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUucmVwbGFjZSgvJi9nLCAnJmFtcDsnKS5yZXBsYWNlKC88L2csICcmbHQ7JykucmVwbGFjZSgvPi9nLCAnJmd0OycpO1xuICB9XG5cbiAgZnVuY3Rpb24gdGFnKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gdGVzdFJlKHJlLCBsZXhlbWUpIHtcbiAgICB2YXIgbWF0Y2ggPSByZSAmJiByZS5leGVjKGxleGVtZSk7XG4gICAgcmV0dXJuIG1hdGNoICYmIG1hdGNoLmluZGV4ID09PSAwO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNOb3RIaWdobGlnaHRlZChsYW5ndWFnZSkge1xuICAgIHJldHVybiBub0hpZ2hsaWdodFJlLnRlc3QobGFuZ3VhZ2UpO1xuICB9XG5cbiAgZnVuY3Rpb24gYmxvY2tMYW5ndWFnZShibG9jaykge1xuICAgIHZhciBpLCBtYXRjaCwgbGVuZ3RoLCBfY2xhc3M7XG4gICAgdmFyIGNsYXNzZXMgPSBibG9jay5jbGFzc05hbWUgKyAnICc7XG5cbiAgICBjbGFzc2VzICs9IGJsb2NrLnBhcmVudE5vZGUgPyBibG9jay5wYXJlbnROb2RlLmNsYXNzTmFtZSA6ICcnO1xuXG4gICAgLy8gbGFuZ3VhZ2UtKiB0YWtlcyBwcmVjZWRlbmNlIG92ZXIgbm9uLXByZWZpeGVkIGNsYXNzIG5hbWVzLlxuICAgIG1hdGNoID0gbGFuZ3VhZ2VQcmVmaXhSZS5leGVjKGNsYXNzZXMpO1xuICAgIGlmIChtYXRjaCkge1xuICAgICAgcmV0dXJuIGdldExhbmd1YWdlKG1hdGNoWzFdKSA/IG1hdGNoWzFdIDogJ25vLWhpZ2hsaWdodCc7XG4gICAgfVxuXG4gICAgY2xhc3NlcyA9IGNsYXNzZXMuc3BsaXQoL1xccysvKTtcblxuICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IGNsYXNzZXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIF9jbGFzcyA9IGNsYXNzZXNbaV1cblxuICAgICAgaWYgKGlzTm90SGlnaGxpZ2h0ZWQoX2NsYXNzKSB8fCBnZXRMYW5ndWFnZShfY2xhc3MpKSB7XG4gICAgICAgIHJldHVybiBfY2xhc3M7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaW5oZXJpdChwYXJlbnQpIHsgIC8vIGluaGVyaXQocGFyZW50LCBvdmVycmlkZV9vYmosIG92ZXJyaWRlX29iaiwgLi4uKVxuICAgIHZhciBrZXk7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHZhciBvYmplY3RzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICAgIGZvciAoa2V5IGluIHBhcmVudClcbiAgICAgIHJlc3VsdFtrZXldID0gcGFyZW50W2tleV07XG4gICAgb2JqZWN0cy5mb3JFYWNoKGZ1bmN0aW9uKG9iaikge1xuICAgICAgZm9yIChrZXkgaW4gb2JqKVxuICAgICAgICByZXN1bHRba2V5XSA9IG9ialtrZXldO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKiBTdHJlYW0gbWVyZ2luZyAqL1xuXG4gIGZ1bmN0aW9uIG5vZGVTdHJlYW0obm9kZSkge1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAoZnVuY3Rpb24gX25vZGVTdHJlYW0obm9kZSwgb2Zmc2V0KSB7XG4gICAgICBmb3IgKHZhciBjaGlsZCA9IG5vZGUuZmlyc3RDaGlsZDsgY2hpbGQ7IGNoaWxkID0gY2hpbGQubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgaWYgKGNoaWxkLm5vZGVUeXBlID09PSAzKVxuICAgICAgICAgIG9mZnNldCArPSBjaGlsZC5ub2RlVmFsdWUubGVuZ3RoO1xuICAgICAgICBlbHNlIGlmIChjaGlsZC5ub2RlVHlwZSA9PT0gMSkge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICAgIGV2ZW50OiAnc3RhcnQnLFxuICAgICAgICAgICAgb2Zmc2V0OiBvZmZzZXQsXG4gICAgICAgICAgICBub2RlOiBjaGlsZFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIG9mZnNldCA9IF9ub2RlU3RyZWFtKGNoaWxkLCBvZmZzZXQpO1xuICAgICAgICAgIC8vIFByZXZlbnQgdm9pZCBlbGVtZW50cyBmcm9tIGhhdmluZyBhbiBlbmQgdGFnIHRoYXQgd291bGQgYWN0dWFsbHlcbiAgICAgICAgICAvLyBkb3VibGUgdGhlbSBpbiB0aGUgb3V0cHV0LiBUaGVyZSBhcmUgbW9yZSB2b2lkIGVsZW1lbnRzIGluIEhUTUxcbiAgICAgICAgICAvLyBidXQgd2UgbGlzdCBvbmx5IHRob3NlIHJlYWxpc3RpY2FsbHkgZXhwZWN0ZWQgaW4gY29kZSBkaXNwbGF5LlxuICAgICAgICAgIGlmICghdGFnKGNoaWxkKS5tYXRjaCgvYnJ8aHJ8aW1nfGlucHV0LykpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICAgICAgZXZlbnQ6ICdzdG9wJyxcbiAgICAgICAgICAgICAgb2Zmc2V0OiBvZmZzZXQsXG4gICAgICAgICAgICAgIG5vZGU6IGNoaWxkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBvZmZzZXQ7XG4gICAgfSkobm9kZSwgMCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1lcmdlU3RyZWFtcyhvcmlnaW5hbCwgaGlnaGxpZ2h0ZWQsIHZhbHVlKSB7XG4gICAgdmFyIHByb2Nlc3NlZCA9IDA7XG4gICAgdmFyIHJlc3VsdCA9ICcnO1xuICAgIHZhciBub2RlU3RhY2sgPSBbXTtcblxuICAgIGZ1bmN0aW9uIHNlbGVjdFN0cmVhbSgpIHtcbiAgICAgIGlmICghb3JpZ2luYWwubGVuZ3RoIHx8ICFoaWdobGlnaHRlZC5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsLmxlbmd0aCA/IG9yaWdpbmFsIDogaGlnaGxpZ2h0ZWQ7XG4gICAgICB9XG4gICAgICBpZiAob3JpZ2luYWxbMF0ub2Zmc2V0ICE9PSBoaWdobGlnaHRlZFswXS5vZmZzZXQpIHtcbiAgICAgICAgcmV0dXJuIChvcmlnaW5hbFswXS5vZmZzZXQgPCBoaWdobGlnaHRlZFswXS5vZmZzZXQpID8gb3JpZ2luYWwgOiBoaWdobGlnaHRlZDtcbiAgICAgIH1cblxuICAgICAgLypcbiAgICAgIFRvIGF2b2lkIHN0YXJ0aW5nIHRoZSBzdHJlYW0ganVzdCBiZWZvcmUgaXQgc2hvdWxkIHN0b3AgdGhlIG9yZGVyIGlzXG4gICAgICBlbnN1cmVkIHRoYXQgb3JpZ2luYWwgYWx3YXlzIHN0YXJ0cyBmaXJzdCBhbmQgY2xvc2VzIGxhc3Q6XG5cbiAgICAgIGlmIChldmVudDEgPT0gJ3N0YXJ0JyAmJiBldmVudDIgPT0gJ3N0YXJ0JylcbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsO1xuICAgICAgaWYgKGV2ZW50MSA9PSAnc3RhcnQnICYmIGV2ZW50MiA9PSAnc3RvcCcpXG4gICAgICAgIHJldHVybiBoaWdobGlnaHRlZDtcbiAgICAgIGlmIChldmVudDEgPT0gJ3N0b3AnICYmIGV2ZW50MiA9PSAnc3RhcnQnKVxuICAgICAgICByZXR1cm4gb3JpZ2luYWw7XG4gICAgICBpZiAoZXZlbnQxID09ICdzdG9wJyAmJiBldmVudDIgPT0gJ3N0b3AnKVxuICAgICAgICByZXR1cm4gaGlnaGxpZ2h0ZWQ7XG5cbiAgICAgIC4uLiB3aGljaCBpcyBjb2xsYXBzZWQgdG86XG4gICAgICAqL1xuICAgICAgcmV0dXJuIGhpZ2hsaWdodGVkWzBdLmV2ZW50ID09PSAnc3RhcnQnID8gb3JpZ2luYWwgOiBoaWdobGlnaHRlZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvcGVuKG5vZGUpIHtcbiAgICAgIGZ1bmN0aW9uIGF0dHJfc3RyKGEpIHtyZXR1cm4gJyAnICsgYS5ub2RlTmFtZSArICc9XCInICsgZXNjYXBlKGEudmFsdWUpLnJlcGxhY2UoJ1wiJywgJyZxdW90OycpICsgJ1wiJzt9XG4gICAgICByZXN1bHQgKz0gJzwnICsgdGFnKG5vZGUpICsgQXJyYXlQcm90by5tYXAuY2FsbChub2RlLmF0dHJpYnV0ZXMsIGF0dHJfc3RyKS5qb2luKCcnKSArICc+JztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbG9zZShub2RlKSB7XG4gICAgICByZXN1bHQgKz0gJzwvJyArIHRhZyhub2RlKSArICc+JztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW5kZXIoZXZlbnQpIHtcbiAgICAgIChldmVudC5ldmVudCA9PT0gJ3N0YXJ0JyA/IG9wZW4gOiBjbG9zZSkoZXZlbnQubm9kZSk7XG4gICAgfVxuXG4gICAgd2hpbGUgKG9yaWdpbmFsLmxlbmd0aCB8fCBoaWdobGlnaHRlZC5sZW5ndGgpIHtcbiAgICAgIHZhciBzdHJlYW0gPSBzZWxlY3RTdHJlYW0oKTtcbiAgICAgIHJlc3VsdCArPSBlc2NhcGUodmFsdWUuc3Vic3RyaW5nKHByb2Nlc3NlZCwgc3RyZWFtWzBdLm9mZnNldCkpO1xuICAgICAgcHJvY2Vzc2VkID0gc3RyZWFtWzBdLm9mZnNldDtcbiAgICAgIGlmIChzdHJlYW0gPT09IG9yaWdpbmFsKSB7XG4gICAgICAgIC8qXG4gICAgICAgIE9uIGFueSBvcGVuaW5nIG9yIGNsb3NpbmcgdGFnIG9mIHRoZSBvcmlnaW5hbCBtYXJrdXAgd2UgZmlyc3QgY2xvc2VcbiAgICAgICAgdGhlIGVudGlyZSBoaWdobGlnaHRlZCBub2RlIHN0YWNrLCB0aGVuIHJlbmRlciB0aGUgb3JpZ2luYWwgdGFnIGFsb25nXG4gICAgICAgIHdpdGggYWxsIHRoZSBmb2xsb3dpbmcgb3JpZ2luYWwgdGFncyBhdCB0aGUgc2FtZSBvZmZzZXQgYW5kIHRoZW5cbiAgICAgICAgcmVvcGVuIGFsbCB0aGUgdGFncyBvbiB0aGUgaGlnaGxpZ2h0ZWQgc3RhY2suXG4gICAgICAgICovXG4gICAgICAgIG5vZGVTdGFjay5yZXZlcnNlKCkuZm9yRWFjaChjbG9zZSk7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICByZW5kZXIoc3RyZWFtLnNwbGljZSgwLCAxKVswXSk7XG4gICAgICAgICAgc3RyZWFtID0gc2VsZWN0U3RyZWFtKCk7XG4gICAgICAgIH0gd2hpbGUgKHN0cmVhbSA9PT0gb3JpZ2luYWwgJiYgc3RyZWFtLmxlbmd0aCAmJiBzdHJlYW1bMF0ub2Zmc2V0ID09PSBwcm9jZXNzZWQpO1xuICAgICAgICBub2RlU3RhY2sucmV2ZXJzZSgpLmZvckVhY2gob3Blbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoc3RyZWFtWzBdLmV2ZW50ID09PSAnc3RhcnQnKSB7XG4gICAgICAgICAgbm9kZVN0YWNrLnB1c2goc3RyZWFtWzBdLm5vZGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5vZGVTdGFjay5wb3AoKTtcbiAgICAgICAgfVxuICAgICAgICByZW5kZXIoc3RyZWFtLnNwbGljZSgwLCAxKVswXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQgKyBlc2NhcGUodmFsdWUuc3Vic3RyKHByb2Nlc3NlZCkpO1xuICB9XG5cbiAgLyogSW5pdGlhbGl6YXRpb24gKi9cblxuICBmdW5jdGlvbiBleHBhbmRfbW9kZShtb2RlKSB7XG4gICAgaWYgKG1vZGUudmFyaWFudHMgJiYgIW1vZGUuY2FjaGVkX3ZhcmlhbnRzKSB7XG4gICAgICBtb2RlLmNhY2hlZF92YXJpYW50cyA9IG1vZGUudmFyaWFudHMubWFwKGZ1bmN0aW9uKHZhcmlhbnQpIHtcbiAgICAgICAgcmV0dXJuIGluaGVyaXQobW9kZSwge3ZhcmlhbnRzOiBudWxsfSwgdmFyaWFudCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIG1vZGUuY2FjaGVkX3ZhcmlhbnRzIHx8IChtb2RlLmVuZHNXaXRoUGFyZW50ICYmIFtpbmhlcml0KG1vZGUpXSkgfHwgW21vZGVdO1xuICB9XG5cbiAgZnVuY3Rpb24gY29tcGlsZUxhbmd1YWdlKGxhbmd1YWdlKSB7XG5cbiAgICBmdW5jdGlvbiByZVN0cihyZSkge1xuICAgICAgICByZXR1cm4gKHJlICYmIHJlLnNvdXJjZSkgfHwgcmU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGFuZ1JlKHZhbHVlLCBnbG9iYWwpIHtcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKFxuICAgICAgICByZVN0cih2YWx1ZSksXG4gICAgICAgICdtJyArIChsYW5ndWFnZS5jYXNlX2luc2Vuc2l0aXZlID8gJ2knIDogJycpICsgKGdsb2JhbCA/ICdnJyA6ICcnKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21waWxlTW9kZShtb2RlLCBwYXJlbnQpIHtcbiAgICAgIGlmIChtb2RlLmNvbXBpbGVkKVxuICAgICAgICByZXR1cm47XG4gICAgICBtb2RlLmNvbXBpbGVkID0gdHJ1ZTtcblxuICAgICAgbW9kZS5rZXl3b3JkcyA9IG1vZGUua2V5d29yZHMgfHwgbW9kZS5iZWdpbktleXdvcmRzO1xuICAgICAgaWYgKG1vZGUua2V5d29yZHMpIHtcbiAgICAgICAgdmFyIGNvbXBpbGVkX2tleXdvcmRzID0ge307XG5cbiAgICAgICAgdmFyIGZsYXR0ZW4gPSBmdW5jdGlvbihjbGFzc05hbWUsIHN0cikge1xuICAgICAgICAgIGlmIChsYW5ndWFnZS5jYXNlX2luc2Vuc2l0aXZlKSB7XG4gICAgICAgICAgICBzdHIgPSBzdHIudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc3RyLnNwbGl0KCcgJykuZm9yRWFjaChmdW5jdGlvbihrdykge1xuICAgICAgICAgICAgdmFyIHBhaXIgPSBrdy5zcGxpdCgnfCcpO1xuICAgICAgICAgICAgY29tcGlsZWRfa2V5d29yZHNbcGFpclswXV0gPSBbY2xhc3NOYW1lLCBwYWlyWzFdID8gTnVtYmVyKHBhaXJbMV0pIDogMV07XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHR5cGVvZiBtb2RlLmtleXdvcmRzID09PSAnc3RyaW5nJykgeyAvLyBzdHJpbmdcbiAgICAgICAgICBmbGF0dGVuKCdrZXl3b3JkJywgbW9kZS5rZXl3b3Jkcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb2JqZWN0S2V5cyhtb2RlLmtleXdvcmRzKS5mb3JFYWNoKGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcbiAgICAgICAgICAgIGZsYXR0ZW4oY2xhc3NOYW1lLCBtb2RlLmtleXdvcmRzW2NsYXNzTmFtZV0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIG1vZGUua2V5d29yZHMgPSBjb21waWxlZF9rZXl3b3JkcztcbiAgICAgIH1cbiAgICAgIG1vZGUubGV4ZW1lc1JlID0gbGFuZ1JlKG1vZGUubGV4ZW1lcyB8fCAvXFx3Ky8sIHRydWUpO1xuXG4gICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgIGlmIChtb2RlLmJlZ2luS2V5d29yZHMpIHtcbiAgICAgICAgICBtb2RlLmJlZ2luID0gJ1xcXFxiKCcgKyBtb2RlLmJlZ2luS2V5d29yZHMuc3BsaXQoJyAnKS5qb2luKCd8JykgKyAnKVxcXFxiJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW1vZGUuYmVnaW4pXG4gICAgICAgICAgbW9kZS5iZWdpbiA9IC9cXEJ8XFxiLztcbiAgICAgICAgbW9kZS5iZWdpblJlID0gbGFuZ1JlKG1vZGUuYmVnaW4pO1xuICAgICAgICBpZiAoIW1vZGUuZW5kICYmICFtb2RlLmVuZHNXaXRoUGFyZW50KVxuICAgICAgICAgIG1vZGUuZW5kID0gL1xcQnxcXGIvO1xuICAgICAgICBpZiAobW9kZS5lbmQpXG4gICAgICAgICAgbW9kZS5lbmRSZSA9IGxhbmdSZShtb2RlLmVuZCk7XG4gICAgICAgIG1vZGUudGVybWluYXRvcl9lbmQgPSByZVN0cihtb2RlLmVuZCkgfHwgJyc7XG4gICAgICAgIGlmIChtb2RlLmVuZHNXaXRoUGFyZW50ICYmIHBhcmVudC50ZXJtaW5hdG9yX2VuZClcbiAgICAgICAgICBtb2RlLnRlcm1pbmF0b3JfZW5kICs9IChtb2RlLmVuZCA/ICd8JyA6ICcnKSArIHBhcmVudC50ZXJtaW5hdG9yX2VuZDtcbiAgICAgIH1cbiAgICAgIGlmIChtb2RlLmlsbGVnYWwpXG4gICAgICAgIG1vZGUuaWxsZWdhbFJlID0gbGFuZ1JlKG1vZGUuaWxsZWdhbCk7XG4gICAgICBpZiAobW9kZS5yZWxldmFuY2UgPT0gbnVsbClcbiAgICAgICAgbW9kZS5yZWxldmFuY2UgPSAxO1xuICAgICAgaWYgKCFtb2RlLmNvbnRhaW5zKSB7XG4gICAgICAgIG1vZGUuY29udGFpbnMgPSBbXTtcbiAgICAgIH1cbiAgICAgIG1vZGUuY29udGFpbnMgPSBBcnJheS5wcm90b3R5cGUuY29uY2F0LmFwcGx5KFtdLCBtb2RlLmNvbnRhaW5zLm1hcChmdW5jdGlvbihjKSB7XG4gICAgICAgIHJldHVybiBleHBhbmRfbW9kZShjID09PSAnc2VsZicgPyBtb2RlIDogYylcbiAgICAgIH0pKTtcbiAgICAgIG1vZGUuY29udGFpbnMuZm9yRWFjaChmdW5jdGlvbihjKSB7Y29tcGlsZU1vZGUoYywgbW9kZSk7fSk7XG5cbiAgICAgIGlmIChtb2RlLnN0YXJ0cykge1xuICAgICAgICBjb21waWxlTW9kZShtb2RlLnN0YXJ0cywgcGFyZW50KTtcbiAgICAgIH1cblxuICAgICAgdmFyIHRlcm1pbmF0b3JzID1cbiAgICAgICAgbW9kZS5jb250YWlucy5tYXAoZnVuY3Rpb24oYykge1xuICAgICAgICAgIHJldHVybiBjLmJlZ2luS2V5d29yZHMgPyAnXFxcXC4/KCcgKyBjLmJlZ2luICsgJylcXFxcLj8nIDogYy5iZWdpbjtcbiAgICAgICAgfSlcbiAgICAgICAgLmNvbmNhdChbbW9kZS50ZXJtaW5hdG9yX2VuZCwgbW9kZS5pbGxlZ2FsXSlcbiAgICAgICAgLm1hcChyZVN0cilcbiAgICAgICAgLmZpbHRlcihCb29sZWFuKTtcbiAgICAgIG1vZGUudGVybWluYXRvcnMgPSB0ZXJtaW5hdG9ycy5sZW5ndGggPyBsYW5nUmUodGVybWluYXRvcnMuam9pbignfCcpLCB0cnVlKSA6IHtleGVjOiBmdW5jdGlvbigvKnMqLykge3JldHVybiBudWxsO319O1xuICAgIH1cblxuICAgIGNvbXBpbGVNb2RlKGxhbmd1YWdlKTtcbiAgfVxuXG4gIC8qXG4gIENvcmUgaGlnaGxpZ2h0aW5nIGZ1bmN0aW9uLiBBY2NlcHRzIGEgbGFuZ3VhZ2UgbmFtZSwgb3IgYW4gYWxpYXMsIGFuZCBhXG4gIHN0cmluZyB3aXRoIHRoZSBjb2RlIHRvIGhpZ2hsaWdodC4gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCB0aGUgZm9sbG93aW5nXG4gIHByb3BlcnRpZXM6XG5cbiAgLSByZWxldmFuY2UgKGludClcbiAgLSB2YWx1ZSAoYW4gSFRNTCBzdHJpbmcgd2l0aCBoaWdobGlnaHRpbmcgbWFya3VwKVxuXG4gICovXG4gIGZ1bmN0aW9uIGhpZ2hsaWdodChuYW1lLCB2YWx1ZSwgaWdub3JlX2lsbGVnYWxzLCBjb250aW51YXRpb24pIHtcblxuICAgIGZ1bmN0aW9uIHN1Yk1vZGUobGV4ZW1lLCBtb2RlKSB7XG4gICAgICB2YXIgaSwgbGVuZ3RoO1xuXG4gICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSBtb2RlLmNvbnRhaW5zLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh0ZXN0UmUobW9kZS5jb250YWluc1tpXS5iZWdpblJlLCBsZXhlbWUpKSB7XG4gICAgICAgICAgcmV0dXJuIG1vZGUuY29udGFpbnNbaV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlbmRPZk1vZGUobW9kZSwgbGV4ZW1lKSB7XG4gICAgICBpZiAodGVzdFJlKG1vZGUuZW5kUmUsIGxleGVtZSkpIHtcbiAgICAgICAgd2hpbGUgKG1vZGUuZW5kc1BhcmVudCAmJiBtb2RlLnBhcmVudCkge1xuICAgICAgICAgIG1vZGUgPSBtb2RlLnBhcmVudDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbW9kZTtcbiAgICAgIH1cbiAgICAgIGlmIChtb2RlLmVuZHNXaXRoUGFyZW50KSB7XG4gICAgICAgIHJldHVybiBlbmRPZk1vZGUobW9kZS5wYXJlbnQsIGxleGVtZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNJbGxlZ2FsKGxleGVtZSwgbW9kZSkge1xuICAgICAgcmV0dXJuICFpZ25vcmVfaWxsZWdhbHMgJiYgdGVzdFJlKG1vZGUuaWxsZWdhbFJlLCBsZXhlbWUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGtleXdvcmRNYXRjaChtb2RlLCBtYXRjaCkge1xuICAgICAgdmFyIG1hdGNoX3N0ciA9IGxhbmd1YWdlLmNhc2VfaW5zZW5zaXRpdmUgPyBtYXRjaFswXS50b0xvd2VyQ2FzZSgpIDogbWF0Y2hbMF07XG4gICAgICByZXR1cm4gbW9kZS5rZXl3b3Jkcy5oYXNPd25Qcm9wZXJ0eShtYXRjaF9zdHIpICYmIG1vZGUua2V5d29yZHNbbWF0Y2hfc3RyXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBidWlsZFNwYW4oY2xhc3NuYW1lLCBpbnNpZGVTcGFuLCBsZWF2ZU9wZW4sIG5vUHJlZml4KSB7XG4gICAgICB2YXIgY2xhc3NQcmVmaXggPSBub1ByZWZpeCA/ICcnIDogb3B0aW9ucy5jbGFzc1ByZWZpeCxcbiAgICAgICAgICBvcGVuU3BhbiAgICA9ICc8c3BhbiBjbGFzcz1cIicgKyBjbGFzc1ByZWZpeCxcbiAgICAgICAgICBjbG9zZVNwYW4gICA9IGxlYXZlT3BlbiA/ICcnIDogc3BhbkVuZFRhZ1xuXG4gICAgICBvcGVuU3BhbiArPSBjbGFzc25hbWUgKyAnXCI+JztcblxuICAgICAgcmV0dXJuIG9wZW5TcGFuICsgaW5zaWRlU3BhbiArIGNsb3NlU3BhbjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcm9jZXNzS2V5d29yZHMoKSB7XG4gICAgICB2YXIga2V5d29yZF9tYXRjaCwgbGFzdF9pbmRleCwgbWF0Y2gsIHJlc3VsdDtcblxuICAgICAgaWYgKCF0b3Aua2V5d29yZHMpXG4gICAgICAgIHJldHVybiBlc2NhcGUobW9kZV9idWZmZXIpO1xuXG4gICAgICByZXN1bHQgPSAnJztcbiAgICAgIGxhc3RfaW5kZXggPSAwO1xuICAgICAgdG9wLmxleGVtZXNSZS5sYXN0SW5kZXggPSAwO1xuICAgICAgbWF0Y2ggPSB0b3AubGV4ZW1lc1JlLmV4ZWMobW9kZV9idWZmZXIpO1xuXG4gICAgICB3aGlsZSAobWF0Y2gpIHtcbiAgICAgICAgcmVzdWx0ICs9IGVzY2FwZShtb2RlX2J1ZmZlci5zdWJzdHJpbmcobGFzdF9pbmRleCwgbWF0Y2guaW5kZXgpKTtcbiAgICAgICAga2V5d29yZF9tYXRjaCA9IGtleXdvcmRNYXRjaCh0b3AsIG1hdGNoKTtcbiAgICAgICAgaWYgKGtleXdvcmRfbWF0Y2gpIHtcbiAgICAgICAgICByZWxldmFuY2UgKz0ga2V5d29yZF9tYXRjaFsxXTtcbiAgICAgICAgICByZXN1bHQgKz0gYnVpbGRTcGFuKGtleXdvcmRfbWF0Y2hbMF0sIGVzY2FwZShtYXRjaFswXSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdCArPSBlc2NhcGUobWF0Y2hbMF0pO1xuICAgICAgICB9XG4gICAgICAgIGxhc3RfaW5kZXggPSB0b3AubGV4ZW1lc1JlLmxhc3RJbmRleDtcbiAgICAgICAgbWF0Y2ggPSB0b3AubGV4ZW1lc1JlLmV4ZWMobW9kZV9idWZmZXIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdCArIGVzY2FwZShtb2RlX2J1ZmZlci5zdWJzdHIobGFzdF9pbmRleCkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByb2Nlc3NTdWJMYW5ndWFnZSgpIHtcbiAgICAgIHZhciBleHBsaWNpdCA9IHR5cGVvZiB0b3Auc3ViTGFuZ3VhZ2UgPT09ICdzdHJpbmcnO1xuICAgICAgaWYgKGV4cGxpY2l0ICYmICFsYW5ndWFnZXNbdG9wLnN1Ykxhbmd1YWdlXSkge1xuICAgICAgICByZXR1cm4gZXNjYXBlKG1vZGVfYnVmZmVyKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlc3VsdCA9IGV4cGxpY2l0ID9cbiAgICAgICAgICAgICAgICAgICBoaWdobGlnaHQodG9wLnN1Ykxhbmd1YWdlLCBtb2RlX2J1ZmZlciwgdHJ1ZSwgY29udGludWF0aW9uc1t0b3Auc3ViTGFuZ3VhZ2VdKSA6XG4gICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0QXV0byhtb2RlX2J1ZmZlciwgdG9wLnN1Ykxhbmd1YWdlLmxlbmd0aCA/IHRvcC5zdWJMYW5ndWFnZSA6IHVuZGVmaW5lZCk7XG5cbiAgICAgIC8vIENvdW50aW5nIGVtYmVkZGVkIGxhbmd1YWdlIHNjb3JlIHRvd2FyZHMgdGhlIGhvc3QgbGFuZ3VhZ2UgbWF5IGJlIGRpc2FibGVkXG4gICAgICAvLyB3aXRoIHplcm9pbmcgdGhlIGNvbnRhaW5pbmcgbW9kZSByZWxldmFuY2UuIFVzZWNhc2UgaW4gcG9pbnQgaXMgTWFya2Rvd24gdGhhdFxuICAgICAgLy8gYWxsb3dzIFhNTCBldmVyeXdoZXJlIGFuZCBtYWtlcyBldmVyeSBYTUwgc25pcHBldCB0byBoYXZlIGEgbXVjaCBsYXJnZXIgTWFya2Rvd25cbiAgICAgIC8vIHNjb3JlLlxuICAgICAgaWYgKHRvcC5yZWxldmFuY2UgPiAwKSB7XG4gICAgICAgIHJlbGV2YW5jZSArPSByZXN1bHQucmVsZXZhbmNlO1xuICAgICAgfVxuICAgICAgaWYgKGV4cGxpY2l0KSB7XG4gICAgICAgIGNvbnRpbnVhdGlvbnNbdG9wLnN1Ykxhbmd1YWdlXSA9IHJlc3VsdC50b3A7XG4gICAgICB9XG4gICAgICByZXR1cm4gYnVpbGRTcGFuKHJlc3VsdC5sYW5ndWFnZSwgcmVzdWx0LnZhbHVlLCBmYWxzZSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJvY2Vzc0J1ZmZlcigpIHtcbiAgICAgIHJlc3VsdCArPSAodG9wLnN1Ykxhbmd1YWdlICE9IG51bGwgPyBwcm9jZXNzU3ViTGFuZ3VhZ2UoKSA6IHByb2Nlc3NLZXl3b3JkcygpKTtcbiAgICAgIG1vZGVfYnVmZmVyID0gJyc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3RhcnROZXdNb2RlKG1vZGUpIHtcbiAgICAgIHJlc3VsdCArPSBtb2RlLmNsYXNzTmFtZT8gYnVpbGRTcGFuKG1vZGUuY2xhc3NOYW1lLCAnJywgdHJ1ZSk6ICcnO1xuICAgICAgdG9wID0gT2JqZWN0LmNyZWF0ZShtb2RlLCB7cGFyZW50OiB7dmFsdWU6IHRvcH19KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcm9jZXNzTGV4ZW1lKGJ1ZmZlciwgbGV4ZW1lKSB7XG5cbiAgICAgIG1vZGVfYnVmZmVyICs9IGJ1ZmZlcjtcblxuICAgICAgaWYgKGxleGVtZSA9PSBudWxsKSB7XG4gICAgICAgIHByb2Nlc3NCdWZmZXIoKTtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9XG5cbiAgICAgIHZhciBuZXdfbW9kZSA9IHN1Yk1vZGUobGV4ZW1lLCB0b3ApO1xuICAgICAgaWYgKG5ld19tb2RlKSB7XG4gICAgICAgIGlmIChuZXdfbW9kZS5za2lwKSB7XG4gICAgICAgICAgbW9kZV9idWZmZXIgKz0gbGV4ZW1lO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChuZXdfbW9kZS5leGNsdWRlQmVnaW4pIHtcbiAgICAgICAgICAgIG1vZGVfYnVmZmVyICs9IGxleGVtZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcHJvY2Vzc0J1ZmZlcigpO1xuICAgICAgICAgIGlmICghbmV3X21vZGUucmV0dXJuQmVnaW4gJiYgIW5ld19tb2RlLmV4Y2x1ZGVCZWdpbikge1xuICAgICAgICAgICAgbW9kZV9idWZmZXIgPSBsZXhlbWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHN0YXJ0TmV3TW9kZShuZXdfbW9kZSwgbGV4ZW1lKTtcbiAgICAgICAgcmV0dXJuIG5ld19tb2RlLnJldHVybkJlZ2luID8gMCA6IGxleGVtZS5sZW5ndGg7XG4gICAgICB9XG5cbiAgICAgIHZhciBlbmRfbW9kZSA9IGVuZE9mTW9kZSh0b3AsIGxleGVtZSk7XG4gICAgICBpZiAoZW5kX21vZGUpIHtcbiAgICAgICAgdmFyIG9yaWdpbiA9IHRvcDtcbiAgICAgICAgaWYgKG9yaWdpbi5za2lwKSB7XG4gICAgICAgICAgbW9kZV9idWZmZXIgKz0gbGV4ZW1lO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICghKG9yaWdpbi5yZXR1cm5FbmQgfHwgb3JpZ2luLmV4Y2x1ZGVFbmQpKSB7XG4gICAgICAgICAgICBtb2RlX2J1ZmZlciArPSBsZXhlbWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHByb2Nlc3NCdWZmZXIoKTtcbiAgICAgICAgICBpZiAob3JpZ2luLmV4Y2x1ZGVFbmQpIHtcbiAgICAgICAgICAgIG1vZGVfYnVmZmVyID0gbGV4ZW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBkbyB7XG4gICAgICAgICAgaWYgKHRvcC5jbGFzc05hbWUpIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSBzcGFuRW5kVGFnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIXRvcC5za2lwKSB7XG4gICAgICAgICAgICByZWxldmFuY2UgKz0gdG9wLnJlbGV2YW5jZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdG9wID0gdG9wLnBhcmVudDtcbiAgICAgICAgfSB3aGlsZSAodG9wICE9PSBlbmRfbW9kZS5wYXJlbnQpO1xuICAgICAgICBpZiAoZW5kX21vZGUuc3RhcnRzKSB7XG4gICAgICAgICAgc3RhcnROZXdNb2RlKGVuZF9tb2RlLnN0YXJ0cywgJycpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcmlnaW4ucmV0dXJuRW5kID8gMCA6IGxleGVtZS5sZW5ndGg7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc0lsbGVnYWwobGV4ZW1lLCB0b3ApKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0lsbGVnYWwgbGV4ZW1lIFwiJyArIGxleGVtZSArICdcIiBmb3IgbW9kZSBcIicgKyAodG9wLmNsYXNzTmFtZSB8fCAnPHVubmFtZWQ+JykgKyAnXCInKTtcblxuICAgICAgLypcbiAgICAgIFBhcnNlciBzaG91bGQgbm90IHJlYWNoIHRoaXMgcG9pbnQgYXMgYWxsIHR5cGVzIG9mIGxleGVtZXMgc2hvdWxkIGJlIGNhdWdodFxuICAgICAgZWFybGllciwgYnV0IGlmIGl0IGRvZXMgZHVlIHRvIHNvbWUgYnVnIG1ha2Ugc3VyZSBpdCBhZHZhbmNlcyBhdCBsZWFzdCBvbmVcbiAgICAgIGNoYXJhY3RlciBmb3J3YXJkIHRvIHByZXZlbnQgaW5maW5pdGUgbG9vcGluZy5cbiAgICAgICovXG4gICAgICBtb2RlX2J1ZmZlciArPSBsZXhlbWU7XG4gICAgICByZXR1cm4gbGV4ZW1lLmxlbmd0aCB8fCAxO1xuICAgIH1cblxuICAgIHZhciBsYW5ndWFnZSA9IGdldExhbmd1YWdlKG5hbWUpO1xuICAgIGlmICghbGFuZ3VhZ2UpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBsYW5ndWFnZTogXCInICsgbmFtZSArICdcIicpO1xuICAgIH1cblxuICAgIGNvbXBpbGVMYW5ndWFnZShsYW5ndWFnZSk7XG4gICAgdmFyIHRvcCA9IGNvbnRpbnVhdGlvbiB8fCBsYW5ndWFnZTtcbiAgICB2YXIgY29udGludWF0aW9ucyA9IHt9OyAvLyBrZWVwIGNvbnRpbnVhdGlvbnMgZm9yIHN1Yi1sYW5ndWFnZXNcbiAgICB2YXIgcmVzdWx0ID0gJycsIGN1cnJlbnQ7XG4gICAgZm9yKGN1cnJlbnQgPSB0b3A7IGN1cnJlbnQgIT09IGxhbmd1YWdlOyBjdXJyZW50ID0gY3VycmVudC5wYXJlbnQpIHtcbiAgICAgIGlmIChjdXJyZW50LmNsYXNzTmFtZSkge1xuICAgICAgICByZXN1bHQgPSBidWlsZFNwYW4oY3VycmVudC5jbGFzc05hbWUsICcnLCB0cnVlKSArIHJlc3VsdDtcbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIG1vZGVfYnVmZmVyID0gJyc7XG4gICAgdmFyIHJlbGV2YW5jZSA9IDA7XG4gICAgdHJ5IHtcbiAgICAgIHZhciBtYXRjaCwgY291bnQsIGluZGV4ID0gMDtcbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHRvcC50ZXJtaW5hdG9ycy5sYXN0SW5kZXggPSBpbmRleDtcbiAgICAgICAgbWF0Y2ggPSB0b3AudGVybWluYXRvcnMuZXhlYyh2YWx1ZSk7XG4gICAgICAgIGlmICghbWF0Y2gpXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNvdW50ID0gcHJvY2Vzc0xleGVtZSh2YWx1ZS5zdWJzdHJpbmcoaW5kZXgsIG1hdGNoLmluZGV4KSwgbWF0Y2hbMF0pO1xuICAgICAgICBpbmRleCA9IG1hdGNoLmluZGV4ICsgY291bnQ7XG4gICAgICB9XG4gICAgICBwcm9jZXNzTGV4ZW1lKHZhbHVlLnN1YnN0cihpbmRleCkpO1xuICAgICAgZm9yKGN1cnJlbnQgPSB0b3A7IGN1cnJlbnQucGFyZW50OyBjdXJyZW50ID0gY3VycmVudC5wYXJlbnQpIHsgLy8gY2xvc2UgZGFuZ2xpbmcgbW9kZXNcbiAgICAgICAgaWYgKGN1cnJlbnQuY2xhc3NOYW1lKSB7XG4gICAgICAgICAgcmVzdWx0ICs9IHNwYW5FbmRUYWc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJlbGV2YW5jZTogcmVsZXZhbmNlLFxuICAgICAgICB2YWx1ZTogcmVzdWx0LFxuICAgICAgICBsYW5ndWFnZTogbmFtZSxcbiAgICAgICAgdG9wOiB0b3BcbiAgICAgIH07XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGUubWVzc2FnZSAmJiBlLm1lc3NhZ2UuaW5kZXhPZignSWxsZWdhbCcpICE9PSAtMSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHJlbGV2YW5jZTogMCxcbiAgICAgICAgICB2YWx1ZTogZXNjYXBlKHZhbHVlKVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKlxuICBIaWdobGlnaHRpbmcgd2l0aCBsYW5ndWFnZSBkZXRlY3Rpb24uIEFjY2VwdHMgYSBzdHJpbmcgd2l0aCB0aGUgY29kZSB0b1xuICBoaWdobGlnaHQuIFJldHVybnMgYW4gb2JqZWN0IHdpdGggdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuXG4gIC0gbGFuZ3VhZ2UgKGRldGVjdGVkIGxhbmd1YWdlKVxuICAtIHJlbGV2YW5jZSAoaW50KVxuICAtIHZhbHVlIChhbiBIVE1MIHN0cmluZyB3aXRoIGhpZ2hsaWdodGluZyBtYXJrdXApXG4gIC0gc2Vjb25kX2Jlc3QgKG9iamVjdCB3aXRoIHRoZSBzYW1lIHN0cnVjdHVyZSBmb3Igc2Vjb25kLWJlc3QgaGV1cmlzdGljYWxseVxuICAgIGRldGVjdGVkIGxhbmd1YWdlLCBtYXkgYmUgYWJzZW50KVxuXG4gICovXG4gIGZ1bmN0aW9uIGhpZ2hsaWdodEF1dG8odGV4dCwgbGFuZ3VhZ2VTdWJzZXQpIHtcbiAgICBsYW5ndWFnZVN1YnNldCA9IGxhbmd1YWdlU3Vic2V0IHx8IG9wdGlvbnMubGFuZ3VhZ2VzIHx8IG9iamVjdEtleXMobGFuZ3VhZ2VzKTtcbiAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgdmFsdWU6IGVzY2FwZSh0ZXh0KVxuICAgIH07XG4gICAgdmFyIHNlY29uZF9iZXN0ID0gcmVzdWx0O1xuICAgIGxhbmd1YWdlU3Vic2V0LmZpbHRlcihnZXRMYW5ndWFnZSkuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgICB2YXIgY3VycmVudCA9IGhpZ2hsaWdodChuYW1lLCB0ZXh0LCBmYWxzZSk7XG4gICAgICBjdXJyZW50Lmxhbmd1YWdlID0gbmFtZTtcbiAgICAgIGlmIChjdXJyZW50LnJlbGV2YW5jZSA+IHNlY29uZF9iZXN0LnJlbGV2YW5jZSkge1xuICAgICAgICBzZWNvbmRfYmVzdCA9IGN1cnJlbnQ7XG4gICAgICB9XG4gICAgICBpZiAoY3VycmVudC5yZWxldmFuY2UgPiByZXN1bHQucmVsZXZhbmNlKSB7XG4gICAgICAgIHNlY29uZF9iZXN0ID0gcmVzdWx0O1xuICAgICAgICByZXN1bHQgPSBjdXJyZW50O1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChzZWNvbmRfYmVzdC5sYW5ndWFnZSkge1xuICAgICAgcmVzdWx0LnNlY29uZF9iZXN0ID0gc2Vjb25kX2Jlc3Q7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKlxuICBQb3N0LXByb2Nlc3Npbmcgb2YgdGhlIGhpZ2hsaWdodGVkIG1hcmt1cDpcblxuICAtIHJlcGxhY2UgVEFCcyB3aXRoIHNvbWV0aGluZyBtb3JlIHVzZWZ1bFxuICAtIHJlcGxhY2UgcmVhbCBsaW5lLWJyZWFrcyB3aXRoICc8YnI+JyBmb3Igbm9uLXByZSBjb250YWluZXJzXG5cbiAgKi9cbiAgZnVuY3Rpb24gZml4TWFya3VwKHZhbHVlKSB7XG4gICAgcmV0dXJuICEob3B0aW9ucy50YWJSZXBsYWNlIHx8IG9wdGlvbnMudXNlQlIpXG4gICAgICA/IHZhbHVlXG4gICAgICA6IHZhbHVlLnJlcGxhY2UoZml4TWFya3VwUmUsIGZ1bmN0aW9uKG1hdGNoLCBwMSkge1xuICAgICAgICAgIGlmIChvcHRpb25zLnVzZUJSICYmIG1hdGNoID09PSAnXFxuJykge1xuICAgICAgICAgICAgcmV0dXJuICc8YnI+JztcbiAgICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMudGFiUmVwbGFjZSkge1xuICAgICAgICAgICAgcmV0dXJuIHAxLnJlcGxhY2UoL1xcdC9nLCBvcHRpb25zLnRhYlJlcGxhY2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGJ1aWxkQ2xhc3NOYW1lKHByZXZDbGFzc05hbWUsIGN1cnJlbnRMYW5nLCByZXN1bHRMYW5nKSB7XG4gICAgdmFyIGxhbmd1YWdlID0gY3VycmVudExhbmcgPyBhbGlhc2VzW2N1cnJlbnRMYW5nXSA6IHJlc3VsdExhbmcsXG4gICAgICAgIHJlc3VsdCAgID0gW3ByZXZDbGFzc05hbWUudHJpbSgpXTtcblxuICAgIGlmICghcHJldkNsYXNzTmFtZS5tYXRjaCgvXFxiaGxqc1xcYi8pKSB7XG4gICAgICByZXN1bHQucHVzaCgnaGxqcycpO1xuICAgIH1cblxuICAgIGlmIChwcmV2Q2xhc3NOYW1lLmluZGV4T2YobGFuZ3VhZ2UpID09PSAtMSkge1xuICAgICAgcmVzdWx0LnB1c2gobGFuZ3VhZ2UpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQuam9pbignICcpLnRyaW0oKTtcbiAgfVxuXG4gIC8qXG4gIEFwcGxpZXMgaGlnaGxpZ2h0aW5nIHRvIGEgRE9NIG5vZGUgY29udGFpbmluZyBjb2RlLiBBY2NlcHRzIGEgRE9NIG5vZGUgYW5kXG4gIHR3byBvcHRpb25hbCBwYXJhbWV0ZXJzIGZvciBmaXhNYXJrdXAuXG4gICovXG4gIGZ1bmN0aW9uIGhpZ2hsaWdodEJsb2NrKGJsb2NrKSB7XG4gICAgdmFyIG5vZGUsIG9yaWdpbmFsU3RyZWFtLCByZXN1bHQsIHJlc3VsdE5vZGUsIHRleHQ7XG4gICAgdmFyIGxhbmd1YWdlID0gYmxvY2tMYW5ndWFnZShibG9jayk7XG5cbiAgICBpZiAoaXNOb3RIaWdobGlnaHRlZChsYW5ndWFnZSkpXG4gICAgICAgIHJldHVybjtcblxuICAgIGlmIChvcHRpb25zLnVzZUJSKSB7XG4gICAgICBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJywgJ2RpdicpO1xuICAgICAgbm9kZS5pbm5lckhUTUwgPSBibG9jay5pbm5lckhUTUwucmVwbGFjZSgvXFxuL2csICcnKS5yZXBsYWNlKC88YnJbIFxcL10qPi9nLCAnXFxuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vZGUgPSBibG9jaztcbiAgICB9XG4gICAgdGV4dCA9IG5vZGUudGV4dENvbnRlbnQ7XG4gICAgcmVzdWx0ID0gbGFuZ3VhZ2UgPyBoaWdobGlnaHQobGFuZ3VhZ2UsIHRleHQsIHRydWUpIDogaGlnaGxpZ2h0QXV0byh0ZXh0KTtcblxuICAgIG9yaWdpbmFsU3RyZWFtID0gbm9kZVN0cmVhbShub2RlKTtcbiAgICBpZiAob3JpZ2luYWxTdHJlYW0ubGVuZ3RoKSB7XG4gICAgICByZXN1bHROb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJywgJ2RpdicpO1xuICAgICAgcmVzdWx0Tm9kZS5pbm5lckhUTUwgPSByZXN1bHQudmFsdWU7XG4gICAgICByZXN1bHQudmFsdWUgPSBtZXJnZVN0cmVhbXMob3JpZ2luYWxTdHJlYW0sIG5vZGVTdHJlYW0ocmVzdWx0Tm9kZSksIHRleHQpO1xuICAgIH1cbiAgICByZXN1bHQudmFsdWUgPSBmaXhNYXJrdXAocmVzdWx0LnZhbHVlKTtcblxuICAgIGJsb2NrLmlubmVySFRNTCA9IHJlc3VsdC52YWx1ZTtcbiAgICBibG9jay5jbGFzc05hbWUgPSBidWlsZENsYXNzTmFtZShibG9jay5jbGFzc05hbWUsIGxhbmd1YWdlLCByZXN1bHQubGFuZ3VhZ2UpO1xuICAgIGJsb2NrLnJlc3VsdCA9IHtcbiAgICAgIGxhbmd1YWdlOiByZXN1bHQubGFuZ3VhZ2UsXG4gICAgICByZTogcmVzdWx0LnJlbGV2YW5jZVxuICAgIH07XG4gICAgaWYgKHJlc3VsdC5zZWNvbmRfYmVzdCkge1xuICAgICAgYmxvY2suc2Vjb25kX2Jlc3QgPSB7XG4gICAgICAgIGxhbmd1YWdlOiByZXN1bHQuc2Vjb25kX2Jlc3QubGFuZ3VhZ2UsXG4gICAgICAgIHJlOiByZXN1bHQuc2Vjb25kX2Jlc3QucmVsZXZhbmNlXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIC8qXG4gIFVwZGF0ZXMgaGlnaGxpZ2h0LmpzIGdsb2JhbCBvcHRpb25zIHdpdGggdmFsdWVzIHBhc3NlZCBpbiB0aGUgZm9ybSBvZiBhbiBvYmplY3QuXG4gICovXG4gIGZ1bmN0aW9uIGNvbmZpZ3VyZSh1c2VyX29wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gaW5oZXJpdChvcHRpb25zLCB1c2VyX29wdGlvbnMpO1xuICB9XG5cbiAgLypcbiAgQXBwbGllcyBoaWdobGlnaHRpbmcgdG8gYWxsIDxwcmU+PGNvZGU+Li48L2NvZGU+PC9wcmU+IGJsb2NrcyBvbiBhIHBhZ2UuXG4gICovXG4gIGZ1bmN0aW9uIGluaXRIaWdobGlnaHRpbmcoKSB7XG4gICAgaWYgKGluaXRIaWdobGlnaHRpbmcuY2FsbGVkKVxuICAgICAgcmV0dXJuO1xuICAgIGluaXRIaWdobGlnaHRpbmcuY2FsbGVkID0gdHJ1ZTtcblxuICAgIHZhciBibG9ja3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdwcmUgY29kZScpO1xuICAgIEFycmF5UHJvdG8uZm9yRWFjaC5jYWxsKGJsb2NrcywgaGlnaGxpZ2h0QmxvY2spO1xuICB9XG5cbiAgLypcbiAgQXR0YWNoZXMgaGlnaGxpZ2h0aW5nIHRvIHRoZSBwYWdlIGxvYWQgZXZlbnQuXG4gICovXG4gIGZ1bmN0aW9uIGluaXRIaWdobGlnaHRpbmdPbkxvYWQoKSB7XG4gICAgYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGluaXRIaWdobGlnaHRpbmcsIGZhbHNlKTtcbiAgICBhZGRFdmVudExpc3RlbmVyKCdsb2FkJywgaW5pdEhpZ2hsaWdodGluZywgZmFsc2UpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVnaXN0ZXJMYW5ndWFnZShuYW1lLCBsYW5ndWFnZSkge1xuICAgIHZhciBsYW5nID0gbGFuZ3VhZ2VzW25hbWVdID0gbGFuZ3VhZ2UoaGxqcyk7XG4gICAgaWYgKGxhbmcuYWxpYXNlcykge1xuICAgICAgbGFuZy5hbGlhc2VzLmZvckVhY2goZnVuY3Rpb24oYWxpYXMpIHthbGlhc2VzW2FsaWFzXSA9IG5hbWU7fSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbGlzdExhbmd1YWdlcygpIHtcbiAgICByZXR1cm4gb2JqZWN0S2V5cyhsYW5ndWFnZXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TGFuZ3VhZ2UobmFtZSkge1xuICAgIG5hbWUgPSAobmFtZSB8fCAnJykudG9Mb3dlckNhc2UoKTtcbiAgICByZXR1cm4gbGFuZ3VhZ2VzW25hbWVdIHx8IGxhbmd1YWdlc1thbGlhc2VzW25hbWVdXTtcbiAgfVxuXG4gIC8qIEludGVyZmFjZSBkZWZpbml0aW9uICovXG5cbiAgaGxqcy5oaWdobGlnaHQgPSBoaWdobGlnaHQ7XG4gIGhsanMuaGlnaGxpZ2h0QXV0byA9IGhpZ2hsaWdodEF1dG87XG4gIGhsanMuZml4TWFya3VwID0gZml4TWFya3VwO1xuICBobGpzLmhpZ2hsaWdodEJsb2NrID0gaGlnaGxpZ2h0QmxvY2s7XG4gIGhsanMuY29uZmlndXJlID0gY29uZmlndXJlO1xuICBobGpzLmluaXRIaWdobGlnaHRpbmcgPSBpbml0SGlnaGxpZ2h0aW5nO1xuICBobGpzLmluaXRIaWdobGlnaHRpbmdPbkxvYWQgPSBpbml0SGlnaGxpZ2h0aW5nT25Mb2FkO1xuICBobGpzLnJlZ2lzdGVyTGFuZ3VhZ2UgPSByZWdpc3Rlckxhbmd1YWdlO1xuICBobGpzLmxpc3RMYW5ndWFnZXMgPSBsaXN0TGFuZ3VhZ2VzO1xuICBobGpzLmdldExhbmd1YWdlID0gZ2V0TGFuZ3VhZ2U7XG4gIGhsanMuaW5oZXJpdCA9IGluaGVyaXQ7XG5cbiAgLy8gQ29tbW9uIHJlZ2V4cHNcbiAgaGxqcy5JREVOVF9SRSA9ICdbYS16QS1aXVxcXFx3Kic7XG4gIGhsanMuVU5ERVJTQ09SRV9JREVOVF9SRSA9ICdbYS16QS1aX11cXFxcdyonO1xuICBobGpzLk5VTUJFUl9SRSA9ICdcXFxcYlxcXFxkKyhcXFxcLlxcXFxkKyk/JztcbiAgaGxqcy5DX05VTUJFUl9SRSA9ICcoLT8pKFxcXFxiMFt4WF1bYS1mQS1GMC05XSt8KFxcXFxiXFxcXGQrKFxcXFwuXFxcXGQqKT98XFxcXC5cXFxcZCspKFtlRV1bLStdP1xcXFxkKyk/KSc7IC8vIDB4Li4uLCAwLi4uLCBkZWNpbWFsLCBmbG9hdFxuICBobGpzLkJJTkFSWV9OVU1CRVJfUkUgPSAnXFxcXGIoMGJbMDFdKyknOyAvLyAwYi4uLlxuICBobGpzLlJFX1NUQVJURVJTX1JFID0gJyF8IT18IT09fCV8JT18JnwmJnwmPXxcXFxcKnxcXFxcKj18XFxcXCt8XFxcXCs9fCx8LXwtPXwvPXwvfDp8O3w8PHw8PD18PD18PHw9PT18PT18PXw+Pj49fD4+PXw+PXw+Pj58Pj58PnxcXFxcP3xcXFxcW3xcXFxce3xcXFxcKHxcXFxcXnxcXFxcXj18XFxcXHx8XFxcXHw9fFxcXFx8XFxcXHx8fic7XG5cbiAgLy8gQ29tbW9uIG1vZGVzXG4gIGhsanMuQkFDS1NMQVNIX0VTQ0FQRSA9IHtcbiAgICBiZWdpbjogJ1xcXFxcXFxcW1xcXFxzXFxcXFNdJywgcmVsZXZhbmNlOiAwXG4gIH07XG4gIGhsanMuQVBPU19TVFJJTkdfTU9ERSA9IHtcbiAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgIGJlZ2luOiAnXFwnJywgZW5kOiAnXFwnJyxcbiAgICBpbGxlZ2FsOiAnXFxcXG4nLFxuICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFXVxuICB9O1xuICBobGpzLlFVT1RFX1NUUklOR19NT0RFID0ge1xuICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgYmVnaW46ICdcIicsIGVuZDogJ1wiJyxcbiAgICBpbGxlZ2FsOiAnXFxcXG4nLFxuICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFXVxuICB9O1xuICBobGpzLlBIUkFTQUxfV09SRFNfTU9ERSA9IHtcbiAgICBiZWdpbjogL1xcYihhfGFufHRoZXxhcmV8SSdtfGlzbid0fGRvbid0fGRvZXNuJ3R8d29uJ3R8YnV0fGp1c3R8c2hvdWxkfHByZXR0eXxzaW1wbHl8ZW5vdWdofGdvbm5hfGdvaW5nfHd0Znxzb3xzdWNofHdpbGx8eW91fHlvdXJ8dGhleXxsaWtlfG1vcmUpXFxiL1xuICB9O1xuICBobGpzLkNPTU1FTlQgPSBmdW5jdGlvbiAoYmVnaW4sIGVuZCwgaW5oZXJpdHMpIHtcbiAgICB2YXIgbW9kZSA9IGhsanMuaW5oZXJpdChcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICAgIGJlZ2luOiBiZWdpbiwgZW5kOiBlbmQsXG4gICAgICAgIGNvbnRhaW5zOiBbXVxuICAgICAgfSxcbiAgICAgIGluaGVyaXRzIHx8IHt9XG4gICAgKTtcbiAgICBtb2RlLmNvbnRhaW5zLnB1c2goaGxqcy5QSFJBU0FMX1dPUkRTX01PREUpO1xuICAgIG1vZGUuY29udGFpbnMucHVzaCh7XG4gICAgICBjbGFzc05hbWU6ICdkb2N0YWcnLFxuICAgICAgYmVnaW46ICcoPzpUT0RPfEZJWE1FfE5PVEV8QlVHfFhYWCk6JyxcbiAgICAgIHJlbGV2YW5jZTogMFxuICAgIH0pO1xuICAgIHJldHVybiBtb2RlO1xuICB9O1xuICBobGpzLkNfTElORV9DT01NRU5UX01PREUgPSBobGpzLkNPTU1FTlQoJy8vJywgJyQnKTtcbiAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSA9IGhsanMuQ09NTUVOVCgnL1xcXFwqJywgJ1xcXFwqLycpO1xuICBobGpzLkhBU0hfQ09NTUVOVF9NT0RFID0gaGxqcy5DT01NRU5UKCcjJywgJyQnKTtcbiAgaGxqcy5OVU1CRVJfTU9ERSA9IHtcbiAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgIGJlZ2luOiBobGpzLk5VTUJFUl9SRSxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgaGxqcy5DX05VTUJFUl9NT0RFID0ge1xuICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgYmVnaW46IGhsanMuQ19OVU1CRVJfUkUsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIGhsanMuQklOQVJZX05VTUJFUl9NT0RFID0ge1xuICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgYmVnaW46IGhsanMuQklOQVJZX05VTUJFUl9SRSxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgaGxqcy5DU1NfTlVNQkVSX01PREUgPSB7XG4gICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICBiZWdpbjogaGxqcy5OVU1CRVJfUkUgKyAnKCcgK1xuICAgICAgJyV8ZW18ZXh8Y2h8cmVtJyAgK1xuICAgICAgJ3x2d3x2aHx2bWlufHZtYXgnICtcbiAgICAgICd8Y218bW18aW58cHR8cGN8cHgnICtcbiAgICAgICd8ZGVnfGdyYWR8cmFkfHR1cm4nICtcbiAgICAgICd8c3xtcycgK1xuICAgICAgJ3xIenxrSHonICtcbiAgICAgICd8ZHBpfGRwY218ZHBweCcgK1xuICAgICAgJyk/JyxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgaGxqcy5SRUdFWFBfTU9ERSA9IHtcbiAgICBjbGFzc05hbWU6ICdyZWdleHAnLFxuICAgIGJlZ2luOiAvXFwvLywgZW5kOiAvXFwvW2dpbXV5XSovLFxuICAgIGlsbGVnYWw6IC9cXG4vLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkJBQ0tTTEFTSF9FU0NBUEUsXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAvXFxbLywgZW5kOiAvXFxdLyxcbiAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV1cbiAgICAgIH1cbiAgICBdXG4gIH07XG4gIGhsanMuVElUTEVfTU9ERSA9IHtcbiAgICBjbGFzc05hbWU6ICd0aXRsZScsXG4gICAgYmVnaW46IGhsanMuSURFTlRfUkUsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIGhsanMuVU5ERVJTQ09SRV9USVRMRV9NT0RFID0ge1xuICAgIGNsYXNzTmFtZTogJ3RpdGxlJyxcbiAgICBiZWdpbjogaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuICBobGpzLk1FVEhPRF9HVUFSRCA9IHtcbiAgICAvLyBleGNsdWRlcyBtZXRob2QgbmFtZXMgZnJvbSBrZXl3b3JkIHByb2Nlc3NpbmdcbiAgICBiZWdpbjogJ1xcXFwuXFxcXHMqJyArIGhsanMuVU5ERVJTQ09SRV9JREVOVF9SRSxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcblxuICByZXR1cm4gaGxqcztcbn0pKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vaGlnaGxpZ2h0LmpzL2xpYi9oaWdobGlnaHQuanMiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIElERU5UX1JFID0gJ1tBLVphLXokX11bMC05QS1aYS16JF9dKic7XG4gIHZhciBLRVlXT1JEUyA9IHtcbiAgICBrZXl3b3JkOlxuICAgICAgJ2luIG9mIGlmIGZvciB3aGlsZSBmaW5hbGx5IHZhciBuZXcgZnVuY3Rpb24gZG8gcmV0dXJuIHZvaWQgZWxzZSBicmVhayBjYXRjaCAnICtcbiAgICAgICdpbnN0YW5jZW9mIHdpdGggdGhyb3cgY2FzZSBkZWZhdWx0IHRyeSB0aGlzIHN3aXRjaCBjb250aW51ZSB0eXBlb2YgZGVsZXRlICcgK1xuICAgICAgJ2xldCB5aWVsZCBjb25zdCBleHBvcnQgc3VwZXIgZGVidWdnZXIgYXMgYXN5bmMgYXdhaXQgc3RhdGljICcgK1xuICAgICAgLy8gRUNNQVNjcmlwdCA2IG1vZHVsZXMgaW1wb3J0XG4gICAgICAnaW1wb3J0IGZyb20gYXMnXG4gICAgLFxuICAgIGxpdGVyYWw6XG4gICAgICAndHJ1ZSBmYWxzZSBudWxsIHVuZGVmaW5lZCBOYU4gSW5maW5pdHknLFxuICAgIGJ1aWx0X2luOlxuICAgICAgJ2V2YWwgaXNGaW5pdGUgaXNOYU4gcGFyc2VGbG9hdCBwYXJzZUludCBkZWNvZGVVUkkgZGVjb2RlVVJJQ29tcG9uZW50ICcgK1xuICAgICAgJ2VuY29kZVVSSSBlbmNvZGVVUklDb21wb25lbnQgZXNjYXBlIHVuZXNjYXBlIE9iamVjdCBGdW5jdGlvbiBCb29sZWFuIEVycm9yICcgK1xuICAgICAgJ0V2YWxFcnJvciBJbnRlcm5hbEVycm9yIFJhbmdlRXJyb3IgUmVmZXJlbmNlRXJyb3IgU3RvcEl0ZXJhdGlvbiBTeW50YXhFcnJvciAnICtcbiAgICAgICdUeXBlRXJyb3IgVVJJRXJyb3IgTnVtYmVyIE1hdGggRGF0ZSBTdHJpbmcgUmVnRXhwIEFycmF5IEZsb2F0MzJBcnJheSAnICtcbiAgICAgICdGbG9hdDY0QXJyYXkgSW50MTZBcnJheSBJbnQzMkFycmF5IEludDhBcnJheSBVaW50MTZBcnJheSBVaW50MzJBcnJheSAnICtcbiAgICAgICdVaW50OEFycmF5IFVpbnQ4Q2xhbXBlZEFycmF5IEFycmF5QnVmZmVyIERhdGFWaWV3IEpTT04gSW50bCBhcmd1bWVudHMgcmVxdWlyZSAnICtcbiAgICAgICdtb2R1bGUgY29uc29sZSB3aW5kb3cgZG9jdW1lbnQgU3ltYm9sIFNldCBNYXAgV2Vha1NldCBXZWFrTWFwIFByb3h5IFJlZmxlY3QgJyArXG4gICAgICAnUHJvbWlzZSdcbiAgfTtcbiAgdmFyIEVYUFJFU1NJT05TO1xuICB2YXIgTlVNQkVSID0ge1xuICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgdmFyaWFudHM6IFtcbiAgICAgIHsgYmVnaW46ICdcXFxcYigwW2JCXVswMV0rKScgfSxcbiAgICAgIHsgYmVnaW46ICdcXFxcYigwW29PXVswLTddKyknIH0sXG4gICAgICB7IGJlZ2luOiBobGpzLkNfTlVNQkVSX1JFIH1cbiAgICBdLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuICB2YXIgU1VCU1QgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3Vic3QnLFxuICAgIGJlZ2luOiAnXFxcXCRcXFxceycsIGVuZDogJ1xcXFx9JyxcbiAgICBrZXl3b3JkczogS0VZV09SRFMsXG4gICAgY29udGFpbnM6IFtdICAvLyBkZWZpbmVkIGxhdGVyXG4gIH07XG4gIHZhciBURU1QTEFURV9TVFJJTkcgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICBiZWdpbjogJ2AnLCBlbmQ6ICdgJyxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5CQUNLU0xBU0hfRVNDQVBFLFxuICAgICAgU1VCU1RcbiAgICBdXG4gIH07XG4gIFNVQlNULmNvbnRhaW5zID0gW1xuICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgIFRFTVBMQVRFX1NUUklORyxcbiAgICBOVU1CRVIsXG4gICAgaGxqcy5SRUdFWFBfTU9ERVxuICBdXG4gIHZhciBQQVJBTVNfQ09OVEFJTlMgPSBTVUJTVC5jb250YWlucy5jb25jYXQoW1xuICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFXG4gIF0pO1xuXG4gIHJldHVybiB7XG4gICAgYWxpYXNlczogWydqcycsICdqc3gnXSxcbiAgICBrZXl3b3JkczogS0VZV09SRFMsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnbWV0YScsXG4gICAgICAgIHJlbGV2YW5jZTogMTAsXG4gICAgICAgIGJlZ2luOiAvXlxccypbJ1wiXXVzZSAoc3RyaWN0fGFzbSlbJ1wiXS9cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ21ldGEnLFxuICAgICAgICBiZWdpbjogL14jIS8sIGVuZDogLyQvXG4gICAgICB9LFxuICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgIFRFTVBMQVRFX1NUUklORyxcbiAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICBOVU1CRVIsXG4gICAgICB7IC8vIG9iamVjdCBhdHRyIGNvbnRhaW5lclxuICAgICAgICBiZWdpbjogL1t7LF1cXHMqLywgcmVsZXZhbmNlOiAwLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJlZ2luOiBJREVOVF9SRSArICdcXFxccyo6JywgcmV0dXJuQmVnaW46IHRydWUsXG4gICAgICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgICAgICBjb250YWluczogW3tjbGFzc05hbWU6ICdhdHRyJywgYmVnaW46IElERU5UX1JFLCByZWxldmFuY2U6IDB9XVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHsgLy8gXCJ2YWx1ZVwiIGNvbnRhaW5lclxuICAgICAgICBiZWdpbjogJygnICsgaGxqcy5SRV9TVEFSVEVSU19SRSArICd8XFxcXGIoY2FzZXxyZXR1cm58dGhyb3cpXFxcXGIpXFxcXHMqJyxcbiAgICAgICAga2V5d29yZHM6ICdyZXR1cm4gdGhyb3cgY2FzZScsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICAgICAgaGxqcy5SRUdFWFBfTU9ERSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdmdW5jdGlvbicsXG4gICAgICAgICAgICBiZWdpbjogJyhcXFxcKC4qP1xcXFwpfCcgKyBJREVOVF9SRSArICcpXFxcXHMqPT4nLCByZXR1cm5CZWdpbjogdHJ1ZSxcbiAgICAgICAgICAgIGVuZDogJ1xcXFxzKj0+JyxcbiAgICAgICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdwYXJhbXMnLFxuICAgICAgICAgICAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGJlZ2luOiBJREVOVF9SRVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgYmVnaW46IC9cXChcXHMqXFwpLyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGJlZ2luOiAvXFwoLywgZW5kOiAvXFwpLyxcbiAgICAgICAgICAgICAgICAgICAgZXhjbHVkZUJlZ2luOiB0cnVlLCBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBrZXl3b3JkczogS0VZV09SRFMsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5zOiBQQVJBTVNfQ09OVEFJTlNcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHsgLy8gRTRYIC8gSlNYXG4gICAgICAgICAgICBiZWdpbjogLzwvLCBlbmQ6IC8oXFwvXFx3K3xcXHcrXFwvKT4vLFxuICAgICAgICAgICAgc3ViTGFuZ3VhZ2U6ICd4bWwnLFxuICAgICAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICAgICAge2JlZ2luOiAvPFxcdytcXHMqXFwvPi8sIHNraXA6IHRydWV9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYmVnaW46IC88XFx3Ky8sIGVuZDogLyhcXC9cXHcrfFxcdytcXC8pPi8sIHNraXA6IHRydWUsXG4gICAgICAgICAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICAgICAgICAgIHtiZWdpbjogLzxcXHcrXFxzKlxcLz4vLCBza2lwOiB0cnVlfSxcbiAgICAgICAgICAgICAgICAgICdzZWxmJ1xuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdmdW5jdGlvbicsXG4gICAgICAgIGJlZ2luS2V5d29yZHM6ICdmdW5jdGlvbicsIGVuZDogL1xcey8sIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgaGxqcy5pbmhlcml0KGhsanMuVElUTEVfTU9ERSwge2JlZ2luOiBJREVOVF9SRX0pLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3BhcmFtcycsXG4gICAgICAgICAgICBiZWdpbjogL1xcKC8sIGVuZDogL1xcKS8sXG4gICAgICAgICAgICBleGNsdWRlQmVnaW46IHRydWUsXG4gICAgICAgICAgICBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICAgICAgY29udGFpbnM6IFBBUkFNU19DT05UQUlOU1xuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgaWxsZWdhbDogL1xcW3wlL1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IC9cXCRbKC5dLyAvLyByZWxldmFuY2UgYm9vc3RlciBmb3IgYSBwYXR0ZXJuIGNvbW1vbiB0byBKUyBsaWJzOiBgJChzb21ldGhpbmcpYCBhbmQgYCQuc29tZXRoaW5nYFxuICAgICAgfSxcbiAgICAgIGhsanMuTUVUSE9EX0dVQVJELFxuICAgICAgeyAvLyBFUzYgY2xhc3NcbiAgICAgICAgY2xhc3NOYW1lOiAnY2xhc3MnLFxuICAgICAgICBiZWdpbktleXdvcmRzOiAnY2xhc3MnLCBlbmQ6IC9bezs9XS8sIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICAgIGlsbGVnYWw6IC9bOlwiXFxbXFxdXS8sXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge2JlZ2luS2V5d29yZHM6ICdleHRlbmRzJ30sXG4gICAgICAgICAgaGxqcy5VTkRFUlNDT1JFX1RJVExFX01PREVcbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW5LZXl3b3JkczogJ2NvbnN0cnVjdG9yJywgZW5kOiAvXFx7LywgZXhjbHVkZUVuZDogdHJ1ZVxuICAgICAgfVxuICAgIF0sXG4gICAgaWxsZWdhbDogLyMoPyEhKS9cbiAgfTtcbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9oaWdobGlnaHQuanMvbGliL2xhbmd1YWdlcy9qYXZhc2NyaXB0LmpzIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHZhciBMSVRFUkFMUyA9IHtsaXRlcmFsOiAndHJ1ZSBmYWxzZSBudWxsJ307XG4gIHZhciBUWVBFUyA9IFtcbiAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgIGhsanMuQ19OVU1CRVJfTU9ERVxuICBdO1xuICB2YXIgVkFMVUVfQ09OVEFJTkVSID0ge1xuICAgIGVuZDogJywnLCBlbmRzV2l0aFBhcmVudDogdHJ1ZSwgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICBjb250YWluczogVFlQRVMsXG4gICAga2V5d29yZHM6IExJVEVSQUxTXG4gIH07XG4gIHZhciBPQkpFQ1QgPSB7XG4gICAgYmVnaW46ICd7JywgZW5kOiAnfScsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnYXR0cicsXG4gICAgICAgIGJlZ2luOiAvXCIvLCBlbmQ6IC9cIi8sXG4gICAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFXSxcbiAgICAgICAgaWxsZWdhbDogJ1xcXFxuJyxcbiAgICAgIH0sXG4gICAgICBobGpzLmluaGVyaXQoVkFMVUVfQ09OVEFJTkVSLCB7YmVnaW46IC86L30pXG4gICAgXSxcbiAgICBpbGxlZ2FsOiAnXFxcXFMnXG4gIH07XG4gIHZhciBBUlJBWSA9IHtcbiAgICBiZWdpbjogJ1xcXFxbJywgZW5kOiAnXFxcXF0nLFxuICAgIGNvbnRhaW5zOiBbaGxqcy5pbmhlcml0KFZBTFVFX0NPTlRBSU5FUildLCAvLyBpbmhlcml0IGlzIGEgd29ya2Fyb3VuZCBmb3IgYSBidWcgdGhhdCBtYWtlcyBzaGFyZWQgbW9kZXMgd2l0aCBlbmRzV2l0aFBhcmVudCBjb21waWxlIG9ubHkgdGhlIGVuZGluZyBvZiBvbmUgb2YgdGhlIHBhcmVudHNcbiAgICBpbGxlZ2FsOiAnXFxcXFMnXG4gIH07XG4gIFRZUEVTLnNwbGljZShUWVBFUy5sZW5ndGgsIDAsIE9CSkVDVCwgQVJSQVkpO1xuICByZXR1cm4ge1xuICAgIGNvbnRhaW5zOiBUWVBFUyxcbiAgICBrZXl3b3JkczogTElURVJBTFMsXG4gICAgaWxsZWdhbDogJ1xcXFxTJ1xuICB9O1xufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2hpZ2hsaWdodC5qcy9saWIvbGFuZ3VhZ2VzL2pzb24uanMiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIFZBUklBQkxFID0ge1xuICAgIGJlZ2luOiAnXFxcXCQrW2EtekEtWl9cXHg3Zi1cXHhmZl1bYS16QS1aMC05X1xceDdmLVxceGZmXSonXG4gIH07XG4gIHZhciBQUkVQUk9DRVNTT1IgPSB7XG4gICAgY2xhc3NOYW1lOiAnbWV0YScsIGJlZ2luOiAvPFxcPyhwaHApP3xcXD8+L1xuICB9O1xuICB2YXIgU1RSSU5HID0ge1xuICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEUsIFBSRVBST0NFU1NPUl0sXG4gICAgdmFyaWFudHM6IFtcbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICdiXCInLCBlbmQ6ICdcIidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnYlxcJycsIGVuZDogJ1xcJydcbiAgICAgIH0sXG4gICAgICBobGpzLmluaGVyaXQoaGxqcy5BUE9TX1NUUklOR19NT0RFLCB7aWxsZWdhbDogbnVsbH0pLFxuICAgICAgaGxqcy5pbmhlcml0KGhsanMuUVVPVEVfU1RSSU5HX01PREUsIHtpbGxlZ2FsOiBudWxsfSlcbiAgICBdXG4gIH07XG4gIHZhciBOVU1CRVIgPSB7dmFyaWFudHM6IFtobGpzLkJJTkFSWV9OVU1CRVJfTU9ERSwgaGxqcy5DX05VTUJFUl9NT0RFXX07XG4gIHJldHVybiB7XG4gICAgYWxpYXNlczogWydwaHAzJywgJ3BocDQnLCAncGhwNScsICdwaHA2J10sXG4gICAgY2FzZV9pbnNlbnNpdGl2ZTogdHJ1ZSxcbiAgICBrZXl3b3JkczpcbiAgICAgICdhbmQgaW5jbHVkZV9vbmNlIGxpc3QgYWJzdHJhY3QgZ2xvYmFsIHByaXZhdGUgZWNobyBpbnRlcmZhY2UgYXMgc3RhdGljIGVuZHN3aXRjaCAnICtcbiAgICAgICdhcnJheSBudWxsIGlmIGVuZHdoaWxlIG9yIGNvbnN0IGZvciBlbmRmb3JlYWNoIHNlbGYgdmFyIHdoaWxlIGlzc2V0IHB1YmxpYyAnICtcbiAgICAgICdwcm90ZWN0ZWQgZXhpdCBmb3JlYWNoIHRocm93IGVsc2VpZiBpbmNsdWRlIF9fRklMRV9fIGVtcHR5IHJlcXVpcmVfb25jZSBkbyB4b3IgJyArXG4gICAgICAncmV0dXJuIHBhcmVudCBjbG9uZSB1c2UgX19DTEFTU19fIF9fTElORV9fIGVsc2UgYnJlYWsgcHJpbnQgZXZhbCBuZXcgJyArXG4gICAgICAnY2F0Y2ggX19NRVRIT0RfXyBjYXNlIGV4Y2VwdGlvbiBkZWZhdWx0IGRpZSByZXF1aXJlIF9fRlVOQ1RJT05fXyAnICtcbiAgICAgICdlbmRkZWNsYXJlIGZpbmFsIHRyeSBzd2l0Y2ggY29udGludWUgZW5kZm9yIGVuZGlmIGRlY2xhcmUgdW5zZXQgdHJ1ZSBmYWxzZSAnICtcbiAgICAgICd0cmFpdCBnb3RvIGluc3RhbmNlb2YgaW5zdGVhZG9mIF9fRElSX18gX19OQU1FU1BBQ0VfXyAnICtcbiAgICAgICd5aWVsZCBmaW5hbGx5JyxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5IQVNIX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ09NTUVOVCgnLy8nLCAnJCcsIHtjb250YWluczogW1BSRVBST0NFU1NPUl19KSxcbiAgICAgIGhsanMuQ09NTUVOVChcbiAgICAgICAgJy9cXFxcKicsXG4gICAgICAgICdcXFxcKi8nLFxuICAgICAgICB7XG4gICAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnZG9jdGFnJyxcbiAgICAgICAgICAgICAgYmVnaW46ICdAW0EtWmEtel0rJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgKSxcbiAgICAgIGhsanMuQ09NTUVOVChcbiAgICAgICAgJ19faGFsdF9jb21waWxlci4rPzsnLFxuICAgICAgICBmYWxzZSxcbiAgICAgICAge1xuICAgICAgICAgIGVuZHNXaXRoUGFyZW50OiB0cnVlLFxuICAgICAgICAgIGtleXdvcmRzOiAnX19oYWx0X2NvbXBpbGVyJyxcbiAgICAgICAgICBsZXhlbWVzOiBobGpzLlVOREVSU0NPUkVfSURFTlRfUkVcbiAgICAgICAgfVxuICAgICAgKSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgYmVnaW46IC88PDxbJ1wiXT9cXHcrWydcIl0/JC8sIGVuZDogL15cXHcrOz8kLyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICBobGpzLkJBQ0tTTEFTSF9FU0NBUEUsXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAnc3Vic3QnLFxuICAgICAgICAgICAgdmFyaWFudHM6IFtcbiAgICAgICAgICAgICAge2JlZ2luOiAvXFwkXFx3Ky99LFxuICAgICAgICAgICAgICB7YmVnaW46IC9cXHtcXCQvLCBlbmQ6IC9cXH0vfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIFBSRVBST0NFU1NPUixcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAna2V5d29yZCcsIGJlZ2luOiAvXFwkdGhpc1xcYi9cbiAgICAgIH0sXG4gICAgICBWQVJJQUJMRSxcbiAgICAgIHtcbiAgICAgICAgLy8gc3dhbGxvdyBjb21wb3NlZCBpZGVudGlmaWVycyB0byBhdm9pZCBwYXJzaW5nIHRoZW0gYXMga2V5d29yZHNcbiAgICAgICAgYmVnaW46IC8oOjp8LT4pK1thLXpBLVpfXFx4N2YtXFx4ZmZdW2EtekEtWjAtOV9cXHg3Zi1cXHhmZl0qL1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZnVuY3Rpb24nLFxuICAgICAgICBiZWdpbktleXdvcmRzOiAnZnVuY3Rpb24nLCBlbmQ6IC9bO3tdLywgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICAgICAgaWxsZWdhbDogJ1xcXFwkfFxcXFxbfCUnLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIGhsanMuVU5ERVJTQ09SRV9USVRMRV9NT0RFLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3BhcmFtcycsXG4gICAgICAgICAgICBiZWdpbjogJ1xcXFwoJywgZW5kOiAnXFxcXCknLFxuICAgICAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICAgICAgJ3NlbGYnLFxuICAgICAgICAgICAgICBWQVJJQUJMRSxcbiAgICAgICAgICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgICAgICAgICAgU1RSSU5HLFxuICAgICAgICAgICAgICBOVU1CRVJcbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NsYXNzJyxcbiAgICAgICAgYmVnaW5LZXl3b3JkczogJ2NsYXNzIGludGVyZmFjZScsIGVuZDogJ3snLCBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICBpbGxlZ2FsOiAvWzpcXChcXCRcIl0vLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtiZWdpbktleXdvcmRzOiAnZXh0ZW5kcyBpbXBsZW1lbnRzJ30sXG4gICAgICAgICAgaGxqcy5VTkRFUlNDT1JFX1RJVExFX01PREVcbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW5LZXl3b3JkczogJ25hbWVzcGFjZScsIGVuZDogJzsnLFxuICAgICAgICBpbGxlZ2FsOiAvW1xcLiddLyxcbiAgICAgICAgY29udGFpbnM6IFtobGpzLlVOREVSU0NPUkVfVElUTEVfTU9ERV1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luS2V5d29yZHM6ICd1c2UnLCBlbmQ6ICc7JyxcbiAgICAgICAgY29udGFpbnM6IFtobGpzLlVOREVSU0NPUkVfVElUTEVfTU9ERV1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnPT4nIC8vIE5vIG1hcmt1cCwganVzdCBhIHJlbGV2YW5jZSBib29zdGVyXG4gICAgICB9LFxuICAgICAgU1RSSU5HLFxuICAgICAgTlVNQkVSXG4gICAgXVxuICB9O1xufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2hpZ2hsaWdodC5qcy9saWIvbGFuZ3VhZ2VzL3BocC5qcyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgUEFSQU1TID0ge1xuICAgIGNsYXNzTmFtZTogJ3BhcmFtcycsXG4gICAgYmVnaW46ICdcXFxcKCcsIGVuZDogJ1xcXFwpJ1xuICB9O1xuXG4gIHZhciBGVU5DVElPTl9OQU1FUyA9ICdhdHRyaWJ1dGUgYmxvY2sgY29uc3RhbnQgY3ljbGUgZGF0ZSBkdW1wIGluY2x1ZGUgJyArXG4gICAgICAgICAgICAgICAgICAnbWF4IG1pbiBwYXJlbnQgcmFuZG9tIHJhbmdlIHNvdXJjZSB0ZW1wbGF0ZV9mcm9tX3N0cmluZyc7XG5cbiAgdmFyIEZVTkNUSU9OUyA9IHtcbiAgICBiZWdpbktleXdvcmRzOiBGVU5DVElPTl9OQU1FUyxcbiAgICBrZXl3b3Jkczoge25hbWU6IEZVTkNUSU9OX05BTUVTfSxcbiAgICByZWxldmFuY2U6IDAsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIFBBUkFNU1xuICAgIF1cbiAgfTtcblxuICB2YXIgRklMVEVSID0ge1xuICAgIGJlZ2luOiAvXFx8W0EtWmEtel9dKzo/LyxcbiAgICBrZXl3b3JkczpcbiAgICAgICdhYnMgYmF0Y2ggY2FwaXRhbGl6ZSBjb252ZXJ0X2VuY29kaW5nIGRhdGUgZGF0ZV9tb2RpZnkgZGVmYXVsdCAnICtcbiAgICAgICdlc2NhcGUgZmlyc3QgZm9ybWF0IGpvaW4ganNvbl9lbmNvZGUga2V5cyBsYXN0IGxlbmd0aCBsb3dlciAnICtcbiAgICAgICdtZXJnZSBubDJiciBudW1iZXJfZm9ybWF0IHJhdyByZXBsYWNlIHJldmVyc2Ugcm91bmQgc2xpY2Ugc29ydCBzcGxpdCAnICtcbiAgICAgICdzdHJpcHRhZ3MgdGl0bGUgdHJpbSB1cHBlciB1cmxfZW5jb2RlJyxcbiAgICBjb250YWluczogW1xuICAgICAgRlVOQ1RJT05TXG4gICAgXVxuICB9O1xuXG4gIHZhciBUQUdTID0gJ2F1dG9lc2NhcGUgYmxvY2sgZG8gZW1iZWQgZXh0ZW5kcyBmaWx0ZXIgZmx1c2ggZm9yICcgK1xuICAgICdpZiBpbXBvcnQgaW5jbHVkZSBtYWNybyBzYW5kYm94IHNldCBzcGFjZWxlc3MgdXNlIHZlcmJhdGltJztcblxuICBUQUdTID0gVEFHUyArICcgJyArIFRBR1Muc3BsaXQoJyAnKS5tYXAoZnVuY3Rpb24odCl7cmV0dXJuICdlbmQnICsgdH0pLmpvaW4oJyAnKTtcblxuICByZXR1cm4ge1xuICAgIGFsaWFzZXM6IFsnY3JhZnRjbXMnXSxcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlLFxuICAgIHN1Ykxhbmd1YWdlOiAneG1sJyxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5DT01NRU5UKC9cXHsjLywgLyN9LyksXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3RlbXBsYXRlLXRhZycsXG4gICAgICAgIGJlZ2luOiAvXFx7JS8sIGVuZDogLyV9LyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICduYW1lJyxcbiAgICAgICAgICAgIGJlZ2luOiAvXFx3Ky8sXG4gICAgICAgICAgICBrZXl3b3JkczogVEFHUyxcbiAgICAgICAgICAgIHN0YXJ0czoge1xuICAgICAgICAgICAgICBlbmRzV2l0aFBhcmVudDogdHJ1ZSxcbiAgICAgICAgICAgICAgY29udGFpbnM6IFtGSUxURVIsIEZVTkNUSU9OU10sXG4gICAgICAgICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAndGVtcGxhdGUtdmFyaWFibGUnLFxuICAgICAgICBiZWdpbjogL1xce1xcey8sIGVuZDogL319LyxcbiAgICAgICAgY29udGFpbnM6IFsnc2VsZicsIEZJTFRFUiwgRlVOQ1RJT05TXVxuICAgICAgfVxuICAgIF1cbiAgfTtcbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9oaWdobGlnaHQuanMvbGliL2xhbmd1YWdlcy90d2lnLmpzIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHZhciBLRVlXT1JEUyA9IHtcbiAgICBrZXl3b3JkOlxuICAgICAgJ2luIGlmIGZvciB3aGlsZSBmaW5hbGx5IHZhciBuZXcgZnVuY3Rpb24gZG8gcmV0dXJuIHZvaWQgZWxzZSBicmVhayBjYXRjaCAnICtcbiAgICAgICdpbnN0YW5jZW9mIHdpdGggdGhyb3cgY2FzZSBkZWZhdWx0IHRyeSB0aGlzIHN3aXRjaCBjb250aW51ZSB0eXBlb2YgZGVsZXRlICcgK1xuICAgICAgJ2xldCB5aWVsZCBjb25zdCBjbGFzcyBwdWJsaWMgcHJpdmF0ZSBwcm90ZWN0ZWQgZ2V0IHNldCBzdXBlciAnICtcbiAgICAgICdzdGF0aWMgaW1wbGVtZW50cyBlbnVtIGV4cG9ydCBpbXBvcnQgZGVjbGFyZSB0eXBlIG5hbWVzcGFjZSBhYnN0cmFjdCAnICtcbiAgICAgICdhcyBmcm9tIGV4dGVuZHMgYXN5bmMgYXdhaXQnLFxuICAgIGxpdGVyYWw6XG4gICAgICAndHJ1ZSBmYWxzZSBudWxsIHVuZGVmaW5lZCBOYU4gSW5maW5pdHknLFxuICAgIGJ1aWx0X2luOlxuICAgICAgJ2V2YWwgaXNGaW5pdGUgaXNOYU4gcGFyc2VGbG9hdCBwYXJzZUludCBkZWNvZGVVUkkgZGVjb2RlVVJJQ29tcG9uZW50ICcgK1xuICAgICAgJ2VuY29kZVVSSSBlbmNvZGVVUklDb21wb25lbnQgZXNjYXBlIHVuZXNjYXBlIE9iamVjdCBGdW5jdGlvbiBCb29sZWFuIEVycm9yICcgK1xuICAgICAgJ0V2YWxFcnJvciBJbnRlcm5hbEVycm9yIFJhbmdlRXJyb3IgUmVmZXJlbmNlRXJyb3IgU3RvcEl0ZXJhdGlvbiBTeW50YXhFcnJvciAnICtcbiAgICAgICdUeXBlRXJyb3IgVVJJRXJyb3IgTnVtYmVyIE1hdGggRGF0ZSBTdHJpbmcgUmVnRXhwIEFycmF5IEZsb2F0MzJBcnJheSAnICtcbiAgICAgICdGbG9hdDY0QXJyYXkgSW50MTZBcnJheSBJbnQzMkFycmF5IEludDhBcnJheSBVaW50MTZBcnJheSBVaW50MzJBcnJheSAnICtcbiAgICAgICdVaW50OEFycmF5IFVpbnQ4Q2xhbXBlZEFycmF5IEFycmF5QnVmZmVyIERhdGFWaWV3IEpTT04gSW50bCBhcmd1bWVudHMgcmVxdWlyZSAnICtcbiAgICAgICdtb2R1bGUgY29uc29sZSB3aW5kb3cgZG9jdW1lbnQgYW55IG51bWJlciBib29sZWFuIHN0cmluZyB2b2lkIFByb21pc2UnXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBhbGlhc2VzOiBbJ3RzJ10sXG4gICAga2V5d29yZHM6IEtFWVdPUkRTLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ21ldGEnLFxuICAgICAgICBiZWdpbjogL15cXHMqWydcIl11c2Ugc3RyaWN0WydcIl0vXG4gICAgICB9LFxuICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgIHsgLy8gdGVtcGxhdGUgc3RyaW5nXG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiAnYCcsIGVuZDogJ2AnLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIGhsanMuQkFDS1NMQVNIX0VTQ0FQRSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdzdWJzdCcsXG4gICAgICAgICAgICBiZWdpbjogJ1xcXFwkXFxcXHsnLCBlbmQ6ICdcXFxcfSdcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgICAgICB2YXJpYW50czogW1xuICAgICAgICAgIHsgYmVnaW46ICdcXFxcYigwW2JCXVswMV0rKScgfSxcbiAgICAgICAgICB7IGJlZ2luOiAnXFxcXGIoMFtvT11bMC03XSspJyB9LFxuICAgICAgICAgIHsgYmVnaW46IGhsanMuQ19OVU1CRVJfUkUgfVxuICAgICAgICBdLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7IC8vIFwidmFsdWVcIiBjb250YWluZXJcbiAgICAgICAgYmVnaW46ICcoJyArIGhsanMuUkVfU1RBUlRFUlNfUkUgKyAnfFxcXFxiKGNhc2V8cmV0dXJufHRocm93KVxcXFxiKVxcXFxzKicsXG4gICAgICAgIGtleXdvcmRzOiAncmV0dXJuIHRocm93IGNhc2UnLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAgICAgIGhsanMuUkVHRVhQX01PREUsXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAnZnVuY3Rpb24nLFxuICAgICAgICAgICAgYmVnaW46ICcoXFxcXCguKj9cXFxcKXwnICsgaGxqcy5JREVOVF9SRSArICcpXFxcXHMqPT4nLCByZXR1cm5CZWdpbjogdHJ1ZSxcbiAgICAgICAgICAgIGVuZDogJ1xcXFxzKj0+JyxcbiAgICAgICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdwYXJhbXMnLFxuICAgICAgICAgICAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGJlZ2luOiBobGpzLklERU5UX1JFXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBiZWdpbjogL1xcKFxccypcXCkvLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgYmVnaW46IC9cXCgvLCBlbmQ6IC9cXCkvLFxuICAgICAgICAgICAgICAgICAgICBleGNsdWRlQmVnaW46IHRydWUsIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGtleXdvcmRzOiBLRVlXT1JEUyxcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAnc2VsZicsXG4gICAgICAgICAgICAgICAgICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgICAgICAgICAgICAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREVcbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdmdW5jdGlvbicsXG4gICAgICAgIGJlZ2luOiAnZnVuY3Rpb24nLCBlbmQ6IC9bXFx7O10vLCBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICBrZXl3b3JkczogS0VZV09SRFMsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgJ3NlbGYnLFxuICAgICAgICAgIGhsanMuaW5oZXJpdChobGpzLlRJVExFX01PREUsIHtiZWdpbjogL1tBLVphLXokX11bMC05QS1aYS16JF9dKi99KSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdwYXJhbXMnLFxuICAgICAgICAgICAgYmVnaW46IC9cXCgvLCBlbmQ6IC9cXCkvLFxuICAgICAgICAgICAgZXhjbHVkZUJlZ2luOiB0cnVlLFxuICAgICAgICAgICAgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICAgICAgICAgIGtleXdvcmRzOiBLRVlXT1JEUyxcbiAgICAgICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgICAgICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGlsbGVnYWw6IC9bXCInXFwoXS9cbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIGlsbGVnYWw6IC8lLyxcbiAgICAgICAgcmVsZXZhbmNlOiAwIC8vICgpID0+IHt9IGlzIG1vcmUgdHlwaWNhbCBpbiBUeXBlU2NyaXB0XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbktleXdvcmRzOiAnY29uc3RydWN0b3InLCBlbmQ6IC9cXHsvLCBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgICdzZWxmJyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdwYXJhbXMnLFxuICAgICAgICAgICAgYmVnaW46IC9cXCgvLCBlbmQ6IC9cXCkvLFxuICAgICAgICAgICAgZXhjbHVkZUJlZ2luOiB0cnVlLFxuICAgICAgICAgICAgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICAgICAgICAgIGtleXdvcmRzOiBLRVlXT1JEUyxcbiAgICAgICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgICAgICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGlsbGVnYWw6IC9bXCInXFwoXS9cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7IC8vIHByZXZlbnQgcmVmZXJlbmNlcyBsaWtlIG1vZHVsZS5pZCBmcm9tIGJlaW5nIGhpZ2xpZ2h0ZWQgYXMgbW9kdWxlIGRlZmluaXRpb25zXG4gICAgICAgIGJlZ2luOiAvbW9kdWxlXFwuLyxcbiAgICAgICAga2V5d29yZHM6IHtidWlsdF9pbjogJ21vZHVsZSd9LFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luS2V5d29yZHM6ICdtb2R1bGUnLCBlbmQ6IC9cXHsvLCBleGNsdWRlRW5kOiB0cnVlXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbktleXdvcmRzOiAnaW50ZXJmYWNlJywgZW5kOiAvXFx7LywgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICAgICAga2V5d29yZHM6ICdpbnRlcmZhY2UgZXh0ZW5kcydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAvXFwkWyguXS8gLy8gcmVsZXZhbmNlIGJvb3N0ZXIgZm9yIGEgcGF0dGVybiBjb21tb24gdG8gSlMgbGliczogYCQoc29tZXRoaW5nKWAgYW5kIGAkLnNvbWV0aGluZ2BcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnXFxcXC4nICsgaGxqcy5JREVOVF9SRSwgcmVsZXZhbmNlOiAwIC8vIGhhY2s6IHByZXZlbnRzIGRldGVjdGlvbiBvZiBrZXl3b3JkcyBhZnRlciBkb3RzXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdtZXRhJywgYmVnaW46ICdAW0EtWmEtel0rJ1xuICAgICAgfVxuICAgIF1cbiAgfTtcbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9oaWdobGlnaHQuanMvbGliL2xhbmd1YWdlcy90eXBlc2NyaXB0LmpzIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHZhciBMSVRFUkFMUyA9ICd0cnVlIGZhbHNlIHllcyBubyBudWxsJztcblxuICB2YXIga2V5UHJlZml4ID0gJ15bIFxcXFwtXSonO1xuICB2YXIga2V5TmFtZSA9ICAnW2EtekEtWl9dW1xcXFx3XFxcXC1dKic7XG4gIHZhciBLRVkgPSB7XG4gICAgY2xhc3NOYW1lOiAnYXR0cicsXG4gICAgdmFyaWFudHM6IFtcbiAgICAgIHsgYmVnaW46IGtleVByZWZpeCArIGtleU5hbWUgKyBcIjpcIn0sXG4gICAgICB7IGJlZ2luOiBrZXlQcmVmaXggKyAnXCInICsga2V5TmFtZSArICdcIicgKyBcIjpcIn0sXG4gICAgICB7IGJlZ2luOiBrZXlQcmVmaXggKyBcIidcIiArIGtleU5hbWUgKyBcIidcIiArIFwiOlwifVxuICAgIF1cbiAgfTtcblxuICB2YXIgVEVNUExBVEVfVkFSSUFCTEVTID0ge1xuICAgIGNsYXNzTmFtZTogJ3RlbXBsYXRlLXZhcmlhYmxlJyxcbiAgICB2YXJpYW50czogW1xuICAgICAgeyBiZWdpbjogJ1xce1xceycsIGVuZDogJ1xcfVxcfScgfSwgLy8gamluamEgdGVtcGxhdGVzIEFuc2libGVcbiAgICAgIHsgYmVnaW46ICclXFx7JywgZW5kOiAnXFx9JyB9IC8vIFJ1YnkgaTE4blxuICAgIF1cbiAgfTtcbiAgdmFyIFNUUklORyA9IHtcbiAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgIHJlbGV2YW5jZTogMCxcbiAgICB2YXJpYW50czogW1xuICAgICAge2JlZ2luOiAvJy8sIGVuZDogLycvfSxcbiAgICAgIHtiZWdpbjogL1wiLywgZW5kOiAvXCIvfSxcbiAgICAgIHtiZWdpbjogL1xcUysvfVxuICAgIF0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuQkFDS1NMQVNIX0VTQ0FQRSxcbiAgICAgIFRFTVBMQVRFX1ZBUklBQkxFU1xuICAgIF1cbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGNhc2VfaW5zZW5zaXRpdmU6IHRydWUsXG4gICAgYWxpYXNlczogWyd5bWwnLCAnWUFNTCcsICd5YW1sJ10sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIEtFWSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnbWV0YScsXG4gICAgICAgIGJlZ2luOiAnXi0tLVxccyokJyxcbiAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgfSxcbiAgICAgIHsgLy8gbXVsdGkgbGluZSBzdHJpbmdcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgYmVnaW46ICdbXFxcXHw+XSAqJCcsXG4gICAgICAgIHJldHVybkVuZDogdHJ1ZSxcbiAgICAgICAgY29udGFpbnM6IFNUUklORy5jb250YWlucyxcbiAgICAgICAgLy8gdmVyeSBzaW1wbGUgdGVybWluYXRpb246IG5leHQgaGFzaCBrZXlcbiAgICAgICAgZW5kOiBLRVkudmFyaWFudHNbMF0uYmVnaW5cbiAgICAgIH0sXG4gICAgICB7IC8vIFJ1YnkvUmFpbHMgZXJiXG4gICAgICAgIGJlZ2luOiAnPCVbJT0tXT8nLCBlbmQ6ICdbJS1dPyU+JyxcbiAgICAgICAgc3ViTGFuZ3VhZ2U6ICdydWJ5JyxcbiAgICAgICAgZXhjbHVkZUJlZ2luOiB0cnVlLFxuICAgICAgICBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7IC8vIGRhdGEgdHlwZVxuICAgICAgICBjbGFzc05hbWU6ICd0eXBlJyxcbiAgICAgICAgYmVnaW46ICchIScgKyBobGpzLlVOREVSU0NPUkVfSURFTlRfUkUsXG4gICAgICB9LFxuICAgICAgeyAvLyBmcmFnbWVudCBpZCAmcmVmXG4gICAgICAgIGNsYXNzTmFtZTogJ21ldGEnLFxuICAgICAgICBiZWdpbjogJyYnICsgaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFICsgJyQnLFxuICAgICAgfSxcbiAgICAgIHsgLy8gZnJhZ21lbnQgcmVmZXJlbmNlICpyZWZcbiAgICAgICAgY2xhc3NOYW1lOiAnbWV0YScsXG4gICAgICAgIGJlZ2luOiAnXFxcXConICsgaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFICsgJyQnXG4gICAgICB9LFxuICAgICAgeyAvLyBhcnJheSBsaXN0aW5nXG4gICAgICAgIGNsYXNzTmFtZTogJ2J1bGxldCcsXG4gICAgICAgIGJlZ2luOiAnXiAqLScsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIGhsanMuSEFTSF9DT01NRU5UX01PREUsXG4gICAgICB7XG4gICAgICAgIGJlZ2luS2V5d29yZHM6IExJVEVSQUxTLFxuICAgICAgICBrZXl3b3Jkczoge2xpdGVyYWw6IExJVEVSQUxTfVxuICAgICAgfSxcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERSxcbiAgICAgIFNUUklOR1xuICAgIF1cbiAgfTtcbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9oaWdobGlnaHQuanMvbGliL2xhbmd1YWdlcy95YW1sLmpzIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL1Jlc291cmNlcy9hc3NldHMvc3R5bGVzL2RlbW8vZGVtby5jc3Ncbi8vIG1vZHVsZSBpZCA9IDI0N1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9oaWdobGlnaHQuanMvc3R5bGVzL2RlZmF1bHQuY3NzXG4vLyBtb2R1bGUgaWQgPSAyNDhcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL1Jlc291cmNlcy9hc3NldHMvcGxhdGZvcm0uc2Nzc1xuLy8gbW9kdWxlIGlkID0gNDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiXSwic291cmNlUm9vdCI6IiJ9