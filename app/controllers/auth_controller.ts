import User from '#models/user'
import { LoginValidator } from '#validators/login'
import { SignupValidator } from '#validators/signup'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async singUp({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(SignupValidator)
      const user = await User.create({
        fullName: payload.full_name,
        email: payload.email,
        password: payload.password,
      })
      const accessToken = await User.accessTokens.create(user)
      return response.status(201).json({
        user: {
          id: user.id,
          full_name: user.fullName,
          email: user.email,
        },
        access_token: accessToken.value!.release(),
        token_type: 'Bearer',
        expires_in: accessToken.expiresAt,
      })
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error)
      return response
        .status(400)
        .send({ error: 'Inscription échouée. Veuillez vérifier vos données.' })
    }
  }

  async login({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(LoginValidator)
      const user = await User.verifyCredentials(payload.email, payload.password)
      const accessToken = await User.accessTokens.create(user)
      return response.status(200).json({
        user,
        access_token: accessToken.value!.release(),
        token_type: 'Bearer',
        expires_in: accessToken.expiresAt,
      })
    } catch (error) {
      console.error('Erreur lors de la connexion:', error)
      return response.status(401).send({ error: 'Identifiants invalides. Veuillez réessayer.' })
    }
  }
}
