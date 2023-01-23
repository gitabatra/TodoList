//jshint esversion:6

exports.getDate = function() {
    const today = new Date();
    /*
    var currentDay = date.getDay();
    var day = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    res.render("list",{kindofDay : day[currentDay]});
    */
    const options= {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    return(today.toLocaleDateString("en-US",options));
};

exports.getDay = function(){
    const today = new Date();
    const options = {
        weekday : "long"
    };
    return(today.toLocaleDateString("en-US",options));
};