const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const validator=require('validator');
const jwt=require('jsonwebtoken')
const Task=require('./tasks')

const UserSchema= mongoose.Schema(
    {
        name:{
            type: String,
            required: true
        },
        email:{
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error('Email is invalid')
                }
            }
        },
        password:{
            type: String,
            required:true,
            trim:true,
            minlength:7,
            validate(value){
                if(value.toLowerCase().includes('password')){
                    throw new Error('Password cannot contain word "password"');
                }
            }
        },
        age:{
            type: Number,
            default: 0,
            validate(value){
                if(value<0){
                    throw new Error('Age must be a positive number')
                }
            }
        },
        tokens:[{
            token:{
                type: String,
                required: true
            }
        }],
        avatar:{
            type: Buffer
        }
    },
    {
        timestamps: true
    }
  
)

UserSchema.virtual('tasks',{
    ref: 'Task',
    localField:'_id',
    foreignField: 'owner'
})

UserSchema.statics.findByCredential= async (email, password)=>{
    const user= await User.findOne({email})
    if(!user){
        throw new Error('No user found. Please sign up first ')
    }

    const isMatch= await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Password incorrect')
    }
    return user;
}


UserSchema.methods.generateAuthToken = async function () {
    const user= this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
    
    user.tokens= user.tokens.concat({ token })
    await user.save()
    return token
}

UserSchema.methods.toJSON = function(){
    const user= this
    const userObject= user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

UserSchema.pre('save', async function(next){
    const user= this;

    if(user.isModified('password')){
        user.password= await bcrypt.hash(user.password, 8)
    }
    next()
})


UserSchema.pre('remove', async function(next){
    const user=this

    await Task.deleteMany({owner : user._id})

    next()
})
const User=mongoose.model('User', UserSchema);

module.exports = User



