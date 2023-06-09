const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('./schemas/userLoginSchema');

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password"
    },
    async (username, password, done) => {
    try {
      
      // Aquí debes implementar la lógica de búsqueda del usuario en tu base de datos
      const user = await User.findOne({ username });

      // Si no se encuentra el usuario, devuelve un mensaje de error
      if (!user) {
        return done(null, false, { message: 'Usuario no encontrado' });
      }

      // Compara la contraseña ingresada con el hash almacenado
      const isMatch = await bcrypt.compare(password, user.password);

      // Si la contraseña no coincide, devuelve un mensaje de error
      if (!isMatch) {
        return done(null, false, { message: 'Contraseña incorrecta' });
      }

      // Si la autenticación es exitosa, devuelve el usuario autenticado
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (_id, done) => {
  try {
    // Aquí debes implementar la lógica para buscar y devolver el usuario desde la base de datos
    const user = await User.findById(_id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
