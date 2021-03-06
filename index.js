/* eslint-env node */
'use strict';

var fs = require('fs');

module.exports = {
  name: 'ember-prism',
  included(app) {
    // Defaults that can be overriden by options
    this.components = [];
    this.plugins = [];
    this.theme = 'themes/prism.css';

    if (app.options && app.options['ember-prism']) {
      const options = app.options['ember-prism'];
      const components = options.components;
      const plugins = options.plugins;
      const theme = options.theme;

      if (theme && theme !== 'none') {
        this.theme = `themes/prism-${theme}.css`;
      }

      if (components) {
        components.forEach((component) => {
          this.components.push(`components/prism-${component}.js`);
        });
      }

      if (plugins) {
        plugins.forEach((plugin) => {

          /**
           * Most Prism plugins contains both a js file and a css file, but there
           * are exception. `highlight-keywords` for instance, does not have a
           * css file.
           *
           * When the plugin is imported, the app should check for file existence
           * before calling `app.import()`.
           */

            // file extensions to be tested for existence.
          const fileExtensions = ['js', 'css'];

          fileExtensions.forEach((fileExtension) => {
            const nodeAssetsPath = `plugins/${plugin}/prism-${plugin}.${fileExtension}`;
            const file = `node_modules/prismjs/${nodeAssetsPath}`;


            if (fs.existsSync(file)) {
              this.plugins.push(nodeAssetsPath);
            }
          });

        });
      }
    }

    this._super.included.apply(this, arguments);
  },
  options: {
    nodeAssets: {
      prismjs() {
        return {
          import: [
            'prism.js',
            this.theme
          ].concat(this.components, this.plugins)
        };
      }
    }
  }
};
