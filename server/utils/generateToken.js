import jwt from "jsonwebtoken";

export const generateToken = (res, user, message) => {
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });

  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    }).json({
        success:true,
        message,
        user
    });
};


/* 
Imagine you are a member of a club (let’s call it the “VIP Club”). Every time you visit the club, the bouncer at the entrance checks if you're a VIP member. Here's how it works:

Club Registration (Signing Up):
When you first join the club, the club manager gives you a special membership card. This card is unique to you and has your name on it. It’s like a token that represents your identity as a member of the club.
This membership card isn’t just a regular card. It’s signed with the manager’s personal signature, a secret code that only the manager knows. This signature is 
like the secret key in your JWT (JSON Web Token). Without it, anyone could easily forge a membership card and pretend to be a member.
Club Visit (Login):
When you visit the club again, you present your membership card to the bouncer at the door. The bouncer knows the manager’s signature and can verify if the card is authentic. 
If the signature matches, the bouncer lets you in, knowing that you're a genuine member.
If you try to present a card with a fake or altered signature, the bouncer will know it’s not legitimate and won’t let you in.
What Happens in Your Code:
In your code, you're generating a token (like the membership card) when a user successfully logs in. Here's how it works, step by step:

Generate the Token (Signing the Membership Card):

js
Copy code
const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });
This line generates a JWT (the membership card) with the userId in the payload (who the user is) and a signature that is signed using a secret key (the manager's signature in our analogy).
The secret key (process.env.SECRET_KEY) ensures that only the server (the club manager) can generate a valid token. Without the secret key, no one else can create a valid membership card that would be accepted by the bouncer (serve
*/