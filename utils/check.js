const { existsSync, mkdirSync } = require('fs')

/**
 * @param {string} path
 */
exports.checkPath = (path) => {
   if (!existsSync(path)) {
      mkdirSync(path, { recursive: true });
   }
}
