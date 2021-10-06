const logger = (req, res, next) => {
    Console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.priginalUrl}`)
    next();
    }

    exports.module = logger;