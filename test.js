require('./lib/os-prober')(function(err, ret) {
    console.log(err);
    console.log(ret);
})