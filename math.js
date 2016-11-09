var fs = require('fs');

var math = function(options) {
    // the logging function, built by init
    var log;

    // place all the patterns together
    // this make it easier to see them in a glance
    this.add({
        role: 'math',
        cmd: 'sum'
    }, sum);
    this.add({
        role: 'math',
        cmd: 'product'
    }, product);

    this.wrap('role:math', function(msg, reply) {
        msg.left = Number(msg.left).valueOf();
        msg.right = Number(msg.right).valueOf();
        this.prior(msg, reply);
    });

    // this is the special initialization pattern
    this.add({
        init: 'math'
    }, init);

    function init(msg, reply) {
        // log to a custom file
        fs.open(options.logfile, 'a', function(err, fd) {
            // cannot open for writting, so fail
            // this error is fatal to Seneca
            if(err) {
                console.log(err);
                return reply(err);
            }
            log = make_log(fd);
            reply();
        })
    }

    function sum(msg, reply) {
        var out = {
            answer: msg.left + msg.right
        };
        log('sum: ' + msg.left + ' + ' + msg.right + ' = ' + out.answer + '\n');
        reply(null, out);
    }

    function product(msg, reply) {
        var out = {
            answer: msg.left * msg.right
        };
        log('product: ' + msg.left + ' * ' + msg.right + ' = ' + out.answer + '\n');
        reply(null, out);
    }

    function make_log(fd) {
        return function (entry) {
            fs.write(fd, new Date().toISOString() + ' ' + entry, null, 'UTF-8', function(err) {
                if(err) {
                    return console.log(err);
                }
                //ensure log entry is flushed
                fs.fsync(fd, function(err) {
                    if(err) {
                        return console.log(err);
                    }
                })
            })
        }
    }
};

module.exports = math;
