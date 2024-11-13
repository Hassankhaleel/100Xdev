const zod = require("zod")
const jwt = require("jsonwebtoken")
const express = require("express")
const app = express()
app.use(express.json())
const KEY = "123456"
// -------------ASSIGNMENT NO 1-------------
//   TAKE USERNAME AND PASSWORD FORM THE USER AND GIVE BACK THE JWT TO USER ,IF USER CREDENTIALS ARE NOT VALID THEN THE RETURN NULL OR SIMILLAR MESSAGE TO USER ABOUT ITS CREDENTIALS.
//   USED: ZOD LIBRARY FOR INPUT VALIDATION

// -----------SATRT   THE    CODE-----------
// creating Schema for inputs of get Mehtod
const userData = []
app.get('/USERS_GET', (req, res) => {
    res.json({
        userData
    })
})
app.post('/USERS_POST', (req, res) => {

    let userrname = req.body.userrname;
    let password = req.body.password;
    let user__Role = req.body.role;
    let user__status = req.body.status; const userNameSchema = zod.string().min(8, { message: "username must atleast 8 charc." })
    const userPassShemza = zod.string().min(8, { message: "Password must be at least 8 characters long." })
    const userRoleSchema = zod.string()
    const userStatusSchema = zod.boolean()

    const username = userNameSchema.safeParse(userrname)
    const userpassword = userPassShemza.safeParse(password)
    const userRole = userRoleSchema.safeParse(user__Role)
    const userStatus = userStatusSchema.safeParse(user__status)

    let arrayOfUserData = [username, userpassword, userRole]
    arrayOfUserData.find(function (inputValues) {
        if (!inputValues.success) {
            res.json({
                ErrorFrom_username: inputValues.error.issues[0].message
            })
        }
        else {
            // --USING JWT WITH try/cath 01-----
            // try {
            //     let userToken = jwt.sign({ userrname }, KEY)

            //     res.json({
            //         userToken
            //     })
            // }
            // catch (err) {


            //     res.json({ errFromTooken: err.message })
            // }
            ////------------------------------------------------------------
            // UISNG JWT WITH callback 02
            //de-structuring the data 
            // let { nameStrc, passStrc, roleStrx } = userData

            jwt.sign({ username: username.data, userpassword: userpassword.data, userRole: userRole.data, userStatus: userStatus.data }, KEY, (err, userToken) => {
                // res.json(userData)

                if (userToken) {
                    res.json({ userTOKE: userToken })
                    userData.push({
                        // ...userData,
                        user_Name: username.data,
                        user_Password: userpassword.data,
                        user_Role: userRole.data,
                        user_Token: userToken,
                        user_status: userStatus.data

                    }
                    )
                }
                else {
                    res.json({ errFromTooken: err })
                }
            })

        }
    })
})

app.get('/USERS_GET/BY_VIA_DECODING/:role', (req, res) => {

    //-- APPROACH 01---LOPING USERDATE USING forloop--
    let DATA_PRIOR_TO_ROLE = []

    for (i = 0; i < userData.length; i++) {
        let token_for_dec = userData[i].user_Token;
        // let decoded_toke = jwt.decode(token_for_dec, { complete: true })///its return the copmlet objet having iwth sig,payload ,headner
        let decoded_toke = jwt.decode(token_for_dec, { complete: false })///its return the only paylod objet
        DATA_PRIOR_TO_ROLE.push(decoded_toke)

    }
    let RoleArray = [
        {
            admin: ["student", "teacher", "peon", "accountant"],
            teacher: ["student"],
            accountant: ["student", "teacher",],//check for felse status
            peon: ["student", "teacher"],
            student: ["student"],

        }
    ]
    //-----ROLE BASE USER RESPNSE-------
    let Role = req.params.role
    let FilteredUser;
    for (let index = 0; index < RoleArray.length; index++) {
        let userRoleGetSelected = RoleArray[index][Role]
        if (userRoleGetSelected) {
            let c = DATA_PRIOR_TO_ROLE.filter((data) => {
                // console.log(data);
                return userRoleGetSelected.includes(data.userRole)
            })
            FilteredUser = c
        }
        else {
            FilteredUser.push(`the ${Role}isnt available right now !Thanks`)
        }




    }
    res.send(FilteredUser)

    // let filterRole_data = DATA_PRIOR_TO_ROLE.filter((data) => {
    //     for (i = 0; i < RoleArray[0].length; i++) {
    //         let includesFun = RoleArray[0][i].includes(Role)


    //     }
    //     // return RoleArray[0].accountant.includes(data.userRole)
    //     console.log(data, "dataforloppwala");


    // })
    // console.log(filterRole_data, " filterRole_data");

    // let MapedDATA = DATA_PRIOR_TO_ROLE.map((dataForMaping) => {
    //     console.log(dataForMaping);


    //     // let a = dataForMaping.filter((dataForFiltrer) => {
    //     //     return RoelArray.push(dataForFiltrer.userRole)
    //     // })
    //     // return a



    // })
    // console.log(MapedDATA);



    //-- APPROACH 02---LOPING USERDATE USING forEach--


})

app.listen(3012)


