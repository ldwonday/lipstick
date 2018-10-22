'use strict';

var config = {
  projectName: 'collect-zan-taro',
  date: '2018-9-7',
  designWidth: 750,
  deviceRatio: {
    '640': 1.17,
    '750': 1,
    '828': 0.905
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: {
    babel: {
      sourceMap: true,
      presets: ['env'],
      plugins: ['transform-class-properties', 'transform-decorators-legacy', 'transform-object-rest-spread']
    },
    typescript: {
      compilerOptions: {
        allowSyntheticDefaultImports: true,
        baseUrl: '.',
        declaration: false,
        experimentalDecorators: true,
        jsx: 'preserve',
        jsxFactory: 'Nerv.createElement',
        module: 'commonjs',
        moduleResolution: 'node',
        noImplicitAny: false,
        noUnusedLocals: true,
        outDir: './dist/',
        preserveConstEnums: true,
        removeComments: false,
        rootDir: '.',
        sourceMap: true,
        strictNullChecks: true,
        target: 'es6'
      },
      include: ['src/**/*'],
      exclude: ['node_modules'],
      compileOnSave: false
    }
  },
  defineConstants: {
    '\u96C6\u8D5E\u9886': '集赞领',
    "https://klimg.pptmbt.com/pub/jz/": 'https://klimg.pptmbt.com/pub/jz/'
  },
  copy: {
    patterns: [{ from: 'src/asset/images', to: 'dist/asset/images' }, { from: 'src/components/wxParse/wxParse.wxss', to: 'dist/components/wxParse/wxParse.wxss' }, { from: 'src/components/wxParse/wxParse.wxml', to: 'dist/components/wxParse/wxParse.wxml' }],
    options: {}
  },
  weapp: {
    module: {
      postcss: {
        autoprefixer: {
          enable: true
        },
        pxtransform: {
          selectorBlackList: [/^.van-.*?$/]
        },
        url: {
          enable: true,
          limit: 10240
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    module: {
      postcss: {
        autoprefixer: {
          enable: true
        }
      }
    }
  }
};

module.exports = function (merge) {
  {
    return merge({}, config, require("./dev.js"));
  }
  return merge({}, config, require("./prod.js"));
};