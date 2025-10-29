import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    username: { type: String },
    email: { type: String, required: true},
    image: { type: String },
    //we`ll get this image url from the CLERK
    role: { type: String, enum: ["user", "hotelOwner"], default: "user" },
    // whenevr the user create an account bydefault the role will be user.
    recentSearchedCities: [{ type: String, required: true }],
  },{ timestamps: true }// timestapms is a new object we created and timestamps means it`ll desrcibe the time, that when this user was created account`
);

// Now using this userSchema we`ll create the user model.

const User = mongoose.model('User', userSchema)



export default User;

