class UserDTO{
    constructor(user){
        this._id = user._id;
        this.username = user.username;
        this.email = user.email;
        this.mobileNumber=user.mobileNumber;
        this.role=user.role;
    }
}

module.exports = UserDTO;