var seneca = require('seneca')();

seneca
    .use('math', {logfile: './math.log'})
    .listen();
