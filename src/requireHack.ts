// 解决 SCF 下不能使用 pnpm install，但是 mariadb 是动态 require 的
// 强行拦截一下使其可以 require 到打包产物里面的 mariadb
import Module from 'module';
import mariadb from 'mariadb';
import sharp from 'sharp';
const { require: _require } = Module.prototype;

const newRequire = (id: string) => {
  if (id === 'mariadb') {
    return mariadb;
  }
  if (id === 'sharp') {
    return sharp;
  }
  return _require(id);
};

newRequire.extensions = _require.extensions;
newRequire.cache = _require.cache;
newRequire.main = _require.main;
newRequire.resolve = _require.resolve;

Module.prototype.require = newRequire;
