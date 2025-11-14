import User from "../models/user.model";
import { connect } from "../mongodb/mongoose";

export async function createOrUpdateUser(
  id,
  first_name,
  last_name,
  image_url,
  email_addresses,
  username
) {
  await connect();

  const email = email_addresses?.[0]?.email_address || "";
  console.log("🔥 createOrUpdateUser CALLED");
  console.log("🔥 MONGODB_URI =", process.env.MONGODB_URI);

  return User.findOneAndUpdate(
    { clerkId: id },
    {
      clerkId: id,
      firstName: first_name,
      lastName: last_name,
      avatar: image_url,
      email,
      username,
    },
    { new: true, upsert: true }
  );

  
}

export async function deleteUser(id) {
  await connect();
  return User.findOneAndDelete({ clerkId: id });
}
