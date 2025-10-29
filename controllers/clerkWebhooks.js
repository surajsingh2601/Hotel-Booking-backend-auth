import User from "../models/User.js";  //this come from user folder
import { Webhook } from "svix";




const clerkWebhooks = async (req, res)=> {
    try {
        // we'll create a svix instance with clerk webhook secret.
        const Whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        
        
        //getting headers
        const headers =     {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        };

        // verifying headers
        await Whook.verify(JSON.stringify(req.body), headers);

        // after that getting data from the request body.
        const {data, type}= req.body

        // after that we have to create an object. so we'll create userData that we can store in out DB.and we'.. use this data from the req body and store the data here in userData

        const userData = {
            _id: data.id,
            email: data.email_addresses?.[0]?.email_address,
            userName: data.first_name + " " + data.last_name ,
            image: data.image_url,
        }

        // switch statement for the diff events.
        switch (type) {
            case "user.created": {
                await User.create(userData);
                console.log("New user created:", userData.email);
                 break;
            } 
            case "user.updated": {
                await User.findOneAndUpdate(({_id:data.id}), userData, {
                    new:true,
                    upsert:true
                });
                console.log("User updated:", userData.email)
                break;
            }
            case "user.deleted": {
                await User.findOneAndDelete({_id:data.id});
                break;
            }
        
            default:
                break;
        }

        res.json({success:true, message:"webhook recieved"} )

    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message});
        

    }

}




export default clerkWebhooks;