const express = require("express")
const app = express()
let jwt = require('jsonwebtoken');
app.use(express.json())
let secret_KEY = "123"
let USER_data = [
    {
        name: "hassan",
        passion: "Sofware endineer",
        qualification: "bscs"
    },
    {
        name: "dumba",
        passion: "Dentist",
        qualification: "MBBS"
    }
    ,
    {
        name: "haris",
        passion: "DAE IN CS",
        qualification: "FSSC"
    }

]


app.get('/data', (req, res) => {

    res.send(
        USER_data

    )
})


function userCheker(name, passion) {
    let user_Availibilit = false;
    for (i = 0; i < USER_data.length; i++) {

        if (USER_data[i].name === name) {
            user_Availibilit = true

        }


    }
    console.log(user_Availibilit);
    return user_Availibilit

}
app.post('/data', (req, res) => {
    let Name_data = req.body.name;
    let postion_data = req.body.passion;


    let cherker = userCheker(Name_data, postion_data)
    if (cherker) {
        return res.json({
            alert: "user already exist kindly add new user to sign up"
        })
    }
    else {
        let token = jwt.sign(Name_data, secret_KEY)
        USER_data.push({
            name: Name_data,
            passion: postion_data,
        })
        return res.send(
            {
                your_singe_in_key: token
            }
        )
    }

})
///---------WORKING WITH TRY CATCH---------
// try {
//     let a;
//     console.log(a.length);
// }
// catch (e) {
//     console.log(e + "asdasdkadkaskdgasdasdddddddddddddddddddddddddddd");

// }




app.listen("3005")
