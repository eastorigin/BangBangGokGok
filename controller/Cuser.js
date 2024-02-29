// 유저 관련 컨트롤러
exports.getSignin = (req, res) => {
    res.render("user/signin");
};

exports.postSignin = (req, res) => {
    User.postSignin(req.body, (result) => {
        if (result.length > 0) {
            res.send(true);
        } else {
            res.send(false);
        }
    });
};
