//var path = require('path');
var fs = require('fs');
const exec = require('child_process').exec;
var linuxVersionFileList =[    
    '/etc/lsb-release',
    '/etc/redhat-release',
    '/etc/fedora-release',
    '/etc/debian_version'
];
var linuxVersion = {
    checkPlatform: function(cb) {
        if(process.platform !== 'linux') {
            cb('UNSPORT_OS');
        } else {
            cb(null);
        }
    },
    checkVersionFile: function(path) {
        try {
            fs.statSync(path);
            return true;

        } catch(err) {
            return false;
        }
    },
    execCmd: function(cmd, cb) {
        exec(cmd, function(err, stdout, stderr) {
            if(err) {
                cb(err);
            } else {
                if(stderr) {
                    cb(stderr);
                } else {
                    cb(null, stdout);
                }
            }
        });
    },
    index: function(cb) {
        linuxVersion.checkPlatform(function(err) {
           if(err) {
               cb(err);
           } else {
              var versionFile;
              for(var i in linuxVersionFileList) {
                  if(linuxVersion.checkVersionFile(linuxVersionFileList[i])) {
                      versionFile = linuxVersionFileList[i];
                      console.log(versionFile);
                      break;
                  }
              }
              if(!versionFile) {
                  cb('UNSPORT_LINUX_VERSION');
              } else {
                  var cmd = 'cat ' + versionFile;
                  if(versionFile === '/etc/redhat-release' || versionFile === '/etc/fedora-release') {
                      linuxVersion.execCmd(cmd + '| tr \'\n\' \' \'', cb);
                  } else if(versionFile === '/etc/debian_version') {
                      linuxVersion.execCmd(cmd + '| tr \'\n\' \' \'', function(err, version) {
                          if(err) {
                              cb(err);
                          } else {
                              cb(null, 'Debian-' +  version);
                          }
                      });
                  } else if(versionFile === '/etc/lsb-release') {
                      linuxVersion.execCmd(cmd + '|grep DISTRIB_RELEASE | awk  -F"="  \'{print $2}\' | tr \'\n\' \' \'', function(err, version) {
                          if(err) {
                              cb(err);
                          } else {
                              cb(null, 'Ubuntu-' +  version);
                          }
                      });
                  } else {
                      cb('UNSPORT_LINUX_VERSION');
                  }
              }
           }
        });
    }
}

module.exports = linuxVersion.index;