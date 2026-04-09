export default {
  extends: ["stylelint-config-standard"],
  plugins: ['stylelint-order'],
  rules: {
    'at-rule-empty-line-before': [
      'always',
      {
        except: ['blockless-after-same-name-blockless', 'first-nested'],
        ignore: ['after-comment'],
      },
    ],
    'order/order': ['custom-properties', 'declarations'],
    'color-hex-length': 'short',
    'comment-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['stylelint-commands'],
      },
    ],
    'comment-whitespace-inside': 'always',
    'custom-property-empty-line-before': [
      'always',
      {
        except: ['after-custom-property', 'first-nested'],
        ignore: ['after-comment', 'inside-single-line-block'],
      },
    ],
    'declaration-block-no-duplicate-properties': true,
    'declaration-block-single-line-max-declarations': 1,
    'declaration-empty-line-before': [
      'always',
      {
        except: ['after-declaration', 'first-nested'],
        ignore: ['after-comment', 'inside-single-line-block'],
      },
    ],
    'function-name-case': 'lower',
    'length-zero-no-unit': true,
    'rule-empty-line-before': [
      'always-multi-line',
      {
        except: ['first-nested'],
        ignore: ['after-comment'],
      },
    ],
    'selector-pseudo-element-colon-notation': 'single',
    'selector-type-case': 'lower',
    "selector-class-pattern": null,
    "selector-pseudo-class-no-unknown": null,
    "keyframes-name-pattern": null,
    "no-descending-specificity": null,
    'unit-allowed-list': [
      'em',
      'ex',
      'rem', // Font-relative lengths
      'pt',
      'px', // Absolute lengths
      'vh',
      'vw',
      'vmin',
      'vmax', // Viewport-percentage lengths
      'deg',
      'grad',
      'rad',
      'turn', // Angle
      'ms',
      's', // Duration
      'dpi',
      'dpcm',
      'dppx', // Resolution
      '%',
      'fr', // Other
    ],
    'declaration-block-no-redundant-longhand-properties': [
      true,
      {
        ignoreShorthands: [
          'grid-template'
        ]
      }
    ]
  },
};
