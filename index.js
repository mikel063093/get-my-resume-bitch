#!/usr/bin/env node
var exec = require('child_process').exec, userArgs, searchPattern, child
const theme = 'minimist'
const hackmyresume = 'hackmyresume'

onPreLoadNpm(null)

function onPreLoadNpm (err) {
  onLog('onPreLoadNpm')
  if (err) {
    onLog(err)
    return
  }
  chekModule(hackmyresume)
    .then(succesPreload)
    .catch(function () {
      onLoadNpm(err)
        .then(function () {
          linkModule(hackmyresume)
            .then(onPreLoadNpm)
            .catch(onLog)
        })
        .catch('run tis command as root')
    })
}

function succesPreload (err) {
  onLog('succesPreload')
  bitchGetMyCV(err)
    .then(res => console.log(res))
    .catch(err => console.log(err))
}

function chekModule (name) {
  onLog('chekModule')
  return new Promise(function (res, reject) {
    try {
      onLog(require.resolve(name))
      onLog('ok chekModule')
      return res(name)
    } catch (e) {
      onLog(name + ' is not found')
      return reject(null)
    }
  })
}

function linkModule (name) {
  onLog('linkModule')
  return new Promise(function (resolve, reject) {
    exec('npm link ' + name, function (err, stdout, stderr) {
      if (err) {
        onLog('err linkModule')
        return reject(err)
      }
      onLog('ok linkModule')
      return resolve(null)
    })
  })
}

function bitchGetMyCV (data) {
  onLog('bitchGetMyCV')
  return new Promise(function (resolve, reject) {
    onLog(process.argv)
    userArgs = process.argv.slice(2)
    searchPattern = userArgs[0]
    if (searchPattern === undefined) {
      return reject('not fiile resume.json found')
    }
    child = exec(hackmyresume + ' BUILD ' + searchPattern + ' TO out/resume.all -t ' + theme, function (err, stdout, stderr) {
      if (err) return reject(err)
      return resolve('results in out')
    })
  })
}

function onLoadNpm (err) {
  onLog('onLoadNpm')
  return new Promise(function (resolve, reject) {
    if (err) return reject(err)
    exec('npm install -g ' + hackmyresume, function (err, stdout, stderr) {
      if (err) return reject(err)
      onLog(stdout)
      return resolve(null)
    })
  // npm.commands.install(['hackmyresume', ' -g'], function (er, data) {
  //   if (er) {
  //     // onLog(er)
  //     onLog('err onLoadNpm' + er)
  //     return reject(er)
  //   }
  //   // onLog(data)
  //   onLog('ok onLoadNpm')
  //   return resolve(data)
  // })
  })
}

// npmls(onLog)
function onLog (arg) {
  // console.log(arg)
}
// function npmls (cb) {
//   exec('npm list -g --json ' + hackmyresume, function (err, stdout, stderr) {
//     if (err) return cb(err)
//     var listNodeModules = JSON.parse(stdout)
//     if (listNodeModules.dependencies[hackmyresume] !== null) {
//       onLog(hackmyresume + 'ok')
//       return cb(null, listNodeModules.dependencies[hackmyresume])
//     }
//     cb(null, 'no hackmyresume installed')
//   })
// }
