import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
// import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import bcrypt from "bcryptjs";
import User from "../db/models/User.js"; // Adjust the import path as needed

// Local Authentication Email/Password
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      console.log(email, password);
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, {
            message: "Invalid email or password.",
          });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Invalid email or password." });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Google Authentication
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "/api/auth/google/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       // try {
//       //   const existingUser = await User.findOne({ googleId: profile.id });
//       //   if (existingUser) {
//       //     return done(null, existingUser);
//       //   }

//       //   const newUser = new User({
//       //     googleId: profile.id,
//       //     email: profile.emails[0].value,
//       //     firstName: profile.name.givenName,
//       //     lastName: profile.name.familyName,
//       //   });

//       //   await newUser.save();
//       //   done(null, newUser);
//       // } catch (err) {
//       //   done(err);
//       // }
//     }
//   )
// );

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
