require('seneca')()
    .client()
    .act('role:math, cmd:sum, left: 1, right: 2')
    .act('role:math, cmd:product, left: 3, right: 4');
