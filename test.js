require('./lib/linux_version')(function(err, ret) {
    console.log(err);
    console.log(ret);
})