import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../models/user.model";
import { JWT_SECRET } from "../config/env";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET as string,
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload.userId).select("-password");

      if (!user) {
        return done(null, false, { success: false, message: "Unauthorized" }); // No user found
      }

      return done(null, { user: user.id, role: user.role });
    } catch (error) {
      return done(error, false, { success: false, message: "Unauthorized" });
    }
  })
);

export default passport;
