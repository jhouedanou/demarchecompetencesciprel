'use strict';

const build = require('@microsoft/sp-build-web');

// Supprimer les warnings SASS courants
build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

// Configuration simple pour éviter PostCSS
var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);
  result.set('serve', result.get('serve-deprecated'));
  return result;
};

// Configuration webpack simplifiée pour développement
build.configureWebpack.mergeConfig({
  additionalConfiguration: (generatedConfiguration) => {
    // Mode développement simple
    generatedConfiguration.mode = 'development';
    
    // Désactiver toutes les optimisations qui causent des problèmes
    if (generatedConfiguration.optimization) {
      generatedConfiguration.optimization.minimize = false;
      generatedConfiguration.optimization.minimizer = [];
    }

    // Modifier les loaders CSS pour éviter PostCSS
    if (generatedConfiguration.module && generatedConfiguration.module.rules) {
      generatedConfiguration.module.rules.forEach(rule => {
        if (rule.use && Array.isArray(rule.use)) {
          rule.use.forEach(loader => {
            // Désactiver les optimisations sur le CSS loader
            if (typeof loader === 'object' && loader.loader && loader.loader.includes('css-loader')) {
              if (loader.options) {
                loader.options.minimize = false;
              }
            }
          });
        }
      });
    }

    return generatedConfiguration;
  }
});

build.initialize(require('gulp'));