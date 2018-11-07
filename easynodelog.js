/* jshint ignore:start */

/**
 * Module dependencies.
 */
var path = require('path');
var dateFormat = require('dateformat');
var chalk = require('chalk');
/**
 * Expose easynodelog
 */

function Easynodelog() {
  var self = this;
  this.rootPath = path.resolve('./');
  this.FILENAME = '';
  this.LINENUMBER = '';
  // show/hide logs
  this.debug = true;
  // choose which logs to show
  this.select = ['error', 'warn', 'info', 'log', 'system', 'success'];// 'info', 'warn', 'error', 'log', 'system'
  // enable/disable write to log file
  this.writeFile = false;
  // write every visible log to this file
  this.file = 'easynodelog.log';
  this.types = {
    log: {
      // enable/disable write to log file
      writeFile: false,
      // specify a log file for this type
      file: 'easynodelog.log.log',
      logFormat: '%d %scyan%t%ecyan [%syellow%f:%l%eyellow] %m',
      dateFormat: 'yyyy-mm-dd hh:MM:ss.l',
      name: 'LOG'
    },
    info: {
      // enable/disable write to log file
      writeFile: false,
      // specify a log file for this type
      file: 'easynodelog.info.log',
      logFormat: '%d %scyan%t%ecyan [%syellow%f:%l%eyellow] %scyan%m%ecyan',
      dateFormat: 'yyyy-mm-dd hh:MM:ss.l',
      name: 'INFO'
    },
    warn: {
      // enable/disable write to log file
      writeFile: false,
      // specify a log file for this type
      file: 'easynodelog.warn.log',
      logFormat: '%d %syellow%t%eyellow [%syellow%f:%l%eyellow] %syellow%m%eyellow',
      dateFormat: 'yyyy-mm-dd hh:MM:ss.l',
      name: 'WARN'
    },
    error: {
      // enable/disable write to log file
      writeFile: true,
      // specify a log file for this type
      file: 'easynodelog.error.log',
      logFormat: '%d %sbgred%swhite%t%ewhite%ebgred [%syellow%f:%l%eyellow] %sred%m%ered',
      dateFormat: 'yyyy-mm-dd hh:MM:ss.l',
      name: 'ERROR'
    },
    success: {
      // enable/disable write to log file
      writeFile: false,
      // specify a log file for this type
      file: 'easynodelog.success.log',
      logFormat: '%d %sgreen%t%egreen [%syellow%f:%l%eyellow] %sgreen%m%egreen',
      dateFormat: 'yyyy-mm-dd hh:MM:ss.l',
      name: 'SUCCESS'
    },
    system: {
      // enable/disable write to log file
      writeFile: false,
      // specify a log file for this type
      file: 'easynodelog.system.log',
      logFormat: '%d %sgray%t%egray [%syellow%f:%l%eyellow] %sgray%m%egray',
      dateFormat: 'yyyy-mm-dd hh:MM:ss.l',
      name: 'SYSTEM'
    }
  };

  this.setFileName = function (filename) {
    this.FILENAME = filename;
  };

  this.getFileName = function () {
    return this.FILENAME.replace(this.rootPath, '');
  };

  this.generateFunctions = function () {
    
    for (var i in this.types) {
      if (this.types.hasOwnProperty(i)) {
        this[i] = new Function(
          'return function ' + i + '(){' +
          'this.setFileName(__stack[1].getFileName());' +
          'this.LINENUMBER = __stack[1].getLineNumber();' +
          'var args = this.argumentsToString(arguments);' +
          'this.printLog(arguments.callee.toString().match(/function ([^\(]+)/)[1], args);' +
          '}'
        )();
      }
    }
  };

  this.generateFunctions();

  this.addType = function (type, config) {
    if (!config) {
      config = {};
    }
    this.types[type] = {};
    if (!config.hasOwnProperty('writeFile')) {
      this.types[type].writeFile = false;
    } else {
      this.types[type].writeFile = config.writeFile;
    }
    if (!config.hasOwnProperty('file')) {
      this.types[type].file = 'easynodelog.' + type + '.log';
    } else {
      this.types[type].file = config.file;
    }
    if (!config.hasOwnProperty('logFormat')) {
      this.types[type].logFormat = '%d %scyan%t%ecyan [%syellow%f:%l%eyellow] %m';
    } else {
      this.types[type].logFormat = config.logFormat;
    }
    if (!config.hasOwnProperty('dateFormat')) {
      this.types[type].dateFormat = 'yyyy-mm-dd hh:MM:ss.l';
    } else {
      this.types[type].dateFormat = config.dateFormat;
    }
    if (!config.hasOwnProperty('name')) {
      this.types[type].name = type;
    } else {
      this.types[type].name = config.name;
    }
    this.generateFunctions();
  };

  this.getDate = function (type) {
    if (type && this.types.hasOwnProperty(type)) {
      return dateFormat(new Date(), this.types[type].dateFormat);
    }
    return '';
  };

  this.computeLog = function (name, message) {
    var str = '';
    if (name && this.types.hasOwnProperty(name)) {
      str = this.types[name].logFormat;
      // inputs
      str = str.replace(new RegExp('%d', 'g'), this.getDate(name));
      str = str.replace(new RegExp('%t', 'g'), this.types[name].name);
      str = str.replace(new RegExp('%f', 'g'), this.getFileName());
      str = str.replace(new RegExp('%F', 'g'), this.FILENAME);
      str = str.replace(new RegExp('%l', 'g'), this.LINENUMBER);
      str = str.replace(new RegExp('%m', 'g'), message);
      // chalk modifiers
      str = str.replace(new RegExp('%sreset', 'g'), chalk.styles.reset.open);
      str = str.replace(new RegExp('%ereset', 'g'), chalk.styles.reset.close);
      str = str.replace(new RegExp('%sbold', 'g'), chalk.styles.bold.open);
      str = str.replace(new RegExp('%ebold', 'g'), chalk.styles.bold.close);
      str = str.replace(new RegExp('%sdim', 'g'), chalk.styles.dim.open);
      str = str.replace(new RegExp('%edim', 'g'), chalk.styles.dim.close);
      str = str.replace(new RegExp('%sitalic', 'g'), chalk.styles.italic.open);
      str = str.replace(new RegExp('%eitalic', 'g'), chalk.styles.italic.close);
      str = str.replace(new RegExp('%sunderline', 'g'), chalk.styles.underline.open);
      str = str.replace(new RegExp('%eunderline', 'g'), chalk.styles.underline.close);
      str = str.replace(new RegExp('%sinverse', 'g'), chalk.styles.inverse.open);
      str = str.replace(new RegExp('%einverse', 'g'), chalk.styles.inverse.close);
      str = str.replace(new RegExp('%shidden', 'g'), chalk.styles.hidden.open);
      str = str.replace(new RegExp('%ehidden', 'g'), chalk.styles.hidden.close);
      str = str.replace(new RegExp('%sstrikethrough', 'g'), chalk.styles.strikethrough.open);
      str = str.replace(new RegExp('%estrikethrough', 'g'), chalk.styles.strikethrough.close);
      // chalk colors
      str = str.replace(new RegExp('%sblack', 'g'), chalk.styles.black.open);
      str = str.replace(new RegExp('%eblack', 'g'), chalk.styles.black.close);
      str = str.replace(new RegExp('%sred', 'g'), chalk.styles.red.open);
      str = str.replace(new RegExp('%ered', 'g'), chalk.styles.red.close);
      str = str.replace(new RegExp('%sgreen', 'g'), chalk.styles.green.open);
      str = str.replace(new RegExp('%egreen', 'g'), chalk.styles.green.close);
      str = str.replace(new RegExp('%syellow', 'g'), chalk.styles.yellow.open);
      str = str.replace(new RegExp('%eyellow', 'g'), chalk.styles.yellow.close);
      str = str.replace(new RegExp('%sblue', 'g'), chalk.styles.blue.open);
      str = str.replace(new RegExp('%eblue', 'g'), chalk.styles.blue.close);
      str = str.replace(new RegExp('%smagenta', 'g'), chalk.styles.magenta.open);
      str = str.replace(new RegExp('%emagenta', 'g'), chalk.styles.magenta.close);
      str = str.replace(new RegExp('%scyan', 'g'), chalk.styles.cyan.open);
      str = str.replace(new RegExp('%ecyan', 'g'), chalk.styles.cyan.close);
      str = str.replace(new RegExp('%swhite', 'g'), chalk.styles.white.open);
      str = str.replace(new RegExp('%ewhite', 'g'), chalk.styles.white.close);
      str = str.replace(new RegExp('%sgray', 'g'), chalk.styles.gray.open);
      str = str.replace(new RegExp('%egray', 'g'), chalk.styles.gray.close);
      // chalk background colors
      str = str.replace(new RegExp('%sbgblack', 'g'), chalk.styles.bgBlack.open);
      str = str.replace(new RegExp('%ebgblack', 'g'), chalk.styles.bgBlack.close);
      str = str.replace(new RegExp('%sbgred', 'g'), chalk.styles.bgRed.open);
      str = str.replace(new RegExp('%ebgred', 'g'), chalk.styles.bgRed.close);
      str = str.replace(new RegExp('%sbggreen', 'g'), chalk.styles.bgGreen.open);
      str = str.replace(new RegExp('%ebggreen', 'g'), chalk.styles.bgGreen.close);
      str = str.replace(new RegExp('%sbgyellow', 'g'), chalk.styles.bgYellow.open);
      str = str.replace(new RegExp('%ebgyellow', 'g'), chalk.styles.bgYellow.close);
      str = str.replace(new RegExp('%sbgblue', 'g'), chalk.styles.bgBlue.open);
      str = str.replace(new RegExp('%ebgblue', 'g'), chalk.styles.bgBlue.close);
      str = str.replace(new RegExp('%sbgmagenta', 'g'), chalk.styles.bgMagenta.open);
      str = str.replace(new RegExp('%ebgmagenta', 'g'), chalk.styles.bgMagenta.close);
      str = str.replace(new RegExp('%sbgcyan', 'g'), chalk.styles.bgCyan.open);
      str = str.replace(new RegExp('%ebgcyan', 'g'), chalk.styles.bgCyan.close);
      str = str.replace(new RegExp('%sbgwhite', 'g'), chalk.styles.bgWhite.open);
      str = str.replace(new RegExp('%ebgwhite', 'g'), chalk.styles.bgWhite.close);
    }
    return str;
  };

  this.printLog = function (name, message) {
    if (self.debug && this.select.indexOf(name) > -1) {
      console.log(this.computeLog(name, message));
    }
  };
  this.argumentsToString = function (args) {
    var str = '';
    for (var i in args) {
      if (args.hasOwnProperty(i)) {
        if (typeof args[i] === 'object') {
          str += JSON.stringify(args[i]) + ' ';
        } else {
          str += args[i] + ' ';
        }
      }
    }
    return str;
  };
}

Object.defineProperty(global, '__stack', {
  get: function () {
    var orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function (_, stack) {
      return stack;
    };
    var err = new Error();
    Error.captureStackTrace(err, arguments.callee); // jshint ignore:line
    var stack = err.stack;
    Error.prepareStackTrace = orig;
    return stack;
  }
});

module.exports = new Easynodelog();

/* jshint ignore:end */
