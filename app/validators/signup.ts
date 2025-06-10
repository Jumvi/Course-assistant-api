import vine from '@vinejs/vine'

export const SignupValidator = vine.compile(
  vine.object({
    full_name: vine.string().maxLength(100),
    email: vine.string().email().maxLength(254).unique({ table: 'users', column: 'email' }),
    password: vine.string().minLength(8).maxLength(100),
    confirm_password: vine.string().sameAs('password'),
  })
)
