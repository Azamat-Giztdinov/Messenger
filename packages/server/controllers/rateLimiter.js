const redisClient = require("../redis");
module.exports.rateLimiter = (secondsLimite, limitAmount) =>
    async (req, res, next) => {
        const ip = req.connection.remoteAddress.slice(0, 6);
        const [respons] = await redisClient
            .multi()
            .incr(ip)
            .expire(ip, secondsLimite)
            .exec();

        if(respons[1] > limitAmount)
            res.json({
                loggedIn: false, 
                status: "Slow down! Try again in a minute."
            });
        else next();
    };
